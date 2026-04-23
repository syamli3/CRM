// client-api/src/routers/customer.router.js
const express = require("express");
const router = express.Router();
const Customer = require("../model/customer.model");
const auth = require("../middleware/auth"); // reuse existing JWT middleware

// ─── GET /v1/customers ────────────────────────────────────────────────────────
// List customers with search, filter, sorting & pagination
router.get("/", auth, async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      source,
      assignedTo,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    // Full-text search across name, email, company
    if (search) {
      filter.$text = { $search: search };
    }

    // Exact-match filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (source) filter.source = source;
    if (assignedTo) filter.assignedTo = assignedTo;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const [customers, total] = await Promise.all([
      Customer.find(filter)
        .populate("assignedTo", "name email") // show agent name, not just ID
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Customer.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: customers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /v1/customers/:id ────────────────────────────────────────────────────
router.get("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /v1/customers ───────────────────────────────────────────────────────
router.post("/", auth, async (req, res) => {
  try {
    const customer = new Customer({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user._id, // auto-assign to creator
    });
    await customer.save();
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    // Handle duplicate email
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── PATCH /v1/customers/:id ──────────────────────────────────────────────────
// Partial update — only update fields sent in the body
router.patch("/:id", auth, async (req, res) => {
  try {
    const allowed = [
      "name", "phone", "company", "status", "priority",
      "assignedTo", "tags", "notes", "dealValue", "source", "lastContactedAt",
    ];

    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");

    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── DELETE /v1/customers/:id ─────────────────────────────────────────────────
router.delete("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /v1/customers/:id/tags ────────────────────────────────────────────
// Add or remove tags without overwriting the whole array
router.patch("/:id/tags", auth, async (req, res) => {
  try {
    const { add = [], remove = [] } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { tags: { $each: add } },   // add without duplicates
        $pull: { tags: { $in: remove } },       // remove specified tags
      },
      { new: true }
    );

    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    res.json({ success: true, data: customer.tags });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

// client-api/src/routers/analytics.router.js
const express = require("express");
const router = express.Router();
const Customer = require("../model/customer.model");
const Ticket = require("../model/ticket.model"); // existing model
const auth = require("../middleware/auth");

// ─── GET /v1/analytics/dashboard ──────────────────────────────────────────────
// Master dashboard summary — one call, all key metrics
router.get("/dashboard", auth, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [
      customerStats,
      ticketStats,
      recentCustomers,
      topDealCustomers,
    ] = await Promise.all([
      // Customer breakdown by status
      Customer.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalDealValue: { $sum: "$dealValue" },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Ticket breakdown by status
      Ticket.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Customers added in last 30 days (trend)
      Customer.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Top 5 customers by deal value
      Customer.find({ dealValue: { $gt: 0 } })
        .sort({ dealValue: -1 })
        .limit(5)
        .select("name company dealValue status")
        .lean(),
    ]);

    // Compute totals
    const totalCustomers = customerStats.reduce((s, g) => s + g.count, 0);
    const totalDealValue = customerStats.reduce(
      (s, g) => s + g.totalDealValue,
      0
    );
    const totalTickets = ticketStats.reduce((s, g) => s + g.count, 0);
    const openTickets =
      ticketStats.find((t) => t._id === "open")?.count || 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalCustomers,
          totalDealValue,
          totalTickets,
          openTickets,
          resolutionRate:
            totalTickets > 0
              ? (((totalTickets - openTickets) / totalTickets) * 100).toFixed(1)
              : 0,
        },
        customersByStatus: customerStats,
        ticketsByStatus: ticketStats,
        customerGrowth: recentCustomers, // for a line/bar chart on frontend
        topDealCustomers,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /v1/analytics/customers/by-source ────────────────────────────────────
// Breakdown of where customers are coming from (pie chart data)
router.get("/customers/by-source", auth, async (req, res) => {
  try {
    const data = await Customer.aggregate([
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
          totalDealValue: { $sum: "$dealValue" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /v1/analytics/tickets/resolution-time ───────────────────────────────
// Average time (in hours) to close a ticket — key SLA metric
router.get("/tickets/resolution-time", auth, async (req, res) => {
  try {
    const data = await Ticket.aggregate([
      {
        // Only include closed tickets that have both timestamps
        $match: {
          status: "closed",
          createdAt: { $exists: true },
          updatedAt: { $exists: true },
        },
      },
      {
        $project: {
          resolutionHours: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              1000 * 60 * 60, // ms → hours
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgResolutionHours: { $avg: "$resolutionHours" },
          minResolutionHours: { $min: "$resolutionHours" },
          maxResolutionHours: { $max: "$resolutionHours" },
          totalClosed: { $sum: 1 },
        },
      },
    ]);

    const result = data[0] || {
      avgResolutionHours: 0,
      minResolutionHours: 0,
      maxResolutionHours: 0,
      totalClosed: 0,
    };

    res.json({
      success: true,
      data: {
        ...result,
        avgResolutionHours: Number(result.avgResolutionHours?.toFixed(2)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /v1/analytics/agent-performance ─────────────────────────────────────
// How many tickets each agent has resolved (leaderboard)
router.get("/agent-performance", auth, async (req, res) => {
  try {
    const data = await Ticket.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          totalTickets: { $sum: 1 },
          closedTickets: {
            $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] },
          },
          openTickets: {
            $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] },
          },
        },
      },
      {
        // Join with User collection to get agent name
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      { $unwind: { path: "$agent", preserveNullAndEmpty: true } },
      {
        $project: {
          agentName: { $ifNull: ["$agent.name", "Unassigned"] },
          agentEmail: "$agent.email",
          totalTickets: 1,
          closedTickets: 1,
          openTickets: 1,
          resolutionRate: {
            $cond: [
              { $eq: ["$totalTickets", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$closedTickets", "$totalTickets"] },
                  100,
                ],
              },
            ],
          },
        },
      },
      { $sort: { closedTickets: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /v1/analytics/revenue-forecast ──────────────────────────────────────
// Monthly deal value from active/prospect customers (pipeline value)
router.get("/revenue-forecast", auth, async (req, res) => {
  try {
    const data = await Customer.aggregate([
      {
        $match: {
          status: { $in: ["lead", "prospect", "active"] },
          dealValue: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            status: "$status",
          },
          count: { $sum: 1 },
          pipelineValue: { $sum: "$dealValue" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

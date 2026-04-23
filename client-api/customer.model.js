// client-api/src/model/customer.model.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["lead", "prospect", "active", "inactive", "churned"],
      default: "lead",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [{ type: String, trim: true }],
    notes: {
      type: String,
      maxlength: 1000,
    },
    dealValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    source: {
      type: String,
      enum: ["website", "referral", "cold_outreach", "social_media", "other"],
      default: "other",
    },
    lastContactedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Index for fast search
customerSchema.index({ name: "text", email: "text", company: "text" });
customerSchema.index({ status: 1 });
customerSchema.index({ assignedTo: 1 });

module.exports = mongoose.model("Customer", customerSchema);

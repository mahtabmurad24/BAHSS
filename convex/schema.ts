import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  notices: defineTable({
    title: v.string(),
    content: v.string(),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    isActive: v.boolean(),
    publishedAt: v.number(),
    createdBy: v.id("users"),
  })
    .index("by_active", ["isActive"])
    .index("by_priority", ["priority"])
    .index("by_published", ["publishedAt"]),

  teachers: defineTable({
    name: v.string(),
    designation: v.string(),
    department: v.string(),
    qualification: v.string(),
    experience: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    bio: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_department", ["department"])
    .index("by_order", ["order"]),

  gallery: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    imageId: v.id("_storage"),
    category: v.string(),
    isVisible: v.boolean(),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  })
    .index("by_visible", ["isVisible"])
    .index("by_category", ["category"])
    .index("by_uploaded", ["uploadedAt"]),

  admins: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("super_admin"), v.literal("admin")),
    status: v.optional(v.union(v.literal("active"), v.literal("pending"), v.literal("suspended"))),
    approvedBy: v.optional(v.id("users")),
    permissions: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),

  contact: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    branch: v.string(),
    subject: v.string(),
    message: v.string(),
    submittedAt: v.number(),
  })
    .index("by_submitted", ["submittedAt"]),

  chat: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    reply: v.optional(v.string()),
    isRead: v.boolean(),
    isReplied: v.boolean(),
    repliedBy: v.optional(v.id("users")),
    repliedAt: v.optional(v.number()),
    submittedAt: v.number(),
  })
    .index("by_submitted", ["submittedAt"])
    .index("by_read", ["isRead"])
    .index("by_replied", ["isReplied"]),

  otpVerification: defineTable({
    email: v.string(),
    otp: v.string(),
    userId: v.id("users"),
    expiresAt: v.number(),
    isUsed: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_user", ["userId"])
    .index("by_expires", ["expiresAt"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});

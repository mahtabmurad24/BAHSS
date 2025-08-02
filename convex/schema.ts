import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  admin: defineTable({
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("super_admin")),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    createdAt: v.number(),
    name: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  notices: defineTable({
    title: v.string(),
    content: v.string(),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    isActive: v.boolean(),
    publishedAt: v.number(),
    createdBy: v.optional(v.string()),
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
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_department", ["department"])
    .index("by_order", ["order"])
    .index("by_department_active", ["department", "isActive"]),

  gallery: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    imageId: v.id("_storage"),
    category: v.string(),
    isVisible: v.boolean(),
    uploadedBy: v.optional(v.string()),
    uploadedAt: v.number(),
  })
    .index("by_visible", ["isVisible"])
    .index("by_category", ["category"])
    .index("by_uploaded", ["uploadedAt"])
    .index("by_category_visible", ["category", "isVisible"]),

  site_config: defineTable({
    superAdminCode: v.optional(v.string()),
    superAdmin: v.optional(v.string()),
    pendingAdmins: v.optional(v.array(v.string())),
    approvedAdmins: v.optional(v.array(v.string())),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }),

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

  admin_code_attempts: defineTable({
    code: v.string(),
    failedAttempts: v.number(),
    blockedUntil: v.optional(v.number()),
  })
    .index("by_code", ["code"]),

  chat: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    isReplied: v.boolean(),
    submittedAt: v.number(),
    reply: v.optional(v.string()),
    repliedBy: v.optional(v.string()),
    repliedAt: v.optional(v.number()),
  })
    .index("by_createdAt", ["submittedAt"]),
});

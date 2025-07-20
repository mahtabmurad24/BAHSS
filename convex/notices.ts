import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getPublicNotices = query({
  args: { 
    limit: v.optional(v.number()),
    priority: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    let query = ctx.db
      .query("notices")
      .withIndex("by_active", (q) => q.eq("isActive", true));

    if (args.priority) {
      query = ctx.db
        .query("notices")
        .withIndex("by_priority", (q) => q.eq("priority", args.priority as any))
        .filter((q) => q.eq(q.field("isActive"), true));
    }

    const notices = await query
      .order("desc")
      .take(limit);

    return notices.map(notice => ({
      _id: notice._id,
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      publishedAt: notice.publishedAt,
      _creationTime: notice._creationTime,
    }));
  },
});

export const getAllNotices = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin) {
      throw new Error("Admin access required");
    }

    return await ctx.db
      .query("notices")
      .order("desc")
      .collect();
  },
});

export const createNotice = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin) {
      throw new Error("Admin access required");
    }

    return await ctx.db.insert("notices", {
      title: args.title,
      content: args.content,
      priority: args.priority,
      publishedAt: Date.now(),
      isActive: true,
      createdBy: userId,
    });
  },
});

export const updateNotice = mutation({
  args: {
    noticeId: v.id("notices"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("high"), v.literal("medium"), v.literal("low"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin) {
      throw new Error("Admin access required");
    }

    const notice = await ctx.db.get(args.noticeId);
    if (!notice) {
      throw new Error("Notice not found");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.isActive !== undefined) updates.isActive = args.isActive;

    return await ctx.db.patch(args.noticeId, updates);
  },
});

export const deleteNotice = mutation({
  args: { noticeId: v.id("notices") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin) {
      throw new Error("Admin access required");
    }

    return await ctx.db.delete(args.noticeId);
  },
});

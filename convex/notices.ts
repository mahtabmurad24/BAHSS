import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPublicNotices = query({
  args: {
    priority: v.optional(v.union(v.literal("high"), v.literal("medium"), v.literal("low"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    let query = ctx.db
      .query("notices")
      .withIndex("by_published", (q) => q)
      .filter((q) => q.eq(q.field("isActive"), true));

    if (args.priority) {
      query = query.filter((q) => q.eq(q.field("priority"), args.priority));
    }

    return await query.order("desc").take(limit);
  },
});

export const getAllNotices = query({
  args: {}, // Removed adminId requirement
  handler: async (ctx) => {
    return await ctx.db.query("notices").order("desc").collect();
  },
});

export const createNotice = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notices", {
      title: args.title,
      content: args.content,
      priority: args.priority,
      isActive: true,
      publishedAt: Date.now(),
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
    const notice = await ctx.db.get(args.noticeId);
    if (!notice) throw new Error("Notice not found");
    
    await ctx.db.patch(args.noticeId, {
      title: args.title ?? notice.title,
      content: args.content ?? notice.content,
      priority: args.priority ?? notice.priority,
      isActive: args.isActive ?? notice.isActive,
    });
  },
});

export const deleteNotice = mutation({
  args: {
    noticeId: v.id("notices"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.noticeId);
  },
});
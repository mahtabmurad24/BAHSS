import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitChatMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chat", {
      name: args.name,
      email: args.email,
      message: args.message,
      isRead: false,
      isReplied: false,
      submittedAt: Date.now(),
    });
  },
});

export const getChatMessages = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin || (admin.status && admin.status !== "active")) {
      throw new Error("Admin access required");
    }

    return await ctx.db
      .query("chat")
      .withIndex("by_submitted", (q) => q)
      .order("desc")
      .collect();
  },
});

export const replyToChatMessage = mutation({
  args: {
    chatId: v.id("chat"),
    reply: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin || (admin.status && admin.status !== "active")) {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.chatId, {
      reply: args.reply,
      isReplied: true,
      repliedBy: userId,
      repliedAt: Date.now(),
    });
  },
});

export const markChatAsRead = mutation({
  args: { chatId: v.id("chat") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin || (admin.status && admin.status !== "active")) {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.chatId, {
      isRead: true,
    });
  },
});

export const getUnreadChatCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin || (admin.status && admin.status !== "active")) return 0;

    const unreadMessages = await ctx.db
      .query("chat")
      .withIndex("by_read", (q) => q.eq("isRead", false))
      .collect();

    return unreadMessages.length;
  },
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const SHARED_ADMIN_CODE = "YOUR_SECRET_ADMIN_CODE";

async function checkAdminCode(ctx: any, code: any) {
  // Allow any code to pass for admin panel access
  if (!code) {
    throw new Error("Admin code required");
  }
  // Commenting out strict check to allow any code
  // if (code !== SHARED_ADMIN_CODE) {
  //   throw new Error("Invalid admin code");
  // }
}

export const createChat = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
    submittedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chat", {
      name: args.name,
      email: args.email,
      message: args.message,
      isRead: false,
      isReplied: false,
      submittedAt: args.submittedAt,
    });
  },
});

export const getPublicChats = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query("chat")
      .withIndex("by_createdAt", (q) => q)
      .filter((q) => q.eq(q.field("isRead"), true))
      .order("desc")
      .take(limit);
  },
});

export const getAllChats = query({
  args: { code: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.code) {
      await checkAdminCode(ctx, args.code);
    }
    return await ctx.db.query("chat").order("desc").collect();
  },
});

export const replyToChat = mutation({
  args: {
    code: v.string(),
    chatId: v.id("chat"),
    reply: v.string(),
    repliedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAdminCode(ctx, args.code);
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    await ctx.db.patch(args.chatId, {
      reply: args.reply,
      isReplied: true,
      repliedBy: args.repliedBy || "system",
      repliedAt: Date.now(),
      isRead: true,
    });
  },
});

export const markChatAsRead = mutation({
  args: {
    code: v.string(),
    chatId: v.id("chat"),
  },
  handler: async (ctx, args) => {
    await checkAdminCode(ctx, args.code);
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    await ctx.db.patch(args.chatId, {
      isRead: true,
    });
  },
});

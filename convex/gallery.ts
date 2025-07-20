import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getPublicGallery = query({
  args: { 
    category: v.optional(v.string()),
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    let query = ctx.db
      .query("gallery")
      .withIndex("by_visible", (q) => q.eq("isVisible", true));

    if (args.category) {
      query = ctx.db
        .query("gallery")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .filter((q) => q.eq(q.field("isVisible"), true));
    }

    const gallery = await query
      .order("desc")
      .take(limit);

    return Promise.all(
      gallery.map(async (item) => ({
        ...item,
        imageUrl: await ctx.storage.getUrl(item.imageId),
      }))
    );
  },
});

export const getAllGallery = query({
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

    if (!admin) {
      throw new Error("Admin access required");
    }

    const gallery = await ctx.db
      .query("gallery")
      .order("desc")
      .collect();

    return Promise.all(
      gallery.map(async (item) => ({
        ...item,
        imageUrl: await ctx.storage.getUrl(item.imageId),
      }))
    );
  },
});

export const generateUploadUrl = mutation({
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

    if (!admin) {
      throw new Error("Admin access required");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const addGalleryItem = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    imageId: v.id("_storage"),
    category: v.string(),
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

    if (!admin) {
      throw new Error("Admin access required");
    }

    return await ctx.db.insert("gallery", {
      title: args.title,
      description: args.description,
      imageId: args.imageId,
      category: args.category,
      isVisible: true,
      uploadedBy: userId,
      uploadedAt: Date.now(),
    });
  },
});

export const updateGalleryItem = mutation({
  args: {
    itemId: v.id("gallery"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    isVisible: v.optional(v.boolean()),
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

    if (!admin) {
      throw new Error("Admin access required");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Gallery item not found");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.category !== undefined) updates.category = args.category;
    if (args.isVisible !== undefined) updates.isVisible = args.isVisible;

    return await ctx.db.patch(args.itemId, updates);
  },
});

export const deleteGalleryItem = mutation({
  args: { itemId: v.id("gallery") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin) {
      throw new Error("Admin access required");
    }

    return await ctx.db.delete(args.itemId);
  },
});

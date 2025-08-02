import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPublicGallery = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    let query = ctx.db
      .query("gallery")
      .withIndex("by_visible", (q) => q.eq("isVisible", true));

    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    const gallery = await query.order("desc").take(limit);
    return Promise.all(
      gallery.map(async (item) => ({
        ...item,
        imageUrl: item.imageId ? await ctx.storage.getUrl(item.imageId) : undefined,
      }))
    );
  },
});

export const getAllGallery = query({
  args: {}, // Removed adminId requirement
  handler: async (ctx) => {
    const gallery = await ctx.db.query("gallery").order("desc").collect();
    return Promise.all(
      gallery.map(async (item) => ({
        ...item,
        imageUrl: item.imageId ? await ctx.storage.getUrl(item.imageId) : undefined,
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  args: {}, // Removed adminId requirement
  handler: async (ctx) => {
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
    return await ctx.db.insert("gallery", {
      title: args.title,
      description: args.description,
      imageId: args.imageId,
      category: args.category,
      isVisible: true,
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
    await ctx.db.patch(args.itemId, {
      title: args.title,
      description: args.description,
      category: args.category,
      isVisible: args.isVisible,
    });
  },
});

export const deleteGalleryItem = mutation({
  args: {
    itemId: v.id("gallery"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
  },
});
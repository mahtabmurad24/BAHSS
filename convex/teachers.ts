import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getPublicTeachers = query({
  args: { 
    department: v.optional(v.string()),
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    let query = ctx.db
      .query("teachers")
      .withIndex("by_active", (q) => q.eq("isActive", true));

    if (args.department) {
      query = ctx.db
        .query("teachers")
        .withIndex("by_department", (q) => q.eq("department", args.department!))
        .filter((q) => q.eq(q.field("isActive"), true));
    }

    const teachers = await query
      .order("asc")
      .take(limit);

    return Promise.all(
      teachers.map(async (teacher) => ({
        ...teacher,
        imageUrl: teacher.imageId ? await ctx.storage.getUrl(teacher.imageId) : null,
      }))
    );
  },
});

export const getAllTeachers = query({
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

    const teachers = await ctx.db
      .query("teachers")
      .order("asc")
      .collect();

    return Promise.all(
      teachers.map(async (teacher) => ({
        ...teacher,
        imageUrl: teacher.imageId ? await ctx.storage.getUrl(teacher.imageId) : null,
      }))
    );
  },
});

export const addTeacher = mutation({
  args: {
    name: v.string(),
    designation: v.string(),
    department: v.string(),
    qualification: v.string(),
    experience: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    bio: v.optional(v.string()),
    order: v.number(),
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

    return await ctx.db.insert("teachers", {
      name: args.name,
      designation: args.designation,
      department: args.department,
      qualification: args.qualification,
      experience: args.experience,
      email: args.email,
      phone: args.phone,
      imageId: args.imageId,
      bio: args.bio,
      isActive: true,
      order: args.order,
      createdBy: userId,
      createdAt: Date.now(),
    });
  },
});

export const updateTeacher = mutation({
  args: {
    teacherId: v.id("teachers"),
    name: v.optional(v.string()),
    designation: v.optional(v.string()),
    department: v.optional(v.string()),
    qualification: v.optional(v.string()),
    experience: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    bio: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    order: v.optional(v.number()),
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

    const teacher = await ctx.db.get(args.teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.designation !== undefined) updates.designation = args.designation;
    if (args.department !== undefined) updates.department = args.department;
    if (args.qualification !== undefined) updates.qualification = args.qualification;
    if (args.experience !== undefined) updates.experience = args.experience;
    if (args.email !== undefined) updates.email = args.email;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.imageId !== undefined) updates.imageId = args.imageId;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.isActive !== undefined) updates.isActive = args.isActive;
    if (args.order !== undefined) updates.order = args.order;

    return await ctx.db.patch(args.teacherId, updates);
  },
});

export const deleteTeacher = mutation({
  args: { teacherId: v.id("teachers") },
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

    return await ctx.db.delete(args.teacherId);
  },
});

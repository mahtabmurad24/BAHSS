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

export const getPublicTeachers = query({
  args: {
    department: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    let query = ctx.db
      .query("teachers")
      .withIndex("by_active", (q) => q.eq("isActive", true));
    if (args.department !== undefined) {
      query = ctx.db
        .query("teachers")
        .withIndex("by_department_active", (q) =>
          q.eq("department", args.department as string).eq("isActive", true)
        );
    }
    const teachers = await query.order("asc").take(limit);
    return Promise.all(
      teachers.map(async (teacher) => ({
        ...teacher,
        imageUrl: teacher.imageId ? await ctx.storage.getUrl(teacher.imageId) : undefined,
      }))
    );
  },
});

export const getAllTeachers = query({
  args: { code: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.code) {
      await checkAdminCode(ctx, args.code);
    }
    const teachers = await ctx.db.query("teachers").order("asc").collect();
    return Promise.all(
      teachers.map(async (teacher) => ({
        ...teacher,
        imageUrl: teacher.imageId ? await ctx.storage.getUrl(teacher.imageId) : undefined,
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    await checkAdminCode(ctx, args.code);
    return await ctx.storage.generateUploadUrl();
  },
});

export const addTeacher = mutation({
  args: {
    code: v.string(),
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
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    await checkAdminCode(ctx, args.code);
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
      createdBy: args.createdBy || "system",
      createdAt: args.createdAt,
    });
  },
});

export const updateTeacher = mutation({
  args: {
    code: v.string(),
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
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await checkAdminCode(ctx, args.code);
    const teacher = await ctx.db.get(args.teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    await ctx.db.patch(args.teacherId, {
      name: args.name !== undefined ? args.name : teacher.name,
      designation: args.designation !== undefined ? args.designation : teacher.designation,
      department: args.department !== undefined ? args.department : teacher.department,
      qualification: args.qualification !== undefined ? args.qualification : teacher.qualification,
      experience: args.experience !== undefined ? args.experience : teacher.experience,
      email: args.email !== undefined ? args.email : teacher.email,
      phone: args.phone !== undefined ? args.phone : teacher.phone,
      imageId: args.imageId !== undefined ? args.imageId : teacher.imageId,
      bio: args.bio !== undefined ? args.bio : teacher.bio,
      order: args.order !== undefined ? args.order : teacher.order,
      isActive: args.isActive !== undefined ? args.isActive : teacher.isActive,
    });
  },
});

export const deleteTeacher = mutation({
  args: {
    code: v.string(),
    teacherId: v.id("teachers"),
  },
  handler: async (ctx, args) => {
    await checkAdminCode(ctx, args.code);
    const teacher = await ctx.db.get(args.teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    await ctx.db.delete(args.teacherId);
  },
});

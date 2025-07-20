import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const SUPER_ADMIN_CODE = "SUPER2025ADMIN";
const ADMIN_CODE = "ADMIN2025";
const SUPER_ADMIN_SECRET = "BAHSSC2025SECRET";

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return admin && (admin.status === "active" || !admin.status);
  },
});

export const getAdminInfo = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin || (admin.status && admin.status !== "active")) return null;

    const user = await ctx.db.get(userId);
    return {
      admin,
      user,
      role: admin.role,
    };
  },
});

export const initializeSuperAdmin = mutation({
  args: { 
    adminCode: v.string(),
    secretCode: v.optional(v.string()),
    otp: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Check if user is already an admin
    const existingAdmin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingAdmin) {
      throw new Error("User is already an admin");
    }

    if (args.adminCode === SUPER_ADMIN_CODE) {
      // Super admin verification
      if (!args.secretCode || args.secretCode !== SUPER_ADMIN_SECRET) {
        throw new Error("Invalid secret code for super admin");
      }

      await ctx.db.insert("admins", {
        userId,
        role: "super_admin",
        status: "active",
        createdAt: Date.now(),
      });
    } else if (args.adminCode === ADMIN_CODE) {
      // Regular admin - needs approval
      await ctx.db.insert("admins", {
        userId,
        role: "admin",
        status: "pending",
        createdAt: Date.now(),
      });
      
      throw new Error("Admin request submitted. Please wait for super admin approval.");
    } else {
      throw new Error("Invalid admin code");
    }
  },
});

export const getPendingAdmins = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin || admin.role !== "super_admin" || (admin.status && admin.status !== "active")) {
      return [];
    }

    const pendingAdmins = await ctx.db
      .query("admins")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    return Promise.all(
      pendingAdmins.map(async (admin) => ({
        ...admin,
        user: await ctx.db.get(admin.userId),
      }))
    );
  },
});

export const getAllAdmins = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!admin || admin.role !== "super_admin" || (admin.status && admin.status !== "active")) {
      return [];
    }

    const allAdmins = await ctx.db
      .query("admins")
      .collect();

    return Promise.all(
      allAdmins.map(async (admin) => ({
        ...admin,
        user: await ctx.db.get(admin.userId),
      }))
    );
  },
});

export const approveAdmin = mutation({
  args: { adminId: v.id("admins") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const superAdmin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!superAdmin || superAdmin.role !== "super_admin" || (superAdmin.status && superAdmin.status !== "active")) {
      throw new Error("Super admin access required");
    }

    await ctx.db.patch(args.adminId, {
      status: "active",
      approvedBy: userId,
    });
  },
});

export const removeAdmin = mutation({
  args: { adminId: v.id("admins") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const superAdmin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!superAdmin || superAdmin.role !== "super_admin" || (superAdmin.status && superAdmin.status !== "active")) {
      throw new Error("Super admin access required");
    }

    const adminToRemove = await ctx.db.get(args.adminId);
    if (!adminToRemove) {
      throw new Error("Admin not found");
    }

    if (adminToRemove.userId === userId) {
      throw new Error("Cannot remove yourself");
    }

    await ctx.db.delete(args.adminId);
  },
});

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { v4 as uuidv4 } from "uuid";

export const isAdmin = query({
  args: { adminId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.adminId) return { isAdmin: false, role: null };
    const admin = await ctx.db
      .query("admin")
      .filter((q) => q.eq(q.field("userId"), args.adminId))
      .first();
    return admin ? { isAdmin: admin.status === "approved", role: admin.role } : { isAdmin: false, role: null };
  },
});

export const getConfig = query({
  handler: async (ctx) => {
    return await ctx.db.query("site_config").first();
  },
});

export const initializeSuperAdmin = mutation({
  args: {
    adminCode: v.string(),
    secretCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("site_config").first();
    
    if (config?.superAdmin) {
      const existingAdmin = await ctx.db
        .query("admin")
        .filter((q) => q.eq(q.field("userId"), config.superAdmin))
        .first();
      
      return { 
        success: true,
        message: "Super admin already exists",
        adminId: config.superAdmin,
        role: existingAdmin?.role || "super_admin"
      };
    }

    if (args.adminCode === "sp@bahss") {
      if (!args.secretCode) {
        throw new Error("Secret code required for super admin initialization");
      }
      if (args.secretCode !== "2025@bahss") {
        throw new Error("Invalid secret code");
      }

      const adminId = uuidv4();
      await ctx.db.insert("site_config", {
        superAdminCode: args.adminCode,
        superAdmin: adminId,
        pendingAdmins: [],
        approvedAdmins: [adminId],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await ctx.db.insert("admin", {
        userId: adminId,
        role: "super_admin",
        status: "approved",
        createdAt: Date.now(),
        name: "System Super Admin",
      });

      return { 
        success: true, 
        message: "Super admin initialized successfully", 
        adminId 
      };
    }

    throw new Error("Invalid admin code provided");
  },
});

export const grantSuperAdmin = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("site_config").first();
    if (!config || config.superAdminCode !== args.code) {
      throw new Error("Invalid super admin code");
    }

    const adminId = uuidv4();
    await ctx.db.insert("admin", {
      userId: adminId,
      role: "admin",
      status: "approved",
      createdAt: Date.now(),
      name: undefined,
    });

    return { 
      isAdmin: true, 
      role: "admin",
      adminId
    };
  },
});

export const getAdminInfo = query({
  args: { adminId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.adminId) return null;
    const admin = await ctx.db
      .query("admin")
      .filter((q) => q.eq(q.field("userId"), args.adminId))
      .first();
    if (!admin) return null;
    return {
      _id: admin._id,
      userId: admin.userId,
      role: admin.role,
      status: admin.status || "pending",
      createdAt: admin.createdAt,
      name: admin.name,
    };
  },
});

export const getPendingAdmins = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("admin")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

export const getAllAdmins = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("admin")
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();
  },
});

export const approveAdmin = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("site_config").first();
    if (!config) throw new Error("Site configuration not found");
    const admin = await ctx.db
      .query("admin")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    if (!admin || admin.status !== "pending") {
      throw new Error("User not found in pending admins list");
    }
    await ctx.db.patch(admin._id, {
      status: "approved",
    });
    await ctx.db.patch(config._id, {
      pendingAdmins: config.pendingAdmins?.filter((id) => id !== args.userId) || [],
      approvedAdmins: [...(config.approvedAdmins || []), args.userId],
      updatedAt: Date.now(),
    });
    return { success: true, message: "Admin approved successfully" };
  },
});

export const removeAdmin = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("site_config").first();
    if (!config) throw new Error("Site configuration not found");
    const admin = await ctx.db
      .query("admin")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    if (!admin) throw new Error("Admin not found");
    if (args.userId === config.superAdmin) {
      throw new Error("Cannot remove super admin");
    }
    await ctx.db.patch(admin._id, {
      status: "rejected",
    });
    await ctx.db.patch(config._id, {
      pendingAdmins: config.pendingAdmins?.filter((id) => id !== args.userId) || [],
      approvedAdmins: config.approvedAdmins?.filter((id) => id !== args.userId) || [],
      updatedAt: Date.now(),
    });
    return { success: true, message: "Admin removed successfully" };
  },
});

export const changeAdminRole = mutation({
  args: {
    userId: v.string(),
    newRole: v.union(v.literal("admin"), v.literal("super_admin")),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("site_config").first();
    if (!config) throw new Error("Site configuration not found");
    const admin = await ctx.db
      .query("admin")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    if (!admin) throw new Error("Admin not found");
    if (args.userId === config.superAdmin && args.newRole === "admin") {
      throw new Error("Cannot demote super admin");
    }
    await ctx.db.patch(admin._id, {
      role: args.newRole,
    });
    if (args.newRole === "super_admin") {
      await ctx.db.patch(config._id, {
        superAdmin: args.userId,
        approvedAdmins: config.approvedAdmins?.filter((id) => id !== args.userId) || [],
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(config._id, {
        approvedAdmins: [...(config.approvedAdmins?.filter((id) => id !== args.userId) || []), args.userId],
        superAdmin: config.superAdmin === args.userId ? undefined : config.superAdmin,
        updatedAt: Date.now(),
      });
    }
    return { success: true, message: `Admin role changed to ${args.newRole} successfully` };
  },
});

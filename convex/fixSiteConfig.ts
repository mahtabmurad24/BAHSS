import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const fixSiteConfig = mutation({
  args: {
    secretCode: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.secretCode !== "FIX2025CONFIG") {
      throw new Error("Invalid secret code");
    }
    const siteConfig = await ctx.db.query("site_config").first();
    if (!siteConfig) {
      await ctx.db.insert("site_config", {
        superAdminCode: "ADMIN2025",
        superAdmin: undefined,
        pendingAdmins: [],
        approvedAdmins: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { success: true, message: "Site config created with default superAdminCode" };
    }
    if (!siteConfig.superAdminCode) {
      await ctx.db.patch(siteConfig._id, {
        superAdminCode: "ADMIN2025",
        updatedAt: Date.now(),
      });
      return { success: true, message: "Site config updated with superAdminCode" };
    }
    return { success: true, message: "Site config already has superAdminCode" };
  },
});
import { mutation } from "./_generated/server";

export const resetSiteConfig = mutation({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db.query("site_config").collect();
    for (const config of configs) {
      await ctx.db.delete(config._id);
    }
    return { success: true };
  },
});
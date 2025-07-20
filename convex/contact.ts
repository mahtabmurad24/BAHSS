import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitContactForm = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    branch: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contact", {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      branch: args.branch,
      subject: args.subject,
      message: args.message,
      submittedAt: Date.now(),

    });
  },
});

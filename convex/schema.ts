import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  project_counter: defineTable({
    userId: v.id("users"),
    nextProjectNumber: v.number(),
  }).index("by_userId", ["userId"]),

  project: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    styleGuide: v.optional(v.string()),
    sketchData: v.any(),
    viewPortData: v.optional(v.any()),
    generatedDesignData: v.optional(v.any()),
    thumbnailUrl: v.optional(v.string()),
    moodBoardImages: v.optional(v.array(v.string())),
    inspirationImages: v.optional(v.array(v.string())),
    createdAt: v.number(),
    lastModified: v.number(),
    isPublic: v.boolean(),
    tags: v.optional(v.array(v.string())),
    projectNumber: v.number(),
  }).index("by_userId", ["userId"]),

  credit_ledger: defineTable({
    userId: v.id("users"),
    subscriptionId: v.id("subscriptions"),
    amount: v.number(),
    type: v.string(),
    reason: v.optional(v.string()),
    idempodencyKey: v.optional(v.string()),
    meta: v.optional(v.any()),
  })
    .index("by_subscriptionId", ["subscriptionId"])
    .index("by_userId", ["userId"])
    .index("by_idempodencyKey", ["idempodencyKey"]),
    
  subscriptions_table: defineTable({
    userId: v.id("users"),
    polarCustomerId: v.string(),
    polarsubscriptionId: v.string(),
    productId: v.optional(v.string()),
    priceId: v.optional(v.string()),
    planeCode: v.optional(v.string()),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    cancelAt: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    seats: v.optional(v.number()),
    metadata: v.optional(v.any()),
    creditBalance: v.number(),
    creditGrantPerPeriod: v.number(),
    creditRolloverLimit: v.number(),
    lastGrantCursor: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_polarSubscriptionId", ["polarsubscriptionId"])
    .index("by_status", ["status"]),
});

export default schema;

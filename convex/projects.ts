import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getProject = query({
    args: {projectId: v.id("project")},
    handler: async (ctx, {projectId}) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const project = await ctx.db.get(projectId);
        if (project?.userId !== userId && !project?.isPublic) {
            throw new Error("Not authorized");
        }
        return project;
    }
})

export const createProject = mutation({
    args: {
        userId: v.id('users'),
        name: v.optional(v.string()),
        sketchesData: v.any(),
        thumbnail: v.optional(v.string()),
    },
    handler: async (ctx, {userId, sketchesData, name, thumbnail}) => {
        console.log('Creating project', userId)

        const projectNumber = await getNextProjectNumber(ctx, userId)
        const projectName = name || `Project ${projectNumber}`

        const projectId = await ctx.db.insert('project', {
            userId,
            title: projectName,
            sketchData: sketchesData,
            thumbnail,
            projectNumber,
            lastModified: Date.now(),
            createdAt: Date.now(),
            isPublic: false
        })

        console.log('Project Created', projectNumber)

        return {
            projectId, name: projectName, projectNumber 
        }
    }
})

async function getNextProjectNumber(ctx: any, userId: string): Promise<number> {
    const counter = await ctx.db.query('project_counter').withIndex('by_userId', (q: any) => q.eq('userId', userId)).first()
    if(!counter) { 
        await ctx.db.insert('project_counter', {userId, nextProjectNumber: 2,})
        return 1
    }
    const projectNumber = counter.nextProjectNumber

    await ctx.db.patch(counter._id, {
        nextProjectNumber: projectNumber + 1,
    })
    return projectNumber
}

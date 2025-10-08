import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMoodBoardImages = query({
    args: { projectId: v.id('project') },
    handler: async (ctx, { projectId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        const project = await ctx.db.get(projectId);
        if (!project || project.userId !== userId) {
            return [];
        }

        const storageIds = project.moodBoardImages || [];
        const images = await Promise.all(
            storageIds.map(async (storageId, i) => {
                try {
                    const url = await ctx.storage.getUrl(storageId);
                    return { 
                        id: `convex-${storageId}`,
                        storageId,
                        url,
                        uploaded: true,
                        uploading: false,
                        i,
                     };
                } catch (e) {
                    return null;
                }
            })
        )

        return images.filter((img) => img !== null).sort((a, b) => {
            return a!.i - b!.i;
        })
    }
})

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        return await ctx.storage.generateUploadUrl();
    }
})

export const removeMoodBoardImages = mutation({
    args: { projectId: v.id('project'), storageId: v.id('_storage') },
    handler: async (ctx, { projectId, storageId }) => {
        const userId = await getAuthUserId(ctx);
        if(!userId) {
            throw new Error("Not authenticated");
        }

        const project = await ctx.db.get(projectId);
        if(!project || project.userId !== userId) {
            throw new Error("Project not found");
        }

        if (project.userId !== userId) {
            throw new Error("Access denied");
        }

        const currentImage  = project.moodBoardImages || [];
        const updatedImages = currentImage.filter((id) => id !== storageId);

        await ctx.db.patch(projectId, {
            moodBoardImages: updatedImages,
            lastModified: Date.now()
        })

        try {
            await ctx.storage.delete(storageId)
        } catch (e) {
            console.error(`Failed to delete mood board images from storage ${storageId}`, e)
        }

        return {success: true, imageCount: updatedImages.length}
    }
})

export const addMoodBoardImage = mutation({
    args: {
        projectId: v.id('project'),
        storageId: v.id('_storage'),
    },
    handler: async (ctx, {projectId, storageId}) => {
        const userId = await getAuthUserId(ctx)
        if(!userId) {
            throw new Error('Not Authenticated')
        }

        const project = await ctx.db.get(projectId);
        if(!project || project.userId !== userId) {
            throw new Error("Project not found");
        }

        if (project.userId !== userId) {
            throw new Error("Access denied");
        }

        const currentImages = project.moodBoardImages || []
        if(currentImages.length >= 5) {
            throw new Error('Max 5 images allowed')
        }

        const updatedImages = [...currentImages, storageId]

        await ctx.db.patch(projectId, {
            moodBoardImages: updatedImages,
            lastModified: Date.now(),
        })

        return {success: true, imageCount: updatedImages.length}
    }
})
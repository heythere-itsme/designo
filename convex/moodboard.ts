import { v } from "convex/values";
import { query } from "./_generated/server";
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
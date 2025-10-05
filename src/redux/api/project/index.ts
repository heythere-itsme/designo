import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type AutoSaveProjectResponse = {
    success: boolean;
    message: string;
    enventId: string;
}
type AutoSaveProjectRequest = {
    projectId: string;
    userId: string;
    shapesData: {
        shapes: Record<string, unknown>;
        tool: string;
        selected: Record<string, unknown>;
        frameCounter: number;
    }
    viewPortData?: {
        scale: number;
        translate: { x: number; y: number }
    }
}

export const projectApi = createApi({
    reducerPath: 'projectApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/projects' }),
    tagTypes: ['Project'],
    endpoints: (builder) => ({
        autosaveProject: builder.mutation<AutoSaveProjectResponse, AutoSaveProjectRequest>({
            query: (body) => ({
                url: '',
                method: 'PATCH',
                body: body, 
            })
        }),
    }),
})
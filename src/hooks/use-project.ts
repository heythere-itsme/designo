'use client'

import { addProject, createProjectFailure, createProjectStart, createProjectSuccess } from "@/redux/slices/projects"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { fetchMutation } from "convex/nextjs";
import { toast } from "sonner"
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const generateGradientThumbnail = () => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97f 0%, #fee140 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #a855f7 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fcb69f 100%)',
  ];

  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  // Extract the two color stops
  const colors = randomGradient.match(/#([0-9a-f]{6})/gi);
  const color1 = colors?.[0] || '#667eea';
  const color2 = colors?.[1] || '#764ba2';

  const svgContent = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill="url(#grad)" />
    </svg>
  `;

  // Convert SVG to Base64 Data URL
  const base64Svg = btoa(svgContent);
  return `data:image/svg+xml;base64,${base64Svg}`;
};


export const useProjectCreation = () => {
    const dispatch = useAppDispatch()
    const user = useAppSelector((store) => store.profile)
    const projectsState = useAppSelector((store) => store.projects)
    const shapesState = useAppSelector((state) => state.shapes)
    const createProject = async (name?: string) => {
        if (!user?.id) {
            toast.error('Sign in req')
            return
        }
        dispatch(createProjectStart())
        try {
            const thumbnail = generateGradientThumbnail();
            const result = await fetchMutation(api.projects.createProject, {
                userId: user.id as Id<'users'>,
                name: name || undefined,
                sketchesData: {
                    shapes: shapesState.shapes,
                    tool: shapesState.tool,
                    selected: shapesState.selected,
                    frameCounter: shapesState.frameCounter,
                },
                thumbnail
            })
            dispatch(addProject({
                _id: result.projectId,
                name: result.name,
                projectNumber: result.projectNumber,
                thumbnail,
                lastModified: Date.now(),
                createdAt: Date.now(),
                isPublic: false
            }))
            dispatch(createProjectSuccess())
            toast.success('Project Created')
        } catch (error) {
            dispatch(createProjectFailure('Failed to create project'))
            toast.error('failed')
            console.error('Project creation failed', error)
        }
    }
    return {
        createProject,
        isCreating: projectsState.isCreating,
        projects: projectsState.projects,
        projectsTotal: projectsState.total,
        canCreate: !!user?.id,
    }
}
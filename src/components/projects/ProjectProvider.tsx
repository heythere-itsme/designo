'use client'
import { fetchProjectSuccess } from '@/redux/slices/projects';
import { useAppDispatch } from '@/redux/store';
import React, { useEffect } from 'react'

type Props = {
    children: React.ReactNode;
    initialProjects: any;
}

const ProjectProvider = ({children, initialProjects} : Props) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if(initialProjects?._valueJSON) {
        const projectsData = initialProjects._valueJSON
        dispatch(fetchProjectSuccess({
            projects: projectsData,
            total: projectsData.length
        }))
    }
  }, [dispatch, initialProjects])
    return (
    <div>{children}</div>
  )
}

export default ProjectProvider
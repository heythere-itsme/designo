import ProjectProvider from '@/components/projects/ProjectProvider';
import ProjectsList from '@/components/projects/ProjectsList';
import { ProjectsQuery } from '@/convex/query.config'
import React from 'react'

const DashBoardPage = async () => {
  const {profile, projects} = await ProjectsQuery();

  return (
    <ProjectProvider initialProjects={projects}>
      <div className='container mx-auto py-36 px-4'>
        <ProjectsList />
      </div>
    </ProjectProvider>
  )
}

export default DashBoardPage

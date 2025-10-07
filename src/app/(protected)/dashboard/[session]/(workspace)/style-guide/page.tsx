import StyleTypography from '@/components/StyleTypography'
import ThemeContent from '@/components/ThemeContent'
import { TabsContent } from '@/components/ui/tabs'
import { MoodBoardImagesQuery, styleGuideQuery } from '@/convex/query.config'
import { MoodBoardImage } from '@/hooks/use-styles'
import { StyleGuide } from '@/redux/api/style-guide'
import { Palette } from 'lucide-react'
import React from 'react'

type Props = {
  searchParams: Promise<{project: string}>
}

const page = async ({searchParams} : Props) => {
  const projectId = (await searchParams).project
  const existingStyleGuide = await styleGuideQuery(projectId)

  const guide = existingStyleGuide.styleGuide?._valueJSON as unknown as StyleGuide ?? null

  const colorGuide = guide?.colorSections || []
  const typographyGuide = guide?.typographySections || []

  const existingMoodBoardImages = await MoodBoardImagesQuery(projectId)
  const guideImages = existingMoodBoardImages.moodBoardImages._valueJSON as unknown as MoodBoardImage[]
  return (
    <div>
      <TabsContent
      value='colors'
      className='space-y-8'>
        {!guideImages.length ? (
          <div className='space-y-8'>
            <div className='text-center py-20'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center'>
                <Palette className='w-8 h-8 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-medium text-foreground mb-2'>Colors not generated yet</h3>
              <p className='text-sm text-muted-foreground max-w-md mx-auto mb-6'>Upload Images to your mood board and generate AI powered style guide with color and typography</p>
            </div>
          </div>
        ) : (
          <ThemeContent colorGuide={colorGuide} />
        )}
      </TabsContent>

      <TabsContent value='typography'>
        <StyleTypography typographyGuide={typographyGuide} />
      </TabsContent>
    </div>
  )
}

export default page
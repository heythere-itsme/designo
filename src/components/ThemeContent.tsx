import { cn } from '@/lib/utils';
import React from 'react'
import ColorSwatch from './ColorSwatch';

type Props = {
    title: string;
    swatches: Array<{
        name: string;
        hexColor: string;
        description?: string
    }>;
    className?: string
}

const ColorTheme = ({title, swatches, className} : Props) => {
    return (
        <div className={cn('flex flex-col gap-5', className)}>
            <div>
                <h3 className='text-lg font-medium text-foreground/50'>{title}</h3>
            </div>
            <div>
                {swatches.map((swatch) => (
                    <div key={swatch.name}>
                        <ColorSwatch name={swatch.name} value={swatch.hexColor} />
                        {swatch.description && (
                            <p className='text-xs text-muted-foreground mt-2'>{swatch.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

const ThemeContent = ({colorGuide} : {colorGuide: any[]}) => {
  return (
    <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-10'>
            {colorGuide.map((section: any, i: number) => (
                <ColorTheme 
                key={i}
                title={section.title}
                swatches={section.swatches} />
            ))}
        </div>
    </div>
  )
}

export default ThemeContent
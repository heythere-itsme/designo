import { cn } from '@/lib/utils';
import React from 'react'

type Props = {
    name: string;
    value: string;
    className?: string
}

const ColorSwatch = ({name, value, className} : Props) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
        <div className='w-12 h-12 rounded-lg border border-border/20 shrink-0 flex'
        style={{backgroundColor: value}}>
            <div>
                <h4 className='text-sm font-medium text-foreground'>{name}</h4>
                <p className='text-xs text-muted-foreground font-mono uppercase'>{value}</p>
            </div>
        </div>
    </div>
  )
}

export default ColorSwatch
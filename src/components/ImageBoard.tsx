import { MoodBoardImage } from '@/hooks/use-styles';
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

type Props = {
    image: MoodBoardImage;
    removeImage: (id: string) => void;
    rotation: number;
    xOffset: number;
    yOffset: number;
    zIndex?: number;
    marginleft?: string;
    marginTop?: string;
}

const UploadStatus = ({uploading, uploaded, error} : {uploading?: boolean, uploaded?: boolean, error?: string}) => {
    if(uploading) (
            <div className='absolute inset-0 bg-black/50 items-center justify-center rounded-2xl'>
                <Loader2 className='w-6 h-6 text-white animate-spin' />
            </div>
        )
    

    if(uploaded) (
        <div className='absolute top-2 right-2'>
            <CheckCircle className='w-5 h-5 text-green-400' />
        </div>
    )

    if(error) (
        <div className='absolute top-2 right-2'>
            <AlertCircle className='w-5 h-5 text-red-400' />
        </div>
    )
    return null

}

const ImageBoard = ({image, removeImage, rotation, xOffset, yOffset, zIndex, marginleft, marginTop} : Props) => {
  return (
    <div
    key={`board-${image.id}`}
    className='absolute group'
    style={{
        transform: `rotate(${rotation}deg) translate(${xOffset}px, ${yOffset}px)`,
        zIndex: zIndex,
        left: "50%",
        marginLeft: marginleft,
        marginTop: marginTop,
        top: "50%",
    }}>
        <div>
            <Image 
            src={image.preview}
            alt='Mood Board'
            fill
            className='object-cover'/>

            <UploadStatus 
            uploading={image.uploading}
            uploaded={image.uploaded}
            error={image.error}/>

            <button
            onClick={() => removeImage(image.id)}
            className='absolute top-2 right-2 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                <X className='w-4 h-4 text-white' />
            </button>
        </div>
    </div>
  )
}

export default ImageBoard
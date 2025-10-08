"use client";
import { MoodBoardImage, useMoodBoard } from "@/hooks/use-styles";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import ImageBoard from "./ImageBoard";

type Props = {
  guideImages: MoodBoardImage[];
};

const MoodBoard = ({ guideImages }: Props) => {
  const {
    images,
    dragActive,
    removeImage,
    handleDrag,
    handleDrop,
    handleFileInput,
    canAddMore,
  } = useMoodBoard(guideImages);

  return (
    <div className="flex flex-col gap-10">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 min-h-[500px] flex items-center justify-center",
          dragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border/50 hover:border-border"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
        </div>
        {images!.length === 0 && (
          <div className="lg:hidden absolute inset-0 fle items-center justify-center">
            <div className="relative">
              {images?.map((img, index) => {

                const seed = img.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
                const random1 = ((seed*9301 + 49297) % 233280) / 233280
                const random2 = (((seed + 1)*9301 + 49297) % 233280) / 233280
                const random3 = (((seed + 2)*9301 + 49297) % 233280) / 233280

                const rotation = (random1 - 0.5) * 20;
                const xOffset = (random2 - 0.5) * 40;
                const yOffset = (random3 - 0.5) * 30;
                return (
                  <ImageBoard
                  key={`mobile-${img.id}`} 
                  image={img}
                  removeImage={removeImage}
                  rotation={rotation}
                  xOffset={xOffset}
                  yOffset={yOffset}
                  zIndex={index + 1}
                  marginleft='-80px'
                  marginTop='-96px'
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodBoard;

"use client";
import { MoodBoardImage, useMoodBoard } from "@/hooks/use-styles";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import ImageBoard from "./ImageBoard";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";

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

  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

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
        {images!.length > 0 && (
          <>
            <div className="lg:hidden absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {images?.map((img, index) => {
                  const seed = img.id
                    .split("")
                    .reduce((a, b) => a + b.charCodeAt(0), 0);
                  const random1 = ((seed * 9301 + 49297) % 233280) / 233280;
                  const random2 =
                    (((seed + 1) * 9301 + 49297) % 233280) / 233280;
                  const random3 =
                    (((seed + 2) * 9301 + 49297) % 233280) / 233280;

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
                      marginleft="-80px"
                      marginTop="-96px"
                    />
                  );
                })}
              </div>
            </div>
            <div className="hidden lg:flex absolute inset-0 items-center justify-center">
              <div className="relative w-full max-w-[700px] h-[300px] mx-auto">
                {images?.map((img, index) => {
                  const seed = img.id
                    .split("")
                    .reduce((a, b) => a + b.charCodeAt(0), 0);
                  const random1 = ((seed * 9301 + 49297) % 233280) / 233280;
                  const random3 =
                    (((seed + 2) * 9301 + 49297) % 233280) / 233280;
                  const spacing = 162;
                  const rotation = (random1 - 0.5) * 50;
                  const xOffset =
                    index * spacing - ((images.length - 1) * spacing) / 2;
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
                      marginleft="-96px"
                      marginTop="-112px"
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        {images?.length === 0 && (
          <div className="relative z-10 space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg text-foreground font-medium">
                Drop your images
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Drage and drop here
              </p>
            </div>
            <Button
            onClick={handleUploadClick}
            variant={"outline"}>
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        )}

        {images!.length > 0 && canAddMore && (
          <div className="absolute bottom-6 right-6 z-20">
            <Button
            onClick={handleUploadClick}
            size="sm"
            variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Add More
            </Button>
          </div>
        )}

        <input 
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        />
      </div>
        {/* Functionality to be added */}
      <Button className="w-fit">Generate Styles</Button>
      {images!.length >= 5 && (
        <div className="text-center p-4 bg-muted/50 rounded-2xl">
          <p className="text-sm text-muted-foreground">Limit reached: 5</p>
        </div>
      )}
    </div>
  );
};

export default MoodBoard;

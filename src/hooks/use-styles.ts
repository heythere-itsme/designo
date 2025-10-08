import { useMutation } from "convex/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export interface MoodBoardImage {
  id: string;
  file?: File;
  preview: string;
  storageId?: string;
  uploaded: boolean;
  uploading: boolean;
  error?: string;
  url?: string;
  isFromServer?: boolean;
}

interface StylesFormData {
  images?: MoodBoardImage[];
}

export const useMoodBoard = (guideImages: MoodBoardImage[]) => {
  const [dragActive, setDragActive] = useState(false);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const form = useForm<StylesFormData>({
    defaultValues: {
      images: [],
    },
  });

  const { watch, setValue, getValues } = form;
  const images = watch("images");

  const generateUploadUrl = useMutation(api.moodboard.generateUploadUrl);
  const removeMoodBoardImages = useMutation(
    api.moodboard.removeMoodBoardImages
  );
  const addMoodBoardImage = useMutation(api.moodboard.addMoodBoardImage);

  const uploadImage = async (
    file: File
  ) => {
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) {
        throw new Error(`Upload Failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();

      if (projectId) {
        await addMoodBoardImage({
          projectId: projectId as Id<"project">,
          storageId: storageId as Id<"_storage">,
        });
      }
      return { storageId };
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (guideImages && guideImages.length > 0) {
      const serverImages: MoodBoardImage[] = guideImages.map((img: any) => ({
        id: img.id,
        preview: img.url,
        storageId: img.storageId,
        uploaded: true,
        uploading: false,
        isFromServer: true,
        url: img.url,
      }));
      const currentImage = getValues("images") || [];
      if (currentImage.length === 0) {
        setValue("images", serverImages);
      } else {
        const mergedImages = [...currentImage];
        serverImages.forEach((serverImg) => {
          const clinetIndex = mergedImages.findIndex(
            (clientImg) => clientImg.storageId === serverImg.storageId
          );

          if (clinetIndex !== -1) {
            if (mergedImages[clinetIndex].preview.startsWith("blob:")) {
              URL.revokeObjectURL(mergedImages[clinetIndex].preview);
            }

            mergedImages[clinetIndex] = serverImg;
          }
        });
        setValue("images", mergedImages);
      }
    }
  }, [guideImages]);

  const addImage = (file: File) => {
    if (images!.length >= 5) {
      toast.error("You can only add up to 5 images");
      return;
    }

    const newImage: MoodBoardImage = {
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      uploading: false,
      isFromServer: false,
    };

    const updatedImages = [...images!, newImage];
    setValue("images", updatedImages);

    toast.success("Image added to mood board");
  };

  const removeImage = async (imageId: string) => {
    const imageToRemove = images!.find((img) => img.id === imageId);
    if (!imageToRemove) return;

    if (imageToRemove.isFromServer && imageToRemove.storageId && projectId) {
      try {
        await removeMoodBoardImages({
          projectId: projectId as Id<"project">,
          storageId: imageToRemove.storageId as Id<"_storage">,
        });
      } catch (e) {
        console.error(e);
        toast.error("Failed to remove image from server");
        return;
      }
    }
    const updatedImages = images?.filter((img) => {
      if (img.id === imageId) {
        if (!img.isFromServer && img.preview.startsWith(`blob:`)) {
          URL.revokeObjectURL(img.preview);
        }
        return false;
      }
      return true;
    });

    setValue("images", updatedImages);
    toast.success("Image Removed"); // Remove later
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("Please drop image file only");
      return;
    }

    imageFiles.forEach((file) => {
      if (images!.length < 5) {
        addImage(file);
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => addImage(file));

    e.target.value = "";
  };

  useEffect(() => {
    const uploadPendingImages = async () => {
      const currentImages = getValues("images") || [];
      if (currentImages.length > 0) {
        for (let i = 0; i < currentImages.length; i++) {
          const image = currentImages[i];
          if (!image.uploaded && !image.uploading && !image.error) {
            const updatedImages = [...currentImages];
            updatedImages[i] = { ...image, uploading: true };
            setValue("images", updatedImages);
            try {
              const { storageId } = await uploadImage(image.file!);
              const finalImages = getValues("images") || [];

              const finalIndex = finalImages?.findIndex(
                (img) => img.id === image.id
              );

              if (finalIndex !== -1) {
                finalImages[finalIndex] = {
                  ...finalImages[finalIndex],
                  storageId,
                  uploaded: true,
                  uploading: false,
                  isFromServer: true,
                };
                setValue("images", [...finalImages]);
              }
            } catch (e) {
              console.error(e);
              const errorImages = getValues("images");
              const errorIndex = errorImages?.findIndex(
                (img) => img.id === image.id
              );
              if (errorIndex !== -1) {
                errorImages![errorIndex!] = {
                  ...errorImages![errorIndex!],
                  uploading: false,
                  error: "Upload failed",
                };
                setValue("images", [...errorImages!]);
              }
            }
          }
        }
      }
    };

    if (images!.length > 0) {
      uploadPendingImages();
    }
  }, [images]);

  useEffect(() => {
    return () => {
      images?.forEach((img) => {
        URL.revokeObjectURL(img.preview)
      })
    }
  },[images])

  return {
    form,
    images,
    dragActive,
    addImage,
    removeImage,
    handleDrag,
    handleDrop,
    handleFileInput,
    canAddMore: images!.length < 5,
  }
};

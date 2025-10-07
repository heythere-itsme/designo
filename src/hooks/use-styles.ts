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
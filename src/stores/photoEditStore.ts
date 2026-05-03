import { create } from "zustand";
import { FileWithPath } from "react-dropzone";

interface PhotoEditStore {
  currentFile: FileWithPath | null;
  setCurrentFile: (file: FileWithPath | null) => void;
  
  imgLink: string | null;
  setImgLink: (link: string | null) => void;
  
  resetState: () => void;
}

export const usePhotoEditStore = create<PhotoEditStore>((set, get) => ({
  currentFile: null,
  setCurrentFile: (file: FileWithPath | null) => set({ currentFile: file }),
  
  imgLink: null,
  setImgLink: (link: string | null) => set({ imgLink: link }),
  
  resetState: () => set({ currentFile: null, imgLink: null }),
}));

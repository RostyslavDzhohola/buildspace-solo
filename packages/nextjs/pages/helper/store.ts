import create from "zustand";
import { BookType } from "~~/components/types";

const useStore = create(set => ({
  booksMetadata: [],
  isMetadataFetched: false,
  setBooksMetadata: booksMetadata => set({ booksMetadata }),
  setIsMetadataFetched: isMetadataFetched => set({ isMetadataFetched }),
}));

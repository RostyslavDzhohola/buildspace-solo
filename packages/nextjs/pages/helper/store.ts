// store.ts
import create from "zustand";
import { BookType } from "~~/components/types";

type Store = {
  booksMetadata: BookType[];
  isMetadataFetched: boolean;
  setBooksMetadata: (booksMetadata: BookType[]) => void;
  setIsMetadataFetched: (isMetadataFetched: boolean) => void;
  updateBooksMetadata: (data: any) => void;
  fetchAllMetadata: (booksMetadata: BookType[]) => Promise<void>;
};

const useStore = create<Store>(set => ({
  booksMetadata: [],
  isMetadataFetched: false,
  setBooksMetadata: booksMetadata => set({ booksMetadata }),
  setIsMetadataFetched: isMetadataFetched => set({ isMetadataFetched }),
  updateBooksMetadata: data => {
    const newBooksMetadata = data.map(event => ({
      bookName: event.args.tokenName,
      bookAddress: event.args.bookAddress,
      baseURI: event.args.baseURI,
      symbol: event.args.symbol,
      price: Number(event.args.price),
    }));
    set({ booksMetadata: newBooksMetadata });
  },
  fetchAllMetadata: async booksMetadata => {
    const allPromises = booksMetadata.map(book => fetchMetadata(book.baseURI));
    const allResults = await Promise.all(allPromises);

    // Merge fetched metadata with existing metadata
    const updatedBooksMetadata = booksMetadata.map((book, index) => {
      const fetchedData = allResults[index];
      if (fetchedData) {
        return {
          ...book,
          priceInDollars: fetchedData.price,
          description: fetchedData.description,
          symbol: fetchedData.symbol,
          image: makeGatewayURL(fetchedData.image),
        };
      }
      return book;
    });
    setBooksMetadata(updatedBooksMetadata); // Update state
  },
}));

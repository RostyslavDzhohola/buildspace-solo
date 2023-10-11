import { toGatewayURL } from "nft.storage";
import create from "zustand";
import { BookType } from "~~/components/types";

export interface Store {
  booksMetadata: BookType[];
  isMetadataFetched: boolean;
  setBooksMetadata: (booksMetadata: BookType[]) => void;
  setIsMetadataFetched: (isMetadataFetched: boolean) => void;
  updateBooksMetadata: (data: any) => void;
  fetchAllMetadata: (booksMetadata: BookType[]) => Promise<void>;
}

const useStore = create<Store>(set => ({
  booksMetadata: [],
  isMetadataFetched: false,
  setBooksMetadata: (booksMetadata: BookType[]) => set({ booksMetadata }),
  setIsMetadataFetched: isMetadataFetched => set({ isMetadataFetched }),
  updateBooksMetadata: data => {
    const newBooksMetadata = data.map((event: any) => ({
      bookName: event.args.tokenName,
      bookAddress: event.args.bookAddress,
      baseURI: event.args.baseURI,
      symbol: event.args.symbol,
      price: Number(event.args.price),
    }));
    set({ booksMetadata: newBooksMetadata });
  },
  fetchAllMetadata: async booksMetadata => {
    function makeGatewayURL(ipfsURI: string): string {
      return ipfsURI.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
    }

    async function fetchMetadata(baseURI: string): Promise<any | null> {
      try {
        const { href } = await toGatewayURL(baseURI);
        const res = await fetch(href);

        if (res.ok) {
          const data: any = await res.json();
          return data;
        } else {
          console.error(`Failed to fetch metadata. Status: ${res.status}`);
          return null;
        }
      } catch (error: any) {
        console.error("Failed to fetch metadata:", error);
        return null;
      }
    }

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
    set({ booksMetadata: updatedBooksMetadata }); // Update state
    console.log("Zustand test Metadata: ", booksMetadata);

  },
}));

export default useStore;

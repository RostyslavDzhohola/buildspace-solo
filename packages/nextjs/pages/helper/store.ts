import { toGatewayURL } from "nft.storage";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { BookType } from "~~/components/types";

export interface Store {
  booksMetadata: BookType[];
  isMetadataFetched: boolean;
  setBooksMetadata: (booksMetadata: BookType[]) => void;
  setIsMetadataFetched: (isMetadataFetched: boolean) => void;
  updateBooksMetadata: (data: BookType[]) => void;
  fetchAllMetadata: (booksMetadata: BookType[]) => Promise<void>;
}

/**
 * A custom hook that creates a Zustand store for managing book metadata.
 * @returns An object containing state and state update functions.
 */
const useZustandStore = create<Store>()(
  devtools(
    (set, get) => ({
      // Array of BookType objects containing book metadata
      booksMetadata: [],
      // Boolean to indicate if metadata has been fetched
      isMetadataFetched: false,
      // Update booksMetadata state to the value passed in as an argument
      setBooksMetadata: booksMetadata => set({ booksMetadata }),
      // Update isMetadataFetched state to true or false depending on the value passed in as an argument
      setIsMetadataFetched: isMetadataFetched => set({ isMetadataFetched }),
      // Update state  with new metadata for each book
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
      // Fetch metadata for each book in booksMetadata array and update state with new metadata fetched from IPFS
      fetchAllMetadata: async booksMetadata => {
        if (!booksMetadata || !Array.isArray(booksMetadata)) {
          console.error("booksMetadata is either undefined, null or not an array");
          return;
        }
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

        /**
         * Fetches metadata for each book in the booksMetadata array.
         * @param booksMetadata - An array of book metadata objects.
         * @returns An array of promises that resolve to the metadata for each book.
         */
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
    }),
    { name: "zustand-store" },
  ), // persist )
);

export default useZustandStore;

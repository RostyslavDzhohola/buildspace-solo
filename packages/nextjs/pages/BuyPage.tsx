import { useEffect } from "react";
import useZustandStore, { Store } from "./helper/store";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { BuyBookCard } from "~~/components/BuyBookCard";
import { MetaHeader } from "~~/components/MetaHeader";
import { BookType } from "~~/components/types";
import useStoreHook from "~~/hooks/custom-hooks/zustandHooks";
import { useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const BuyPage: NextPage = () => {
  // State to store metadata
  const booksMetadata = useStoreHook(useZustandStore, (state: Store) => state.booksMetadata);
  // const booksMetadata = useZustandStore(state => state.booksMetadata);
  console.log('Direct Zustand check:', booksMetadata);

  console.log(
    "useStoreHooks check: ",
    useStoreHook(useZustandStore, (state: Store) => state.booksMetadata),
  );
  // Function to update metadata
  // const setBooksMetadata = useStoreHook(useZustandStore, (state: Store) => state.setBooksMetadata);
  const setBooksMetadata = useZustandStore(state => state.setBooksMetadata); // this one doesn't work when i use the hook
  // State to track if metadata has been fetched
  const isMetadataFetched = useStoreHook(useZustandStore, (state: Store) => state.isMetadataFetched);
  // const isMetadataFetched = useZustandStore(state => state.isMetadataFetched);
  // Function to update metadata fetched state
  // const setIsMetadataFetched = useStoreHook(useZustandStore, (state: Store) => state.setIsMetadataFetched);
  const setIsMetadataFetched = useZustandStore(state => state.setIsMetadataFetched); // this one doesn't work when i use the hook
  // Function to fetch the rest of the metadata and merge it with the existing metadata
  // const fetchAllMetadata = useStoreHook(useZustandStore, (state: Store) => state.fetchAllMetadata); // this gives me a typeError:  fetchAllMetadata is not a function
  const fetchAllMetadata = useZustandStore(state => state.fetchAllMetadata);

  const { data, isLoading, error } = useScaffoldEventHistory({
    contractName: "BookFactory",
    eventName: "BookCreated",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n, // replace with your starting block
  });

  const { writeAsync: buyBookAsync } = useScaffoldContractWrite({
    contractName: "BookFactory",
    functionName: "purchaseBookFromAddress",
    value: "0", // placeholder value
    args: ["0x0"],
  });

  useEffect(() => {
    if (data && !isLoading && !error && setBooksMetadata) {
      const newBooksMetadata = data.map(event => {
        return {
          bookName: event.args.tokenName,
          bookAddress: event.args.bookAddress,
          baseURI: event.args.baseURI,
          symbol: event.args.symbol,
          price: Number(event.args.price),
        };
      });
      setBooksMetadata(newBooksMetadata);
    }
  }, [data, isLoading, error, setBooksMetadata]);

  useEffect(() => {
    if (booksMetadata && booksMetadata.length > 0 && !isMetadataFetched && fetchAllMetadata && setIsMetadataFetched) {
      fetchAllMetadata(booksMetadata).then(() => {
        setIsMetadataFetched(true);
      });
    }
  }, [booksMetadata, isMetadataFetched, setIsMetadataFetched, fetchAllMetadata]);

  return (
    <>
      <MetaHeader title="Mint HamletBook NFT" description="Mint your HamletBook NFT here." />
      <div className="flex flex-wrap justify-center gap-x-24">
        {booksMetadata ? (
          booksMetadata.map((book, index) => (
            <BuyBookCard
              key={index}
              book={book}
              buyBook={async (selectedBook: BookType) => {
                if (selectedBook.price !== undefined) {
                  await buyBookAsync({
                    value: ethers.utils.formatEther(String(selectedBook.price)) as any,
                    args: [selectedBook.bookAddress],
                  });
                }
              }}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default BuyPage;

import { useEffect } from "react";
import useStore from "./helper/store";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { BuyBookCard } from "~~/components/BuyBookCard";
import { MetaHeader } from "~~/components/MetaHeader";
import { BookType } from "~~/components/types";
import { useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const BuyPage: NextPage = () => {
  // State to store metadata
  const booksMetadata = useStore(state => state.booksMetadata);
  // Function to update metadata
  const setBooksMetadata = useStore(state => state.setBooksMetadata);
  // State to track if metadata has been fetched
  const isMetadataFetched = useStore(state => state.isMetadataFetched);
  // Function to update metadata fetched state
  const setIsMetadataFetched = useStore(state => state.setIsMetadataFetched);
  // Function to fetch the rest of the metadata and merge it with the existing metadata
  const fetchAllMetadata = useStore(state => state.fetchAllMetadata); 

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
    if (data && !isLoading && !error) {
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
    if (booksMetadata.length > 0 && !isMetadataFetched) {
      fetchAllMetadata(booksMetadata).then(() => {
        setIsMetadataFetched(true);
      });
    }
  }, [booksMetadata, isMetadataFetched, setIsMetadataFetched, fetchAllMetadata]);

  useEffect(() => {
    if (isMetadataFetched) {
      // Only run this once after metadata has been fetched
      console.log(">> Fetched Metadata:", booksMetadata);
    }
  }, [isMetadataFetched, booksMetadata]);

  return (
    <>
      <MetaHeader title="Mint HamletBook NFT" description="Mint your HamletBook NFT here." />
      <div className="flex flex-wrap justify-center gap-x-24">
        {booksMetadata.map((book, index) => (
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
        ))}
      </div>
    </>
  );
};

export default BuyPage;

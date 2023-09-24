import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { toGatewayURL } from "nft.storage";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

type BookMetadata = {
  bookAddress: string;
  bookName: string;
  symbol: string;
  price: number;
  baseURI: string;
  priceInDollars?: number; // new
  description?: string; // new
  image?: string; // new
};

const BuyPage: NextPage = () => {
  // const [purchased, setPurchased] = useState(false); // State to track if the NFT has been minted
  const [booksMetadata, setBooksMetadata] = useState<BookMetadata[]>([]);
  const [isMetadataFetched, setIsMetadataFetched] = useState(false);

  const { data, isLoading, error } = useScaffoldEventHistory({
    contractName: "BookFactory",
    eventName: "BookCreated",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n, // replace with your starting block
  });

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
  }, [data, isLoading, error]);

  useEffect(() => {
    const fetchAllMetadata = async () => {
      const allPromises = booksMetadata.map(book => fetchMetadata(book.baseURI));
      const allResults = await Promise.all(allPromises);

      // Merge fetched metadata with existing metadata
      const updatedBooksMetadata = booksMetadata.map((book, index) => {
        const fetchedData = allResults[index];
        if (fetchedData) {
          return {
            ...book,
            priceInDollars: fetchedData.priceInDollars,
            description: fetchedData.description,
            symbol: fetchedData.symbol,
            image: fetchedData.image,
          };
        }
        return book;
      });
      setBooksMetadata(updatedBooksMetadata);// Update state
    };

    if (booksMetadata.length > 0 && !isMetadataFetched) {
      // Added this condition
      fetchAllMetadata();
      setIsMetadataFetched(true);
    }
    // console.log("Books Metadata Updated:", booksMetadata);
  }, [booksMetadata, isMetadataFetched]);

  useEffect(() => {
    if (isMetadataFetched) { // Only run this once after metadata has been fetched
      console.log("Fetched Metadata:", booksMetadata);
    }
  }, [isMetadataFetched, booksMetadata]);

  return (
    <>
      <MetaHeader title="Mint HamletBook NFT" description="Mint your HamletBook NFT here." />
      <div className="flex flex-row justify-center gap-x-24">
        <div>
          {booksMetadata.map((book, index) => (
            <div className="flex " key={index}>
              Book Address: {book.bookAddress} <br />
              Book Name: {book.bookName} <br />
              Description: {book.description} <br />
              Symbol: {book.symbol} <br />
              Book URI: {book.baseURI} <br />
              Price in wei: {book.price} wei <br />
              Price in dollars: ${book.priceInDollars} <br />
              Image: {book.image} <br />
              {/* <Image src={book.image} alt="Hamlet Book" width={200} height={300} /> */}
              ----------------------------------------
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BuyPage;

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { toGatewayURL } from "nft.storage";
import { BookType, BuyBookCard } from "~~/components/BuyBookCard";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const BuyPage: NextPage = () => {
  // const [purchased, setPurchased] = useState(false); // State to track if the NFT has been minted
  const [booksMetadata, setBooksMetadata] = useState<BookType[]>([]);
  const [isMetadataFetched, setIsMetadataFetched] = useState(false);

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
            priceInDollars: fetchedData.price,
            description: fetchedData.description,
            symbol: fetchedData.symbol,
            image: makeGatewayURL(fetchedData.image),
          };
        }
        return book;
      });
      setBooksMetadata(updatedBooksMetadata); // Update state
    };

    if (booksMetadata.length > 0 && !isMetadataFetched) {
      // Added this condition
      fetchAllMetadata();
      setIsMetadataFetched(true);
    }
    // console.log("Books Metadata Updated:", booksMetadata);
  }, [booksMetadata, isMetadataFetched]);

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

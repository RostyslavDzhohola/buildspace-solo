import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

type BookMetadata = {
  bookAddress: string;
  baseURI: string;
  additionalData?: {
    name: string;
    description: string;
    symbol: string;
    price: string;
    image: string;
  };
};

const BuyPage: NextPage = () => {
  // const [purchased, setPurchased] = useState(false); // State to track if the NFT has been minted
  const [booksMetadata, setBooksMetadata] = useState<BookMetadata[]>([]);

  const { data, isLoading, error } = useScaffoldEventHistory({
    contractName: "BookFactory",
    eventName: "BookCreated",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n, // replace with your starting block
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      if (data && !isLoading && !error) {
        try {
          const newBooksMetadata: Promise<BookMetadata>[] = data.map(async event => {
            const { bookAddress, baseURI } = event.args;
            const res = await fetch(new Request(baseURI, { method: "GET", mode: "cors" }));
            if (res.ok) {
              const metadata = await res.json();
              return {
                bookAddress,
                baseURI,
                additionalData: metadata,
              };
            } else {
              throw new Error("Failed to fetch metadata");
            }
          });

          const fetchedBooks = await Promise.all(newBooksMetadata);
          setBooksMetadata(fetchedBooks);
        } catch (err) {
          console.error("Error fetching metadata:", err);
        }
      }
    };

    fetchMetadata();
  }, [data, isLoading, error]);

  return (
    <>
      <MetaHeader title="Mint HamletBook NFT" description="Mint your HamletBook NFT here." />
      <div className="flex flex-row justify-center gap-x-24">
        <div>
          {booksMetadata.map((book, index) => (
            <div key={index}>
              {/* Display book metadata here */}
              Book Address: {book.bookAddress} <br />
              Book URI: {book.baseURI} <br />
              Name: {book.additionalData?.name} <br />
              Description: {book.additionalData?.description} <br />
              {/* ... */}
            </div>
          ))}
        </div>

        {/* <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-start items-center">
          <Image
            src="/hamlet.jpg" // Replace with the actual path to your image
            alt="Hamlet Book" // Provide an appropriate alt description
            width={200} // Adjust the width as needed
            height={300} // Adjust the height as needed
          />
          <button className="btn btn-primary" onClick={handleMintClick}>
            {purchased ? "Purchased" : "Buy"}
            {purchased ? "" : <div>$15</div>}
          </button>
          {purchased ? (
            <button className="btn btn-secondary">
              <Link href="/read">Read</Link>
            </button>
          ) : (
            ""
          )}
          <a href="/books/hamlet.pdf" target="_blank" rel="noopener noreferrer">
            <button className="btn btn-secondary">Read a Book</button>
          </a>
        </div> */}
      </div>
    </>
  );
};

export default BuyPage;

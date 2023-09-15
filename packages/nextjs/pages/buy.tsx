import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

type BookMetadata = {
  bookAddress: string;
  bookName: string;
  symbol: string;
  price: number;
  baseURI: string;
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
    if (data && !isLoading && !error) {
      const newBooksMetadata = data.map(event => {
        return {
          bookAddress: event.args.bookAddress,
          bookName: event.args.tokenName,
          baseURI: event.args.baseURI,
          symbol: event.args.symbol,
          price: Number(event.args.price),
        };
      });
      setBooksMetadata(newBooksMetadata);
    }
  }, [data, isLoading, error]);

  return (
    <>
      <MetaHeader title="Mint HamletBook NFT" description="Mint your HamletBook NFT here." />
      <div className="flex flex-row justify-center gap-x-24">
        <div>
          {booksMetadata.map((book, index) => (
            <div className="flex " key={index}>
              Book Address: {book.bookAddress} <br />
              Book URI: {book.baseURI}
              <br />
              Book Name: {book.bookName} <br />
              Symbol: {book.symbol} <br />
              Price: {book.price} wei <br />

            ----------------------------------------
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

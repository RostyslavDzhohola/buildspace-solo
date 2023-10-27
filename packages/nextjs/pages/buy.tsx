// import { useEffect, useState } from "react";
import { useMetadataFetch } from "../hooks/helper/useMetadataFetch";
import { ethers } from "ethers";
import type { NextPage } from "next";
// import { toGatewayURL } from "nft.storage";
import { BuyBookCard } from "~~/components/BuyBookCard";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { BookType } from "~~/types/types";

const BuyPage: NextPage = () => {
  const { booksMetadata } = useMetadataFetch();

  const { writeAsync: buyBookAsync } = useScaffoldContractWrite({
    contractName: "BookFactory",
    functionName: "purchaseBookFromAddress",
    value: "0", // placeholder value
    args: ["0x0"],
  });

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
                // sometimes the price is not correct for some reason
                // TODO: figure out why sometimes the price passed to the function is not correct and I get the revert error
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

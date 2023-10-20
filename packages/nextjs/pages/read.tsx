import { useMemo, useState } from "react";
import { useMetadataFetch } from "./helper/useMetadataFetch";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { ReadBookCard } from "~~/components/ReadBookCard";
import { useScaffoldContractRead, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { BookType } from "~~/types/types";

const ReadingPage: NextPage = () => {
  const { address } = useAccount();
  const { booksMetadata } = useMetadataFetch();
  // const [selling, setSelling] = useState(false); // State to track if the NFT has been minted
  // const [sellPrice, setSellPrice] = useState(0); // State to track if the NFT has been minted
  // const [ownedBooks, setOwnedBooks] = useState<any[]>([]); // State to track if the NFT has been minted
  // const [currentAccount, setCurrentAccount] = useState(""); // State to track if the NFT has been minted

  const {
    data: purchsedEvnets,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "BookFactory",
    eventName: "BookPurchased",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
  });

  const purchasedEventsForCurrentUser = purchsedEvnets?.filter(event => event.args.buyer === address) || [];

  console.log("Current account is: ", address);
  console.log("Books for current account:", purchasedEventsForCurrentUser);
  console.log("All Purchased book events:", purchsedEvnets, isLoadingEvents, errorReadingEvents);

  // const handleSellClick = async () => {
  //   try {
  //     const sellingPrice = window.prompt("How much would you like to sell the book for?", "Enter price");

  //     if (sellingPrice !== null) {
  //       const parsedPrice = parseInt(sellingPrice, 10); // Parse as base 10 integer

  //       if (!isNaN(parsedPrice)) {
  //         // Check if the parsed value is not NaN
  //         setSelling(true);
  //         setSellPrice(parsedPrice);

  //         // Your logic to handle selling here
  //         alert(`Selling for: $${parsedPrice}`);
  //       } else {
  //         alert("Please enter a valid number.");
  //       }
  //     }
  //   } catch (error) {
  //     console.log("An error occurred:", error);
  //   }
  // };

  const readBook = async (book: BookType) => {
    // Implement your logic to read the book here
    alert(`Reading: ${book.bookName}`);
  };

  const ownedBooksMetadata = useMemo(() => {
    const purchasedBookAddresses = purchasedEventsForCurrentUser.map(event => event.args.bookAddress);
    return booksMetadata.filter(book => purchasedBookAddresses.includes(book.bookAddress));
  }, [purchasedEventsForCurrentUser, booksMetadata]);


  return (
    <>
      <MetaHeader
        title="Example UI | Scaffold-ETH 2"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="flex flex-wrap justify-center gap-x-24">
        {ownedBooksMetadata.map((booksMetadata, index) => (
          <ReadBookCard key={index} book={booksMetadata} readBook={readBook} />
        ))}
      </div>
    </>
  );
};

export default ReadingPage;

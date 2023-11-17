import { useEffect, useMemo } from "react";
import { useMetadataFetch } from "../hooks/helper/useMetadataFetch";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { ReadBookCard } from "~~/components/ReadBookCard";
import Lit from "~~/hooks/helper/lit";
import { useScaffoldContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { BookType } from "~~/types/types";

const ReadingPage: NextPage = () => {
  const { address } = useAccount();
  const { booksMetadata } = useMetadataFetch();
  // const [selling, setSelling] = useState(false); // State to track if the NFT has been minted
  // const [sellPrice, setSellPrice] = useState(0); // State to track if the NFT has been minted
  // const [cid, setCid] = useState("0x0"); // State to save ipfsCid
  // const [bookUint8Array, setBookUint8Array] = useState<string | Uint8Array>(); // State to save decrypted book

  const { data: purchsedEvnets } = useScaffoldEventHistory({
    contractName: "BookFactory",
    eventName: "BookPurchased",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
  });

  const { data: BookFactory } = useScaffoldContract({ contractName: "BookFactory" });

  const purchasedEventsForCurrentUser = useMemo(() => {
    return purchsedEvnets?.filter(event => event.args.buyer === address) || [];
  }, [purchsedEvnets, address]);

  console.log("Current account is: ", address);
  console.log("Books for current account:", purchasedEventsForCurrentUser);
  // console.log("All Purchased book events:", purchsedEvnets, isLoadingEvents, errorReadingEvents);

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

  const downloadDecryptedBook = (arrayBuffer: string | Uint8Array | ArrayBuffer, fileName: string): void => {
    // Step 1: Create a Blob from the ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });

    // Step 2: Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Step 3: Create a link and set attributes
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.pdf`;

    // Append to the document
    document.body.appendChild(link);

    // Step 4: Programmatically click the link to start download
    link.click();

    // Clean up and revoke the URL
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  // Usage example in an async function, after you've obtained the ArrayBuffer from decryption:
  // downloadDecryptedBook(decryptedBookArrayBuffer, 'My_Decrypted_Book');

  const readBook = async (book: BookType) => {
    try {
      const ipfsCid = await BookFactory?.read.getBookIpfsCid([book.bookAddress]);
      if (ipfsCid !== undefined) {
        console.log("Decrypting book with CID:", ipfsCid);
        const decryptedBookArrayBuffer = await Lit.decryptBook(ipfsCid);
        console.log("Decrypted book:", decryptedBookArrayBuffer);

        // Assuming decryptedBookArrayBuffer is of type ArrayBuffer
        downloadDecryptedBook(decryptedBookArrayBuffer, book.bookName.replace(/\s/g, "_"));
      } else {
        alert("Failed to fetch IPFS CID.");
      }
    } catch (error) {
      console.error("Error decrypting book:", error);
    }
  };

  const ownedBooksMetadata = useMemo(() => {
    const purchasedBookAddresses = purchasedEventsForCurrentUser.map(event => event.args.bookAddress);
    return booksMetadata.filter(book => purchasedBookAddresses.includes(book.bookAddress));
  }, [purchasedEventsForCurrentUser, booksMetadata]);

  useEffect(() => {
    Lit.connect();
  }, []);

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

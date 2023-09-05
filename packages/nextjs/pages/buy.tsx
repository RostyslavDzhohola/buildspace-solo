import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const BuyPage: NextPage = () => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "HamletBook", // Name of your contract
    functionName: "purchaseBook", // Function in your contract responsible for minting
    value: "0.0092",
  });
  const [purchased, setPurchased] = useState(false); // State to track if the NFT has been minted

  const handleMintClick = async () => {
    try {
      await writeAsync(); // Calls the minting function
      setPurchased(true); // Updates the state to reflect the minting
      // Handle success if needed
    } catch (error) {
      // Handle error if needed
    }
  };

  return (
    <>
      <MetaHeader title="Mint HamletBook NFT" description="Mint your HamletBook NFT here." />
      <div className="flex flex-row justify-around">
        <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-start items-center">
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
          {/* <a href="/books/hamlet.pdf" target="_blank" rel="noopener noreferrer">
            <button className="btn btn-secondary">Read a Book</button>
          </a> */}
        </div>
        <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-start items-center">
          <Image
            src="/napoleon.jpg" // Replace with the actual path to your image
            alt="Napolen Book cover" // Provide an appropriate alt description
            width={200} // Adjust the width as needed
            height={300} // Adjust the height as needed
          />
          <button
            className="btn btn-primary"
            onClick={handleMintClick}
            disabled={isMining} // Disable the button while minting
          >
            {isMining ? "Purchased" : "Buy"}
          </button>
          {/* <a href="https://submarine.pinata.cloud/dyHju6Vuiezd75yEE7fJLD" target="_blank" rel="noopener noreferrer">
            <button className="btn btn-secondary">Read a Book</button>
          </a> */}
        </div>
      </div>
    </>
  );
};

export default BuyPage;

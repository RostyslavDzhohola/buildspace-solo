import { useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const ReadingPage: NextPage = () => {
  const [selling, setSelling] = useState(false); // State to track if the NFT has been minted
  const [sellPrice, setSellPrice] = useState(0); // State to track if the NFT has been minted

  const handleSellClick = async () => {
    try {
      const sellingPrice = window.prompt("How much would you like to sell the book for?", "Enter price");

      if (sellingPrice !== null) {
        const parsedPrice = parseInt(sellingPrice, 10); // Parse as base 10 integer

        if (!isNaN(parsedPrice)) {
          // Check if the parsed value is not NaN
          setSelling(true);
          setSellPrice(parsedPrice);

          // Your logic to handle selling here
          alert(`Selling for: $${parsedPrice}`);
        } else {
          alert("Please enter a valid number.");
        }
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

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
      <div>
        <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-start items-center">
          <Image
            src="/hamlet.jpg" // Replace with the actual path to your image
            alt="Hamlet Book" // Provide an appropriate alt description
            width={200} // Adjust the width as needed
            height={300} // Adjust the height as needed
          />
          <a href="/books/hamlet.pdf" target="_blank" rel="noopener noreferrer">
            <button className="btn btn-primary">Read a Book</button>
          </a>
          {selling ? (
            <button className="btn btn-secondary">Selling for: ${sellPrice}</button>
          ) : (
            <button className="btn btn-secondary" onClick={handleSellClick}>
              Sell
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ReadingPage;

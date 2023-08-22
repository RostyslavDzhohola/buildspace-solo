import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";


const Minting: NextPage = () => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "HamletBook", // Name of your contract
    functionName: "safeMint", // Function in your contract responsible for minting
  });

  const handleMintClick = async () => {
    try {
      await writeAsync(); // Calls the minting function
      // Handle success if needed
    } catch (error) {
      // Handle error if needed
    }
  };

  return (
    <>
      <MetaHeader title="Mint HamletBook NFT" description="Mint your HamletBook NFT here." />
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        <Image
          src="/hamlet.jpg" // Replace with the actual path to your image
          alt="Hamlet Book" // Provide an appropriate alt description
          width={200} // Adjust the width as needed
          height={300} // Adjust the height as needed
        />
        <button
          className="btn btn-primary"
          onClick={handleMintClick}
          disabled={isMining} // Disable the button while minting
        >
          {isMining ? "Minting..." : "Mint NFT"}
        </button>
        <a href="https://submarine.pinata.cloud/vjy3H4fH7nZZcKXTrEq8xN" target="_blank" rel="noopener noreferrer">
          <button className="btn btn-secondary">Access Book</button>
        </a>
      </div>
    </>
  );
};

export default Minting;

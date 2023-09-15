import React, { useEffect, useState } from "react";
import Image from "next/image";
import { storeOnIPFS } from "./helper/nftStorageHelper";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useNativeCurrencyPrice, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

// import { useGlobalState } from "~~/services/store/store";

const Publish: NextPage = () => {
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookName, setBookName] = useState<string>("");
  const [bookDescription, setBookDescription] = useState<string>("");
  const [bookPrice, setBookPrice] = useState<number>(0);
  const [bookPriceInEth, setBookPriceInEth] = useState<bigint>(BigInt(0));
  const [bookURI, setBookURI] = useState<string>("");
  const [bookSymbol, setBookSymbol] = useState<string>("");
  const [coverURL, setCoverURL] = useState<string>("");

  const nativeCurrencyPrice: number = useNativeCurrencyPrice(); // ETH in USD

  // const { nativeCurrencyPrice, setNativeCurrencyPrice } = useGlobalState();

  const { writeAsync: createBookAsync } = useScaffoldContractWrite({
    contractName: "BookFactory", // Name of your contract
    functionName: "createBook", // Function in your contract responsible for minting
    args: [bookName, bookSymbol, bookPriceInEth, bookURI],
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!bookFile || !bookName || !bookDescription) {
      alert("All fields are required");
      return;
    }

    if (coverFile) {
      try {
        const coverIPFSURL = await storeOnIPFS(coverFile, bookName, bookDescription, bookSymbol, String(bookPrice));
        setBookURI(coverIPFSURL);
        console.log("bookURI is -> ", coverIPFSURL);
        alert(
          `Your cover has been uploaded. Cover IPFS URL -> ${coverIPFSURL},  Book name -> ${bookName}, Book description -> ${bookDescription}`,
        );
        console.log("book price in ETH converted to bigint", bookPriceInEth);
        console.log("Arguments being passed to createBooAsync", [bookName, bookSymbol, bookPriceInEth, coverIPFSURL]);
        await createBookAsync({ args: [bookName, bookSymbol, bookPriceInEth, coverIPFSURL] });
      } catch (error) {
        console.error("An error occurred while creating the book:", error);
        alert("An error occurred. Please check the console for details.");
      }
    } else {
      alert("Cover file is required");
    }
  };

  const handleBookFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const mimeType = file.type;
      if (mimeType.startsWith("application/pdf")) {
        // Modify according to your valid mime types for books
        setBookFile(file);
      } else {
        console.log("Invalid book file type.");
        alert("Invalid book file type. Please upload a PDF.");
        // Show some error message to the user if you like
      }
    }
  };

  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const mimeType = file.type;
      if (mimeType.startsWith("image/jpg") || mimeType.startsWith("image/jpeg") || mimeType.startsWith("image/png")) {
        setCoverFile(file);
        const url = URL.createObjectURL(file);
        setCoverURL(url); // Update state
        console.log("File name: ", file.name);
      } else {
        console.log("Invalid cover file type.");
        alert("Invalid cover file type. Please upload a JPG, JPEG, or PNG image.");
        // Show some error message to the user if you like
      }
    }
  };

  useEffect(() => {
    if (nativeCurrencyPrice > 0) {
      const tempBookPriceInEth = (bookPrice / nativeCurrencyPrice) * 1e18; // keeping 18 decimals, like in Solidity
      setBookPriceInEth(BigInt(Math.round(tempBookPriceInEth)));
    }
  }, [bookPrice, nativeCurrencyPrice]);

  return (
    <>
      <MetaHeader
        title="Publish a Book"
        description="On this page you can upload your book, cover and decide how many copies you want."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="flex justify-center">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <fieldset className="space-y-2">
            <label className="block text-lg font-medium py-3">
              Enter your book`s <i>NAME</i>
            </label>
            <input
              type="text"
              className="block dark:text-black pl-2"
              placeholder="Book name"
              value={bookName}
              onChange={e => setBookName(e.target.value)}
            />
            <label className="block text-lg font-medium py-3">
              Enter your book`s <i>DESCRIPTION</i>
            </label>
            <textarea
              className="block dark:text-black pl-2"
              placeholder="Book description"
              value={bookDescription}
              onChange={e => setBookDescription(e.target.value)}
            />
            <label className="block text-lg font-medium py-3">
              Enter your book`s <i>TICKER</i>
            </label>
            <input
              type="text"
              className="block dark:text-black pl-2"
              placeholder="Book symbol"
              value={bookSymbol}
              onChange={e => setBookSymbol(e.target.value)}
            />
          </fieldset>
          <div className="pt-3">
            <hr />
          </div>
          <fieldset className="space-y-2">
            <label className="block text-lg font-medium pb-3 pt-2">
              Upload your <i>BOOK</i> file here
            </label>
            <input type="file" className="block" onChange={handleBookFileChange} />
            {/* <div className="w-full h-32 flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer hover:bg-gray-300">
              Drag & Drop your Book Here
            </div> */}
            <label className="block text-lg font-medium py-3">
              Upload your book <i>COVER</i> here
            </label>
            <input type="file" className="block" onChange={handleCoverFileChange} />

            <div className="relative aspect-w-2 aspect-h-3 w-64 flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer hover:bg-gray-300">
              {coverURL ? (
                <Image src={coverURL} width={1600} height={2400} alt="Uploaded Cover" />
              ) : (
                "Drag & Drop File Here"
              )}
            </div>

            <div className="pt-3">
              <hr />
            </div>
          </fieldset>
          <fieldset className="space-y-2">
            <label className="block text-lg font-medium py-3">
              How many <i>COPIES</i> do you want to publish?
            </label>
            <input type="number" className="block dark:text-black pl-2" min="1" max="10000" placeholder="1000" />
            <label className="block text-lg font-medium py-3">
              How much do you want to <i>charge</i> for each copy?
            </label>
            <span className="mr-2 inline">$</span>
            <input
              type="number"
              className="inline dark:text-black pl-2"
              min="1"
              max="100"
              placeholder="15"
              onChange={e => setBookPrice(Number(e.target.value))}
            />
            <label className="block text-lg font-medium py-3">
              How much <i>royalties</i> do you want to have with each resale?
            </label>
            <span className="mr-2 inline">%</span>
            <input type="number" className="inline dark:text-black pl-2" min="0" max="30" step="0.01" placeholder="5" />
          </fieldset>
          <div className="pt-3">
            <hr />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:scale-110 focus:scale-100">
              Publish
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Publish;

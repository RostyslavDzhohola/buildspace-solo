import React, { useState } from "react";
import { storeOnIPFS } from "./helper/nftStorageHelper";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Publish: NextPage = () => {
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookName, setBookName] = useState<string>("");
  const [bookDescription, setBookDescription] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (coverFile) {
      const coverIPFSURL = await storeOnIPFS(coverFile, bookName, bookDescription);
      alert(
        `Your cover has been uploaded. Cover IPFS URL -> ${coverIPFSURL},  Book name -> ${bookName}, Book description -> ${bookDescription}`,
      );
    } else {
      alert("Cover file is required");
    }
  };

  const handleBookFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBookFile(file);
    }
  };

  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      console.log("File name: ", file.name);
    }
  };

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
              Enter your book's <i>name</i>
            </label>
            <input
              type="text"
              className="block dark:text-black pl-2"
              placeholder="Book name"
              value={bookName}
              onChange={e => setBookName(e.target.value)}
            />
            <label className="block text-lg font-medium py-3">
              Enter your book`s <i>description</i>
            </label>
            <textarea
              className="block dark:text-black pl-2"
              placeholder="Book description"
              value={bookDescription}
              onChange={e => setBookDescription(e.target.value)}
            />
          </fieldset>
          <div className="pt-3">
            <hr />
          </div>
          <fieldset className="space-y-2">
            <label className="block text-lg font-medium pb-3 pt-2">
              Upload your <i>book</i> file here
            </label>
            <input type="file" className="block" onChange={handleBookFileChange} />
            <div className="w-full h-32 flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer hover:bg-gray-300">
              Drag & Drop File Here
            </div>
            <label className="block text-lg font-medium py-3">
              Upload your book <i>cover</i> here
            </label>
            <input type="file" className="block" onChange={handleCoverFileChange} />
            <div className="w-full h-32 flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer hover:bg-gray-300">
              Drag & Drop File Here
            </div>
            <div className="pt-3">
              <hr />
            </div>
          </fieldset>
          <fieldset className="space-y-2">
            <label className="block text-lg font-medium py-3">
              How many <i>copies</i> do you want to publish?
            </label>
            <input type="number" className="block dark:text-black pl-2" min="1" max="10000" placeholder="1000" />
            <label className="block text-lg font-medium py-3">
              How much do you want to <i>charge</i> for each copy?
            </label>
            <span className="mr-2 inline">$</span>
            <input type="number" className="inline dark:text-black pl-2" min="1" max="100" placeholder="15" />
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
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded">
              Publish
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Publish;

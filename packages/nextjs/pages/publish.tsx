import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  // i need to upload file to ipfs. For now I just need a dumy function
  event.preventDefault();
  alert("your book has been uploaded");
};

const Publish: NextPage = () => {
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
            <label className="block text-lg font-medium py-3">Upload your book file here</label>
            <input type="file" className="block" />
            <div className="w-full h-32 flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer hover:bg-gray-300">
              Drag & Drop File Here
            </div>
            <div className="py-4">
              <hr />
            </div>
          </fieldset>
          <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Publish;

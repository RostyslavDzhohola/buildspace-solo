import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Solo</span>
            <span className="block text-2xl">A Buildspace Project</span>
          </h1>
          <p>
            Navigate to <strong>Mint a Book</strong> page where you can play with the toy
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;

import * as LitJsSdk from "@lit-protocol/lit-node-client";

// import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";

// let authSig: any;
// async function initializeAuthSig() {
//   authSig = await checkAndSignAuthMessage({
//     chain: "sepolia",
//   });
//   console.log("authSig is: ", authSig);
// }

// initializeAuthSig();

// Client initialization
const client = new LitJsSdk.LitNodeClient({});
const chain = "optimismGoerli";

const accessControlConditions = [
  {
    contractAddress: "", // bookNFT contract address
    standardContractType: "ERC721", // ERC721
    chain,
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0", // at least 1 NFT of the book
    },
  },
];

class Lit {
  litNodeClient: LitJsSdk.LitNodeClient = new LitNodeClient();

  async connect() {
    if (typeof window !== "undefined") {
      console.log("Running on the client");
    } else {
      console.log("Running on the server");
    }

    try {
      await client.connect();
      this.litNodeClient = client;
      console.log("LitNodeClient connected");
    } catch (e) {
      console.log("LitNodeClient connection failed: ", e);
    }
  }

  // File encryption
  async encryptBook(bookFile: File, bookAddress: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    if (typeof window !== "undefined") {
      console.log("Running on the client");
    } else {
      console.log("Running on the server");
    }

    if (!bookAddress) {
      console.log("Book address is required");
      throw new Error("Book address is required");
    }

    const updatedAccessControlConditions = [
      {
        ...accessControlConditions[0], // Spread the existing properties
        contractAddress: bookAddress, // Override the contractAddress property
      },
    ];

    console.log("Make sure to pass the correct updatedAccessControlConditions: ", updatedAccessControlConditions);

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    console.log("Loging all the accessControl paramenters ", {
      authSig,
      bookFile,
      bookAddress,
      updatedAccessControlConditions,
      infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
      infuraSecretKey: process.env.NEXT_PUBLIC_INFURA_API_SECRET_KEY,
    });
    // console.log("infuraID is: ", process.env.NEXT_PUBLIC_INFURA_PROJECT_ID);
    try {
      const ipfsCid = await LitJsSdk.encryptToIpfs({
        authSig: authSig,
        accessControlConditions: updatedAccessControlConditions,
        chain: chain,
        file: bookFile,
        litNodeClient: this.litNodeClient,
        infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || "",
        infuraSecretKey: process.env.NEXT_PUBLIC_INFURA_API_SECRET_KEY || "",
      });

      return ipfsCid;
    } catch (error) {
      console.error("Error encrypting book:", error);
      throw new Error("Error encrypting book");
    }
  }

  async decryptBook(ipfsCid: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    if (typeof window !== "undefined") {
      console.log("Running on the client");
    } else {
      console.log("Running on the server");
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const decryptedFile = await LitJsSdk.decryptFromIpfs({
      authSig,
      ipfsCid, // This is returned from the above encryption
      litNodeClient: this.litNodeClient,
    });

    return decryptedFile;
  }
}

export default new Lit();

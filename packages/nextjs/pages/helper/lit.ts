import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";

let authSig: any;
async function initializeAuthSig() {
  authSig = await checkAndSignAuthMessage({
    chain: "sepolia",
  });
}

initializeAuthSig();

// Client initialization
const client = new LitJsSdk.LitNodeClient({
  // litNetwork: "serrano",
  // connectTimeout: 40000, // 40 seconds
}); // pass an empty object as argument
const chain = "sepolia";

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
    try {
      await this.litNodeClient.connect();
      console.log("LitNodeClient connected");
    } catch (e) {
      console.log("LitNodeClient connection failed");
      console.log(e);
    }
  }
  // File encryption
  async encrypt(file: File, bookAddress: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const updatedAccessControlConditions = [
      {
        ...accessControlConditions[0], // Spread the existing properties
        bookAddress, // Override the contractAddress property
      },
    ];

    // console.log("infuraID is: ", process.env.NEXT_PUBLIC_INFURA_PROJECT_ID);
    const ipfsCid = await LitJsSdk.encryptToIpfs({
      authSig,
      accessControlConditions: updatedAccessControlConditions,
      chain,
      //   string: "Encrypt & store on IPFS seamlessly with Lit 😎",
      file, // If you want to encrypt a file instead of a string
      litNodeClient: this.litNodeClient,
      infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || "",
      infuraSecretKey: process.env.NEXT_PUBLIC_INFURA_API_SECRET_KEY || "",
    });

    return ipfsCid;
  }

  async decrypt(ipfsCid: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const decryptedFile = await LitJsSdk.decryptFromIpfs({
      authSig,
      ipfsCid, // This is returned from the above encryption
      litNodeClient: this.litNodeClient,
    });

    return decryptedFile;
  }
}

export default new Lit();

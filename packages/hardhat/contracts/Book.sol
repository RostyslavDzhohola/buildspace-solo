//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// YourContract inherits the implementation of ERC721
contract Book is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 public bookPrice;
    string internal customBaseURI;
    string internal bookIpfsCid; // IPFS CID of the encrypted book 
    bool private isBookIpfsCidSet; // Flag to check if the IPFS CID of the book has been set

    constructor(
        string memory tokenName, 
        string memory symbol, 
        uint256 bookPrice_, 
        string memory baseURI_, 
        address addressOwner
    ) ERC721 (tokenName, symbol) {
        bookPrice = bookPrice_;
        customBaseURI = baseURI_;
        transferOwnership(addressOwner);
    }

    function setBookIpfsCid(string memory newIpfsCid, address author) external {
        require(author == owner(), "Not the owner");
        require(!isBookIpfsCidSet, "bookIpfsCid has already been set");
        bookIpfsCid = newIpfsCid;
        isBookIpfsCidSet = true; // Mark bookIpfsCid as set
    }

    function purchaseBook(address buyer ) public payable returns (uint256){
        require(msg.value == bookPrice, "Incorrect price");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

		_safeMint(buyer, tokenId); // Minting the NFT to the sender of the transaction

        return tokenId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return customBaseURI;
    }

    function getBookIpfsCid() external view returns (string memory) {
        return bookIpfsCid;
    }

}

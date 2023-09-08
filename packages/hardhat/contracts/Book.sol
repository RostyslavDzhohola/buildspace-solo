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
contract Book is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 public bookPrice;
    string internal customBaseURI;


    constructor(string memory tokenName, string memory symbol, uint256 bookPrice_, string memory baseURI_) ERC721(tokenName, symbol) {
        bookPrice = bookPrice_;
        customBaseURI = baseURI_;
    }


    function purchaseBook(string memory metadataURI ) public payable returns (uint256){
        require(msg.value == bookPrice, "Incorrect price");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

		_safeMint(msg.sender, tokenId); // Minting the NFT to the sender of the transaction
        _setTokenURI(tokenId, metadataURI); 

        return tokenId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return customBaseURI;
    }


}

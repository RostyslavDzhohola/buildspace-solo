//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// YourContract inherits the implementation of ERC721
contract HamletBook is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("HamletBook", "HBT") {}

    function purchaseBook( ) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
				_safeMint(msg.sender, tokenId); // Minting the NFT to the sender of the transaction
    }
}

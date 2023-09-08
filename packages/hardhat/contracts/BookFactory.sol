// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Book.sol";  // Assume Book.sol contains your original Book contract

contract BookFactory {
    // Array to keep track of deployed Book contracts
    address[] public books;

    // Event to emit when a new Book contract is deployed
    event BookCreated(address bookAddress, string tokenName, string symbol, string baseURI);

    function createBook(string memory name, string memory symbol, uint256 bookPrice, string memory baseURI) public returns (address) {
      // Deploy a new Book contract and set its base URI, book price, and token name
      Book newBook = new Book(name, symbol, bookPrice, baseURI);

      // Add the newly created Book address to the array
      books.push(address(newBook));

      // Emit an event for the frontend to catch
      emit BookCreated(address(newBook), name, symbol, baseURI);

      return address(newBook);
    }
}

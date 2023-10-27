// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Book.sol";  // Assume Book.sol contains your original Book contract

contract BookFactory {
  // Struct to keep more information about each Book
  struct BookInfo {
      address bookAddress;
      string name;
      string symbol;
      uint256 price;
      string baseURI;
  }

  // Array to keep track of all deployed Books' addresses
  address[] public bookAddresses;

  // Mapping from book address to BookInfo struct
  mapping(address => BookInfo) public books;

  // Event to emit when a new Book contract is deployed
  event BookCreated(address indexed bookAddress, string tokenName, string symbol, uint256 price, string baseURI);
  event BookPurchased(address indexed buyer, address indexed bookAddress, uint256 tokenId);
  event BookIpfsCidSet(address indexed bookAddress, string ipfsCid);

  function createBook(string memory name, string memory symbol, uint256 bookPrice, string memory baseURI) public returns (address) {
    console.log("Book's baseURI is %s", baseURI);
    // Deploy a new Book contract and set its base URI, book price, and token name
    Book newBook = new Book(name, symbol, bookPrice, baseURI, msg.sender);

    // Create BookInfo struct
    BookInfo memory newBookInfo = BookInfo({
      bookAddress: address(newBook),
      name: name,
      symbol: symbol,
      price: bookPrice,
      baseURI: baseURI
    });

    // Add the newly created BookInfo to the mapping
    books[address(newBook)] = newBookInfo;

    // Add the newly created Book address to the array
    bookAddresses.push(address(newBook));

    console.log("Book created succesfully with address %s", address(newBook));

    // Emit an event for the frontend to catch
    emit BookCreated(address(newBook), name, symbol, bookPrice, baseURI);

    return address(newBook);
  }

  //function to set ipfsCid of the book
  function setBookIpfsCid(address bookAddress, string memory newIpfsCid) public {
      // Look up the book info from the mapping
      BookInfo memory bookToSetIpfsCid = books[bookAddress];

      // Make sure the book exists
      require(bookToSetIpfsCid.bookAddress != address(0), "Book does not exist");

      // Create a new instance from the address
      Book bookInstance = Book(bookAddress);

      // Call the setBookIpfsCid function on the Book contract
      bookInstance.setBookIpfsCid(newIpfsCid, msg.sender);
      emit BookIpfsCidSet(bookAddress, newIpfsCid);
  }

  function purchaseBookFromAddress(address bookAddress ) public payable {
    // Look up the book info from the mapping
    BookInfo memory bookToPurchase = books[bookAddress];

    // Make sure the book exists
    require(bookToPurchase.bookAddress != address(0), "Book does not exist");

    // Check if the correct price is sent
    require(msg.value == bookToPurchase.price, "Incorrect price");

    // Create a new instance from the address
    Book bookInstance = Book(bookAddress);

    // Call the purchase function on the Book contract
    uint256 tokenId = bookInstance.purchaseBook{value: msg.value}(msg.sender);
    emit BookPurchased(msg.sender, bookAddress, tokenId);

    // Emit an event or log (optional)
    console.log("Book with token ID %s purchased successfully", tokenId);
  }


  // Get all book addresses (for frontend to then query each book's info)
  function getAllBookAddresses() public view returns (address[] memory) {
    return bookAddresses;
  }

  function getBookIpfsCid(address bookAddress) public view returns (string memory) {
    // Look up the book info from the mapping
    BookInfo memory bookToGetIpfsCid = books[bookAddress];

    // Make sure the book exists
    require(bookToGetIpfsCid.bookAddress != address(0), "Book does not exist");

    // Create a new instance from the address
    Book bookInstance = Book(bookAddress);

    // Call the getBookIpfsCid function on the Book contract
    string memory bookIpfsCid = bookInstance.getBookIpfsCid();

    return bookIpfsCid;
  }
}

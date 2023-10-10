import Image from "next/image";
import { BookType } from "./types";

interface BuyBookCardProps {
  book: BookType;
  buyBook: (book: BookType) => Promise<void>;
}

export const BuyBookCard: React.FC<BuyBookCardProps> = ({ book, buyBook }) => (
  <div className="flex flex-col items-center mb-10 border border-gray-300 rounded-lg p-4">
    {book.image && (
      <Image priority src={book.image} alt={book.bookName + " book"} width={200} height={300} className="mb-4" />
    )}
    <strong>Book Address:</strong> {book.bookAddress} <br />
    <strong>Book Name:</strong> {book.bookName} <br />
    <strong>Description:</strong> {book.description} <br />
    <strong>Price:</strong> {book.priceInDollars} <br />
    <button
      className="py-2 px-4 bg-blue-500 text-white rounded hover:scale-110 focus:scale-100"
      onClick={async () => await buyBook(book)}
    >
      Buy Book
    </button>
  </div>
);

import Image from "next/image";
import { Address } from "~~/components/scaffold-eth";
import { BookType } from "~~/types/types";

interface ReadBookCardProps {
  book: BookType;
  readBook: (book: BookType) => Promise<void>;
}

export const ReadBookCard: React.FC<ReadBookCardProps> = ({ book, readBook }) => (
  <div className="flex flex-col items-center mb-10 border border-gray-300 rounded-lg p-4">
    {book.image && <Image src={book.image} alt={book.bookName + " book"} width={200} height={300} className="mb-4" />}
    <Address address={book.bookAddress} />
    <strong>Book Name:</strong> {book.bookName} <br />
    <strong>Description:</strong> {book.description} <br />
    <strong>Price:</strong> {book.priceInDollars} <br />
    <button
      className="py-2 px-4 bg-green-500 text-white rounded hover:scale-110 focus:scale-100"
      onClick={async () => await readBook(book)}
    >
      Read Book
    </button>
  </div>
);

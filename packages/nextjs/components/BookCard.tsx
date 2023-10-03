import Image from "next/image";

export type BookType = {
  bookAddress: string;
  bookName: string;
  symbol: string;
  price: number;
  baseURI: string;
  priceInDollars?: string; // new
  description?: string; // new
  image?: string; // new
};

interface BookCardProps {
  book: BookType;
  buyBook: (book: BookType) => Promise<void>;
}

export const BookCard: React.FC<BookCardProps> = ({ book, buyBook }) => (
  <div className="flex flex-col items-center mb-10">
    {book.image && <Image src={book.image} alt="Book" width={200} height={300} className="mb-4" />}
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

const dotenv = require("dotenv");

const connectDB = require("./config/db");
const Book = require("./models/Book");

dotenv.config();

connectDB();

const books = [
  {
    uniqueId: "B001",
    title: "1984",
    author: "George Orwell",
    publicationYear: 1949,
    genre: "Dystopian",
    isbn: "9780451524935",
    availabilityStatus: true,
  },
  {
    uniqueId: "B002",
    title: "White Nights",
    author: "Fyodor Dostoevsky",
    publicationYear: 1848,
    genre: "Classic",
    isbn: "9780140444702",
    availabilityStatus: true,
  },
  {
    uniqueId: "B003",
    title: "The Alchemist",
    author: "Paulo Coelho",
    publicationYear: 1988,
    genre: "Fiction",
    isbn: "9780062315007",
    availabilityStatus: true,
  },
  {
    uniqueId: "B004",
    title: "Atomic Habits",
    author: "James Clear",
    publicationYear: 2018,
    genre: "Self Help",
    isbn: "9780735211292",
    availabilityStatus: true,
  },
  {
    uniqueId: "B005",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    publicationYear: 1997,
    genre: "Finance",
    isbn: "9781612680194",
    availabilityStatus: true,
  },
  {
    uniqueId: "B006",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publicationYear: 1960,
    genre: "Classic",
    isbn: "9780061120084",
    availabilityStatus: true,
  },
  {
    uniqueId: "B007",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationYear: 1925,
    genre: "Classic",
    isbn: "9780743273565",
    availabilityStatus: true,
  },
  {
    uniqueId: "B008",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publicationYear: 1813,
    genre: "Romance",
    isbn: "9780141439518",
    availabilityStatus: true,
  },
  {
    uniqueId: "B009",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publicationYear: 1937,
    genre: "Fantasy",
    isbn: "9780547928227",
    availabilityStatus: true,
  },
  {
    uniqueId: "B010",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    publicationYear: 1997,
    genre: "Fantasy",
    isbn: "9780590353427",
    availabilityStatus: true,
  },
  {
    uniqueId: "B011",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    publicationYear: 1951,
    genre: "Classic",
    isbn: "9780316769488",
    availabilityStatus: true,
  },
  {
    uniqueId: "B012",
    title: "The Da Vinci Code",
    author: "Dan Brown",
    publicationYear: 2003,
    genre: "Thriller",
    isbn: "9780307474278",
    availabilityStatus: true,
  },
  {
    uniqueId: "B013",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    publicationYear: 1937,
    genre: "Motivational",
    isbn: "9781585424337",
    availabilityStatus: true,
  },
  {
    uniqueId: "B014",
    title: "Ikigai",
    author: "Héctor García",
    publicationYear: 2016,
    genre: "Self Help",
    isbn: "9780143130727",
    availabilityStatus: true,
  },
  {
    uniqueId: "B015",
    title: "The Power of Habit",
    author: "Charles Duhigg",
    publicationYear: 2012,
    genre: "Self Help",
    isbn: "9780812981605",
    availabilityStatus: true,
  },
  {
    uniqueId: "B016",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    publicationYear: 2011,
    genre: "History",
    isbn: "9780062316097",
    availabilityStatus: true,
  },
  {
    uniqueId: "B017",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    publicationYear: 2020,
    genre: "Finance",
    isbn: "9780857197689",
    availabilityStatus: true,
  },
  {
    uniqueId: "B018",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    publicationYear: 2019,
    genre: "Thriller",
    isbn: "9781250301697",
    availabilityStatus: true,
  },
  {
    uniqueId: "B019",
    title: "A Thousand Splendid Suns",
    author: "Khaled Hosseini",
    publicationYear: 2007,
    genre: "Drama",
    isbn: "9781594483851",
    availabilityStatus: true,
  },
  {
    uniqueId: "B020",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    publicationYear: 2003,
    genre: "Drama",
    isbn: "9781594631931",
    availabilityStatus: true,
  }
];

const seedBooks = async () => {
  try {
    await Book.deleteMany();

    await Book.insertMany(books);

    console.log("20 Books Inserted Successfully");

    process.exit();
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
};

seedBooks();
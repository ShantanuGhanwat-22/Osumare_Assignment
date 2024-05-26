const express = require("express");
const cors = require("cors");

const app = express();
const port = 8000;

const corsOptions = {
  origin: "http://localhost:3000", // Allow only this origin
  methods: "GET,POST,PUT,DELETE", // Allow only these methods
  allowedHeaders: "Content-Type,Authorization", // Allow only these headers
};

app.use(cors(corsOptions));

let books = [
  { id: 1, title: "Harry Potter Part One", description: "Written By JK Rowling" , price: 10 },
  { id: 2, title: "Harry Potter Part Two", description: "Written By JK Rowling" , price: 15 },
  { id: 3, title: "Harry Potter Part Three", description: "Written By JK Rowling" , price: 20 },
  { id: 4, title: "Harry Potter Part Four", description: "Written By JK Rowling" , price: 25 },
  { id: 5, title: "Harry Potter Part Five", description: "Written By JK Rowling" , price: 30 },
  { id: 6, title: "Harry Potter Part Six", description: "Written By JK Rowling" , price: 35 },
  { id: 7, title: "Harry Potter Part Seven", description: "Written By JK Rowling" , price: 40 },
  { id: 8, title: "Harry Potter Part Eight", description: "Written By JK Rowling" , price: 45 },
  { id: 9, title: "Harry Potter Part Nine", description: "Written By JK Rowling" , price: 50 },
  
];

// Create a new book
app.post("/books", (req, res) => {
  const { title, description, price } = req.body;
  const newBook = {
    id: books.length + 1,
    title,
    description,
    price,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Read all books with pagination
//http://localhost:8000/books?page=1
app.get("/books", (req, res) => {
  console.log(req.query.page);
  const page = parseInt(req.query.page);
  console.log("page= ", page); // Check the value of page

  if (isNaN(page) || page < 1) {
    return res.status(400).json({ message: "Invalid page number" });
  }

  const limit = 3;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  console.log("startIndex= ", startIndex); // Check the value of startIndex
  console.log("endIndex= ", endIndex); // Check the value of endIndex

  const paginatedBooks = books.slice(startIndex, endIndex);
  const totalPages = Math.ceil(books.length / limit);

  res.json({
    page,
    limit,
    totalPages,
    totalBooks: books.length,
    books: paginatedBooks,
  });
});

//Get by id
app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Update a book by ID
app.put("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, description, price } = req.body;
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = { id: bookId, title, description, price };
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book by ID
app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

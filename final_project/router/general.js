const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (!isValid(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  return res.status(404).json({message: "Unable to register user. Username and/or password are required."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  
  for (let key in books) {
      if (books[key].author === author) {
          booksByAuthor.push(books[key]);
      }
  }
  
  if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
  } else {
      return res.status(404).json({message: "Author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  
  for (let key in books) {
      if (books[key].title === title) {
          booksByTitle.push(books[key]);
      }
  }
  
  if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
  } else {
      return res.status(404).json({message: "Title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});
// --- Code bổ sung cho Question 11 (Sử dụng Axios với Async/Await và Promises) ---
const axios = require('axios');
const baseURL = "http://localhost:5000";

// 1. Lấy danh sách toàn bộ sách bằng Async/Await
async function getAllBooksAsync() {
    try {
        const response = await axios.get(`${baseURL}/`);
        console.log("Axios Async - All Books:", response.data);
    } catch (error) {
        console.error("Error fetching all books:", error.message);
    }
}

// 2. Tìm chi tiết sách theo ISBN bằng Promises (thay đổi cách viết theo yêu cầu đề bài)
function getBookByISBNPromise(isbn) {
    axios.get(`${baseURL}/isbn/${isbn}`)
        .then(response => {
            console.log(`Axios Promise - Book ISBN ${isbn}:`, response.data);
        })
        .catch(error => {
            console.error("Error fetching book by ISBN:", error.message);
        });
}

// 3. Tìm sách theo Tác giả bằng Async/Await
async function getBookByAuthorAsync(author) {
    try {
        const response = await axios.get(`${baseURL}/author/${author}`);
        console.log(`Axios Async - Books by ${author}:`, response.data);
    } catch (error) {
        console.error("Error fetching books by author:", error.message);
    }
}

// 4. Tìm sách theo Tiêu đề bằng Async/Await
async function getBookByTitleAsync(title) {
    try {
        const response = await axios.get(`${baseURL}/title/${title}`);
        console.log(`Axios Async - Books titled "${title}":`, response.data);
    } catch (error) {
        console.error("Error fetching books by title:", error.message);
    }
}

// Tự động gọi chạy thử nghiệm khi file được load (tùy chọn)
getAllBooksAsync();
getBookByISBNPromise("1");
module.exports.general = public_users;
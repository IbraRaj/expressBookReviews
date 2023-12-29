const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
  const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
  

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 600);
  });
  promise.then((result) => {
    return res.status(200).json({ books: result });
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    //Write your code here
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(books[req.params.isbn]), 600);
    });
  
    const book = await promise;
  
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    //Write your code here
    const authorName = req.params.author;
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter(
          (b) => b.author === authorName
        );
        resolve(filteredBooks);
      }, 600);
    });
  
    const filteredBooks = await promise;
  
    if (filteredBooks.length > 0) {
      return res.status(200).json({ books: filteredBooks });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.title === title
      );
      return resolve(filteredBooks);
    }, 600);
  });

  const filteredBooks = await promise;
  if (filteredBooks.length > 0) {
    return res.status(200).json({ books: filteredBooks });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const reviews = req.params.reviews;
  res.send(books[reviews])
});

module.exports.general = public_users;

const express = require("express");
const usersData = require("./users.json");
const productsData = require("./product.json");
const app = express();

// middleware

const paginatedResults = (model) => {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.data = model.slice(startIndex, endIndex);
    res.paginatedResonse = results;
    next();
  };
};

app.get("/users", paginatedResults(usersData), (req, res) => {
  res.json(res.paginatedResonse);
});

app.get("/products", paginatedResults(productsData), (req, res) => {
  res.json(res.paginatedResonse);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

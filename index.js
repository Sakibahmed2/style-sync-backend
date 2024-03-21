const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("styleSync");
    const productsCollection = db.collection("products");

    //create product
    app.post("/api/v1/products", async (req, res) => {
      const { image, title, rating, price, brand, description } = req.body;
      const result = await productsCollection.insertOne({
        image,
        title,
        rating,
        price,
        brand,
        description,
      });

      res.status(201).json({
        success: true,
        message: "Products created successfully",
        data: result,
      });
    });

    //get all product
    app.get("/api/v1/products", async (req, res) => {
      const result = await productsCollection.find().toArray();

      res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: result,
      });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});

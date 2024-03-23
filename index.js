const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
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
      const {
        image,
        title,
        rating,
        price,
        brand,
        description,
        sale,
        salePrice,
      } = req.body;
      const result = await productsCollection.insertOne({
        image,
        title,
        rating,
        price,
        brand,
        description,
        sale,
        salePrice,
      });

      res.status(201).json({
        success: true,
        message: "Products created successfully",
        data: result,
      });
    });

    //get all product
    app.get("/api/v1/products", async (req, res) => {
      const { category } = req.query;

      const filter = {};
      if (category) {
        filter.category = category;
      }

      try {
        const result = await productsCollection.find(filter).toArray();

        res.status(200).json({
          success: true,
          message: "Products retrieved successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to retrieve products",
          error: error.message,
        });
      }
    });

    //get single product
    app.get("/api/v1/products/:id", async (req, res) => {
      const { id } = req.params;

      const query = { _id: new ObjectId(id) };

      const result = await productsCollection.findOne(query);

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

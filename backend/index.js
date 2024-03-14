const port = process.env.PORT;
const express = require("express");
//creating app instance using express
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const path = require("path"); //we can access backend directory using this module

const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

//request get from response passed through this json
app.use(express.json());
app.use(cors()); //our project connect to port 4000using this module

//connecting database with mongodb

const mongourl = process.env.MONGO_URL;

mongoose.connect(mongourl);

//api creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

//add products in database
//image storage engine

const storage = multer.diskStorage({
  destination: "./upload/Images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}` //define how the file name should be 1- file-fieldname=>refer to the name of feild where file get upload, date.now()=> give the current date in the upload filename that make it unique, path.extname()=> extract the original file name----------basically used to rename the file
    );
  },
});

const upload = multer({
  storage: storage,
});

//creating upload endpoint for images
// "/images" is the static point where all the images get saved
app.use("/images", express.static("upload/Images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//whenever we upload any data in mongodb first we have to make schema

//schema for creating products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  //generating id automatic and for getting all the products in one array .. means in "products" array
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  //try and catch block are the error handler, suppose  we get some error in function "product" then without error handler this crach cause server crash or anything, but if we add try-catch block(error handler) then server will catch the error and send where the error adn what's the error

  try {
    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    console.log(product);
    //for saving data in database

    await product.save();

    console.log("Saved");

    // Generating response
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//creating api for deleting products

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    Success: true,
    name: req.body.name,
  });
});

//creating api for getting all products

app.get("/allProducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products fetched");
  res.send(products);
});

//schema creating for user model

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//endpoint for registration

app.post("/signup", async (req, res) => {
  try {
    // Check if email already exists
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        errors: "Existing user found with the same email address",
      });
    }

    // Create an empty cart
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    // Create a new user
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, "secret_ecom");

    // Respond with success and token
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//creating endpoint for login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email }); //using this statement we get the user realted to the particular email

  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id, //after comparing the password if it is true then this create the user object
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Email not found" });
  }
});

//creating endpoint for new collection data
app.get("/newcollection", async (req, res) => {
  let products = await Product.find({}); //it stored all the products
  let newCollection = products.slice(1).slice(-8); // using this we get newly added 8 item from the api

  console.log("NewCollection Fetched");
  res.send(newCollection);
});

// Creating endpoint for popular in women
app.get("/popularinwomen", async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4); // Gives array elements from 0 (start point) to 3 (quantity: 4 - 1)
    console.log("Popular in women fetched");
    res.send(popular_in_women);
  } catch (error) {
    console.error("Error fetching popular in women:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Creating endpoint for popular in men
app.get("/popularinmen", async (req, res) => {
  try {
    let products = await Product.find({ category: "men" });
    let popular_in_men = products.slice(0, 4); // Gives array elements from 0 (start point) to 3 (quantity: 4 - 1)
    console.log("Popular in men fetched");
    res.send(popular_in_men);
  } catch (error) {
    console.error("Error fetching popular in men:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Creating endpoint for popular in kids
app.get("/popularinkids", async (req, res) => {
  try {
    let products = await Product.find({ category: "kid" });
    let popular_in_kids = products.slice(0, 4); // Gives array elements from 0 (start point) to 3 (quantity: 4 - 1)
    console.log("Popular in kids fetched");
    res.send(popular_in_kids);
  } catch (error) {
    console.error("Error fetching popular in kids:", error);
    res.status(500).send("Internal Server Error");
  }
});

//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "Please authenticate using a valid token" });
    }
  }
};

//creating endpoint for adding product frpm cartdata after login
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    //this method find the user and update the data with modified data

    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

//creating endpoint for removing product from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removes", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    //this method find the user and update the data with modified data

    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

//creating endpoint to get cart
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.get("/", (req, res) => res.send("Express on Vercel"));
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});

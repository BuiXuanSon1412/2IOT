const express = require('express');
const path = require('path')
const cors = require('cors');
require("dotenv").config();
 
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
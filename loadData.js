const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("./models/tourModel");

dotenv.config({ path: "./config.env" });

const dburi =
  "mongodb+srv://htoowaiyan:<password>@tours.27e6mhc.mongodb.net/?retryWrites=true&w=majority";

const uri = dburi.replace("<password>", process.env.MOGODB_PASSWORD);

mongoose
  .connect(uri)
  .then((con) => {
    console.log(con.connections);
    console.log("DB Connection Successful.");
  });

//READ the file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, "utf-8")
);

//INSERT INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data Successfully Loaded");
  } catch (err) {
    console.log(err);
  }
};

//DELETE ALL COLLECTIONS FROM DATABASE
const deleteData = async () => {
  try {
    await Tour.deletMany();
    console.log("Data Successfully Deleted");
  } catch (err) {
    console.log(err);
  }
};

importData();

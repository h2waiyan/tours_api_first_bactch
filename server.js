const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.message, err.name);

  process.exit(1);
});

const app = require("./index");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT;

console.log(app.get("env")); // Env - Express

console.log(process.env.PORT); // Env - NODE

const dburi =
  "mongodb+srv://htoowaiyan:<password>@tours.27e6mhc.mongodb.net/?retryWrites=true&w=majority";

const uri = dburi.replace("<password>", process.env.MOGODB_PASSWORD);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    // useFindAndModify: false,
  })
  .then((conn) => {
    console.log("Connected to Database!");
  });

const server = app.listen(port, () => {
  console.log("Server is listening on port 3000");
});

process.on("unhandledRejection", (err) => {
  console.log(err.message, err.name);
  server.close(() => {
    process.exit(1);
  });
});

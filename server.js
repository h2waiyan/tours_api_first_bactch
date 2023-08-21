const mongoose = require("mongoose");
const dotenv = require("dotenv");
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

app.listen(port, () => {
  console.log("Server is listening on port 3000");
});

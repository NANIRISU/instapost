const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const { MONGOURI } = require("./key");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongoose");
});

mongoose.connection.on("error", (err) => {
  console.log("error", err);
});

require("./models/user");
require("./models/post");
//mongoose.model('User')
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

app.listen(PORT, () => {
  // here we listen on server with port number
  console.log("server is running on", PORT);
});

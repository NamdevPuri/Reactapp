const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => console.log(error.message));

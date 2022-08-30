const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    //connecting with mongodb database
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;

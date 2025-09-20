const mongoose = require('mongoose');
require("dotenv").config();// important declaration to use process or environment variables
// false: passes the filter query to mongodb even if it is not in the schema and returns empty document
//true: removes the filter query not defined in the schema and returns the all the document

const connectWithDB = () => {
  mongoose.set('strictQuery', false);
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`DB connected successfully`))
    .catch((err) => {
      console.log(`DB connection failed`);
      console.log(err);
      
      process.exit(1);
      
    });
};

module.exports = connectWithDB;

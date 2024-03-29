const mongoose = require('mongoose');
require("dotenv").config();



exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{console.log("DB connected successfully");})
    .catch((error)=>{
        console.log("Database could not connect");
        console.log(error.message);
        process.exit(1);
    })
}

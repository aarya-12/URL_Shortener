//THIS FILE STORES ALL THE SHORTURL INFORMATION

//include mongoose and shortid library
const mongoose = require('mongoose')
const shortId = require('shortid')

//create a schema called shortUrlSchema
const shortUrlSchema = new mongoose.Schema({
  
  //first column
  full: {
    type: String,
    required: true
  },
  //second column
  short: {
    type: String,
    required: true,
    //generates a unique short identifier using the shortid library
    default: shortId.generate
  },
  //third column
  clicks: {
    type: Number,
    required: true,
    //starts the count from zero
    default: 0
  },
  author:{
    type: String,
    required: false,
    default: "abc"
  }
})

//connects the database to this model
module.exports = mongoose.model('Short', shortUrlSchema)
//including express, mongoose and shortUrl model
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

//express() returns an app object that is used to setup our entire application
const app = express()

//------------------------------------------------------------------------------------------------------------------------------------------------------------

//connecting to the database
//const post = process.env.PORT || 5000
const CONNECTION_URL= process.env.MONGODB_URL || "mongodb+srv://aaronrocque:bhushan@cluster0.s4mikbe.mongodb.net/UrlShortner?retryWrites=true&w=majority"
mongoose.connect(CONNECTION_URL).then((result)=> {
  console.log("Connected");
})
.catch((err)=> console.log("ERROR"));

//------------------------------------------------------------------------------------------------------------------------------------------------------------

//view engine helps you render template files
//lets user generate html using plain js
app.set('view engine', 'ejs')

//------------------------------------------------------------------------------------------------------------------------------------------------------------

//tells the application that we are using URLs
//express.urlencoded() recognizes the incoming request as string or array
app.use(express.urlencoded({ extended: false }))

//------------------------------------------------------------------------------------------------------------------------------------------------------------

//defining a route 
app.get('/', async (req, res) => {

  //this gets all the URLs in our shortUrls table
  //asynchronous action
  const shortUrls = await ShortUrl.find()
  urls=shortUrls;
  //this will render everything from the index.ejs file to the browser as well as teh short url
  res.render('index', { shortUrls: shortUrls })
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------

//post request, which will allow us to create short URLs
//from index.ejs, we will post to an endpoint in the form
//app.post() will create that endpoint here
app.post('/shortUrls', async (req, res) => {

  //create a shortUrl by passing teh value of a full url that you get from the index.ejs files form
  console.log(req.body.author);
  await ShortUrl.create({ full: req.body.fullUrl, author: req.body.author })
  
  //since ShortUrl.create() is an asynchronous action ie it takes place in the backgroud,
  //so we need to wait till this finishes executing
  //Hence the use of async and await, to wait for teh ShortUrl to be created before we move on

  //after the url is created, redirect the user back to the home page
  res.redirect('/')
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------

//deletd the url from the database
app.post('/deleteUrls', async (req, res) => {

  //asynchronous function
  await ShortUrl.deleteOne({ _id: req.body.postId });

  //redirects the user back to the home page
  res.redirect('/')
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------

//another route that gets evrything after the / and saves it in the parameter called shortUrl
app.get('/:shortUrl', async (req, res) => {

  //asynchronous function
  //finds the short url from ShortUrl model that matches with what we just saved in shortUrl
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

  //if a url is passed that doesn't exist, we get an Error 404
  if (shortUrl == null) return res.sendStatus(404)

  //if url is found, increase the number of clicks by 1
  shortUrl.clicks++

  //updates the url and the new click value
  shortUrl.save()

  //redirects the user to the actual webiste he/she intended to go ie that of the full url
  res.redirect(shortUrl.full)
})

app.post('/search',async(req,res)=>{
  const authorName=req.body.author;
  const regex=new RegExp(authorName,'i');
  ShortUrl.find({author:{$regex:regex}},(err,result)=>{
    if(result)
    {
      res.render('index', { shortUrls: result });
    }
  })

})
app.post('/sort',async(req,res)=>{
  ShortUrl.find({}).sort({clicks:-1}).exec(function(err, docs){
    res.render('index', { shortUrls: docs });
  })

})
//------------------------------------------------------------------------------------------------------------------------------------------------------------

//pass the port number that we want our app to listen to
//default set to 5000
app.listen(process.env.PORT || 5000);

//------------------------------------------------------------------------------------------------------------------------------------------------------------
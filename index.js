const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());

const Article = require('./models/Article');

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err))

// render the html page
app.get('/', (req, res) => {
    let name = 'John Doe';
    let age = 25;
    // res.sendFile(`${__dirname}/views/index.ejs`);
    res.render('index.ejs', {name, age})
})


app.get('/product/:id', (req, res) =>{
    res.send('Display product ' + req.params.id)
})

// path parameter
app.get('/totalPrice/:price/:qty', (req, res) =>{
    console.log(req.params)
    res.send(`Total Price: ${Number(req.params.price) + Number(req.params.qty)}`)   
})

// query parameter
// http://localhost:3000/totalPrice?price=100&qty=2
app.get('/totalPrice', (req, res) =>{
    console.log(req.query)
    res.send(`Total Price: ${Number(req.query.price) + Number(req.query.qty)}`)
})

// body parameter
// http://localhost:3000/addProduct
app.post('/addProduct', (req, res) =>{
   
    // res.send(`creating a new product: ${req.body.name} with price: ${req.body.price} and qty: ${req.body.qty}`) 
    res.json({
        name : req.body.name,
        price : req.body.price,
        qty: req.body.qty,
        date: req.query.date
    })
})





app.put('/updateEntireFields', (req, res) =>{
    res.send('updating a all fields')
})

app.patch('/updateSpecificField', (req, res) =>{
    res.send('updating a specific field')
})


app.delete('/deleteProduct', (req, res) =>{
    res.send('deleting a product')
})


// ================== Articles endpoint ==================
app.post('/articles', async (req, res) => {
    const newArticle = new Article();
    newArticle.title = req.body.articleTitle;
    newArticle.body = req.body.articleBody;
    newArticle.numberOfLikes = 0;


    await newArticle.save()

    // checking status of the request
    if(res.statusCode === 200){
        res.json({
            message: 'Article created successfully',
            data: newArticle
        })
    }else{
        res.json({
            message: 'Article not created'
        })
    }
})

app.get('/articles', async (req, res) => {
    const articles = await Article.find();
    res.json({
        data: articles
    })
})

app.get('/article/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.json({
        data: article
    })
})

app.put('/article/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    article.title = req.body.articleTitle;
    article.body = req.body.articleBody;

    await article.save();

    res.json({
        message: 'Article updated successfully',
        data: article
    })
})

app.delete("/article/:id", async (req, res) =>{
    const article = await Article.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Article deleted successfully',
        data: article
    })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

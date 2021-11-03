const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = 5000;

app.use(bodyParser.json());//middleWire hisebe use
app.use(cors()); //middleWire hisebe use

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o25ox.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJhonStore").collection("products");
    const ordersCollection = client.db("emaJhonStore").collection("orders");


    app.post('/addProduct', (req,res) =>{
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount);
            });
    })

    app.get('/products',(req,res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req,res)=>{
        productsCollection.find({key: req.params.key})
            .toArray((err, documents) =>{
                res.send(documents[0]);
            })
    })

    app.post('/productByKeys', (req,res) =>{
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
            .toArray((err,documents)=>{
                res.send(documents);
            })
    })

    app.post('/addOrder', (req,res) =>{
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.acknowledged);
            });
    })

});

app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.listen(process.env.PORT || port);
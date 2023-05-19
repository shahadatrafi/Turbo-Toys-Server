const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Turbo is running')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jmzo55h.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const toysCollections = client.db("turboToys").collection('products');
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // toys route
    app.get('/toys', async (req, res) => {
      let query ={}
      if (req.query.email) {
        query = { sellerEmail : req.query.email}
      };
      const result = await toysCollections.find(query).toArray();
      res.send(result);
    })
    
    app.post('/toys', async (req, res) => {
      const newToy = req.body;
      const result = await toysCollections.insertOne(newToy);
      res.send(result);
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id) }
      const result = await toysCollections.findOne(query);
      res.send(result);
    })
    
    // sub-category route
    app.get('/toys/regular-car', async (req, res) => {
      const result = await toysCollections.find({subcategory : 'Regular Car'}).toArray();
      res.send(result);
    })
    
    app.get('/toys/police-car', async (req, res) => {
      const result = await toysCollections.find({subcategory : 'Police Car'}).toArray();
      res.send(result);
    })
    
    app.get('/toys/sports-car', async (req, res) => {
      const result = await toysCollections.find({subcategory : 'Sports Car'}).toArray();
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Turbo is running on ${port}`)
})

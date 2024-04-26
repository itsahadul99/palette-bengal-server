const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifklbg0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db('allCraftDB').collection('allCraft')

    app.post('/addCraft', async(req, res) => {
        const craftItem = req.body;
        // console.log(craftItem);
        const result = await craftCollection.insertOne(craftItem)
        res.send(result)
    });

    app.get('/allCraft', async(req, res) => {
        const cursor = craftCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    // load the single data for view details
    app.get('/allCraft/:id', async(req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query)
      res.send(result)
    })

    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Palette of Bengal server is running')
})
app.listen(port, () => {
    console.log(`Palette of Bengal server is running on port: ${port}`);
})
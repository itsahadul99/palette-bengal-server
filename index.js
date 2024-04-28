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
    
    app.post('/addCraft', async (req, res) => {
      const craftItem = req.body;
      // console.log(craftItem);
      const result = await craftCollection.insertOne(craftItem)
      res.send(result)
    });

    app.get('/allCraft', async (req, res) => {
      const cursor = craftCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // load the single data for view details
    app.get('/allCraft/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.findOne(query)
      res.send(result)
    })

    // load the data based on user creation
    app.get('/myArtCraft/:email', async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = craftCollection.find({ userEmail: email });
      const result = await query.toArray();
      res.send(result)
    })
    
    // load single data for update 
    app.get('/updateItem/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.findOne(query)
      res.send(result)
    })
    // update item 

    app.patch('/updateItem/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const item = req.body;
      // console.log(item);
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateItem = {
        $set: {
          item_name: item.item_name,
          sub_category: item.sub_category,
          image: item.image,
          price: item.price,
          rating: item.rating,
          customization: item.customization,
          description: item.description,
          stockStatus: item.stockStatus,
          processingTime: item.processingTime,
          userEmail: item.userEmail,
          userName: item.userName
        }
      }
      const result = await craftCollection.updateOne(query, updateItem, options)
      res.send(result)
    })

    // delete a item from database 
    app.delete('/myArtCraft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.deleteOne(query)
      res.send(result)
    })

    const categoryCollection = client.db('allCraftDB').collection('allCategories');
    app.get('/allCategories', async(req, res) => {
      const cursor = categoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    
    app.get('/allCategories/:sub_categoryname', async(req, res) => {
      const sub_category = req.params.sub_categoryname;
      // console.log(sub_category);
      const query = categoryCollection.find({sub_categoryname: sub_category})
      const result = await query.toArray()
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
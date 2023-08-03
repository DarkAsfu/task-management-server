const express = require('express');
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;
const app =express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqju11e.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    // collection
    const taskCollection = client.db('taskCollectionDB').collection('tasks')
    // get api
    app.get('/alltask', async(req, res) => {
        const cursor = taskCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    // get by email
    app.get('/mytask', async(req, res) =>{
        console.log(req.query);
        let query = {};
        if(req.query?.email){
            query = { email: req.query.email }
        }
        const cursor = taskCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })
    // post api created
    app.post('/addtask', async(req, res) =>{
        const newTask = req.body;
        const result = await taskCollection.insertOne(newTask);
        res.send(result);
    })

    // delete api
    app.delete('/alltask/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await taskCollection.deleteOne(query);
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


// default api
app.get('/', (req, res) => {
    res.send('task management is running');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
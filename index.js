const { MongoClient, ServerApiVersion, MongoRuntimeError } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const express = require("express");
const cors = require("cors");
// const { ObjectID } = require("bson");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@gearshub.clcxw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log(" db connected");
    const collection = client.db("gearsHub").collection("services");

    const orderCollection = client.db("gearsHub").collection("orders");

    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = collection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singlePart = await collection.findOne(query);
      res.send(singlePart);
    });

    app.patch("/service/:id", async (req, res) => {
      const id = req.params.id;
      const newQuantity = req.body;
      console.log("Updated Quantity", newQuantity.updatedQuantity);
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          available: newQuantity.updatedQuantity,
        },
      };
      const result = await collection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //updating available quantity after a order has been placed
    app.post("/order", async (req, res) => {
      const order = req.body;
      console.log("adding new order", order);
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Gears hub app listening on port ${port}`);
});

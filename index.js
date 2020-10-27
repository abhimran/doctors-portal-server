const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pv2hb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send("Home Page")
})

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const appiontmentCollection = client.db("doctorsPortal").collection("appointments");

 app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        appiontmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/appointments', (req, res) => {
        appiontmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res)=>{
        appiontmentCollection.deleteOne({_id: ObjectId(req.params.id)})
    })

    app.post('/appointmentsByDate', (req, res) => {
        const date = req.body;
        appiontmentCollection.find({date: date.date})
            .toArray((err, documents) => {
                res.send(documents);
            })
        })
});


app.listen(process.env.PORT || port)

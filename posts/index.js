const express = require('express');
const axios = require('axios');

const bodyParser = require('body-parser');

const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let posts ={};


app.get('/posts', (req, res) => {

    res.send(posts);
})

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id]= {
        id, title
    };

    //emmetiig event into the bus event

   await axios.post('http://localhost:4005/events', {
        type:'PostCreated',
        data: {
            id,
            title
        }
    })

    res.status(201).send(posts[id]);

})

// Listen for events
app.post('/events', (req,res) => {
    console.log('Event Received', req.body.type);

    res.send({});
})
app.listen(4002, () => {
    console.log('[Post Service]Listening on 4002')
})
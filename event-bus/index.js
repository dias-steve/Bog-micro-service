const express = require('express');
const bodyParser = require('body-parser');
const axios =require('axios');

const app = express();
app.use(bodyParser.json());

// setting the event stock manager
// for wether a service doen't have all the events

const events = [];


app.post('/events',(req,res) => {
    const event = req.body;

    events.push(event);

    axios.post('http://localhost:4003/events', event).catch(err=>console.log(err.message));//query service
    axios.post('http://localhost:4002/events', event).catch(err=>console.log(err.message));//posts service
    axios.post('http://localhost:4001/events', event).catch(err=>console.log(err.message));//comments service
    axios.post('http://localhost:4006/events', event).catch(err=>console.log(err.message));//moderation service

    res.send({status: 'OK'});
} );

// get all events received
app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log('[event bus]Listening on 4005');
});
// this service reformat posts data: it combine all data related to posts such as comments ... 

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios =require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const posts = {

};

const handleEvent = (type, data) => {
   
    
    if(type === 'PostCreated'){
        const { id, title } = data; 

        posts[id] = {id, title, comments:[]};
    }

    if(type === 'CommentCreated'){
        const { id, content, postId, status } = data; 
        const post= posts[postId];
        post.comments.push({id, content, status});

    }

    
    //update 
    if(type === 'CommentUpdated'){
        const {id, content, postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find( comment => {
            return comment.id === id
        });

        comment.status = status;
        comment.content = content;
    }

}
app.get('/posts', (req,res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;
   
    handleEvent(type, data);

    res.send({})
});

app.listen(4003, async () => {
    console.log('[Query Service] Listening on 4003');

    //Sync events: we get all events 
    const res = await axios.get('http://localhost:4005/events').catch(err=>console.log(err.message));

    for(let event of res.data){
        console.log('Processing event:', event.type);
        handleEvent(event.type, event.data);
    }
});
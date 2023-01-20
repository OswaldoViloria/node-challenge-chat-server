const express = require("express");
const cors = require("cors");
const { response, text } = require("express");

const app = express();
const bodyParser = require("body-parser")


app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", (request, response) =>{
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", (request, response) =>{
  response.status(200).json(messages)
});

app.post("/messages", (request, response) =>{
  const messageNew = messages.length > 0 ? messages[messages.length-1].id +1 : 0
  if (request.body.from.length > 0 && request.body.text.length > 0) {
    const newMessages = {
    id : messageNew,
    from : request.body.from,
    text : request.body.text
  };
    messages.push(newMessages)
    response.status(201).json(newMessages)
  } else {
    response.status(400).send("No hay nada :C!")
  }
});

app.get("/messages/search", (request, response) => {
  let searchReq = request.query.text
  const result = messages.filter((text) => text.text.includes(searchReq))
  response.status(200).json(result)
});

app.get("/messages/latest", (request, response) => {
  response.json(messages.slice(-10))
})

app.get("/messages/:messages_id", (request, response) =>{
  const messagesId = request.params.messages_id;
  const messagesIndex = messages.find( index => index.id == messagesId) 
  if (messagesIndex) {
	response.status(200).json(messagesIndex)
} else {
	response.status(404).send("Not Found") 
}}); 

app.delete("/messages/:messages_id", (request, response) => {
  const messagesId = request.params.messages_id;
  const messagesIndex = messages.findIndex( index => index.id == messagesId);
  if (messagesIndex > -1) {
    messages.splice(messagesIndex, 1);
    response.status(200).json(messages);
  } else {
    response.status(404).send("Not Found :C");
  }
});

app.listen(3000, () => {
   console.log("Listening on port 3000")
});

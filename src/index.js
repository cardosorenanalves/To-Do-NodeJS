const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const user = users.find(customer => customer.username === username);

  if(!user){
      return response.status(400).json({error: "User not found!"})
  }

  request.username = user;
  
  return next()
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;

  const usernameExists = users.some((user) => 
  user.username === username
  )

  if(usernameExists){
    return response.status(400).json({error: 'Username already exists!'})
  }

 users.push({ 
	id: uuidv4(),
	name, 
	username, 
	todos: []
}) 

return response.status(201).send()
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
 const {username} = request;

 return response.status(200).send(username.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {deadline, title} = request.body
  const {username} = request;
  
 

  const newTodo = {
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date() 
  }

  username.todos.push(newTodo)
  return response.status(201).send()

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;

  const todo = username.todos.find((item) => 
  item.id === id
  )

  todo.title = title
  todo.deadline = deadline

  return response.status(200).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {username} = request;
  const {id} = request.params;

  const todo = username.todos.find((item) => 
  item.id === id
  )

  todo.done = true
 

  return response.status(200).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
});

module.exports = app;
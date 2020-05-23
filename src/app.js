const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function existsId(request, response, next) {
  const {id} = request.params;

  if((repositories.findIndex((repo) => repo.id === id) < 0)) {
    return response.status(400).json('Id does not exist');
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  let repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", existsId, (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  let indexOfId = repositories.findIndex((repository) => {
    return repository.id === id
  });

  if(indexOfId < 0) {
    return response.status(400).json({error: 'Invalid ID'});
  }
  
  let repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[indexOfId].likes
  }

  repositories[indexOfId] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", existsId, (request, response) => {
  const {id} = request.params;

  let indexOfId = repositories.findIndex((repo) => {
    return repo.id === id;
  });

  repositories.splice(indexOfId, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", existsId, (request, response) => {
  const {id} = request.params;

  let indexOfId = repositories.findIndex((repo) => {
    return repo.id === id;
  });
  //console.log(repositories[indexOfId]);
  repositories[indexOfId].likes += 1;
  //console.log(repositories[indexOfId]);
  return response.json(repositories[indexOfId]);
});

module.exports = app;

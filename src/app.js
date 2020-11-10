const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const {title, url, techs} = request.body;
    const portifolio = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0,
    };

    repositories.push(portifolio);//Aqui chamo o array de repositories e adiciono este portifolio no array
    return response.json(portifolio);//Aqui estou exibindo o portifolio recém criado nas linhas anteriores
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const portifolioIndex = repositories.findIndex(portifolio => portifolio.id === id); //Percorre o array para localizar o portifolio desejado
  
  if (portifolioIndex === -1){//Altera a informação desejada
    return response.status(400).json({error: ('Portifolio not found.')});
  };
  
  const portifolio = { //Estou criando o objeto de projeto novamente
    id,
    title,
    url,
    techs,
    likes: repositories[portifolioIndex].likes,
  };

  repositories[portifolioIndex] = portifolio; //Substituindo a possição do array selecionada anteriormente pelo novo portifolio criado na linha anterior
  return response.json(portifolio);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const portifolioIndex = repositories.findIndex(portifolio => portifolio.id === id); //Percorre o array para localizar o portifolio desejado
  
  if (portifolioIndex === -1){//Altera a informação desejada
      return response.status(400).json({error: ('Portifolio not found.')});
  };

  repositories.splice(portifolioIndex, 1); //O 1 informa quantas informações quero remover, neste caso 1 se refere apenas a informação contida no índice selecionado

  return response.status(204).send(); //O método send fará que o retorno seja em branco. O status 204 é indicado para retorno vazio.
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const portifolioIndex = repositories.findIndex(portifolio => portifolio.id === id); 

  if (portifolioIndex === -1){//Altera a informação desejada
    return response.status(400).json({error: ('Portifolio not found.')});
  };

  repositories[portifolioIndex].likes++;

  return response.json(repositories[portifolioIndex]);
});

module.exports = app;
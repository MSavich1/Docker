const express = require("express");
const axios = require("axios")
const { connectDb } = require("./helpers/db");
const { host, port, db, apiUrl } = require("./configuration");
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())

const startServer = () => {
  app.listen(port, () => {
    console.log(`Started auth servise on port: ${port}`);
    console.log(`On host ${host}`);
    console.log(`Our database ${db}`);
  });
};

app.get("/test", (req, res) => {
  res.send("Our auth server is working correctly");
});

app.get("/testwithapidata", (req,res) => {
  axios.get(apiUrl + "/testapidata").then(response => {
    res.json({
      testapidata: response.data.testwithapi
    })
  })
})

app.post("/sign-in", (req, res) => {
  const { email, password} = req.body;
  if(email === "admin@mail.ru" && password === "1234qwer"){
    res.json({
      token: "wefqwefqwefqwefqwef",
    })
  }else{
    res.json({
      error: "Incorrent email or password"
    })
  }
})

app.get("/api/currentUser", (req, res) => {
  res.json({
    id:"1234",
    email: "foo@gmail.com",
  })
})

connectDb()
  .on("error", console.log)
  .on("disconnected", connectDb)
  .once("open", startServer);

const express = require("express");
const { connectDb } = require("./helpers/db");
const axios = require("axios")
const { host, port, db, authApiUrl} = require("./configuration");
const { default: mongoose } = require("mongoose");
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())

const postSchema = new mongoose.Schema({
  name: String,
});
const Post = mongoose.model("Post", postSchema);

const startServer = () => {
  app.listen(port, () => {
    console.log(`Started api servise on port: ${port}`);
    console.log(`On host ${host}`);
    console.log(`Our database ${db}`);

    const silence = new Post({ name: "Silence" });
    silence.save((err, saveSilence) => {
        if(err) return console.error(err);
        console.log("saveSilence with volumes", saveSilence)
    })
  });
};

app.get("/test", (req, res) => {
  res.send("Our api sserver is working correctly");
});

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

app.get("/testapidata", (req,res) => {
  res.json({
    testwithapi: true
  })
}) 



app.get("/testwithcurrentuser", (req,res) => {
  axios.get(authApiUrl + "/currentUser").then(response => {
    res.json({
      testwithcurrentuser: true,
      currentUserFromAuth: response.data,
    })
  })
})


connectDb()
  .on("error", console.log)
  .on("disconnected", connectDb)
  .once("open", startServer);

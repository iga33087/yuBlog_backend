const bodyParser = require('body-parser')
const formData = require("express-form-data")
//const mongo = require('./lib/mongo.js')
const express = require('express')
const app = express()
global=require('./lib/global.js')
const articles = require('./routes/articles.js')
const classtypes = require('./routes/classtypes.js')

app.use(bodyParser.urlencoded({ limit: '1024mb',extended: false }))
app.use(bodyParser.json({limit: '1024mb'}))
app.use(formData.parse());

app.use('/articles', articles)
app.use('/classtypes', classtypes)

app.get('/',async (req, res) => {
  let data=[
    {title:"Linux",children:[
      {title:"如何部屬網頁"},
      {title:"如何實現Docker化"},
      {title:"如何透過CI/CD實現自動化工作"},
    ]},
    {title:"Javascript",children:[]},
    {title:"Vue",children:[]},
    {title:"Openwrt",children:[]},
  ]
  res.send(data)
})

app.listen(3009)
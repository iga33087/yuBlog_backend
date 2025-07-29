const bodyParser = require('body-parser')
const formData = require("express-form-data")
const express = require('express')
const app = express()
const mongo = require('./lib/mongo.js')
global=require('./lib/global.js')

app.use(bodyParser.urlencoded({ limit: '1024mb',extended: false }))
app.use(bodyParser.json({limit: '1024mb'}))
app.use(formData.parse());

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

app.get('/get',async (req, res) => {
  try {
    let r=await mongo.getData('articleModel',{})
    res.send(r)
  }
  catch(err) {
    console.log(1111,err)
    res.status(400).send({
      message: err
    })
  }
})

app.get('/add',async (req, res) => {
  try {
    let data= {
      classtype_id: 1,
      title: 'aaaab',
      content: 'bbb3333',
    }
    await mongo.addData('articleModel',data)
    res.send(true)
  }
  catch(err) {
    res.status(400).send({
      message: err
    })
  }
})

app.listen(3009)
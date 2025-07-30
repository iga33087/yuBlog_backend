global=require('./lib/global.js')
const bodyParser = require('body-parser')
const formData = require("express-form-data")
const express = require('express')
const app = express()
const auth = require('./routes/auth.js')
const articles = require('./routes/articles.js')
const classtypes = require('./routes/classtypes.js')
const members = require('./routes/members.js')

app.use(bodyParser.urlencoded({ limit: '1024mb',extended: false }))
app.use(bodyParser.json({limit: '1024mb'}))
app.use(formData.parse())

const whiteList = ['/auth/login','/classtypes','/articles']

app.use(async (req, res, next) => {
  if (whiteList.includes(req.path)) {
    return next();
  }
  else {
    let r=await global.verifyToken(req.headers.authorization)
    if(r) return next();
    else {
      res.status(400).send({
        message: 'Validation Error'
      })
    }
  }
  verifyToken(req, res, next);
});


app.use('/auth', auth)
app.use('/articles', articles)
app.use('/classtypes', classtypes)
app.use('/members', members)

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

global.randomSign()

app.listen(3009)
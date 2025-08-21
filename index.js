global=require('./lib/global.js')
const bodyParser = require('body-parser')
const formData = require("express-form-data")
const express = require('express')
const app = express()
const auth = require('./routes/auth.js')
const articles = require('./routes/articles.js')
const classtypes = require('./routes/classtypes.js')
const tags = require('./routes/tags.js')
const members = require('./routes/members.js')
const comments = require('./routes/comments.js')
const appInfo = require('./routes/appInfo.js')
const google = require('./routes/google.js')

app.use(bodyParser.urlencoded({ limit: '1024mb',extended: false }))
app.use(bodyParser.json({limit: '1024mb'}))
app.use(formData.parse())

const whiteList = {
  'GET': ['/classtypes','/tags','/articles/outline','/articles/classtypeBox','/articles/data','/google/getToken','/google/getInfo'],
  'POST': ['/auth/login','/google/login'],
  'PUT': [],
  'DELETE': []
}

app.use(async (req, res, next) => {
  console.log('use',req.path)
  if (whiteList[req.method].includes(req.path)) {
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
});

app.use('/auth', auth)
app.use('/articles', articles)
app.use('/classtypes', classtypes)
app.use('/tags', tags)
app.use('/members', members)
app.use('/comments', comments)
app.use('/appInfo', appInfo)
app.use('/google', google)

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
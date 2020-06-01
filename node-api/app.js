const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('./util/request')
const package = require('./package.json')
const exec = require('child_process').exec
const cache = require('apicache').middleware
const mysqlConnection = require('./util/connect-db')
const multer = require('multer')
const tokenUtil = require('./util/token')
const jwt = require('jsonwebtoken')

// version check
exec('npm info NeteaseCloudMusicApi version', (err, stdout, stderr) => {
  if (!err) {
    let version = stdout.trim()
    if (package.version < version) {
      console.log(`最新版本: ${version}, 当前版本: ${package.version}, 请及时更新`)
    }
  }
})

const app = express()

// CORS
app.use((req, res, next) => {
  if (req.path !== '/' && !req.path.includes('.')) {
    res.header({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Headers': 'X-Requested-With',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      'Content-Type': 'application/json; charset=utf-8'
    })
  }
  next()
})

// cookie parser
app.use((req, res, next) => {
  req.cookies = {}, (req.headers.cookie || '').split(/\s*;\s*/).forEach(pair => {
    let crack = pair.indexOf('=')
    if (crack < 1 || crack == pair.length - 1) return
    req.cookies[decodeURIComponent(pair.slice(0, crack)).trim()] = decodeURIComponent(pair.slice(crack + 1)).trim()
  })
  next()
})

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// cache
app.use(cache('1 minutes', ((req, res) => res.statusCode === 200)))

// static
app.use(express.static(path.join(__dirname, 'public')))

// 与用户相关的操作需要token验证
app.use('/user', (req, res, next) => {
  if(req.originalUrl.includes('/user/login') || req.originalUrl.includes('/user/register')) {
    next()
  } else {
    let {token} = req.headers
    if(token){
      let payload = tokenUtil.verifyToken(token)
      if(payload.uid) {
        next()
      } else {
        res.status(401).send({
          code: 401,
          msg: '用户未登录'
        })
      }
    } else {
      res.status(401).send({
        code: 401,
        msg: '用户未登录'
      })
    }
  }
})
// router
const special = {
  'daily_signin.js': '/daily_signin',
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm'
}

// 网易官方提供的接口
fs.readdirSync(path.join(__dirname, 'module')).reverse().forEach(file => {
  if (!(/\.js$/i.test(file))) return
  let route = (file in special) ? special[file] : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/')
  let question = require(path.join(__dirname, 'module', file))

  app.use(route, (req, res) => {
    let query = Object.assign({}, req.query, req.body, { cookie: req.cookies })
    question(query, request)
      .then(answer => {
        console.log('[OK]', decodeURIComponent(req.originalUrl))
        res.append('Set-Cookie', answer.cookie)
        res.status(answer.status).send(answer.body)
      })
      .catch(answer => {
        console.log('[ERR]', decodeURIComponent(req.originalUrl))
        if (answer.body.code == '301') answer.body.msg = '需要登录'
        res.append('Set-Cookie', answer.cookie)
        console.log('[ERR]', decodeURIComponent(req.originalUrl), answer)
        res.status(answer.status).send(answer.body)
      })
  })
})

// 自己编写的接口
fs.readdirSync(path.join(__dirname,'module/cloud-music')).reverse().forEach(file => {
  if(!(/\.js$/i.test(file))) return
  let route = '/' + file.replace(/\.js$/i, '').replace(/-/g,'/')
  let requestway = require(path.join(__dirname, 'module/cloud-music' ,file))
  // 上传文件时使用multer插件
  if(route == '/upload/image'){
    const upload = multer({
      dest: path.join(__dirname, 'public/images')
    })
    app.use(route, upload.single('file'), (req, res) => {
      fs.rename(req.file.path, path.join(req.file.destination, req.file.originalname), (err) => {
        if (err) throw err;
        requestway({
          url: 'http://localhost:3000/images/'+req.file.originalname,
          id: req.body.id
        }, mysqlConnection)
        .then(result => {
          console.log('[OK]', decodeURIComponent(req.originalUrl))
          res.status(result.code)
          res.json(result)
        })
        .catch(result => {
          console.log('[ERR]', decodeURIComponent(req.originalUrl))
          res.status(result.code)
          res.json(result)
        })
      })
    })
  } else {
    app.use(route, (req, res) => {
      let query = Object.assign({}, req.query, req.body, { cookie: req.cookies })
     requestway(query, mysqlConnection)
     .then(result => {
        console.log('[OK]', decodeURIComponent(req.originalUrl))
        res.status(result.code)
        res.json(result)
     })
     .catch(result => {
        console.log('[ERR]', decodeURIComponent(req.originalUrl))
        res.status(result.code)
        res.json(result)
     })

    })
  }

})

const port = process.env.PORT || 3000

app.server = app.listen(port, () => {
  console.log(`server running @ http://localhost:${port}`)
})

module.exports = app

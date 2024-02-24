'use strict';
const express = require('express')
const cors = require('cors')
const socketIO = require("socket.io");
const http = require("http");
const fs = require('fs');
const bodyParser = require('body-parser')
//const log4js = require('./src/app/log4js.config');
/*
const dbConn = require('./db-conn')
const comOp = require('./db-com-op');
const userOp = require('./db-user-op');
const themeOp = require('./db-theme-op');
const monthTaskOp = require('./db-month-task-op');
const taskDetailOp = require('./db-task-detail-op');
*/
require("events").EventEmitter.defaultMaxListeners = 0;

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  //2024/02/03
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  )
  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
}

var _db =  undefined
// 人数カウント
let userCount = 0;
//http server
const app = express()
const server = http.createServer(app); // Expressを用いないserverも必要
// サーバーオブジェクトsocketioを作成する
const io = socketIO(server, {
  cors: {
    // corsモジュールでは上手くCORSできないため、Server作成時の引数にCORSオプションを追加する
    //origin: "http://localhost:8081/",
    origin: "*",
    //methods: ["GET", "POST"],
    //credentials: true,
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));


//app.use(bodyParser.json())
//app.use(allowCrossDomain)
//app.use(express.urlencoded({ extended: true, limit: "10mb" }));
//app.use(express.json({ extended: true, limit: "10mb" }));

io.on("connection", (socket) => {
    // ブラウザから接続されたときの処理
    console.log("a user connected");
    userCount++;
    console.log(`${userCount}名が入室中…`);

    // ブラウザが切断したときの処理
    socket.on("disconnect", () => {
        console.log("user disconnected");
        userCount--;
        console.log(`${userCount}名が入室中…`);
    });

    socket.on("chat message", (msg) => {
        console.log("chat message received!!!");
        console.log(msg);
        console.log("---------------");
        io.emit("chat", msg);
    });

    socket.on("draw line", (line) => {
      console.log("draw line received!!!");
      console.log(line);
      console.log("---------------");
      io.emit("draw", line);
  });
});

// health check
//app.use('/health', check);

//ログ設定不要
//log4js.configure('./src/config/log4js.config.json');

//2024/02/03 added
/* ログをファイルへ出力する。*/
// 標準出力をリダイレクト
//const out = fs.createWriteStream('info.log');
// 標準エラー出力をリダイレクト
//const err = fs.createWriteStream('error.log');
// カスタマイズされた独自コンソールオブジェクトを作成する。
//const logger = new console.Console(out, err);
// 実際にログを出力してみる。
//logger.log('----アプリ開始');
//logger.log('------初期化成功');
//logger.error(new Error('-----障害検出'));
console.log('----アプリ開始');
console.log('------初期化成功');

//const systemLogger = log4js.getLogger('system'); 
//const httpLogger = log4js.getLogger('http'); 
//const accessLogger = log4js.getLogger('access');
//app.use(log4js.connectLogger(accessLogger));
app.use((req, res, next) => {
  if (typeof req === 'undefined' || req === null ||
        typeof req.method === 'undefined' || req.method === null ||
        typeof req.header === 'undefined' || req.header === null) {
    next();
    return;
  }
  if (req.method === 'GET' || req.method === 'DELETE') {
    //httpLogger.info(req.query);
  } else {
    //httpLogger.info(req.body);
  }
  next();
});
//systemLogger.info("App start");
 
// API Version
const apiVersion = '/api/v2.1.0';

app.get('/', function (req, res) {
  console.log("/ requested!!!");
  res.render('index.html');
})

app.get('/hello', function (req, res) {
  console.log("/hello requested!!!");
  res.send("Hello!")
})

app.get('/root', (req, res) => {
  console.log("root requested!!!");
  res.render('index.ejs');
});

//app.listen(3000);

//call back
function setDBCallback (error, db) {
  if (error !== null) {
      console.log('error when fetching the DB connection ' + JSON.stringify(error))
      return
  }
  _db = db;
}

var PORT = process.env.PORT || 8088
//var server = app.listen(PORT, '0.0.0.0', function() {
server.listen(PORT, '0.0.0.0', function() {
  const host = server.address().address
  const port = server.address().port
  console.log(`Muserver App listening at http://${host}:${port}`)
  //logger.log(`Muserver App listening at http://${host}:${port}`);

  //dbConn.getDB(setDBCallback);
})

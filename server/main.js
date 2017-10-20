import express from 'express';
import session from 'express-session';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import employee from './routes/employee';
import auth from './routes/auth';
import commodity from './routes/commodity';
import consult from './routes/consult';
import ondemand from './routes/ondemand';
import chat from './routes/chat';
import reservation from './routes/reservation';
import rank from './routes/rank';

import flash from 'connect-flash';
import path from 'path';
// import fs from 'fs';
// import https from 'https';

// const sslPath = path.join(__dirname, '/../server/sslcert');
// const certOption = {
//     key: fs.readFileSync(sslPath + '/server.key', 'utf8'),
//     cert: fs.readFileSync(sslPath + '/server.crt', 'utf8')
// };

const app = express();
const port = 3000;
const devPort = 3001;
// const sslPort = 3002;
const db = require('oracledb-autoreconnect');
db.oracledb.maxRows = 300;
const dbConfig = require('./database/config');

/**
 * oracledb-autoreconnect initial
 */
db.setConnection(dbConfig);

/**
 * development mode
 */
if (process.env.NODE_ENV === 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    let compiler = webpack(config);
    let devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(devPort, () => {
        console.log('webpack-dev-server is listening on port', devPort);
    });
}

/**
 * middleware
 */
app.set('trust proxy', 1);
app.use(session({
    secret: 'hanabit2017',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2000 * 60 * 60
    }
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Headers","*");
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

/**
 * api
 */
app.use('/api/employee', employee);
app.use('/api/auth', auth);
app.use('/api/commodity', commodity);
app.use('/api/consult', consult);
app.use('/api/ondemand', ondemand);
app.use('/api/chat', chat);
app.use('/api/reservation', reservation);
app.use('/api/rank', rank);

/**
 * static
 */
app.use('/images', express.static(path.join(__dirname, '/../images')));
app.use('/:name', express.static(path.join(__dirname, '/../public')));


app.get("*", function(req, res) {
    let empCode = req.path.split('/')[1];
    if (empCode !== undefined) {
        res.redirect(`/${empCode}`);
    } else {
        //
        res.redirect('/fail');
    }
});
import http from 'http';
http.createServer(app).listen(port, function () {
    console.log('Express HTTP server listening on port ' + port);
});


// http.createServer(app).listen(port, function () {
//     console.log('Express HTTP server listening on port ' + port);
// });

// app.get("*", function (req, res) {
//     let empCode = req.path.split('/')[1];
//     if (empCode !== undefined) {
//         res.redirect(`/${empCode}`);
//     } else {
//         //
//         res.redirect('/fail');
//     }
// });
// https.createServer(certOption, app).listen(sslPort, function () {
//     console.log('Express HTTPS server listening on port ' + sslPort);
// });

/**
 * Secondary express - http
 * @type {*}
 */
// const httpApp = express();
// import http from 'http';
// httpApp.get('*', function (req, res) {
//     let empCode = req.path.split('/')[1];
//     let host = req.get('Host');
//     host = host.replace(/:\d+$/, ":" + sslPort);
//
//     if (empCode !== undefined) {
//         res.redirect(`https://${host}/${empCode}`);
//     } else {
//         //
//         res.redirect('/fail');
//     }
// });
// http.createServer(httpApp).listen(port, function () {
//     console.log('Express HTTP server listening on port ' + port);
// });
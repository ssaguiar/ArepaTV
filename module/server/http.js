
const fs = require('fs');
const ws = require('ws');
const db = require('mongoose');
const fetch = require('axios');
const molly = require('molly-js');
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

process.molly.iframe = 'sameorigin';
process.molly.strict = true;
process.molly.threads = 1;
const PORT = 3000;

/*-------------------------------------------------------------------------------------------------*/

process.env.MONGO = process.env.MONGO.replace( 'PASS', process.env.MPASS );
db.connect( process.env.MONGO ); db.model('users',new db.Schema({
    quality: Number, email: String,
    user: Number, time: Number,
    pass: String, name: String,
    hash: String,
}));

/*-------------------------------------------------------------------------------------------------*/

molly.createHTTPServer((server)=>{
    //  const user = require('./ws');
    //  const opt = { server, path: '/ws' };
    //  const socket = new ws.Server( opt );
    //  socket.on('connection',(client)=>{ user(client) });
},PORT);

/*-------------------------------------------------------------------------------------------------*/

if( !worker.isMainThread ) worker.parentPort.postMessage('done');

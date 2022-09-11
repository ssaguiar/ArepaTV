
const fs = require('fs');
const ws = require('ws');
const db = require('mongoose');
const fetch = require('axios');
const molly = require('molly-js');
const cluster = require('cluster');
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

const threads = 1;
const PORT = 27019;

/*-------------------------------------------------------------------------------------------------*/

process.env.MONGO = process.env.MONGO.replace( 'PASS', process.env.MPASS );
db.connect( process.env.MONGO ); db.model('users',new db.Schema({
    quality: Number, email: String,
    user: Number, time: Number,
    pass: String, name: String,
    hash: String,
}));

/*-------------------------------------------------------------------------------------------------*/

if ( cluster.isPrimary ) {
    for ( let i=threads; i--; ) { cluster.fork();
    } cluster.on('exit', (worker, code, signal)=>{ cluster.fork();
        console.log(`worker ${worker.process.pid} died by: ${code}`);
    });
} else {
    http.createServer(app).listen(PORT,()=>{
        if( !worker.isMainThread ) worker.parentPort.postMessage('done');
    });
}

/*-------------------------------------------------------------------------------------------------*/

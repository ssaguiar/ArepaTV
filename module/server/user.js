const url = require('url')
const http = require('http');
const db = require('mongoose');
const fetch = require('axios');
const cluster = require('cluster');
const {Buffer} = require('buffer');
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

process.env.MONGO = process.env.MONGO.replace( 'PASS', process.env.MPASS );
db.connect( process.env.MONGO ); const USER = db.model('users',new db.Schema({
    quality: Number, email: String,
    user: Number, time: Number,
    pass: String, name: String,
    hash: String,
})) || db.models.users;
const PORT = 27019;
const threads = 1;

/*-------------------------------------------------------------------------------------------------*/

function parseBody( body ){
    return new Promise((response,reject)=>{
        const data = new Array();
        body.on('data',(chunk)=>{ data.push(chunk) });
        body.on('close',()=>{ response(Buffer.concat(data)) });
    });
}

function mail(req,res){
    return new Promise(async(response,reject)=>{
        const body = JSON.parse(await parseBody(req));
        USER.findOne({ email:body.email },(err,data)=>{
            if(err) return reject(err); response(JSON.stringify(data));
        });
    });
}

function hash(req,res){
    return new Promise(async(response,reject)=>{
        const body = JSON.parse(await parseBody(req));
        USER.findOne({ hash:body.hash },(err,data)=>{
            if(err) return reject(err); response(JSON.stringify(data));
        });
    });
}

function save(req,res){
    return new Promise(async(response,reject)=>{
        const body = JSON.parse(await parseBody(req)); console.log(body);
        const done = new USER(body); done.save((err,data)=>{
            if(err) return reject(err); response(JSON.stringify(data));
        });
    });
}

/*-------------------------------------------------------------------------------------------------*/

async function app(req,res){
    try {
        const p = url.parse(req.url,true);
        const q = p.query;
    
        if( p.pathname == '/mail' && req.method == 'POST' ){
            res.writeHead(200,{"Content-Type":"application/json"});
            return res.end( await mail( req,res ) );
        } else if( p.pathname == '/hash' && req.method == 'POST' ){
            res.writeHead(200,{"Content-Type":"application/json"});
            return res.end( await hash( req,res ) );
        } else if( p.pathname == '/save' && req.method == 'POST' ){
            res.writeHead(200,{"Content-Type":"application/json"});
            return res.end( await save( req,res ) );  
        } else {
            res.writeHead(404,{"Content-Type":"text/plain"});
            return res.end('err');
        }
    } catch(e) {
        res.writeHead(404,{"Content-Type":"text/plain"});
        res.end(`err:${e?.message}`); console.log(e);
    }
}

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

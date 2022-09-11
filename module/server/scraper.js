const url = require('url');
const http = require('http');
const fetch = require('axios');
const {Buffer} = require('buffer');
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

const PORT = 27018;

/*-------------------------------------------------------------------------------------------------*/

function parseBody( body ){
    return new Promise((response,reject)=>{

        const data = new Array();

        body.on('data',(chunk)=>{
            data.push( chunk );
        });

        body.on('end',()=>{
            const out = Buffer.concat(data);
            response( out.toString() );
        });

        body.on('error',(e)=>{
            reject(e);
        })

    });
}

/*-------------------------------------------------------------------------------------------------*/

async function app(req,res){
    try {
        const body = JSON.parse(await parseBody(req));
        res.writeHead(200,{'Content-Type': 'application/json'});
        const path = `${process.cwd()}/module/scraper/${body.type}`;
        res.end(JSON.stringify( await require( path )( body.url ) ));
    } catch(e) {
        res.writeHead(404,{'Content-Type': 'text/html'});
        res.end(`error: ${e?.message}`);
    }
}

/*-------------------------------------------------------------------------------------------------*/

http.createServer(app).listen(PORT,()=>{
    if( !worker.isMainThread ) worker.parentPort.postMessage('done');
});

/*-------------------------------------------------------------------------------------------------*/
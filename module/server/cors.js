const os = require('os');
const url = require('url');
const http = require('http');
const https = require('https');
const cluster = require('cluster');
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

const numCPUs = os.cpus().length * 20;
const size = Math.pow(10,6) * 3;
const PORT = 4000; 

/*-------------------------------------------------------------------------------------------------*/

function parseRange( range ){
    const interval = range.match(/\d+/gi);
    const chunk = Number(interval[0])+size;
    return interval[1] ? range : range+chunk;
}

/*-------------------------------------------------------------------------------------------------*/

function app(req,res){

    const p = url.parse( req.url,true );
    const q = p.query; 
    
    const _prt = q.type || 'https';
    const _url = `${_prt}://${q.href}`;
    const port = (/https/gi).test(_url) ? 443 : 80;
    const protocol = (/https/gi).test(_url) ? https : http;

    const options = url.parse(_url);
          options.agent = protocol.Agent({ rejectUnauthorized: false });
          options.method = 'GET';
          options.port = port;
          options.headers = {
              'sec-ch-ua-platform': req.headers['sec-ch-ua-platform'],
              'sec-ch-ua-mobile': req.headers['sec-ch-ua-mobile'],
              'user-agent': req.headers['user-agent'],
              'sec-ch-ua': req.headers['sec-ch-ua'],
              referer: _url,
          };

    if( req.headers.range ) options.headers.range = parseRange(req.headers.range);
    
    const data = protocol.request( 
        options,(response) => {
            if( response.headers.location )
                response.headers.location = response.headers.location.replace(/^http.*:\/\//gi,'?href=')
            res.writeHead(response.statusCode,response.headers);
            response.pipe(res);
    });

    data.on('error',(e)=>{
        res.writeHead(504,{'Content-Type': 'text/html'});
        res.end(`error: ${e?.message}`);
    });

    data.end();

}

/*-------------------------------------------------------------------------------------------------*/

if ( cluster.isPrimary ) {

    for ( let i = 0; i < numCPUs; i++ ) { cluster.fork();
    } cluster.on('exit', (worker, code, signal)=>{ cluster.fork();
        console.log(`worker ${worker.process.pid} died by: ${code}`);
    });

} else {
    http.createServer(app).listen(PORT,'0.0.0.0',()=>{
        console.log(`listening -> http://localhost:${PORT}`);
        if( !worker.isMainThread ) worker.parentPort.postMessage('done');
    });
}

/*-------------------------------------------------------------------------------------------------*/


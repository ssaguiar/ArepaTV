const os = require('os');
const url = require('url');
const http = require('http');
const https = require('https');
const fetch = require('axios');
const cluster = require('cluster');
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

const threads = os.cpus().length * 2;
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
    try {

        const p = url.parse( req.url,true );
        const q = p.query; 
        
        const _prt = q.type || 'https';
        const _url = `${_prt}://${q.href}`;
        const protocol = (/https/gi).test(_url) ? https : http;
    
        const options = new Object();
              options.url = _url;
              options.method = 'GET';
              options.responseType = 'stream';
              options.headers = { referer: _url,
                  'sec-ch-ua': req.headers['sec-ch-ua'],
                  'user-agent': req.headers['user-agent'],
                  'sec-ch-ua-mobile': req.headers['sec-ch-ua-mobile'],
                  'sec-ch-ua-platform': req.headers['sec-ch-ua-platform'],
              };  options.agent = new protocol.Agent({ rejectUnauthorized: false });
    
        if( req.headers.range ) options.headers.range = parseRange(req.headers.range);

        fetch(options).then(response=>{
            res.writeHead(response.status,response.headers);
            response.data.pipe(res);
        }).catch(e=>{
            res.writeHead(504,{'Content-Type': 'text/html'});
            res.end(`error: ${e?.message}`);
            console.log(e?.message);
        });

    } catch(e) {
        res.writeHead(504,{'Content-Type': 'text/html'});
        res.end(`error: ${e?.message}`);
        console.log(e?.message);
    }
}

/*-------------------------------------------------------------------------------------------------*/

if ( cluster.isPrimary ) {
    for ( let i=threads; i--; ) { cluster.fork();
    } cluster.on('exit', (worker, code, signal)=>{ cluster.fork();
        console.log(`worker ${worker.process.pid} died by: ${code}`);
    });
} else {
    http.createServer(app).listen(PORT,'0.0.0.0',()=>{
        if( !worker.isMainThread ) worker.parentPort.postMessage('done');
    });
}

/*-------------------------------------------------------------------------------------------------*/
const os = require('os');
const url = require('url');
const http = require('http');
const https = require('https');
const fetch = require('axios');
const cluster = require('cluster');
const worker = require('worker_threads');

const defaultHeader = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 15054.50.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'Accept-Language': 'es-419,es;q=0.9', 'sec-ch-ua-platform': '"Chrome OS"',
    'Upgrade-Insecure-Requests': '1', 'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate', 'Cache-Control': 'no-cache',
    'Connection': 'keep-alive', 'Sec-Fetch-Site': 'none',
    'sec-ch-ua-mobile': '?0', 'Sec-Fetch-User': '?1',
    'Pragma': 'no-cache',
}

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
        
        const _prt = q?.prot || 'https';
        const _url = `${_prt}://${q.href}`;
    
        const options = new Object();
        
              options.url = _url;
              options.method = 'GET';
              options.responseType = 'stream';

              options.headers = { referer: _url,
                  'sec-ch-ua': req.headers['sec-ch-ua'] || defaultHeader['sec-ch-ua'],
                  'user-agent': req.headers['user-agent'] || defaultHeader['user-agent'],
                  'sec-ch-ua-mobile': req.headers['sec-ch-ua-mobile'] || defaultHeader['sec-ch-ua-mobile'],
                  'sec-ch-ua-platform': req.headers['sec-ch-ua-platform'] || defaultHeader['sec-ch-ua-platform'],
              };  
              
              options.httpAgent = new http.Agent({ rejectUnauthorized: false });
              options.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    
        if( req.headers.range ) options.headers.range = parseRange(req.headers.range);

        if( (/audio|video/i).test(q?.type) && !range ){
			res.writeHead( 200,{ 'Content-Type': q.type }); res.end();
        } else {

            fetch(options).then(response=>{
                res.writeHead(response.status,response.headers);
                response.data.pipe(res);
            }).catch(e=>{
                res.writeHead(504,{'Content-Type': 'text/html'});
                res.end(`error: ${e?.message}`);
                console.log(e?.message);
            });

        }

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
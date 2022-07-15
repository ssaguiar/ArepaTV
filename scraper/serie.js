
const url = require('url');
const fetch = require('axios');

// TODO: function -------------------------------------------//

const headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Referer": "https://player.pelisgratishd.io/404/",
	"accept-language": "es-419,es;q=0.9,en;q=0.8",
    "sec-ch-ua-platform": "\"Chrome OS\"",
    "upgrade-insecure-requests": "1",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "navigate",
    "sec-fetch-dest": "iframe",
    "sec-ch-ua-mobile": "?0",
};

async function URL( _url,_cfg=undefined ){
	
	const conf = {	
		headers:headers,
		method:'GET',
		url:_url,
	};

	if( _cfg ) 
		Object.keys( _cfg ).map(x=>{
			conf[x] = _cfg[x];
		});
		
	const raw = await fetch( conf );
	const { request,data } = raw;
	const path = request.res.responseUrl;
	const { host } = url.parse( request.res.responseUrl );
	
	return {
		raw: raw,
		url: path,
		data: data,
		path: host,
		req: request,
	}
	
}

// TODO: main ---------------------------------------------- //

module.exports = async ( _path )=>{
	
	let $,res,data;
	
	// TODO: primera redireccion
	res = await URL( _path );
	data = res.data.match(/var s = {[^\}]+};/gi).toString();
	data = data.match(/https[^"]+/gi)[0];
	console.log('done a');
	
	// TODO: segunda redireccion
	res = await URL( data );
	data = res.data.match(/go_to_player\(\'[^']+/gi).toString();
	data = data.match(/https[^'|,]+/gi)[0];
	prsd = url.parse(data,true);
	console.log('done b');

	// TODO: tercera redireccion
	res = await URL( 'https://gcs.megaplay.cc/r.php',{
		data: `h=${prsd.query.h}`, method: 'POST',
	}); data = res.url.split('/').pop();
	console.log('done c');

	//TODO: Cuarta Redireccion
	res = await URL(
		`https://embedsito.com/api/source/${data}`,
		{ method:'POST', data:'' }
	);
	console.log('done e');

	console.log( res.data );
	
	return res.data.data[ res.data.data.length-1 ].file;
}

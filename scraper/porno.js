const fetch = require('axios');

// TODO: main ---------------------------------------------- //

module.exports = async ( _path )=>{
	
	let regex = /Playerjs\([^\(\)]+\);/gi;
	let {data} = await fetch.get( _path );
		 data = data.match(regex);
		 data = data[0].replace(/(\n| )+/g,'');
		 data = `{${data.slice(10,data.length-4)}}`;
	
	const obj = JSON.parse(data);
		  obj.file = obj.file.replace(/240p|360p|HD|\[|\]/gi,'')
		  obj.file = obj.file.split(',');

	return obj.file[ obj.file.length-1 ];
}

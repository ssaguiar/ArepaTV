const lwdb = require('lwdb');

async function getList( sdb,_type,_filter,_obj ){
    if( !_filter ) return await sdb.list( _type,_obj );
    else return await sdb.match( _type,_filter,_obj );
}

(async()=>{
    try{
        
        const sdb = new lwdb.createStreamDB(
            process.env.MODEL, process.env.PASS
        );
        
        const args = [
            req.query.type,
            req.query.filter,{
                offset: req.query.offset,
                length: req.query.length,
        }];
		
       	const {data} = await getList( sdb,...args );
        res.send(200,data.map((x)=>{
            return `<a hash="${x.hash}" onclick="extra.show(this)" 
                       class="uk-height-medium"
                       id="poster"
                       href="#">
                <img src="./img/${req.query.type}.jpg"
                     data-src="${x.imagen}"
                     alt="${x.nombre}"
					 lazy>
            </a>`;
        }).join(''));
     	
    } catch(e) { 
        console.log(e)
    	res.send(404,'something wrong')
    }
})();
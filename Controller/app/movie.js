const molly = require('molly-js');
const fetch = require('axios');
const url = require('url');

async function getList( _type,_filter,_offset,_length ){

    const params = url.format({
        query:{
            db:'arepatv',
            table: _type,
            target: _filter,
            offset: _offset,
            length: _length,
        }
    })

    if( !_filter )   
        return await fetch.get(`http://localhost:27017/list${params}`);
    else 
        return await fetch.get(`http://localhost:27017/match${params}`);
}

/*-------------------------------------------------------------------------------------------------*/

module.exports = async(req,res)=>{
    try{ 
        
        const args = [
            req.query.type,
            req.query.filter,
            req.query.offset,
            req.query.length,
        ];

        const type = req.query.type.replace(/s$/,'');
        const {data} = await getList( ...args );
        const resp = data.map((x)=>{

            const temp = typeof x.magnet == 'string' ? '' : `
                <span class="uk-badge uk-primary uk-enphasis"> ${x.magnet.length}Temp </span>  
            `; return `
                <a onclick="show(this)" hash="${x.hash}" id="movie" class="uk-inline uk-child-width-expand uk-height-medium">
                    <img class="uk-rounded" src="./img/placeholder.webp" lazy="${x.imagen}" alt="${x.nombre}">
                    <div class=" uk-position-top-left uk-position-small">
                        <span class="uk-badge uk-primary uk-enphasis"> ${type} </span> ${temp} 
                    </div> 
                </a>`;

        }).join('|'); res.send(200,resp);

    } catch(e) { console.log(e); res.send(404,''); }
};

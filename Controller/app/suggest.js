const worker = require('worker_threads');
const molly = require('molly-js');
const fetch = require('axios'); 
const url = require('url');

/*-------------------------------------------------------------------------------------------------*/

module.exports = async(req,res)=>{

    const filt = 'peliculas|series|novelas';
    const regx = new RegExp(filt,'i');
    const resp = new Array();

    if( (regx).test(req.query.type) ){

        const filter = filt.split('|'); for( var i in filter ){
            const search = url.format({query: {
                length: 5, db: 'arepatv',
                target: req.query.filter,
                table: filter[i],
            }}); 
            const {data} = await fetch.get(`http://localhost:27017/match${search}`);
            data.map((x)=>{ resp.push(`<li>
                    <a href="?type=${filter[i]}&filter=${x.nombre}">
                        <span class="uk-badge uk-primary uk-enphasis">${filter[i]}</span> 
                    ${x.nombre}</a>
                </li>`); 
            });
        }
    
    } else {

        const search = url.format({ query: {
            length: 10, db: 'arepatv',
            target: req.query.filter,
            table: req.query.type,
        }});

        const {data} = await fetch.get(`http://localhost:27017/match${search}`);
        data.map((x)=>{ resp.push(`<li>
                <a href="?type=${req.query.type}&filter=${x.nombre}">
                    <span class="uk-badge uk-primary uk-enphasis">${req.query.type}</span>
                ${x.nombre}</a>
            </li>`); 
        });

    }   
    
    res.send( 200,resp.join('\n') );

};

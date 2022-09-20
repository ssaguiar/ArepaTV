const molly = require('molly-js');
const fetch = require('axios');
const url = require('url');
const fs = require('fs');

const page = new Object();

/*-------------------------------------------------------------------------------------------------*/

page.comentarios = ( hash )=>{
    const path = `/comp/social/comment.html?hash=${hash}`;
    return `<iframe class="uk-width-expand uk-height-medium" src="${path}" overflow-scroll></iframe> <br>`
};

/*-------------------------------------------------------------------------------------------------*/

page.similar = async function(x){

    const filter = x.categoria[ 
        parseInt(Math.random() * x.categoria.length - 1)
    ];

    const params = url.format({
        query:{
            offset: parseInt( Math.random() * 100 ),
            target: filter,
            table: x.type,
            db:'arepatv',
            length: 6,
        }
    })
    
    const {data} = await fetch.get(`http://localhost:27017/match${params}`);
    const type = x.type.replace(/s$/,'');

    return data.map((y)=>{ return `
        <a onclick="show(this)" hash="${y.hash}" type="${type}" id="movie" class="uk-inline uk-child-width-expand uk-height-medium">
            <img class="uk-rounded" src="./img/placeholder.webp" lazy="${y.imagen}" alt="${y.nombre}">
            <div class=" uk-position-top-left uk-position-small">
                <span class="uk-badge uk-primary uk-enphasis"> ${type} </span>   
            </div>  
        </a>
    `;}).join('');
}

page.categoria = function(x){
    return x.categoria.map((y)=>{
        const data = y.replace(/\>/gi,'');
        return data==' ' ? '' : `
            <a class="uk-badge uk-primary uk-enphasis" href="?type=${x.type}&filter=${data}">${data}</a>
        `;
    }).join('');
}

page.capitulos = function(x){

    const _temporada = new Array();
    const _capitulos = new Array();

    x.magnet = x.magnet.reverse();
    x.magnet.map((temporada,i)=>{

        let hidden = ''; let active = 'true'; if( i!=0 ){
            active = 'false'; hidden = 'hidden';
        } 

        const cap = temporada.map((capitulo,j)=>{
            const p = x.magnet.length - 1 - Number(i); return `
                <a url="/app/play?hash=${x.hash}&cap=${j}&tmp=${p}&type=${x.type}"
                   target="_blank" id="movie" onclick="play(this)" class="uk-inline uk-child-width-expand uk-height-small">             
                    <img class="uk-rounded" src="./img/thumbnail.webp" lazy="${capitulo.imagen}" alt="${capitulo.nombre}">
                    <div class=" uk-position-top-left uk-position-small">
                        <span class="uk-badge uk-primary uk-enphasis"> cap${+j+1} </span>   
                    </div>   
                </a>`;
        }).join('');

        _temporada.push(`
            <a id="selector" show="#temporada-${i}" hide=".temporada" class="uk-button uk-default" active="${active}"> 
                T${+i+1} 
            </a>
        `);

        _capitulos.push(` 
            <div class="uk-flex uk-flex-wrap
                    uk-child-width-1-6@m
                    uk-child-width-1-4@s
                    uk-child-width-1-2
                    temporada" 
                 id="temporada-${i}" ${hidden}> 
                ${cap}
            </div>
        `);

    });

    const _temp = _temporada.length > 1 ? _temporada.join('') : '';

    return `
        <div class="uk-flex" id="temporadaSelector">
            ${_temp} </div> ${_capitulos.join('')}
    `; 

    return result;
}

/*-------------------------------------------------------------------------------------------------*/
page.screen = async function(x){

    const categorias = page.categoria(x);
    const similar = await page.similar(x);

    if( (/peliculas/i).test(x.type) ) return `
        <img class="uk-width-expand uk-visible@m" lazy="${x.poster}">
        <div class="uk-text-justify uk-position-cover">
            <div class="uk-flex uk-child-width-expand uk-padding">
                <div class="uk-padding uk-padding-remove-vertical uk-padding-remove-left uk-width-auto uk-visible@s">
                    <img class="uk-width-expand uk-height-medium uk-rounded" src="/img/placeholder.webp" lazy="${x.imagen}" alt="${x.nombre}">
                </div> <div>
                    <h1>${x.nombre}</h1>
                    <div> ${categorias} </div>
                    <p>${x.descripcion.split(' ').slice(0,70).join(' ')}</p>
                    <a class="uk-button uk-primary uk-enphasis uk-rounded"
                       url="/app/play?type=${x.type}&hash=${x.hash}"
                       onclick="play(this)"
                       target="_blanck">
                        Reproducir
                    </a>
                </div>
            </div> <div class="uk-padding uk-padding-remove-top" gradient>
            <br><hr> <div class=" uk-flex uk-flex-wrap 
                    uk-child-width-1-6@m
                    uk-child-width-1-4@s
                    uk-child-width-1-2
                "> ${similar} </div>
                <!--
                <hr> ${page.comentarios(x.hash)} <br>
                -->
            </div>
        </div>
    `;

    const capitulos = page.capitulos(x); return `
        <img class="uk-width-expand uk-visible@m" lazy="${x.poster}">
        <div class="uk-text-justify uk-position-cover">
            <div class="uk-flex uk-child-width-expand uk-padding uk-padding-remove-bottom">
                <div class="uk-padding uk-padding-remove-vertical uk-padding-remove-left uk-width-auto uk-visible@s">
                    <img class="uk-width-expand uk-height-medium uk-rounded" src="/img/placeholder.webp" lazy="${x.imagen}" alt="${x.nombre}">
                </div> <div>
                    <h1>${x.nombre}</h1>
                    <div> ${categorias} </div>
                    <p>${x.descripcion.split(' ').slice(0,70).join(' ')}</p>
                </div>
            </div> <div class="uk-padding uk-padding-remove-top" gradient>
            <br><hr> <div> ${capitulos} </div>
                <!--
                <hr> <div class=" uk-flex uk-flex-wrap 
                    uk-child-width-1-6@m
                    uk-child-width-1-4@s
                    uk-child-width-1-2
                ">  ${similar} </div>
                <hr> ${page.comentarios(x.hash)} <br>
                -->
            </div>
        </div>
    `;

}

/*-------------------------------------------------------------------------------------------------*/

module.exports = async(req,res)=>{

    const params = url.format({
        query:{ db:'arepatv',
            table: req.query.type,
            target: req.query.filter,
        }
    });
    
    fetch.get(`http://localhost:27017/hash${params}`).then(async({data})=>{
        data[0].type = req.query.type || 'peliculas';
        res.send( 200,await page.screen(data[0]) );
    }).catch(e=>{ console.log(e);
        res.send( 404,`something went wrong: ${e.message}` )
    })

};
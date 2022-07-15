const lwdb = require('lwdb');

function page( data ){

    let capitulos = new String();
    let temporada = new String();
    let button = new String();

    data.descripcion = data.descripcion.split(' ')
        .slice(0,50).join(' ') + '...';

    if( typeof data.magnet === 'string' ){
        capitulos = `<div class="uk-flex uk-width-expand">
            <a class="uk-button uk-button-primary uk-width-expand"
               onclick="extra.play(this)"
               hash="${data.hash}"> 
               Reproducir 
            </a>
        </div>`;
        
    } else {
        capitulos = data.magnet.map((x,i)=>{

            button = `
                <a class="uk-button uk-button-primary uk-width-expand"
                    uk-toggle="#chSelector,#tm_${i}"> 
                    Anterior
                </a>
            `;

            temporada += `<div id="tm_${i}" hidden> ${button}` + x.map((y,j)=>{
                return `<a class="uk-button uk-button-default uk-width-expand"
                    onclick="extra.play(this)"
                    hash="${data.hash}"
                    t="${i}" c="${j}">
                    Capitulo ${j+1}
                </a>`;
            }).join('') + `</div>`;

            return `<a class="uk-button uk-button-default" 
                uk-toggle="#chSelector,#tm_${i}"> 
                Temporada ${Math.abs(i-data.magnet.length)}
            </a>`;

        }).join('');
    }

    return `
        <button class="uk-offcanvas-close" type="button" uk-close></button>
        <h3 class="uk-text-truncate">${data.nombre}</h3><hr>
        <p>${data.descripcion}</p><hr>
        <div class="uk-width-expand uk-child-width-expand" id="chSelector">
            ${capitulos}
        </div>
        <div class="uk-width-expand uk-child-width-expand" id="chSelector" hidden>
            ${temporada}
        </div>
    `;
}

(async()=>{
    try{
        
        const sdb = new lwdb.createStreamDB(
            process.env.MODEL,
            process.env.PASS
        );
		
       	const {data} = await sdb.findByHash( 
            req.query.type,
            req.query.filter
        );
        
        res.send(200,page(data[0]));
     	
    } catch(e) { 
        console.log(e)
    	res.send(404,'something wrong')
    }
})();
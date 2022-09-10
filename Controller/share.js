const scraper = require(`${process.cwd()}/module/scraper/main`);
const molly = require('molly-js');
const fetch = require('axios');
const url = require('url');

function share( _type,_hash,_url ){
    return new Promise((response,reject)=>{

        const query = url.format({
            query: {
                table: _type,
                target: _hash,
                db: 'arepatv',
            }
        });

        fetch.get(`http://localhost:27017/hash${query}`)
        .then(async({data})=>{
            response(`      
                <!DOCTYPE html>
                <html lang="es">        

                    <title> Ver ${data[0].nombre} En ArepaTV</title>

                    <!-- SEO -->
                    <meta charset="utf-8">
                    <meta name="author" content="bececrazy">
                    <meta name="robots" content="noindex,nofollow">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

                    <meta name="description" content="${data[0].descripcion}">
                    <meta name="keywords" content="${data[0].categoria.join(',')}">

                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content="${data[0].nombre}">
                    <meta property="og:image" content="${data[0].imagen}">
                    <meta property="og:description" content="${data[0].descripcion}">
                    
                    <!-- Google tag (gtag.js) -->
                    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6B0N2VM8W7"></script>
                    <script>
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date()); gtag('config', 'G-6B0N2VM8W7');
                    </script>   

                    <script> (()=>{ window.location='${_url}' })(); </script>

                </html>
            `);
        }).catch((e)=>{ response('error: movie not found') });
    
    });
}

/*-------------------------------------------------------------------------------------------------*/

module.exports = async(req,res)=>{
    
    const tmp = req.query.tmp;
    const cap = req.query.cap;
    const type = req.query.type;
    const hash = req.query.hash;

    let url = `/app/play?type=${type}&hash=${hash}`;
    if( tmp && cap ) url += `&tmp=${tmp}&cap=${cap}`;

    res.send( 200, await share( type,hash,url ) );

};

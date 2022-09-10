const script = `<script> window.top.location.href="https://arepatv.ml/login?m=T3BwcyBhbGdvIHNhbGlvIG1hbA==" </script>`;

const template = `
<!DOCTYPE html><html lang="es">
    <head>
        <!-- SEO -->
        <meta charset="utf-8">
        <meta name="robots" content="noindex,nofollow">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="ArepaTV: Reproductor de Video">
        <meta name="keywords" content="Peliculas, Series, Anime, Documentales">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
                        
        <!----->
        <link rel="canonical" href="https://arepatv.ml/app/play" />

        <!--Molly-->
        <link rel="stylesheet" href="/molly.css">
        <link rel="stylesheet" href="/css/index.css">
        <script type="text/javascript" src="/molly.js"></script>

        <!-- VideoJS --> 
        <script src="https://cdn.plyr.io/3.7.2/plyr.js"></script>
        <link rel="stylesheet" href="https://cdn.plyr.io/3.7.2/plyr.css" />

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6B0N2VM8W7"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date()); gtag('config', 'G-6B0N2VM8W7');
        </script> 

        <title> __TITLE__ </title>

    </head>

    <body class="uk-background-secondary uk-height-expand uk-light uk-flex uk-flex-center uk-flex-middle"> 
        
        <video autoplay controls
            preload="auto"
            class="player"
            crossorigin>
            __VIDEO__
        </video>

        <script>
            const player = new Plyr('video');
        </script>

        <style>
            :root{ --plyr-color-main: var(--color-primary); }
            .plyr{ width: 100vw; max-height: 100vh; }
            body { background: black !important; }
        </style>

    </body>
</html>`;

/*-------------------------------------------------------------------------------------------------*/

const molly = require('molly-js');
const fetch = require('axios');
const db = require('mongoose');
const url = require('url');

/*-------------------------------------------------------------------------------------------------*/

db.connect(process.env.MONGO); const USER = db.models.users;
function loadMovie( _url,_type ){
    return require(`${process.cwd()}/module/scraper/${_type}`)( _url );
}

function responseMovie( req,res,user ){
    return new Promise((response,reject)=>{

        const tmp = req.query.tmp;
        const cap = req.query.cap;
        const type = req.query.type;
        const hash = req.query.hash;
        const query = `?db=arepatv&table=${type}&target=${hash}`;
    
        fetch.get(`http://localhost:27017/hash${query}`)
        .then(async({data})=>{
    
            let url = new String();
    
            if( !cap && !tmp ) url = data[0].magnet;
            else url = data[0].magnet[tmp][cap]['src'];
    
            let movie = await loadMovie( url,type );    
                movie = movie.map((x,i)=>{
                    try{
                        if( i > user?.quality||0 ) return '';
                        x.size = x.label.replace(/p/i,'');
                        x.file = x.file.replace(/http.[:|\/]+/,`/cors?href=`);
                        return `<source src="${x.file}" type="video/mp4" size="${x.size}"/>`;
                    } catch(e) { console.log(e.message); return '' }
                });
    
            response(
                template.replace(/__TITLE__/gi,data[0].nombre)
                        .replace(/__VIDEO__/gi,movie.join(''))
            );
    
        }).catch(e=>{ reject( e?.message || e?.response?.data || e); console.log(e); });

    });
}

module.exports = (req,res)=>{

    const auth = req.parse.cookie?.auth;
    console.log( req.url, req.parse.ip );
    if( auth ) USER.findOne({hash:auth},(err,data)=>{

        if( err || !data || !data?.hash )
            return res.send(404,script);

        responseMovie( req,res,data )
        .then((data)=>res.send(200,data))
        .catch((e)=>{ res.send(404,e); console.log(e) })

    }); else return res.send(404,script);

}
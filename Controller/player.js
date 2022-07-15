
const scraper = require(`${process.cwd()}/scraper/main`);
const lwdb = require('lwdb');

function loadMovie( _url,_type ){
    return scraper[_type]( _url );
}

(async()=>{
    try{

        const sdb = new lwdb.createStreamDB( process.env.MODEL, process.env.PASS );
        const {data} = await sdb.findByHash( req.query.type, req.query.filter );
        const _tmp = req.query.tmp;
        const _cap = req.query.cap;
        let url = new String();
        
        if( !_cap && !_tmp ) url = data[0].magnet;
        else url = data[0].magnet[_tmp][_cap];
        
        let movie = await loadMovie( url,req.query.type );
            movie = movie.replace(/http.[:|\/]+/,`./cors?href=`);

        res.send(200,`
            <video class="uk-position-center"
                   onerror="extra.loaded(this)"
                   hash="${req.query.filter}"
                   controls="" autoplay="" 
                   id="videoPlayer"
                   preload="auto"
                   src="${movie}">
            </video>
        `);

    } catch(e) {
        console.log(e);
        res.send(404,'something went wrong');
    }
})();
const fetch = require("axios");
const url = require("url")

function loadMovie( _url,_type ){
    return new Promise((response,reject)=>{
        fetch({ method: 'POST', 
            data: JSON.stringify({
                url:_url, type:_type
            }), url: 'http://localhost:27018',
        })
        .then(({data})=>{ response(data) })
        .catch((e)=>{ reject(e) });
    });
}

module.exports = (req,res)=>{

    const tmp = req.query.tmp;
    const cap = req.query.cap;
    const type = req.query.type;
    const hash = req.query.hash;
    const query = `?db=arepatv&table=${type}&target=${hash}`;

    fetch(`http://localhost:27017/hash${query}`).then(async({data})=>{
    
        let url = new String();
    
        if( !cap && !tmp ) url = data[0].magnet;
        else url = data[0].magnet[tmp][cap]['src'];
        res.json(200, await loadMovie( url,type ));
    
    }).catch(e=>{ res.send(404,e?.message); });
    
}
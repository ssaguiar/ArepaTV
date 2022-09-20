const fetch = require("axios");
const url = require("url")

module.exports = (req,res)=>{

    const type = req.query.filter == '' ? 'list' : 'match';
    const table = req.query.type || 'peliculas';
    const search = url.format({ query:{
            table: table, db: "arepatv", 
            target: req.query.filter || '',
            length: 30, offset: req.query.offset || 0
        }, host: `http://localhost:27017/${type}`,
    })

    fetch(search).then((response)=>{
        res.json(200,response.data.map(x=>{
            return {
                nombre: x.nombre,
                imagen: x.imagen,
                target: `${table}|${x.hash}`,
            }
        }))
    }).catch((e)=>{ res.send(404,e?.message) })

}
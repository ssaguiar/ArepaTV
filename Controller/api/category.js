const fs = require("fs");

module.exports = (req,res)=>{

    const path = `${process.molly.frontend}/csv`;
    const type = req.query.type || "peliculas";
    
    let category; const types = fs.readdirSync(path).map(x=>{ 
        raw = fs.readFileSync(`${path}/${x}`); 
        category = raw.toString().split('|');
        return x.replace(/.csv$/i,'');
    }); res.json(200,{ type: types, category: category });

}
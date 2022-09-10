const { Buffer } = require('buffer');
const cp = require('child_process');
const fetch = require('axios');
const fs = require('fs');

module.exports = (req,res)=>{
    if ( req.method == 'POST' ){

        res.send(200,'done');
        fetch('http://localhost:27017/refresh?table=user&db=arepatv')
        .then(()=>{ }).catch(()=>{ });

    } else { res.send(404,'error') }
}
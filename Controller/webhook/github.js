const { Buffer } = require('buffer');
const cp = require('child_process');
const fs = require('fs');

module.exports = (req,res)=>{
    if ( req.method == 'POST' ){

        res.send(200,'done');
        cp.execSync('git pull');

    } else { res.send(404,'error') }
}
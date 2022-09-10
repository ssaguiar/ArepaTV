const cp = require('child_process');
const fs = require('fs');

function getDate(){
    const output = new Object();
    const date = new Date();

    output.path = `${date.toDateString()}`;
    output.today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    date.setDate( date.getDate() + 1 );
    output.tomrw = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    return output;
}

module.exports = (req,res)=>{
    if( req.method == 'POST' ){

        const date = getDate();res.send(200,'done'); 
        const path = `> "../logs/${date.path}.log"`;
        const today = `--since "${date.today} 00:00:00"`;
        const tomrw = `--until "${date.tomrw} 00:00:00"`;
        cp.execSync(`journalctl -u arepatv.service -b ${today} ${tomrw} ${path}`);

    } else { res.send(404,'error') }
}
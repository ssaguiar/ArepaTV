const {Buffer} = require('buffer');
const molly = require('molly-js');
const fetch = require('axios');
const db = require('mongoose');
const url = require('url');

/*-------------------------------------------------------------------------------------------------*/

const e = [
    //algo salio mal
    '/mail?m=YWxnbyBzYWxpbyBtYWwsIGludGVudGUgbeFzIHRhcmRl',
];  const signup = '?table=signup&db=arepatv';

/*-------------------------------------------------------------------------------------------------*/

module.exports = (req,res)=>{

    const hash = req.query.m;
    fetch.get(`http://localhost:27017/hash${signup}&target=${hash}`).then(({data})=>{
                
        const validator = [
            [ !data[0]?.hash, e[0] ],
            [ !data[0]?.pass, e[0] ],
            [ !data[0]?.email, e[0] ],
            [ data[0]?.hash != hash, e[0] ]
        ]; for( var i in validator ){
            if( validator[i][0] ) return res.redirect(validator[i][1]);
        }

        fetch({ method: 'POST', data: JSON.stringify(data[0]),
            url: 'http://localhost:27019/save', responseType: 'json'
        }).then(({data})=>{ res.redirect('/app');
            fetch.get(`http://localhost:27017/remove${signup}&target=${hash}`);
        }).catch((err)=>{ res.redirect(e[0]) });
        
    }).catch(err=>{ res.redirect(e[0]) });
    
}
const {Buffer} = require('buffer');
const molly = require('molly-js');
const fetch = require('axios');
const db = require('mongoose');
const url = require('url');

/*-------------------------------------------------------------------------------------------------*/

const signup = '?table=signup&db=arepatv';
db.connect(process.env.MONGO);
const USER = db.models.users;

const e = [
    //algo salio mal
    '/mail?m=YWxnbyBzYWxpbyBtYWwsIGludGVudGUgbeFzIHRhcmRl',
]; 

/*-------------------------------------------------------------------------------------------------*/

module.exports = (req,res)=>{

    const hash = req.query.m;
    fetch.get(`http://localhost:27017/hash${signup}&target=${hash}`).then(({data})=>{

        console.log( data );

        const validator = [
            [ !data[0]?.hash, e[0] ],
            [ !data[0]?.pass, e[0] ],
            [ !data[0]?.email, e[0] ],
            [ data[0]?.hash != hash, e[0] ]
        ]; for( var i in validator ){
            if( validator[i][0] ) return res.redirect(validator[i][1]);
        }
        
            const done = new USER(data[0]); done.save((err,data)=>{
                if(err) return res.redirect(e[0]); res.redirect('/app');
                fetch.get(`http://localhost:27017/remove${signup}&target=${hash}`) 
            });

    }).catch(err=>{ console.log(err); res.redirect(e[0]) });
    
}
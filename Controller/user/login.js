const { Buffer } = require('buffer');
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
    '/login?m=YWxnbyBzYWxpbyBtYWwsIGludGVudGUgbeFzIHRhcmRl',
    //usuario y contraseña
    '/login?m=dXN1YXJpbyBvIGNvbnRyYXNl8WEgaW52YWxpZGE=',
    //tiempo de prueba
    '/login?m=dGllbXBvIGRlIHVzbyBjYWR1Y2Fkbw',
];  

/*-------------------------------------------------------------------------------------------------*/

function validateUser( query ){
    return new Promise((response,reject)=>{
        USER.findOne({ hash:query.hash },(err,data)=>{

            const validator = [ //user validator
                [ err, e[0] ],
                [ !data||!data?.hash, e[1] ],
                [ query.hash!=data?.hash, e[1] ],
                [ Date.now() > data?.time, e[2] ],
            ];  for( var i in validator ){
                if( validator[i][0] ) reject(validator[i][1]);
            }   response('/app');
            
        });
    });
}

/*-------------------------------------------------------------------------------------------------*/

function validateSignUp( query,err ){
    return new Promise((response,reject)=>{
        fetch(`http://localhost:27017/hash${signup}&target=${query.hash}`)
        .then(({data})=>{
            
            const validator = [ //user validator
                [ !(data.length>0), err ],
                [ !data?.verified, `/mail?m=${query.hash}` ],
            ];  for( var i in validator ){
                if( validator[i][0] ) reject(validator[i][1]);
            }   response();
            
        }).catch(()=>{ reject(e[0]) });
    })
}

/*-------------------------------------------------------------------------------------------------*/

module.exports = (req,res)=>{

    if( req.method == 'POST' ){ const data = new Array();
        
        req.on('data',(chunk)=>{ data.push(chunk); });
        req.on('end',()=>{

            const raw = Buffer.concat(data).toString();
            const { query } = url.parse(`?${raw}`,true);

            validateUser( query ) 
            .then((e)=>{ res.redirect(e) })
            .catch((e)=>{ 
                validateSignUp( query,e )
                .then(()=>{ res.redirect(e) })
                .catch((e)=>{ res.redirect(e) })
            });

        });
    
    } else { res.redirect('/login'); }

}
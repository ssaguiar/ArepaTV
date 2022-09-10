const crypto = require('crypto-js');
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
    //Correo doble
    'ZWwgY29ycmVvIGVzdGEgYXNvY2lhZG8gYSBvdHJhIGN1ZW50YQ==',
    //algo salio mal
    'YWxnbyBzYWxpbyBtYWwsIGludGVudGUgbeFzIHRhcmRl',
    //contraseñas no coinciden
    'bGFzIGNvbnRyYXNl8WFzIG5vIGNvaW5jaWRlbg==',
    //contraseña debil
    'Y29udHJhc2XxYSBtdXkgY29ydGE'
];

/*-------------------------------------------------------------------------------------------------*/

function freeTrial(){
    const prueba = new Date();
    const dia = prueba.getDate() + 7;
    prueba.setDate( dia ); return prueba.getTime();
}

/*-------------------------------------------------------------------------------------------------*/

function saveUser( query ){
    return new Promise((response,reject)=>{

        fetch.get(`http://localhost:27017/hash${signup}&target=${query.hash}`)
        .then(({data})=>{

            const user = {
                name: `${query.firstname} ${query.lastname}`,
                quality: 0, user: 1,
                email: query.email,
                time: freeTrial(),
                pass: query.pass,
                hash: query.hash,
            };

            if( data[0]?.hash != query.hash )
                fetch({
                    url: `http://localhost:27017/push${signup}`,
                    data: JSON.stringify(user), method: 'POST'
                }).then(()=>{ response(); }).catch((err)=>{ reject(e[1]); });
            
            else
                fetch({
                    url: `http://localhost:27017/update${signup}&target=${query.hash}`,
                    data: JSON.stringify(user), method: 'POST'
                }).then(()=>{ response(); }).catch((err)=>{ reject(e[1]); });

        }).catch((err)=>{ reject(e[1]) });

    });
}

/*-------------------------------------------------------------------------------------------------*/

function validateUser( query ){
    return new Promise((response,reject)=>{
    
        let validator = [// Validador de Contraseñas
            [ !query?.pass, e[1] ],
            [ !query?.email, e[1] ],
            [ query.pass.length < 5, e[3]],
            [ query.pass != query.conf, e[2]],
        ]; for( var i in validator ){
            if( validator[i][0] ) return reject(validator[i][1]);
        }

        query.hash = crypto.SHA256( 
            query.email.toLowerCase() +
            query.pass.toLowerCase() 
        ).toString();

        USER.findOne({ email:query.email },(err,data)=>{
            
            validator = [// Validador de Usuarios
                [ err, e[1] ], [ query.email == data?.email, e[0]],
            ]; for( var i in validator ){
                if( validator[i][0] ) return reject(validator[i][1]);
            }

            //Guardar Nuevo usuario
            saveUser( query ).then(()=>{ response( query.hash );
            }).catch((err)=>{ reject(e[1]) });

        });

    });
}

/*-------------------------------------------------------------------------------------------------*/

module.exports = (req,res)=>{
    if( req.method == 'POST' ){
        
        let data = new Array();
    
        req.on('data',(chunk)=>{ data.push(chunk); });
        req.on('end',()=>{

            const raw = Buffer.concat(data);
            const { query } = url.parse(`?${raw}`,true);
            
            validateUser( query ).then((e)=>{ 
                res.redirect(`/mail?m=${e}`)
            }).catch((e)=>{ 
                res.redirect(`/signup?m=${e}`) 
            });

        });
    
    } else { res.redirect('/signup'); }
}

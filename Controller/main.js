const { Buffer } = require('buffer');
const molly = require('molly-js');
const fetch = require('axios');
const url = require('url');
const fs = require('fs');

/*-------------------------------------------------------------------------------------------------*/

const countries = `
    AG | AI | AR | AW | BB | BM | BO | 
    BR | BS | BZ | CL | CO | CR | CU | 
    DM | DO | EC | FK | GD | GS | GT | 
    GY | HN | HT | JM | KN | KY | LC | 
    MS | MX | NI | PA | PE | PR | PY | 
    SR | SV | TC | TT | UY | VC | VE | 
    VG | VI | ES | SP | 
`;

const companies = `GOOGLE|FACEBOOK|INTAGRAM|TWITTER|TELEGRAM|WHATSAPP|DISCORD`;

/*-------------------------------------------------------------------------------------------------*/

function regionValidator(req,res){
    return new Promise((response,reject)=>{
        
        const ip = req.parse?.ip||''; if( !(/unavailable/i).test(req.parse.pathname) ){
            fetch({ method: 'GET', url: `http://ip-api.com/json/${ip}` }).then(({data})=>{
                const regex_cont = new RegExp(data.countryCode,'gi'); 
                const regex_comp = new RegExp(companies,'gi'); 
                if( !regex_cont.test(countries) && !regex_comp.test(data.org) ){
                    let message = `${data.timezone}|${data.country}|${req.parse.ip}`;
                        message = Buffer.from(message).toString('base64');
                    response(res.redirect(`/unavailable?m=${message}`));
                } else reject();
            }).catch(e=>{ reject(e) });
        } else reject();
                     
    });
}

/*-------------------------------------------------------------------------------------------------*/

function userValidator(req,res){
    return new Promise((response,reject)=>{

        if( !req.parse.cookie?.auth ) { 
            if( req.headers['sec-fetch-site'] == 'none' ){
                response(res.send(404,`<script> 
                    window.top.location.href="https://arepatv.ml/login?m=T3BwcyBhbGdvIHNhbGlvIG1hbA==" 
                </script>`));
            } else {
                const message = 'YWwgcGFyZWNlciBubyBoYXMgaW5pY2lhZG8gc2VzafNu';
                response(res.redirect(`/login?m=${message}`)); 
            }
        }   reject();

    });
}

/*-------------------------------------------------------------------------------------------------*/

module.exports = (req,res,protocol)=>{
    return new Promise((response,reject)=>{
        try{

            console.log( req.url, req.parse.ip );

            regionValidator(req,res).then((e)=>{reponse(e)})
            .catch((e)=>{ 
                if(!(/app/i).test(req.parse.pathname)) 
                    return reject(e); userValidator(req,res)
                .then((e)=>{response(e)}).catch((e)=>{reject(e)})
            }); 

        } catch(e){ reject(e) }    
    }) 
}

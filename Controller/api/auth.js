const url = require("url");
const fetch = require("axios");
const {Buffer} = require("buffer");
const crypto = require("crypto-js");

function authenticateToken( hash ){
    return new Promise((response,reject)=>{

        fetch({ mathod: 'POST',
            url: 'http://localhost:27019/hash', 
            data: JSON.stringify({ hash: hash })
        }).then(({data})=>{
            response({ status:"done", payload:hash })
        }).catch((e)=>{ reject(e) })

    })  
}

function authenticateUser( user ){
    return new Promise((response,reject)=>{

        const raw = Buffer.from(user,"base64");
        const data = raw.toString().split('|');
        const hash = crypto.SHA256(
            data[0].toLowerCase() + 
            data[1].toLowerCase()
        )

        fetch({ mathod: 'POST',
            url: 'http://localhost:27019/hash', 
            data: JSON.stringify({ hash: hash })
        }).then(({data})=>{
            response({ status:"done", payload:hash })
        }).catch((e)=>{ reject(e) })

    })  
}

module.exports = async(req,res)=>{
    try {

        return res.json(200,{ status:"done", payload:"done" })

        if( req.headers['authentication-user'] ){
            auth = await authenticateUser( req.headers['authentication-user'] );
            res.json(200,auth);
        } else if( req.headers['authentication-token'] ){
            auth = await authenticateToken( req.headers['authentication-token'] );
            res.json(200,auth);
        } else {
            res.json(404,{ status:"error", payload:"algo salio mal" });
        }
        
    } catch(e) { console.log(e);
        res.json(200,{ status:"error", payload:"algo salio mal" })
    }
}
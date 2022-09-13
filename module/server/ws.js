const fetch = require('axios');
const url = require('url');

const login = '?table=users&db=arepatv';

/*-------------------------------------------------------------------------------------------------*/

function addUser(client,hash){
    fetch({ method: 'POST', data: JSON.stringify({hash:hash}),
        url: 'http://localhost:27019/hash', responseType: 'json'
    }).then(({data})=>{ const user = data;

        fetch.get(`http://localhost:27017/match${login}&target=${hash}`)
        .then(({data})=>{

            fetch({
                url: `http://localhost:27017/unshift${login}&target=${hash}`,
                method: 'POST', data: JSON.stringify(user)
            }).catch(e=>{ console.log(e.response.data) }).then(()=>{
                let validator = [
                    [ user?.hash != hash, 'client.send("close")' ],
                    [ user?.user <= data.length, 'client.send("user")' ],
                ].some(x=>{ if(x[0]) eval(x[1]); return x[0] }); 
                if( validator ) return 0;
            });

        }).catch(e=>{ console.log(e.response.data) });

    }).catch((err)=>{ client.send("close") });
}

function delUser(client,hash){
    fetch.get(`http://localhost:27017/remove${login}&target=${hash}`)
    .catch(e=>{ console.log(e.response.data) });
}

/*-------------------------------------------------------------------------------------------------*/

module.exports = (client)=>{

    client.on('message',(msg)=>{
        client.hash = JSON.parse(msg).target;
        addUser(client,client.hash);
    });

    client.on('close',()=>{ 
        delUser(client,client.hash) 
    });
    
    client.on('error',()=>{
        delUser(client,client.hash) 
    });

}
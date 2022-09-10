
const e = [
//  algo salio mal
    '/login?m=T3BzcyBhbGdvIHNhbGlvIG1hbCwgaW50ZW50YSBt4XMgdGFyZGU=',
//  muchos usuarios 
    '/login?m=aGF5IG11Y2hvIHVzdWFyaW9zIHVzYW5kbyBzdSBjdWVudGE='
]

/*
addEvent( window,'load',async()=>{

    try{

        const ws = new WebSocket('wss///°req.parse.hostname°//ws');
        const { value } = await cookieStore.get('auth');
        
        ws.onopen = ()=>{
            ws.send(JSON.stringify({
                payload: 'connect',
                target: value,
            }));
        };
        
        ws.onmessage = (msg)=>{
            switch(msg.data){
                case 'close': window.location = e[0]; break;
                case 'user': window.location = e[1]; break;
                default: break; 
            }
        }

    } catch(err) { console.log(e); } //window.location = e[0];

});
*/
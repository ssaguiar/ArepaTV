
const lwdb = require('lwdb');

(async()=>{
    try{

        const sdb = new lwdb.createStreamDB( process.env.MODEL, process.env.PASS );

        const args = [
            req.query.type,
            req.query.filter
        ];

        const {data} = await sdb.match( ...args );

        res.send(200,data.map((x)=>{
            return `<option value="${x.nombre}" />`;
        }).join('\n'));

    } catch(e) {
        console.log(e);
        res.send(404,'something went wrong');
    }
})();
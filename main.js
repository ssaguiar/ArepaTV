#!/bin/node

require('dotenv').config();
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

const db = new worker.Worker('./module/server/db',{ env: worker.SHARE_ENV });
db.on('message',()=>{
    const http = new worker.Worker('./module/server/http',{ env: worker.SHARE_ENV });
    http.on('message',()=>{
        const tm = new worker.Worker('./module/server/logs',{ env: worker.SHARE_ENV });
        const cors = new worker.Worker('./module/server/cors',{ env: worker.SHARE_ENV });
    });
});

/*-------------------------------------------------------------------------------------------------*/
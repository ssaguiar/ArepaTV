#!/bin/node

require('dotenv').config();
const worker = require('worker_threads');

/*-------------------------------------------------------------------------------------------------*/

const db = new worker.Worker('./module/server/db',{ env: worker.SHARE_ENV });
const user = new worker.Worker('./module/server/user',{ env: worker.SHARE_ENV });
const cors = new worker.Worker('./module/server/cors',{ env: worker.SHARE_ENV });
db.on('message',()=>{
    const tm = new worker.Worker('./module/server/logs',{ env: worker.SHARE_ENV });
    const http = new worker.Worker('./module/server/http',{ env: worker.SHARE_ENV });
    const scrp = new worker.Worker('./module/server/scraper',{ env: worker.SHARE_ENV });
});

/*-------------------------------------------------------------------------------------------------*/
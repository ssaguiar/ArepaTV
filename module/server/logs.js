const fetch = require('axios');
let interval, event, timeout;

event = function(){
    timeout = 2000;
    fetch({ method: 'POST',
        url: 'http://localhost:3000/webhook/logs',
    }).then(()=>{ return main(event);
    }).catch(e=>{ return main(event); }); 
}

function calculateInterval(){
    
    const today = new Date();
    const tomrw = new Date();

    tomrw.setDate( tomrw.getDate() + 1 );
    tomrw.setHours(0); tomrw.setSeconds(0);
    tomrw.setMinutes(0); tomrw.setMilliseconds(0);

    timeout = tomrw.getTime() - today.getTime();

}

function main( callback ){
    calculateInterval();
    clearTimeout( interval );
    interval = setTimeout(callback,timeout);
};  main( event );

function stepOne( ev ){

    ev.preventDefault();
    const object = new Object();

    $$('input[name]').map(x=>{ 
        object[x.getAttribute('name')] = x.value;
    });

    object.hash = device.crypto.SHA256(
        object.email.toLowerCase() + 
        object.pass.toLowerCase() 
    ).toString();

    $('input[name=hash]').value = object.hash; 
    window.cookieStore.set('auth',object.hash);

    ev.target.submit();

}

addEvent(window,'load',()=>{ 

    if( query.get('m') ){
        $('[alert]').innerHTML = `
            <div class="uk-alert-danger" uk-alert>
                <a class="uk-alert-close" uk-close></a>
                <p>${atob(query.get('m'))}</p>
            </div>
        `; window.cookieStore.delete('auth');
    } else {
        const user = window.cookieStore.get('auth')
        .then((data)=>{ if( data )  
            window.location.href = '/app';
        }).catch((e)=>{ console.log(e) })
    }

});

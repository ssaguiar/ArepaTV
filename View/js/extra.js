
loading = require('./loading');
const extra = new Object();

//TODO Load More Core Base
async function loadList( _type,_length,_offset ){
    query.set('offset',_offset);
    query.set('length',_length);

    const url = `./movies?${query.toString()}`;
    const data = await ajax.get(url); 
    return await data.text();
}

//TODO Load More Core Base
async function loadData( _type,_hash ){
    const query = new URLSearchParams();
    query.set('filter',_hash);
    query.set('type',_type);

    const url = `./hash?${query.toString()}`;
    const data = await ajax.get(url); 
    return await data.text();
}

//TODO: load Movies
async function loadMovie( _type,_hash,_tmp,_cap ){
    const query = new URLSearchParams();
    query.set('filter',_hash);
    query.set('type',_type);

    if( _tmp && _cap ){
        query.set('cap',_cap);
        query.set('tmp',_tmp);
    }

    const url = `./player?${query.toString()}`;
    const data =  await ajax.get(url); 
    return await data.text();

}

//TODO: Load Categories
extra.loadCategory = async()=>{
	const res = await ajax.get('./json/category.json');
    const type = query.get('type');
    const data = await res.json();

    $('#category').innerHTML = data[type].map((x)=>{
        return `<li class="uk-link-reset">
			<a href="?type=${type}&filter=${x}">${x}</a>
    	</li>`;
    }).join('');
}

//TODO: Load More Movies
extra.loadMore = async()=>{
    
    if( window['_loadingMovies_'] ) return undefined;
    window['_loadingMovies_'] = true;

    if( !query.get('type') ) query.set('type','peliculas');
    
    const args = [ query.get('type'),100,$$('#poster').length ];    
    const data = await loadList( ...args );

    $('#movie_list').innerHTML += data;
    window['_loadingMovies_'] = false;
    setTimeout( window.render,100 );
}

extra.event = ()=>{

    addEvent($('#movie_list'),'scroll',()=>{
        const B = Math.abs( $('#movie_list').scrollHeight * 0.15 - $('#movie_list').scrollHeight );
        const A = Math.abs( $('#movie_list').scrollHeight * 0.15 + $('#movie_list').scrollTop );
        if( A>B ) extra.loadMore();
    //  console.log( A,B,A>B );
    });

    addEvent($('.uk-search-input'),'keydown',async (ev)=>{
        
        if( window['_suggesting_'] ) return undefined;
        window['_suggesting_'] = true;

        const type = query.get('type');
        const parm = new URLSearchParams();
        const data = $('.uk-search-input').value;

        parm.set('type',type);
        parm.set('filter',data);

        const res = await ajax.get(`./suggest?${parm.toString()}`);
        $('#suggest-list').innerHTML = await res.text();

        window['_suggesting_'] = false;
    });

    addEvent($('.uk-search-input'),'change',()=>{

        const type = query.get('type');
        const parm = new URLSearchParams();
        const data = $('.uk-search-input').value;

        parm.set('type',type);
        parm.set('filter',data);

        if( data=='nfsw' ) 
            return window.location = '/?type=porno';
        return window.location.search = parm.toString();
    });

}

//TODO Play Movie
extra.show = async( _el )=>{

    const type = query.get('type');
    const hash = _el.getAttribute('hash');
    UIkit.offcanvas($('movcanvas')).show();
    $('#movieInfo').innerHTML = loading.movieInfo();

    const data = await loadData( type,hash );
    $('#movieInfo').innerHTML = data;
}

//TODO: MEdia Player
extra.play = async( _el )=>{

    UIkit.modal($('modal')).show();
    const type = query.get('type');
    const _cap = _el.getAttribute('c');
    const _tmp = _el.getAttribute('t');
    const hash = _el.getAttribute('hash');
    $('#moviePlayer').innerHTML = loading.moviePlayer();

    const data = await loadMovie( type,hash,_tmp,_cap );
    $('#moviePlayer').innerHTML = data;
    
} 

//TODO: Player Loaded
extra.loaded = async( _el )=>{
    device.hls.play( _el,_el.src );
}

//TODO: Remove Player
extra.removePlayer = async( _el )=>{
    $('#moviePlayer').innerHTML = '';
}

window.extra = extra;
module.exports = extra;
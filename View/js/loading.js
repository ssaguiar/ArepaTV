
const loading = new Object();
const color = {
    'peliculas': '#5271FF',
    'series': '#7ED957',
    'anime': '#FFDE59',
    'porno': '#FF1616'
}

loading.moviePlayer = ()=>{
    return `
        <div uk-spinner="ratio: 3" class="uk-position-center"></div>
    `;
}

loading.movieInfo = ()=>{
    return `
        <button class="uk-offcanvas-close" type="button" uk-close></button>
        <div uk-spinner="ratio: 3" class="uk-position-center"></div>
    `;
}

loading.nameLogo = ()=>{
    const type = query.get('type');
    $('#logo').setAttribute('href',`?type=${type}`); 
    $('#logo').innerHTML = `
        <strong> only </strong>
        <strong style="color:${color[type]}"> 
            ${type} 
        </strong> 
    `;
}

window.loading = loading;
module.exports = loading;
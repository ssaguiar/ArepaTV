
loading = require('./loading');
extra = require('./extra');

device.onload( async()=>{
    extra.loadCategory();
    extra.loadMore();
    extra.event();

    loading.nameLogo();
});
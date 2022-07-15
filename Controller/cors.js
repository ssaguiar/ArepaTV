
const axios = require('axios');
const type = req.query.type ? req.query.type : 'https';

res.sendFile({
    method: req.method,
    url: `${type}://${req.query.href}`,
});

const proxy = require('proxy');

module.exports = function(app){
    app.use(
        proxy('/api/auth/login', {
        target: 'https://metaverse.aidoc.io',
        changeOrigin: true
    }));
}
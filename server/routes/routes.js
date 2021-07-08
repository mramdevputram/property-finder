const service = {}

service.routes = routes

module.exports = service

function routes(app){
    app.use('/', require('../controllers/property.controller'))
}
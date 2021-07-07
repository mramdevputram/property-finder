const service = {}

service.routes = routes

module.exports = service

function routes(app){
    console.log("ROUTES - - -",app)
    app.use('/', require('../controllers/property.controller'))
}
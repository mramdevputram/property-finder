const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const helmet = require('helmet');
/* For making Images & Thumbnais Acceble Directly From Property_Image Folder*/
app.use(express.static('property_Image/'));
app.use(helmet());
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors());
app.set('views', path.join(process.env.PWD, 'views'));
app.set('view engine', 'html');

require('./routes/routes').routes(app)



const config = require('./config');
const cons = require('consolidate');
const mysql = require('mysql2/promise');


initialize()


/* Init DB is not Exists */
async function initialize(){
    try{
        const connection = await mysql.createConnection({ host:config.conn.host,port: config.conn.port, user:config.dbUser, password:config.dbPass });
        let conn = await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.dbName}\`;`);
        console.log("conn",conn)
    }catch(e){
        console.log("DB Connection Err:",e)
    }
}



const httpServer = http.createServer(app);
const server = httpServer.listen(8011, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});


// process.on('uncaughtException', function(err) {
//   console.log('Caught exception: ' + err);
//   logger.log('error', err, 'my string');
// });



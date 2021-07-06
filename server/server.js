const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose')
const app = express();
const helmet = require('helmet');
/* For making Images & Thumbnais Acceble Directly From Property_Image Folder*/
app.use(express.static('property_Image/'));
app.use(helmet());
const cors = require('cors');
const Sharp = require('sharp');
const fs = require('fs');
const fse = require('fs-extra');
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors());
app.set('views', path.join(process.env.PWD, 'views'));
app.set('view engine', 'html');
const router = express.Router();
const MONGO_DB_URL = `mongodb://localhost:27017/Property`;
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const propertySchema = require('./models/Property-Schema')
const config = require('./config');
const cons = require('consolidate');
const mysql = require('mysql2/promise');


/* 
   Get,Save,Update Properties
   auther: @Matang 
*/
router.route('/properties')
    .get([], getProperties)
    .post([], saveProperties)
    .put([], updateProperties)

app.use(router)



/* 
   Get Properties With/Without Filter
   auther: @Matang 
*/
async function getProperties(req, res) {
    // let db = await mongoose.createConnection(MONGO_DB_URL)
    const connection = await mysql.createConnection({ host:config.conn.host,port: config.conn.port, user:config.dbUser, password:config.dbPass });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.dbName}\`;`);

    const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, config.conn);
    const propertyTable = sequelize.define('Properties', propertySchema);
    await propertyTable.sync({ alter: true })
    try {
        await sequelize.authenticate();
        // let propertiesData =  await propertyTable.findAll();
        
        
        let searchTxt = req.query.search
        // let properties = db.collection('Properties')
        // properties.createIndex({ area: "text" })
        
        let priceAray = req.query.priceRange && req.query.priceRange !== '' && req.query.priceRange !== 'None' ? req.query.priceRange.split(',') : []
        let min = priceAray && priceAray.length ? parseFloat(priceAray[0]) : ''
        let max = priceAray && priceAray.length ? parseFloat(priceAray[1]) : ''
        let findSqlQry = {where: {},order: [['createdAt', 'DESC']]}
        let findQuery = searchTxt && searchTxt !== '' ? { $text: { $search: searchTxt } } : {}
        if(searchTxt && searchTxt !== ''){
            findSqlQry['where']['area'] ={ [Op.substring]: searchTxt}
        }
        if (min !== '' && max !== '') {
            findQuery['price'] = { $gte: min, $lte: max }
            findSqlQry['where']['price'] = {
                    [Op.gte]: min,
                    [Op.lte]: max
                  }
        }
        
        let propertiesData =  await propertyTable.findAll(findSqlQry);
        let propertyList = propertiesData ?  JSON.parse(JSON.stringify(propertiesData, null, 2)) : [];
        // let pArray = await properties.find(findQuery).sort({ createdAt: -1 }).toArray()
        // let recentList = await properties.find().sort({ lastviewedAt: -1 }).limit(6).toArray()

        let recentList =  await propertyTable.findAll({where: {},order: [['lastviewedAt', 'DESC']]});


        const apiResponse = {
            "code": 200,
            "message": 'success',
            "data": { propertyList, recentList}
        }
        res.json(apiResponse).end();
    } catch (e) {
        console.log("Get Properties Err: -", e)
        const apiResponse = {
            "code": 501,
            "message": e,
            "data": null
        }
        res.json(apiResponse).end();
    } finally {
        db.close()
    }

}

/* 
   Save Properties
   auther: @Matang 
*/
async function saveProperties(req, res) {
    // let db = await mongoose.createConnection(MONGO_DB_URL)
    const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, config.conn);
    const propertyTable = sequelize.define('Properties', propertySchema);
    await propertyTable.sync({})
    try {

        // let properties = db.collection('Properties')
        let addObj = req.body
        
        addObj['price'] = parseFloat(addObj['price'])
        addObj['createdAt'] = new Date()
        addObj['viewCount'] = 0
        if (addObj['imgs'].length) {
            let { thumbNails, images } = await uploadImages(addObj['imgs'], addObj.name)
            addObj['imgs'] = images
            addObj['thumbNails'] = thumbNails
        }
       
        let saveSql = {...addObj}
       
        /* Add Data In SQL  */
        let addToSql = await propertyTable.create(saveSql);
        
        // let saveObj = await properties.insert(addObj)
        const apiResponse = {"code": 200,"message": 'success',"data": null}
        res.json(apiResponse).end();
    } catch (e) {
        console.log("Save Properties Err: -", e)
        const apiResponse = {
            "code": 501,
            "message": e,
            "data": null
        }
        res.json(apiResponse).end();
    } finally {
        // db.close()
    }
}

/* 
   Upload Images & Thumbnails oF Properties
   auther: @Matang 
*/
async function uploadImages(files, propertyName) {
    try {
        let images = []
        let thumbNails = []
        for (let file of files) {
            let imgDir = `./property_Image/${propertyName}`
            let extension = file.split(';')[0].split('/')[1];
            let fileName = "property_" + new Date().getTime() + '.' + extension;
            let thumbFileName = "property_thumb" + new Date().getTime() + '.' + extension;
            let storePath = imgDir + '/' + fileName;
            let thumbStorePath = imgDir + '/' + thumbFileName;
            let base64Data = file.replace(/^data:image\/\w+;base64,/, "");
            let buf = new Buffer(base64Data, 'base64');


            const options = {
                'quality': 50,
                'chromaSubsampling': '4:4:4',
                'progressive': true,
                'force': true
            };
            /* Thumbnail */
            let buffCompressedData = await Sharp(buf).resize({ height: 50 }).jpeg({ 'quality': 100 }).toFormat(extension).toBuffer()


            await fse.ensureDir(imgDir)
            await fs.writeFileSync(storePath, buf, 'utf8', function (err) {
                if (err) {
                    throw err
                }
            });
            await fs.writeFileSync(thumbStorePath, buf, 'utf8', function (err) {
                if (err) {
                    throw err
                }
            });
            let dbThumbImagPath = thumbStorePath.replace('./property_Image/', '')
            let dbImagPath = storePath.replace('./property_Image/', '')
            images.push(dbImagPath)
            thumbNails.push(dbThumbImagPath)
        }
        return { images, thumbNails }

    } catch (e) {
        throw e.toString()
    } finally {

    }
}

/* 
   Update Properties
   auther: @Matang 
*/
async function updateProperties(req, res) {
    // let db = await mongoose.createConnection(MONGO_DB_URL)
    const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, config.conn);
    const propertyTable = sequelize.define('Properties', propertySchema);
    await propertyTable.sync({})
    try {
        // let properties = db.collection('Properties')
        let propertyId = req.body.id
        let updateQuery = req.body.for == 'Favorite' ? { $set: { isFavorite: req.body.isFavorite, 'updatedAt': new Date() } } : { $set: { 'lastviewedAt': new Date() }, $inc: { viewCount: 1 } }
        
        let updateSqlQuery = req.body.for == 'Favorite' ? { isFavorite: req.body.isFavorite, 'updatedAt': new Date() }  : { 'lastviewedAt': new Date(),viewCount: Sequelize.literal('viewCount + 1')  }

        // let updaeObj = await properties.update({ isFavorite: req.body.isFavorite }, updateQuery)
        let updateProperty = await propertyTable.update(updateSqlQuery, {where: {id: propertyId}});
        const apiResponse = {"code": 200,"message": 'success',"data": null}
        res.json(apiResponse).end();
    } catch (e) {
        console.log("Update Properties Err: -", e)
        const apiResponse = {
            "code": 501,
            "message": e,
            "data": null
        }
        res.json(apiResponse).end();
    } finally {
        // db.close()
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



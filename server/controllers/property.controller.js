const express = require('express');
const router = express.Router();
const propertyService = require('../services/property.service')
const Sharp = require('sharp');
const fs = require('fs');
const fse = require('fs-extra');
const {validate} = require('../validate')
const { check, oneOf, validationResult } = require('express-validator');


router.route('/properties')
    .get([], getProperties)
    .post([], saveProperties)
    .put([], updateProperties)


module.exports = router
/* 
   Get Properties With/Without Filter
   auther: @Matang 
*/
async function getProperties(req, res) {
    try {
        let document = {
            ...req.query
        }
        console.log("document: ",document)

        let getData = await propertyService.retriveProperties(document)
        const apiResponse = {"code": 200,"message": 'success',"data": getData}
        res.json(apiResponse).end();
    } catch (e) {
        console.log("Get Properties Err: -", e)
        const apiResponse = {"code": 501,"message": e,"data": null}
        res.json(apiResponse).end();
    }
}

/* 
   Save Properties
   auther: @Matang 
*/
async function saveProperties(req, res) {
    try {
        let document = {
            ...req.body
        }
        
        document['price'] = parseFloat(document['price'])
        document['viewCount'] = 0
        if (document['imgs'].length) {
            let { thumbNails, images } = await uploadImages(document['imgs'], document.name)
            document['imgs'] = images
            document['thumbNails'] = thumbNails
        }
        
        let validation = validate(req,res,document)
        if(!validation.success) return res.json(validation).end();

        let saveDataMessage = await propertyService.saveProperty(document)
        
        /* Temporary Response as its Practical other wise can be do from Comman Service Only */
        const apiResponse = {"code": 200,"message": saveDataMessage,"data": null}
        res.json(apiResponse).end();
    } catch (e) {
        console.log("Save Properties Err: -", e)
        const apiResponse = {"code": 500,"message": e,"data": null}
        res.json(apiResponse).end();
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
    try {
        let document = {
            ...req.body
        }
        let validation = validate(req,res,document)
        if(!validation.success) return res.json(validation).end();
        
        let updateDataMessage = await propertyService.updateProperties(document)

        /* Temporary Response as its Practical other wise can be do from Comman Service Only */
        const apiResponse = {"code": 200,"message": updateDataMessage,"data": null}
        res.json(apiResponse).end();
    } catch (e) {
        console.log("Update Properties Err: -", e)
        const apiResponse = {"code": 500,"message": e,"data": null}
        res.json(apiResponse).end();
    }
}

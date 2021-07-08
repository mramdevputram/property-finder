const express = require('express');
const router = express.Router();
const propertyService = require('../services/property.service')
const commanService = require('../services/comman.service')
const {validate} = require('../validate')
let apiResponseService = require('../api-response');

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
        let getData = await propertyService.retriveProperties(document)
        
        const apiResponse = apiResponseService.setSuccessResponse(200,'success',getData)
        res.json(apiResponse).end();
    } catch (e) {
        console.log("Get Properties Err: -", e)
        const apiFailResponse = apiResponseService.setSystemFailureResponse(e.toString())
        res.json(apiFailResponse).end();
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
        let validation = validate(req,res,document)

        document['viewCount'] = 0
        if (document['imgs'].length) {
            let { thumbNails, images } = await commanService.uploadImages(document['imgs'], document.name)
            document['imgs'] = images
            document['thumbNails'] = thumbNails
        }
        
        if(!validation.success) return res.json(validation).end();
        let saveDataMessage = await propertyService.saveProperty(document)
        
        const apiResponse = apiResponseService.setSuccessResponse(200,saveDataMessage,null)
        res.json(apiResponse).end();
    } catch (e) {
        console.log("Save Properties Err: -", e)
        const apiFailResponse = apiResponseService.setSystemFailureResponse(e.toString())
        res.json(apiFailResponse).end();
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

        const apiResponse = apiResponseService.setSuccessResponse(200,updateDataMessage,null)
        res.json(apiResponse).end();
    } catch (e) {
        console.log("Update Properties Err: -", e)
        const apiFailResponse = apiResponseService.setSystemFailureResponse(e.toString())
        res.json(apiFailResponse).end();
    }
}

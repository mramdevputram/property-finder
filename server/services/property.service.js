const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const propertyTable = require('../models/Property-Schema');
const config = require('../config');
const cons = require('consolidate');
const mysql = require('mysql2/promise');



const service = {
    retriveProperties,
    saveProperty,
    updateProperties
}

module.exports = service;

async function retriveProperties(retObj) {
    const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, config.conn);
    try{
        let latestTable = await propertyTable.sync({ alter: true })
        let isConnected = await sequelize.authenticate(); 
        let {search: searchTxt} = retObj
        let offset = retObj.offset ?  Number(retObj.offset) : 0
        
        let priceAray = retObj.priceRange && retObj.priceRange !== '' && retObj.priceRange !== 'None' ? retObj.priceRange.split(',') : []
        let min = priceAray && priceAray.length ? parseFloat(priceAray[0]) : ''
        let max = priceAray && priceAray.length ? parseFloat(priceAray[1]) : ''
        let findSqlQry = {limit: 4,offset: offset, where: {},order: [['createdAt', 'DESC']]}
        
        if(searchTxt && searchTxt !== ''){
            findSqlQry['where']['area'] ={ [Op.substring]: searchTxt}
        }
        if (min !== '' && max !== '') {
            findSqlQry['where']['price'] = {
                    [Op.gte]: min,
                    [Op.lte]: max
                  }
        }
        const count = await propertyTable.count({});

        let propertiesData =  await propertyTable.findAll(findSqlQry);
        let propertyList = propertiesData ?  JSON.parse(JSON.stringify(propertiesData, null, 2)) : [];

        let recentList =  await propertyTable.findAll({where: {},order: [['lastviewedAt', 'DESC']]});
        return { propertyList, recentList, count}
    }catch(e){
        throw `Retrive Properties Error: ${e.toString()}`
    }
}

async function saveProperty(saveObj) {
    const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, config.conn);
    await propertyTable.sync({})
    try{
        let isConnected = await sequelize.authenticate();
        /* Add Data In SQL  */
        let addToSql = await propertyTable.create(saveObj);
        console.log("saveObj: : ",saveObj)
        return "Success"
    }catch(e){
        throw `Save Property Error: ${e.toString()}`
    }
}

async function updateProperties(updateObj) {
    const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, config.conn);
    await propertyTable.sync({})
    try {
        let isConnected = await sequelize.authenticate();
        let propertyId = updateObj.id
        let updateQuery = updateObj.for == 'Favorite' ? { $set: { isFavorite: updateObj.isFavorite, 'updatedAt': new Date() } } : { $set: { 'lastviewedAt': new Date() }, $inc: { viewCount: 1 } }
        
        let updateSqlQuery = updateObj.for == 'Favorite' ? { isFavorite: updateObj.isFavorite, 'updatedAt': new Date() }  : { 'lastviewedAt': new Date(),viewCount: Sequelize.literal('viewCount + 1')  }

        let updateProperty = await propertyTable.update(updateSqlQuery, {where: {id: propertyId}});
        return "Success"
    }catch(e){
        throw `Update Property Error: ${e.toString()}`
    }
}





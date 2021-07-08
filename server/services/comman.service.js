const Sharp = require('sharp');
const fs = require('fs');
const fse = require('fs-extra');

const service = {
    uploadImages
}

module.exports = service

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
    } 
}
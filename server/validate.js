let util = require('util');
let apiResponse = require('./api-response');

let commonFunction = {};
commonFunction.validate = validate;

module.exports = commonFunction;

function validate(req, res, required){  
    for(let key in required){       
        if(key == 'email'){
            let isEmpty = req.check(key, key+' must not be empty').notEmpty();
            // console.log("isEmpty",isEmpty.validationErrors[0]);
            if(!isEmpty.validationErrors[0]){
                req.assert('email', ' Valid email required').isEmail();
            }
        }
        else {
            req.check(key, key+' must not be empty').notEmpty();
        }
    }
      let errors = req.validationErrors();
      if (errors) {
        let errorResponse = apiResponse.setFailureResponse(util.inspect(errors));
        return errorResponse;
      }
      else{
        let successResponse = {
            "success":true
        };
        return successResponse;
      }
}   
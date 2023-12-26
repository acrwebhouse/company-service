const config = require('../setting/config').config;
const httpRequest = require('../utils/httpRequest');
const utilsValue = require('../utils/value');

function removeAccessTokensByUserId(userId,callback) {
    if (utilsValue.isValid(userId)){
        const url = config['auth-basic-server'].location+'/'+config['auth-basic-server'].restApi.removeAccessTokensByUserId;
        const method = 'DELETE';
        const headers = {};
        const json = {
            userId:userId
        }
        httpRequest.sendJsonRequest(url, headers, json, method, (error, body) => {
            if (error) {
              console.log('===removeAccessTokensByUserId==error=')
              console.log(error)
              console.log('===removeAccessTokensByUserId==body=')
              console.log(body)
              callback(false,body);
            } else {
                if(body.status == true){
                callback(true,'remove access tokens');
              }else{
                callback(false,'no match user id');
              }
            }
          });
    }else if(Array.isArray(ids)&&ids.length == 0){
        callback(true, 'ids is 0')
    }else {
        callback(false, 'id invalid')
    }
}


exports.removeAccessTokensByUserId = removeAccessTokensByUserId
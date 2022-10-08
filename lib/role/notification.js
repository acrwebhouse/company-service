const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');

const notificationDoc = {
    token : '',
    userId : '',
    type : 0
}

function newNotificationDoc(){
    const doc = JSON.parse(JSON.stringify(notificationDoc))
    return doc;
}

function addNotification(token,userId,type,callback) {
    const url = config['notification-basic-server'].location+'/'+config['notification-basic-server'].restApi.addNotification;
    const method = 'POST';
    const headers = {};
    const doc = newNotificationDoc();
    if(utilsValue.isValid(token)){
        doc.token = token
    }

    if(utilsValue.isValid(userId)){
        doc.userId = userId
    }

    if(utilsValue.isValid(type)){
        doc.type = type
    }

    httpRequest.sendJsonRequest(url, headers, doc, method, (error, body) => {
        if (error) {
          callback(false,body);
        } else {
          callback(body.status,body.data);
        }
      });
    
}

function editNotification(id,token,userId,type,callback) {
    const doc = newNotificationDoc();
    if (utilsValue.isValid(id)){
        doc.id = id
    }
    if (utilsValue.isValid(token)){
        doc.token = token
    }
    if (utilsValue.isValid(userId)){
        doc.userId = userId
    }
    if (utilsValue.isValid(type)){
        doc.type = type
    }

    const url = config['notification-basic-server'].location+'/'+config['notification-basic-server'].restApi.editNotification;
    const method = 'PUT';
    const headers = {};

    httpRequest.sendJsonRequest(url, headers, doc, method, (error, body) => {
        if (error) {
            callback(false,body);
        } else {
            if(body.data.nModified > 0){
                const result = body.data.updateData
                callback(true,result);
            }else{
                callback(false,'no match id');
            }
        }
    });
}

exports.addNotification = addNotification
exports.editNotification = editNotification

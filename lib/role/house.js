const config = require('../setting/config').config;
const httpRequest = require('../utils/httpRequest');

function transferExEmployeeCompanyHouse(userId,companyId,newOwnerId,callback) {
    const employee = {
        'searchDoc': {
          'owner': userId,
          'belongType': 2,
          'belongId': companyId
        },
        'updateData': {
          'owner': newOwnerId
        }
      }
    const url = config['house-basic-server'].location+'/'+config['house-basic-server'].restApi.editHousesNoCheckUniqueAddress;
    const method = 'PUT';
    const headers = {};
    httpRequest.sendJsonRequest(url, headers, employee, method, (error, body) => {
        if (error) {
            console.log('===transferExEmployeeCompanyHouse==error=')
            console.log(error)
            console.log('===transferExEmployeeCompanyHouse==body=')
            console.log(body)
            callback(false,body);
        } else {
            if (body.data.ok > 0){
                callback(true,body.data.updateData);
            }else{
                callback(false,body.data);
            }
        }
    });
}

function getTeamUploadHouseCounts(managerId,companyId,minCreateTime,maxCreateTime,callback) {
    callback(true,'tmp')
}

exports.transferExEmployeeCompanyHouse = transferExEmployeeCompanyHouse
exports.getTeamUploadHouseCounts = getTeamUploadHouseCounts
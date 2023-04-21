exports.on = function(app) {
    const preRestApi = '/house';
    const employees = require('../role/employees');
    const middleware = require('./middleware').middleware;
    const utilsValue = require('../utils/value');
    const house = require('../role/house');

    app.get(preRestApi + '/getTeamUploadHouseCounts',[middleware.tokenAuth,middleware.checkIsEmployee], function(req, res) {
        /* 
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        */
        const companyId = req.query.companyId
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const managerId = decodeToken.id
        const minCreateTime = req.query.minCreateTime;
        const maxCreateTime = req.query.maxCreateTime;

        const response = {
            'status':true,
            'data':'no imp'
        }
    
        house.getTeamUploadHouseCounts(managerId,companyId,minCreateTime,maxCreateTime,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        }) 
    });

    app.get(preRestApi + '/getTeamHouses',[middleware.tokenAuth,middleware.checkIsEmployee], function(req, res) {
        /* 
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        */
        const companyId = req.query.companyId
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const managerId = decodeToken.id

        const response = {
            'status':true,
            'data':'no imp'
        }

        res.send(response)
    });
}
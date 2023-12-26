exports.on = function(app) {
    const preRestApi = '/house';
    const middleware = require('./middleware').middleware;
    const utilsValue = require('../utils/value');
    const house = require('../role/house');

    app.get(preRestApi + '/getTeamUploadHouseCounts',[middleware.checkIsEmployee], function(req, res) {
        /* 
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        */
        const companyId = req.query.companyId
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const managerId = decodeToken.id
        const minPrice1 = req.query.minPrice1
        const minPrice2 = req.query.minPrice2
        const minPrice3 = req.query.minPrice3
        const minPrice4 = req.query.minPrice4
        const minPrice5 = req.query.minPrice5
        const maxPrice1 = req.query.maxPrice1
        const maxPrice2 = req.query.maxPrice2
        const maxPrice3 = req.query.maxPrice3
        const maxPrice4 = req.query.maxPrice4
        const maxPrice5 = req.query.maxPrice5
        const priceRange = []
        const minCreateTime = req.query.minCreateTime;
        const maxCreateTime = req.query.maxCreateTime;
        const response = {
            'status':true,
            'data':''
        }

        if(utilsValue.isValid(minPrice1) && utilsValue.isValid(maxPrice1)){
            priceRange.push(
                {
                    min:minPrice1*1,
                    max:maxPrice1*1
                }
            )
        }

        if(utilsValue.isValid(minPrice2) && utilsValue.isValid(maxPrice2)){
            priceRange.push(
                {
                    min:minPrice2*1,
                    max:maxPrice2*1
                }
            )
        }

        if(utilsValue.isValid(minPrice3) && utilsValue.isValid(maxPrice3)){
            priceRange.push(
                {
                    min:minPrice3*1,
                    max:maxPrice3*1
                }
            )
        }

        if(utilsValue.isValid(minPrice4) && utilsValue.isValid(maxPrice4)){
            priceRange.push(
                {
                    min:minPrice4*1,
                    max:maxPrice4*1
                }
            )
        }

        if(utilsValue.isValid(minPrice5) && utilsValue.isValid(maxPrice5)){
            priceRange.push(
                {
                    min:minPrice5*1,
                    max:maxPrice5*1
                }
            )
        }

        house.getTeamUploadHouseCounts(managerId,companyId,priceRange,minCreateTime,maxCreateTime,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        }) 
    });

    app.get(preRestApi + '/getTeamHouses',[middleware.checkIsEmployee], function(req, res) {
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
            'data':''
        }

        house.getTeamHouses(managerId,companyId,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        }) 
    });
}
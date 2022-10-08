exports.on = function(app) {
    const preRestApi = '/user';
    const user = require('../role/user');
    const middleware = require('./middleware').middleware;
    const utilsValue = require('../utils/value');
    
    app.get(preRestApi + '/getPersonalInfo',[middleware.tokenAuth], function(req, res) {
        /* #swagger.security = [{
               "apiKeyAuth": []
        }] */

        const response = {
            'status':true,
            'data':''
        }
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const id = decodeToken.id
        user.getPersonalInfo(id,(result,data)=>{
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.get(preRestApi + '/getUserList',[middleware.tokenAuth,middleware.checkIsAdmin], function(req, res) {
        /* #swagger.security = [{
               "apiKeyAuth": []
        }] */

        const start = req.query.start
        const count = req.query.count
        const timeSort = req.query.timeSort
        const roles = req.query.roles
        const name = req.query.name
        const salesCity = req.query.salesCity
        const salesArea = req.query.salesArea
        const response = {
            'status':true,
            'data':''
        }
        user.getUsers(start,count,timeSort,roles,name,salesCity,salesArea,(result,data)=>{
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.put(preRestApi + '/editUser',[middleware.tokenAuth , middleware.checkCanEdit], function(req, res) {
        /* #swagger.security = [{
               "apiKeyAuth": []
        }] 
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Edit a user',
            schema: {
                id: '61ed2777f5178ce385654350',
                account: 'a123456789',
                password: '123456',
                name: 'Chris',
                gender: true,
                roles: [1,2,3,4],
                rolesInfo: {
                    admin:{},
                    host:{},
                    user:{},
                    sales:{},
                },
                houseIds:[],
                phone: '0909666666',
                mail: 'acr.webhouse@gmail.com',
                address: '台北市文山區興隆路六段66號6樓',
                bornDate: '2022/05/11'
            }
        }
        */

        const response = {
            'status':true,
            'data':''
        }

        const id = req.body.id
        const account = req.body.account
        const password = req.body.password
        const name = req.body.name
        const gender = req.body.gender
        const roles = req.body.roles
        const rolesInfo = req.body.rolesInfo
        const houseIds = req.body.houseIds
        const phone = req.body.phone
        const mail = req.body.mail
        const address = req.body.address
        const bornDate = req.body.bornDate

        user.editUser(id,account,password,name,gender,roles,rolesInfo,houseIds,phone,mail,address,bornDate,(result,data)=>{
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.delete(preRestApi + '/removeUser',[middleware.tokenAuth,middleware.checkIsAdmin], function(req, res) {
         /*
         #swagger.security = [{
               "apiKeyAuth": []
        }]
         #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Remove a user',
            schema: {
                ids: ['61ed2777f5178ce385654350','61ed2777f5178ce385654353']
            }
        }*/

        const ids = req.body.ids
        const response = {
            'status':true,
            'data':''
        }
        user.removeUser(ids,(result,data)=>{
            response.status = result;
            response.data = data
            res.send(response);
        })
    });
}
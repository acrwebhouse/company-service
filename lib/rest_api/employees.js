exports.on = function(app) {
    const preRestApi = '/employees';
    const employees = require('../role/employees');
    const middleware = require('./middleware').middleware;
    const utilsValue = require('../utils/value');
    const user = require('../role/user');

    app.post(preRestApi + '/applyEmployees',[middleware.tokenAuth], function(req, res) {
        /*
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'apply a employees',
            schema: {
                companyId: '61ed2777f5178ce385654351'                
            }
        }*/ 
        const companyId = req.body.companyId
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const userId = decodeToken.id
        const response = {
            'status':true,
            'data':''
        }
        employees.applyEmployees(companyId,userId,(result,data)=> {
            response.status = result;
            response.data = data
            if(result == true){
                user.setCompanyIdToUser(companyId,userId,(result,data)=> {
                    response.status = result;
                    response.data = data
                    res.send(response);
                })
            }else{
                res.send(response);
            }
        })
    });

    app.put(preRestApi + '/editEmployees',[middleware.checkIsCompanyAdmin], function(req, res) {
        /*
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Edit a company',
            schema: {
                id: '61ed2777f5178ce385654350',
                companyId: '61ed2777f5178ce385654351',
                userId: '61ed2777f5178ce385654352',
                rank: 1,
                managerId: '61ed2777f5178ce385654353',
                state:1,
                isResign:false
            }
        }*/ 
        const id = req.body.id
        const companyId = req.body.companyId
        const userId = req.body.userId
        const rank = req.body.rank
        const managerId = req.body.managerId
        const state = req.body.state
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const adminId = decodeToken.id
        const isResign = req.body.isResign
        const response = {
            'status':true,
            'data':''
        }
        employees.editEmployees(id,companyId,userId,rank,managerId,state,adminId,isResign,(result,data)=> {
            response.status = result;
            response.data = data
            if(result == true && (isResign == true || state ==3 || state ==5)){
                user.setCompanyIdToUser('empty',userId,(result,data)=> {
                    response.status = result;
                    response.data = data
                    res.send(response);
                })
            }if(result == true ){
                user.setCompanyIdToUser(companyId,userId,(result,data)=> {
                    response.status = result;
                    response.data = data
                    res.send(response);
                })
            }else{
                res.send(response);
            }
        })
    });

    app.get(preRestApi + '/getEmployeesListByCompanyId',[middleware.tokenAuth,middleware.checkIsEmployee], function(req, res) {
        /* 
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        */
        const companyId = req.query.companyId
        let skip = req.query.skip
        let limit = req.query.limit
        skip = skip*1;
        limit = limit*1
        const response = {
            'status':true,
            'data':''
        }

        employees.getEmployeesListByCompanyId(companyId,skip,limit,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        }) 
    });

    app.get(preRestApi + '/getPersonalEmployeesInfo',[middleware.tokenAuth], function(req, res) {
         /* 
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        */
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const id = decodeToken.id
        const response = {
            'status':true,
            'data':''
        }
        employees.getEmployeesByUserId(id,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.put(preRestApi + '/cancelApplyEmployees',[middleware.tokenAuth], function(req, res) {
        /*
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'cancel apply employees',
            schema: {
                id: '61ed2777f5178ce385654350',
            }
        }*/ 
        const id = req.body.id
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const userId = decodeToken.id
        const response = {
            'status':true,
            'data':''
        }
        employees.cancelApplyEmployees(id,userId,(result,data)=> {
            response.status = result;
            response.data = data
            if(result == true ){
                user.setCompanyIdToUser('empty',userId,(result,data)=> {
                    response.status = result;
                    response.data = data
                    res.send(response);
                })
            }else{
                res.send(response);
            }
        })
    });

}
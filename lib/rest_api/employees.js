exports.on = function(app) {
    const preRestApi = '/employees';
    const employees = require('../role/employees');
    const middleware = require('./middleware').middleware;
    const utilsValue = require('../utils/value');
    const user = require('../role/user');
    const auth = require('../role/auth');

    app.post(preRestApi + '/applyEmployees', function(req, res) {
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
        employees.getCurrentEmployeeByUserId(userId,(result,data)=>{
            if(result == true){
                const oldState = data.state
                const oldIsResign = data.isResign
                if((oldState != 2 && state == 2) || (oldState != 4 && state == 4) || (oldIsResign == false && isResign == true)){
                    auth.removeAccessTokensByUserId(userId,(result,data)=>{
                        if(result == true){
                            editEmployeesExe(id,companyId,userId,rank,managerId,state,adminId,isResign,response)
                        }else{
                            response.status = result;
                            response.data = data
                        }
                    })
                }else{
                    editEmployeesExe(id,companyId,userId,rank,managerId,state,adminId,isResign,response)
                }
            }else{
                response.status = result;
                response.data = data
                res.send(response);
            }
        }) 
        
        function editEmployeesExe(id,companyId,userId,rank,managerId,state,adminId,isResign,response){
            employees.editEmployees(id,companyId,userId,rank,managerId,state,adminId,isResign,(result,data)=> {
                response.status = result;
                response.data = data
                if(result == true && state == 3){
                    res.send(response);
                }
                else if(result == true && (isResign == true || state == 5)){
                    user.setCompanyIdToUser('empty',userId,(result,data)=> {
                        response.status = result;
                        response.data = data
                        res.send(response);
                    })
                }else if(result == true ){
                    user.setCompanyIdToUser(companyId,userId,(result,data)=> {
                        response.status = result;
                        response.data = data
                        res.send(response);
                    })
                }else{
                    res.send(response);
                }
            })
        }

    });

    app.get(preRestApi + '/getEmployeesListByCompanyId',[middleware.checkIsEmployee], function(req, res) {
        /* 
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        */
        const companyId = req.query.companyId
        let skip = req.query.skip
        let limit = req.query.limit
        const states = req.query.states
        skip = skip*1;
        limit = limit*1
        const response = {
            'status':true,
            'data':''
        }

        employees.getEmployeesListByCompanyId(companyId,states,skip,limit,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        }) 
    });

    app.get(preRestApi + '/getPersonalEmployeesInfo', function(req, res) {
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

    app.get(preRestApi + '/getCurrentPersonalEmployeeInfo', function(req, res) {
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
       employees.getCurrentEmployeeByUserId(id,(result,data)=> {
           response.status = result;
           response.data = data
           res.send(response);
       })
   });

    app.put(preRestApi + '/cancelApplyEmployees', function(req, res) {
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

    app.get(preRestApi + '/getTeamMembers',[middleware.checkIsEmployee], function(req, res) {
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

        employees.getTeamMembers(managerId,companyId,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        }) 
    });
}
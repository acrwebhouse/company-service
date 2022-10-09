exports.on = function(app) {
    const preRestApi = '/employees';
    const employees = require('../role/employees');
    const middleware = require('./middleware').middleware;
    const utilsValue = require('../utils/value');

    app.post(preRestApi + '/addEmployees', function(req, res) {
        /*#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Add a employees',
            schema: {
                companyId: '61ed2777f5178ce385654351',
                userId: '61ed2777f5178ce385654352',
                rank: 1,
                managerId: '61ed2777f5178ce385654353',
                state:0
                
            }
        }*/ 
        const companyId = req.body.companyId
        const userId = req.body.userId
        const rank = req.body.rank
        const managerId = req.body.managerId
        const state = req.body.state
        const response = {
            'status':true,
            'data':''
        }
        employees.addEmployees(companyId,userId,rank,managerId,state,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.put(preRestApi + '/editEmployees', function(req, res) {
        /*#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Edit a company',
            schema: {
                id: '61ed2777f5178ce385654350',
                companyId: '61ed2777f5178ce385654351',
                userId: '61ed2777f5178ce385654352',
                rank: 1,
                managerId: '61ed2777f5178ce385654353',
                state:1
            }
        }*/ 
        const id = req.body.id
        const companyId = req.body.companyId
        const userId = req.body.userId
        const rank = req.body.rank
        const managerId = req.body.managerId
        const state = req.body.state
        const response = {
            'status':true,
            'data':''
        }
        employees.editEmployees(id,companyId,userId,rank,managerId,state,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.get(preRestApi + '/getEmployeesListByCompanyId', function(req, res) {
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
            console.log(data)
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

}
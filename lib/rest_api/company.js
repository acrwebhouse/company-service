exports.on = function(app) {
    const preRestApi = '/company';
    const company = require('../role/company');
    const middleware = require('./middleware').middleware;
    const utilsValue = require('../utils/value');

    app.get(preRestApi + '/getCompanyList', function(req, res) {
        /*
        #swagger.parameters['sort'] = {
            in: 'query',
            type: 'string',
            schema: '{\"updateTime\":1}'
        }
        */ 
        const name = req.query.name
        const unifiedBusinessNo = req.query.unifiedBusinessNo
        const skip = req.query.skip
        const limit = req.query.limit
        const timeSort = req.query.sort;
        const state = req.query.state
        const response = {
            'status':true,
            'data':''
        }

        company.getCompanyList(name,unifiedBusinessNo,state,skip,limit,timeSort,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        }) 
    });

    app.get(preRestApi + '/getCompanyById', function(req, res) {
        const id = req.query.id
        const response = {
            'status':true,
            'data':''
        }
        company.getCompanyById(id,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });
}
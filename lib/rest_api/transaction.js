exports.on = function(app) {
    const preRestApi = '/transaction';
    const house = require('../role/house');
    const transaction = require('../role/transaction');
    const middleware = require('./middleware').middleware;
    const utilsValue = require('../utils/value');

    app.post(preRestApi + '/applyTransaction',[ middleware.checkIsEmployee], function(req, res) {
        /*
        #swagger.security = [{
               "apiKeyAuth": []
        }] 
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'apply a transaction',
            schema: {
                houseId: '636fce410653bf00212481a5',
                userId: '636fce410653bf00212481a5',
                actualPrice: 12000,
                serviceCharge: 10000,
                startRentDate: '2022/05/11',
                endRentDate: '2022/10/11',
                companyId: '636fcdc30653bf00212481a3'            
            }
        }*/ 
        const houseId = req.body.houseId
        const userId = req.body.userId
        const actualPrice = req.body.actualPrice
        const serviceCharge = req.body.serviceCharge
        const startRentDate = req.body.startRentDate
        const endRentDate = req.body.endRentDate
        const companyId = req.body.companyId

        const response = {
            'status':true,
            'data':''
        }
        transaction.applyTransaction(houseId,userId,actualPrice,serviceCharge,startRentDate,endRentDate,companyId,(result,data)=>{
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.get(preRestApi + '/getTransactionList',[ middleware.checkIsEmployee], function(req, res) {
        /* #swagger.security = [{
               "apiKeyAuth": []
        }] 
        #swagger.parameters['userId'] = {
            in: 'query',
            type: 'string',
            schema: '61ed2777f5178ce385654350'
        }
        #swagger.parameters['companyId'] = {
            in: 'query',
            type: 'string',
            schema: '61ed2777f5178ce385654350'
        }
        #swagger.parameters['isDelete'] = {
            in: 'query',
            type: 'boolean',
        }
        #swagger.parameters['minPrice'] = {
            in: 'query',
            type: 'int',
            schema: 0
        }#swagger.parameters['maxPrice'] = {
            in: 'query',
            type: 'int',
            schema: 19999
        }
        #swagger.parameters['startTransactionDate'] = {
            in: 'query',
            type: 'string',
            schema: '2022/03/11'
        }
        #swagger.parameters['endTransactionDate'] = {
            in: 'query',
            type: 'string',
            schema: '2022/10/11'
        }
        #swagger.parameters['city'] = {
            in: 'query',
            type: 'string',
            schema: '台北市'
        }
        #swagger.parameters['area'] = {
            in: 'query',
            type: 'string',
            schema: '文山區'
        }
        #swagger.parameters['minServiceCharge'] = {
            in: 'query',
            type: 'int',
            schema: 0
        }#swagger.parameters['maxServiceCharge'] = {
            in: 'query',
            type: 'int',
            schema: 19999
        }
        #swagger.parameters['minActualPrice'] = {
            in: 'query',
            type: 'int',
            schema: 0
        }#swagger.parameters['maxActualPrice'] = {
            in: 'query',
            type: 'int',
            schema: 19999
        }
        #swagger.parameters['typeOfRental'] = {
            in: 'query',
            type: 'int',
            schema: 1
        }
        */

        const isDelete = req.query.isDelete
        const skip = req.query.skip
        const limit = req.query.limit
        const minPrice = req.query.minPrice
        const maxPrice = req.query.maxPrice
        const startTransactionDate = req.query.startTransactionDate
        const endTransactionDate = req.query.endTransactionDate
        const area = req.query.area
        const city = req.query.city
        const typeOfRental = req.query.typeOfRental
        const userId = req.query.userId
        const companyId = req.query.companyId
        const minServiceCharge = req.query.minServiceCharge
        const maxServiceCharge = req.query.maxServiceCharge
        const minActualPrice = req.query.minActualPrice
        const maxActualPrice = req.query.maxActualPrice
        const states = req.query.states

        const response = {
            'status':true,
            'data':''
        }
        transaction.getTransactionList(userId,companyId,minPrice,maxPrice,startTransactionDate,endTransactionDate,city,area,minServiceCharge,maxServiceCharge,minActualPrice,maxActualPrice,typeOfRental,isDelete,skip,limit,states,(result,data)=>{
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.put(preRestApi + '/editTransactionNoIncludeCompany',[ middleware.checkIsEmployee], function(req, res) {
        /* #swagger.security = [{
               "apiKeyAuth": []
        }] 
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Edit a transaction',
            schema: {
                id: '61ed2777f5178ce385654350',
                houseId: '636fce410653bf00212481a5',
                userId: '636fcdc30653bf00212481a3',
                actualPrice: 12000,
                serviceCharge: 10000,
                transactionDate : '2022/05/11',
                startRentDate : '2022/05/11',
                endRentDate : '2022/10/11',
                companyId: '636fcdc30653bf00212481a3',
                edit: {
                    actualPrice: 5000,
                    serviceCharge: 2000,
                    transactionDate: '2022/05/11',
                    startRentDate: '2022/05/11',
                    endRentDate: '2022/10/11'
                },
                state: 2
            }
        }
        */

        const id = req.body.id
        const houseId = req.body.houseId
        const userId = req.body.userId
        const actualPrice = req.body.actualPrice
        const serviceCharge = req.body.serviceCharge
        const transactionDate = req.body.transactionDate
        const startRentDate = req.body.startRentDate
        const endRentDate = req.body.endRentDate
        const edit = req.body.edit
        const state = req.body.state
        const response = {
            'status':true,
            'data':''
        }

        console.log('===editTransactionNoIncludeCompany====id====',id)
        console.log('===editTransactionNoIncludeCompany====houseId====',houseId)
        console.log('===editTransactionNoIncludeCompany====userId====',userId)
        console.log('===editTransactionNoIncludeCompany====actualPrice====',actualPrice)
        console.log('===editTransactionNoIncludeCompany====serviceCharge====',serviceCharge)
        console.log('===editTransactionNoIncludeCompany====transactionDate====',transactionDate)
        console.log('===editTransactionNoIncludeCompany====startRentDate====',startRentDate)
        console.log('===editTransactionNoIncludeCompany====endRentDate====',endRentDate)
        console.log('===editTransactionNoIncludeCompany====edit====',edit)
        console.log('===editTransactionNoIncludeCompany====state====',state)

        transaction.getTransactionById(id,(result,data)=>{
            console.log('===getTransactionById====result====',result)
            console.log('===getTransactionById====data====',data)
            if(result === true){
                const orgTransaction = data
                transaction.editTransactionNoIncludeCompany(id,houseId,userId,actualPrice,serviceCharge,transactionDate,startRentDate,endRentDate,edit,state,(result,data)=> {
                    console.log('===editTransactionNoIncludeCompany====result====',result)
                    console.log('===editTransactionNoIncludeCompany====data====',data)
                    if(result === true){
                        if(orgTransaction.state === 1 && state === 4){
                            const ids = [orgTransaction.houseId]
                            house.removeHouse(ids,(result,data)=> {
                                response.status = result
                                response.data = data
                                res.send(response);
                            })
                        }else{
                            response.status = true
                            response.data = data
                            res.send(response);
                        }
                    }else{
                        response.status = false
                        response.data = data
                        res.send(response);
                    }
                })
            }else{
                response.status = false
                response.data = 'no match id'
                res.send(response);
            }
        })
    });

    app.delete(preRestApi + '/removeTransaction', function(req, res) {
         /*
         #swagger.security = [{
               "apiKeyAuth": []
        }]
         #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Remove a tansaction',
            schema: {
                ids: ['61ed2777f5178ce385654350','61ed2777f5178ce385654353']
            }
        }*/

        const ids = req.body.ids
        const response = {
            'status':true,
            'data':''
        }
        transaction.removeTransaction(ids,(result,data)=>{
            response.status = result;
            response.data = data
            res.send(response);
        })
    });
}
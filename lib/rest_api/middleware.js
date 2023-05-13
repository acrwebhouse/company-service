const utilsValue = require('../utils/value');
const employees = require('../role/employees');
const middleware = {
    tokenAuth: function(req, res, next) {
        const token = req.headers['x-token']
        if(utilsValue.isValid(token)){
            const decodeToken = utilsValue.jwtDecode(token)
            const id = decodeToken.id
            if(utilsValue.isValid(id)){
                next()
            }else{
                const response = {
                    status : false,
                    data :"x-token format error"
                }
                res.send(response);
            }
        }else{
            const response = {
                status : false,
                data :"x-token undefined"
            }
            res.send(response);
        }
    },
    checkIsAdmin: function(req, res, next) {
       const token = req.headers['x-token']
       const decodeToken = utilsValue.jwtDecode(token)
       const roles = decodeToken.roles
       if(utilsValue.isValid(roles) && roles.includes(1)){
          next()
       }else{
        const response = {
            status : false,
            data :"role is not admin"
        }
        res.send(response);
       }
    },
    checkCanEdit: function(req, res, next) {
       const token = req.headers['x-token']
       const decodeToken = utilsValue.jwtDecode(token)
       const roles = decodeToken.roles
       const id = decodeToken.id
       const editId = req.body.id
       if(utilsValue.isValid(roles) && roles.includes(1) || id == editId){
          next()
       }else{
        const response = {
            status : false,
            data :"role is not admin and not account owner"
        }
        res.send(response);
       }
    },
    checkIsEmployee: function(req, res, next) {
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const id = decodeToken.id
        const companyId = req.query.companyId
        let isEmployee = false;
        employees.getEmployeesByUserId(id,(result,data)=>{
            if(result == true){
                for(let i = 0 ;i<data.length; i++){
                    if(data[i].companyId == companyId && data[i].state == 2){
                        isEmployee = true;
                        i = data.length
                    }
                }
                if(isEmployee ==true){
                    next()
                }else{
                    const response = {
                        status : false,
                        data :'user is not employee'
                    }
                    res.send(response);
                }
            }else{
                const response = {
                    status : false,
                    data :data
                }
                res.send(response);
            }
        })
        // if(utilsValue.isValid(roles) && roles.includes(1)){
        //    next()
        // }else{
        //  const response = {
        //      status : false,
        //      data :"role is not admin"
        //  }
        //  res.send(response);
        // }
    },
    checkIsCompanyAdmin: function(req, res, next) {
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const id = decodeToken.id
        const companyId = req.body.companyId
        let isAdmin = false;
        employees.getEmployeesByUserId(id,(result,data)=>{
            if(result == true){
                for(let i = 0 ;i<data.length; i++){
                    if(data[i].companyId == companyId && data[i].state == 2 && data[i].rank == 0){
                        isAdmin = true;
                        i = data.length
                    }
                }
                if(isAdmin ==true){
                    next()
                }else{
                    const response = {
                        status : false,
                        data :'user is not company admin'
                    }
                    res.send(response);
                }
            }else{
                const response = {
                    status : false,
                    data :data
                }
                res.send(response);
            }
        })
        // if(utilsValue.isValid(roles) && roles.includes(1)){
        //    next()
        // }else{
        //  const response = {
        //      status : false,
        //      data :"role is not admin"
        //  }
        //  res.send(response);
        // }
    },
    checkIsTransactionOwner: function(req, res, next) {
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const id = decodeToken.id
        const userId = req.body.userId || req.query.userId
        if(id === userId){
            next()
        }else{
            const companyId = req.body.companyId || req.query.companyId
            let isOwner = false;
            employees.getEmployeesByUserId(id,(result,data)=>{
                if(result == true){
                    for(let i = 0 ;i<data.length; i++){
                        if(data[i].companyId == companyId && data[i].state == 2 && data[i].rank == 0){
                            isOwner = true;
                            i = data.length
                        }
                    }
                    if(isOwner ==true){
                        next()
                    }else{
                        const response = {
                            status : false,
                            data :'user is not owner'
                        }
                        res.send(response);
                    }
                }else{
                    const response = {
                        status : false,
                        data :data
                    }
                    res.send(response);
                }
            })
        }
        

    },

    checkIsTransactionAdmin: function(req, res, next) {
        const token = req.headers['x-token']
        const decodeToken = utilsValue.jwtDecode(token)
        const id = decodeToken.id
        const companyId = req.body.companyId || req.query.companyId
        let isOwner = false;
        employees.getEmployeesByUserId(id,(result,data)=>{
            if(result == true){
                for(let i = 0 ;i<data.length; i++){
                    if(data[i].companyId == companyId && data[i].state == 2 && data[i].rank == 0){
                        isOwner = true;
                        i = data.length
                    }
                }
                if(isOwner ==true){
                    next()
                }else{
                    const response = {
                        status : false,
                        data :'user is not admin'
                    }
                    res.send(response);
                }
            }else{
                const response = {
                    status : false,
                    data :data
                }
                res.send(response);
            }
        })
    },
}

exports.middleware = middleware
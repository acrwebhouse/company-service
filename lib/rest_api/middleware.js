const utilsValue = require('../utils/value');
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
    }
}

exports.middleware = middleware
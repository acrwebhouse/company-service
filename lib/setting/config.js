require('dotenv').config()
exports.config = {
    'serverIp':process.env.SERVER_IP || '127.0.0.1',
    'serverPort': process.env.SERVER_PORT || 7000,
    'company-basic-server':{
        location: process.env.COMPANY_BASIC_LOCATION ||'http://127.0.0.1:20000',
        restApi:{
            'getCompanyList':'company/getCompanyList',
            'getCompanyById':'company/getCompanyById',
        }
    },
    'employees-basic-server':{
        location: process.env.EMPLOYEES_BASIC_LOCATION ||'http://127.0.0.1:21000',
        restApi:{
            'addNotification':'notification/addNotification',
            'editNotification':'notification/editNotification'
        }
    },
    'swaggerIp':process.env.SWAGGER_IP || '127.0.0.1',
}
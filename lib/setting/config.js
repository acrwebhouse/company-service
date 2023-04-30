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
            'addEmployees':'employees/addEmployees',
            'editEmployees':'employees/editEmployees',
            'getEmployeesListByCompanyId':'employees/getEmployeesListByCompanyId',
            'getEmployeesByUserId':'employees/getEmployeesByUserId',
            'editEmployees':'employees/editEmployees',
        }
    },
    'house-basic-server':{
        location: process.env.HOUSE_BASIC_LOCATION ||'http://127.0.0.1:14000',
        restApi:{
            'editHousesNoCheckUniqueAddress':'house/editHousesNoCheckUniqueAddress',
            'getHousesByBody':'house/getHousesByBody',
        }
    },
    'user-basic-server':{
        location: process.env.USER_BASIC_LOCATION ||'http://127.0.0.1:13000',
        restApi:{
            'getUser':'user/getUser',
            'editUser':'user/editUser',
            'getUserById':'user/getUserById',
        }
    },
    'smtp-basic-server':{
        location: process.env.SMTP_BASIC_LOCATION ||'http://35.234.42.100:16000',
        restApi:{
            'sendMail':'smtp/sendMail'
        }
    },
    'reserve-house-basic-server':{
        location: process.env.RESERVE_HOUSE_BASIC_LOCATION ||'http://127.0.0.1:18000',
        restApi:{
            'editReserveHouse':'reserveHouse/editReserveHouse',
            'getReserveHouses':'reserveHouse/getReserveHouses',
        }
    },
    'swaggerIp':process.env.SWAGGER_IP || '127.0.0.1',
}
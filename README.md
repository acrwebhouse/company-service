# company-service

build docker
docker build . -t acrwebdev/company-service

docker push
docker push acrwebdev/company-service

docker pull acrwebdev/company-service:latest

run docker
docker run -p 7000:7000 --env COMPANY_BASIC_LOCATION=http://10.140.0.2:20000 --env EMPLOYEES_BASIC_LOCATION=http://10.140.0.2:21000 --env HOUSE_BASIC_LOCATION=http://10.140.0.2:14000 --env USER_BASIC_LOCATION=http://10.140.0.2:13000 --env SMTP_BASIC_LOCATION=http://10.140.0.2:16000 --env SERVER_IP=35.234.42.100 --env SERVER_PORT=7000 --env SWAGGER_IP=35.234.42.100 --env TZ=Asia/Taipei --restart=always --name=company-service -d acrwebdev/company-service

# company-service

build docker
docker build . -t acrwebdev/company-service:0.0.1

docker push
docker push acrwebdev/company-service:0.0.1

docker pull acrwebdev/company-service:0.0.1

run docker
docker run -p 7000:7000 --env COMPANY_BASIC_LOCATION=http://10.140.0.2:20000 --env EMPLOYEES_BASIC_LOCATION=http://10.140.0.2:21000 --env HOUSE_BASIC_LOCATION=http://10.140.0.2:14000 --env USER_BASIC_LOCATION=http://10.140.0.2:13000 --env SMTP_BASIC_LOCATION=http://10.140.0.2:16000 --env SERVER_IP=34.80.78.75 --env SERVER_PORT=7000 --env SWAGGER_IP=34.80.78.75 --env TZ=Asia/Taipei --restart=always --name=company-service -d acrwebdev/company-service:0.0.1

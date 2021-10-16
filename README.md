<Cloud Computing - Trabajo Práctico 3>
Alumno: Scacciante Matias
Legajo: 45226

Seguir los siguientes pasos para ejecutar el proyecto:

Ejecutar 
# docker network create awslocal

Ejecutar 
# docker run -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb

Ingresar a:
# http://localhost:8000/shell
ejecutar el script del archivo "CrearTablas.txt" para crear las tablas de Envio e Index

Ejecutar
# npm install

Ejecutar
# sam local start-api --docker-network awslocal

Para probar los Request abrir el archivo Test-Request.http

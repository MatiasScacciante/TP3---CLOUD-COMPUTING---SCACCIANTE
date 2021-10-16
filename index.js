const AWS = require('aws-sdk');
const createId = require('hash-generator')

const handler = async ({ pathParameters, httpMethod, body }) => {

    const dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345'
        }
    });

    const docClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamodb
    });
    const { TableNames: tablas } = await dynamodb.listTables().promise()
    if (!tablas.includes('Envio')) {
        return {
            statusCode: 400,
            body: 'Crear las tablas necesarias '
        }
    }

    switch (httpMethod) {

        case 'POST':
            const crearEnvio = {
                TableName: 'Envio',
                Item: {
                    id: createId(4),
                    fechaAlta: new Date().toISOString(),
                    pendiente: new Date().toISOString(),
                    ...JSON.parse(body),
                }
            }

            try {
                await docClient.put(crearEnvio).promise()
                return {
                    statusCode: 200,
                    
                    body: JSON.stringify(crearEnvio.Item)
                };
            } catch {
                return {
                    statusCode: 500,
                    body: 'Error al intentar crear el envio.'
                };
            }


        case 'GET':
            const envioId = (pathParameters || {}).idEnvio || false;
            if (envioId) {
                const ParEnvio = {
                    TableName: 'Envio',
                    Key: {
                        id: envioId,
                    }
                };

                const envio = await docClient.get(ParEnvio).promise()
                return {
                    statusCode: 200,
                    body: JSON.stringify(envio)
                }
            }

            const tablas = {
                TableName: 'Envio',
                IndexName: 'EnviosPendientesIndex'
            };
            try {
                const envios = await docClient.scan(tablas).promise()
                return {
                    statusCode: 200,
                    body: JSON.stringify(envios)
                }
            } catch (err) {
                console.log(err)
                return {
                    statusCode: 500,

                    body: 'Error, no se pudieron obtener los envios'
                };
            }

        case 'PUT':
            const idEnvio = (pathParameters || {}).idEnvio || false;

            const actEstado = {
                TableName: 'Envio',
                Key: {
                    id: idEnvio
                },
                UpdateExpression: 'REMOVE pendiente',
                ConditionExpression: 'attribute_exists(pendiente)'
            }

            try {
                await docClient.update(actEstado).promise()
                return {
                    statusCode: 200,
                    body: `Se actualizo el estado del envio ${idEnvio}, se entregó correctamente`
                };
            } catch {
                return {
                    statusCode: 500,
                    body: `Error, el Envio de ${idEnvio}, no se encuentra`
                };
            }

        default:
            return {
                statusCode: 501,
                body: `Error:  ${httpMethod}, el metodo no es soportado`
            };
    }
}

exports.handler = handler;
//database.js

const { Connection, Request, TYPES } = require('tedious');
const { AuthenticationContext } = require('adal-node');
function createConnection(config) {
    return new Connection(config);
}
function connectToDatabase(connection, callback) {
    connection.on('connect', (err) => {
        if (err) {
            console.error('Failed to connect to the database:', err.message);
            callback(err);
        } else {
            console.log('Connected to Azure SQL Database');
            callback(null);
        }
    });
}
function executeQuery(connection, query, parameters, callback) {
    const request = new Request(query, (err, rowCount) => {
        if (err) {
            console.error('Failed to execute query:', err.message);
            callback(err);
        } else {
            callback(null, rowCount);
            
        }
    });

    if (parameters) {
        for (const parameter of parameters) {
            request.addParameter(parameter.name, parameter.type, parameter.value);
        }
    }
    connection.execSql(request);
}
function getToken(clientId, clientSecret, callback) {
    const authorityHostUrl = 'https://login.microsoftonline.com';
    const tenant = '70a28522-969b-451f-bdb2-abfea3aaa5bf'; // Замініть на свій тенант AD
    const authorityUrl = `${authorityHostUrl}/${tenant}`;
    const resource = 'https://database.windows.net'; // Ресурс, для якого ви отримуєте токен
    const context = new AuthenticationContext(authorityUrl);
    context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, (err, tokenResponse) => {
        if (err) {
            callback(err, null);
            
        } else {
            callback(null, tokenResponse.accessToken);
        }
    });
}
getToken('226ac1b5-4ca9-451b-9d2a-8eec33f72e32', 'rlN8Q~ZKQkEz7iHL3rmmdruWg3BRruf2IgH2daaW', (err, token) => {
    if (err) {
        console.error('Failed to get access token:', err.message);
    } else {
        const config = {
            server: 'dsn-server.database.windows.net',
            options: {
                database: 'dsn-db-1',
                encrypt: true,
                authentication: {
                    type: 'azure-active-directory-access-token',
                    options: {
                        token: token,
                    },
                },
            },
        };
        connection = createConnection(config); // Перенесли connection сюди
        connectToDatabase(connection, (err) => {
            if (err) {
                
            } else {
                console.log('Connected to the database');
            }
        });
    }
});
module.exports = {
    createConnection,
    connectToDatabase,
    executeQuery,
};

//csvUtils.js

const fs = require('fs');
const path = require('path');
const { Connection, Request, TYPES } = require('tedious');
const uploadsDirectory = path.join(__dirname, 'uploads');
function createOrUpdateCSVFile(csvData, historyFileName, connection, callback) {
    const csvFileName = `${historyFileName}.csv`;
    const filePath = path.join(uploadsDirectory, csvFileName); // Повний шлях до файлу
    fs.writeFileSync(filePath, csvData);
    const query = `INSERT INTO Files (FileName, Content) VALUES (@FileName, @Content)`;
    const request = new Request(query, (err) => {
        if (err) {
            console.error('Failed to save file to database:', err.message);
            callback(err, null);
        } else {
            console.log('File saved to database');
            callback(null, csvFileName);
        }
    });
    request.addParameter('FileName', TYPES.NVarChar, csvFileName);
    request.addParameter('Content', TYPES.NVarChar, fs.readFileSync(filePath, 'utf8'));
    connection.execSql(request);
}
function generateDownloadLink(csvFileName) {
    const downloadLink = `/download/${csvFileName}`; // Приклад посилання
    return downloadLink;
}
module.exports = {
    createOrUpdateCSVFile,
    generateDownloadLink,
};

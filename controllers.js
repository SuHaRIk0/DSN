//controllers.js

const database = require('./database');
const csvUtils = require('./csvUtils');
const { Request, TYPES } = require('tedious');
async function createOrUpdateDataset(req, res) {
    const { is_truth, text, history_file_name } = req.body;
    database.connectToDatabase((err, connection) => {
        if (err) {
            res.status(500).json({ error: '������� ���������� �� ���� �����' });
            return;
        }
        const query = `SELECT * FROM YourTable WHERE history_file_name = @history_file_name`;
        const request = new Request(query, (err, rowCount) => {
            if (err) {
                res.status(500).json({ error: '������� ������ �� ���� �����' });
                return;
            }
            if (rowCount === 0) {
                const csvData = `${is_truth}, "${text}"\n`;
                csvUtils.createOrUpdateCSVFile(csvData, history_file_name);
                res.json({ message: '���� CSV �������� � ���������', downloadLink: 'your-download-link' });
            } else {
                const csvData = `${is_truth}, "${text}"\n`;
                csvUtils.createOrUpdateCSVFile(csvData, history_file_name);
                res.json({ message: '���� CSV �������� � ���������', downloadLink: 'your-updated-download-link' });
            }
            connection.close();
        });
        request.addParameter('history_file_name', TYPES.NVarChar, history_file_name);
        connection.execSql(request);
    });
}
module.exports = {
    createOrUpdateDataset,
};

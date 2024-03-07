const fs = require('fs');
const csv = require('csv-parser');
const filePath = 'data.csv';
fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    console.log(row.Name);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });
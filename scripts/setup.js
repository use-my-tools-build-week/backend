const fs = require('fs');

const from = `${__dirname}/../knexfile.example.js`;
const to = `${__dirname}/../knexfile.js`;
fs.copyFile(from, to, (err) => {
  if(err) {
    console.log(err);
  }

  console.log(`Copied ${from} to ${to}`);
})

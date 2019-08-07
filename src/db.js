var CustomerStore = require('./store');
const data = require('../data.json');
module.exports = callback => {
  // connect to a database if needed, then pass it to `callback`:
  CustomerStore.uploaddata(data, (err, res) => {
    if (err) {
      console.error('error while restoring data');
    } else {
      console.log('data restored');
    }
    callback();
  });
};
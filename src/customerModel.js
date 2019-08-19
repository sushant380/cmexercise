const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = 'Customer';
/**
 * Convert db records to general format.
 * @param {*} row DB record.
 */
function fromStore(rows) {
  return rows.map(function(row) {
    return {
      id: row.id,
      name: row.name,
      age: row.age,
      country: row.country
    };
  });
}

/**
 * Get all customers based on filters.
 * @param {Number} limit number of records
 * @param {String} token next page token if there is any else false
 * @param {Function} callback function to return the result.
 */
function getAllCustomers(limit, token, callback) {
  const query = ds
    .createQuery([kind])
    .limit(limit)
    .start(token);
  return ds.runQuery(query, function(err, customers, queryInfo) {
    if (err) {
      callback(err);
    } else {
      const formattedResult = fromStore(customers);
      callback(null, formattedResult, queryInfo.endCursor);
    }
  });
}
/**
 * Get customer from DB based on ID
 * @param {Number} id numeric customer id
 * @param {Function} callback function to return the result
 */
function getCustomerById(id, callback) {
  const query = ds.createQuery([kind]).filter('id', '=', parseInt(id, 10));
  return ds.runQuery(query, function(err, customers) {
    if (err) {
      callback(err);
    } else {
      const formattedResult = fromStore(customers);
      callback(null, formattedResult);
    }
  });
}

module.exports = {
  getAllCustomers,
  getCustomerById
};

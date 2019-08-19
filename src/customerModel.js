const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = 'Customer';
/**
 * Convert db records to general format.
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

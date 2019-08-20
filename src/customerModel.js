const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = 'Customer';

function fireQuery(query, callback) {
  return ds.runQuery(query, function(err, customers) {
    err ? callback(err) : callback(null, customers);
  });
}
/**
 * Get all customers based on filters.
 */
function getAllCustomers(callback) {
  const query = ds.createQuery([kind]);
  return fireQuery(query, callback);
}
/**
 * Get customer from DB based on ID
 */
function getCustomerById(id, callback) {
  const query = ds.createQuery([kind]).filter('id', '=', parseInt(id, 10));
  return fireQuery(query, callback);
}

module.exports = {
  getAllCustomers,
  getCustomerById
};

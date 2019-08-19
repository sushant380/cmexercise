const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = 'Customer';
/**
 * Convert db records to general format.
 * @param {*} row DB record.
 */
function fromStore(row) {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    country: row.country
  };
}

/**
 * Get all customers based on filters.
 * @param {Array} filters filters to be applied.
 * @param {Number} limit number of records
 * @param {String} token next page token if there is any else false
 * @return {Promise} return promise of customers else error
 */
function getAllCustomers(limit, token) {
  const query = ds
    .createQuery([kind])
    .limit(limit)
    .start(token);
  return ds
    .runQuery(query)
    .then(function(result) {
      return Promise.resolve({
        rows: result[0].map(fromStore),
        pageToken: result[1]
      });
    })
    .catch(function(err) {
      return Promise.reject(err);
    });
}
/**
 * Get customer from DB based on ID
 * @param {Number} id numeric customer id
 * @return {Promise} returns promise of customer data else error
 */
function getCustomerById(id) {
  const query = ds.createQuery([kind]).filter('id', '=', parseInt(id, 10));
  return ds
    .runQuery(query)
    .then(function(result) {
      return result[0].map(fromStore);
    })
    .then(function(rs) {
      return rs.length ? Promise.resolve({ rows: rs }) : Promise.reject('404');
    })
    .catch(function(err) {
      return Promise.reject(err);
    });
}

module.exports = {
  getAllCustomers,
  getCustomerById
};

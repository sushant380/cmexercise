const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = 'Customer';
/**
 * Convert db records to general format.
 * @param {*} row DB record.
 */
const fromStore = ({ id, name, age, country }) => ({
  id,
  name,
  age,
  country
});
/**
 * Use query param to filter the results
 * @param {String} query
 * @param {Array} filters
 */
const applyFilters = (query, filters) => {
  filters.forEach(({ field, operator, value }) => {
    query = query.filter(field, operator, value);
  });
  return query;
};
/**
 * Get all customers based on filters.
 * @param {Array} filters filters to be applied.
 * @param {Number} limit number of records
 * @param {String} token next page token if there is any else false
 * @param {Function} callback call back method to return the result.
 */
const getall = (filters, limit, token) => {
  const query = applyFilters(
    ds
      .createQuery([kind])
      .limit(limit)
      .start(token),
    filters
  );
  return ds
    .runQuery(query)
    .then(result =>
      Promise.resolve({ rows: result[0].map(fromStore), pageToken: result[1] })
    )
    .catch(err => Promise.reject(err));
};
/**
 * Get customer from DB based on ID
 * @param {Number} id numeric customer id
 * @param {Function} callback call back function to return the result.
 */
const get = id => {
  const query = ds.createQuery([kind]).filter('id', '=', parseInt(id, 10));
  return ds
    .runQuery(query)
    .then(result => result[0].map(fromStore))
    .then(rs =>
      rs.length ? Promise.resolve({ rows: rs }) : Promise.reject('404')
    )
    .catch(err => Promise.reject(err));
};

module.exports = {
  getall,
  get
};

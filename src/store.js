const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = 'Customer';
/**
 * Convert db records to general format.
 * @param {*} row DB record.
 */
const fromStore = row => {
  const { id, name, age, country } = row;
  return {
    id,
    name,
    age,
    country
  };
};

const applyFilters = (query, filters) => {
  filters.forEach(filter => {
    query = query.filter(filter.field, filter.operator, filter.value);
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
      Promise.resolve({ rows: result[0].map(fromStore), pageCursor: result[1] })
    )
    .catch(err => Promise.reject(err));
  // ds.runQuery(query)
  //   .then(({ rows, info }) => {
  //     callback(
  //       null,
  //       rows.map(fromStore),
  //       info.moreResults !== Datastore.NO_MORE_RESULTS ? info.endCursor : false
  //     );
  //   })
  //   .catch(err => callback(err));
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
    .then(result => Promise.resolve({ rows: result[0].map(fromStore) }))
    .catch(err => Promise.reject(err));
};

const upload = (data, callback) => {
  const key = ds.key('Customer');
  const updated = data.map(record => {
    record.key = key;
    return record;
  });
  ds.save(updated, callback);
};
/**
 * Dummy data to be uploaded into DB for testing.
 * @param {Array} data data
 * @param {Function} callback call back to send response.
 */
const uploaddata = (data, callback) => {
  const query = ds.createQuery([kind]).limit(1);
  ds.runQuery(query)
    .then(result => result[0].length === 0 && upload(data, callback))
    .catch(err => upload(data, callback));
};
module.exports = {
  getall,
  get,
  uploaddata
};

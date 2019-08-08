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
/**
 * Get all customers based on filters.
 * @param {Array} filters filters to be applied.
 * @param {Number} limit number of records
 * @param {String} token next page token if there is any else false
 * @param {Function} callback call back method to return the result.
 */
const getall = (filters, limit, token, callback) => {
  let query = ds
    .createQuery([kind])
    .limit(limit)
    .start(token);
  if (Array.isArray(filters)) {
    filters.forEach(filter => {
      query = query.filter(filter.field, filter.operator, filter.value);
    });
  }
  ds.runQuery(query, (err, rows, nextQ) => {
    if (err) {
      callback(err);
      return;
    }
    const hasMore =
      nextQ.moreResults !== Datastore.NO_MORE_RESULTS ? nextQ.endCursor : false;
    callback(null, rows.map(fromStore), hasMore);
  });
};
/**
 * Get customer from DB based on ID
 * @param {Number} id numeric customer id
 * @param {Function} callback call back function to return the result.
 */
const get = (id, callback) => {
  const query = ds.createQuery([kind]).filter('id', '=', parseInt(id, 10));
  ds.runQuery(query, (err, rows, nextQ) => {
    if (err) {
      callback(err);
      return;
    }
    const converted = rows.map(fromStore);
    const customer = converted.length ? converted[0] : null;
    if (!customer) {
      callback('404');
      return;
    }
    callback(null, customer);
  });
};

/**
 * Dummy data to be uploaded into DB for testing.
 * @param {Array} data data
 * @param {Function} callback call back to send response.
 */
const uploaddata = (data, callback) => {
  const query = ds.createQuery([kind]).limit(1);
  ds.runQuery(query, (err, rows, nextQ) => {
    if (err || (rows && rows.length == 0)) {
      const key = ds.key('Customer');
      const updated = data.map(record => {
        record.key = key;
        return record;
      });
      ds.save(updated, callback);
    }
  });
};
module.exports = {
  getall,
  get,
  uploaddata
};

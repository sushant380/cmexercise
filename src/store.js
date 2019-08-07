const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = 'Customer';
const fromStore = row => {
  const { id, name, age, country } = row;
  return {
    id,
    name,
    age,
    country
  };
};
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
      callback(err);
    }
    callback(null, customer);
  });
};

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

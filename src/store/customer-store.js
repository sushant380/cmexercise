const { Datastore } = require("@google-cloud/datastore");
const ds = new Datastore();
const kind = "Customer";
const fromStore = row => {
  const { name, age, country } = row;
  return {
    name,
    age,
    country
  };
};
const getall = (limit, token, callback) => {
  const query = ds
    .createQuery([kind])
    .limit(limit)
    .start(token);
  ds.runQuery(query, (err, rows, nextQ) => {
    if (err) {
      console.log(err);
      callback(err);
      return;
    }
    const hasMore =
      nextQ.moreResults !== Datastore.NO_MORE_RESULTS ? nextQ.endCursor : false;
    callback(null, rows.map(fromStore), hasMore);
  });
};
const get = (id, callback) => {
  const query = ds.createQuery([kind]).filter("id", "=", id);
  ds.runQuery(query, (err, rows, nextQ) => {
    if (err) {
      console.log(err);
      callback(err);
      return;
    }
    const hasMore =
      nextQ.moreResults !== Datastore.NO_MORE_RESULTS ? nextQ.endCursor : false;
    callback(null, rows.map(fromStore), hasMore);
  });
};

const uploaddata = (data, callback) => {
  const key = ds.key("Customer");
  const updated = data.map(record => {
    record.key = key;
    return record;
  });
  ds.save(updated, callback);
};
module.exports = {
  getall,
  get,
  uploaddata
};

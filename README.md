# Customer management excercise

This is example implemented using [Express.JS](https://expressjs.com/de/) and Node js.

## Features

- Express JS
- GCP Datastore
- Chai
- Mocha
- Sinon
- REST API

## How to use

### 1. Download example & install dependencies

Clone the repository:

```
git clone git@github.com:sushant380/cmexercise.git
```

Install Node dependencies:

```
cd cmexercise
npm install
```

### 2. Deploy application on gcloud app engine

To run the example, open gcp sdk console on you local machine. Setup the gcp account and select default project for the deployment. Run following commands to deploy cmexcercise. Sample data will be uploaded into GCP Datastore for testing purpose.

```
cd path/cmexcersise
gcloud app deploy
```

### 3. Use the REST API

```
gcloud app browse
```

The server is now running on `http://{yourprojectid}.appspot.com`. You can send the API requests implemented in `src/app.js`, e.g. [`http://{yourprojectid}.appspot.com/customers`](http://{yourprojectid}.appspot.com/customers).

### 4. Using the REST API

#### `GET`

- `/customers`: Fetch all customer entities stored in DB.
- `/customers?name={nameString}&country={country}`: Fetch all customer entities stored in DB filtered by criteria passed in query parameters.
- `/customers/:id`: Fetch customer entity by its `id`.

### 5. Test

```
npm test
```

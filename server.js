const app = require('express')();
const API = require('json-api');
const mongoose = require('mongoose');
require('dotenv').config();

const APIError = API.types.Error;
mongoose.connect(process.env.DB_URL);

const models = {
  User: require('./models/user').model,
  Truck: require('./models/truck').model,
  Fleet: require('./models/fleet').model,
  City: require('./models/city').model,
  Journey: require('./models/journey').model
};

const registryTemplates = {
  users: require('./models/user').registry,
  trucks: require('./models/truck').registry,
  fleets: require('./models/fleet').registry,
  cities: require('./models/city').registry,
  journeys: require('./models/journey').registry
};

const adapter = new API.dbAdapters.Mongoose(models);
const registry = new API.ResourceTypeRegistry(registryTemplates,
  {dbAdapter: adapter});

const docs = new API.controllers.Documentation(registry, {name: 'Truck API'});
const controller = new API.controllers.API(registry);
const front = new API.httpStrategies.Express(controller, docs);

const apiReqHandler = front.apiRequest.bind(front);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Cache-Control');
  res.header('Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

const db = [
  'users',
  'trucks',
  'fleets',
  'cities',
  'journeys'
];

app.options('*', (req, res) => {
  res.send();
});

app.get('/api', front.docsRequest.bind(front));

app.route(`/api/:type(${db.join('|')})`).get(apiReqHandler).post(apiReqHandler)
  .patch(apiReqHandler);

app.route(`/api/:type(${db.join('|')})/:id`).get(apiReqHandler)
  .patch(apiReqHandler)
  .delete(apiReqHandler);

app.route(`/api/:type(${db.join('|')})/:id/relationships/:relationship`)
  .get(apiReqHandler).post(apiReqHandler).patch(apiReqHandler)
  .delete(apiReqHandler);

app.use((req, res) => {
  front.sendError(new APIError(404, undefined, 'Not Found'), req, res);
});

app.listen(process.env.PORT);

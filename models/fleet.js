const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const fleetSchema = new Schema({
  name: String,
  user: {type: ObjectId, ref: 'User'},
  truckList: [{type: ObjectId, ref: 'Truck'}]
});

module.exports = {
  schema: fleetSchema,
  model: mongoose.model('Fleet', fleetSchema),
  registry: {
    urlTemplates: {
      self: `${process.env.BASE_URL}/fleets/{id}`,
      relationship: `${process.env.BASE_URL}/fleets/${process.env.SUFFIX_URL}`
    }
  }
};

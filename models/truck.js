const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const truckSchema = new Schema({
  user: {type: ObjectId, ref: 'User'},
  maxPayload: {type: Number, required: true, default: 0},
  isDelivering: {type: Boolean, required: true, default: false},
  currentTown: {type: ObjectId, ref: 'City', required: true},
  fleetList: [{type: ObjectId, ref: 'Fleet'}]
});

module.exports = {
  schema: truckSchema,
  model: mongoose.model('Truck', truckSchema),
  registry: {
    urlTemplates: {
      self: `${process.env.BASE_URL}/trucks/{id}`,
      relationship: `${process.env.BASE_URL}/trucks/${process.env.SUFFIX_URL}`
    }
  }
};

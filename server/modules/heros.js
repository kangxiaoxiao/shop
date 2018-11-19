var mongoose = require('mongoose');
var MovieSchema = require('../schemas/heroList');
var Movie = mongoose.model('Movie', MovieSchema,"heros");

module.exports = Movie;


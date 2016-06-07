

// Mongoose import
var mongoose = require('mongoose');



// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://test:test@ds037272.mlab.com:37272/hecm')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('opened')
});
   

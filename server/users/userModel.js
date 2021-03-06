var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var bluebird = require('bluebird');
var SALT_WORK_FACTOR = 10;


var Schema = mongoose.Schema ;

// This is the User Table .
var userSchema = new Schema({
	username : { type : String , required: true , index : { unique : true }},
	password : {type : String , required: true },
	email  : {type:  String },
	firstName  : { type : String , required: true } , 
	lastName : { type : String , required: true } ,
	age : { type : Number } , 
  usersRating : {type : Array},
	cohortNumber : { type: Number , required: true },
	image : {type : String }  ,
	About : { type : String } ,  
  counter : {type: Number}, //  This is a new counter that counts how many students reflect to this Student
  gitHub:  {type : String},
  employed : {type : Boolean},
	salt: { type : String }
});

userSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }
    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }
      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

// Setting up the user Model . 
var User = mongoose.model('User' , userSchema);
User.comparePassword = function(candidatePassword, savedPassword, res, cb){
	bcrypt.compare( candidatePassword, savedPassword, function(err, isMatch){
		if(err){
			res.status(500).send('Error');
		} else if(cb){
			cb(isMatch);
		}
	});
};

module.exports = User;









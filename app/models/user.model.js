/**
 * Created by Zakaria on 20/04/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {type: String, lowercase: true},
  displayName: String,
  picture: {
    url: {type:String, default: 'img/img_user.png'},
    caption: String,
    thumbUrl: String,
    contentType: String
  },
  locality: {
    address: String,
    city: String,
    postal_code: String,
    country: String
  },
  deleted: {
    type: Boolean,
    default: false// true means it has been deleted
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

//
// userSchema.pre("save", function (next) {
//   var self = this;
//
//   this.constructor.findOne({email: this.email}, 'email', function (err, user) {
//     if (err) {
//       console.warn('err', err);
//       return next(err);
//     }
//     if (user) {
//       if (self.id === user.id) {
//         return next();
//       }
//       console.warn('user ', user);
//       self.invalidate("email", "L'email est unique");
//       return next(new Error("L'email que vous associez à ce compte existe déjà"));
//     } else {
//       next();
//     }
//   });
// });


module.exports = mongoose.model('User', userSchema);

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

/*
 * Passport "serializes" objects to make them easy to store, converting the
 * user to an identifier (id)
 */
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

/*
 * Passport "deserializes" objects by taking the user's serialization (id)
 * and looking it up in the database
 */
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  process.nextTick(function () {
    User.findOne({ email: email }, function (err, user) {
      if (err) return done(err)
      if (!user) return done(null, false)
      if (!user.validPassword(password)) return done(null, false)
      return done(null, user)
    })
  })
}))

module.exports = passport

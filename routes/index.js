var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

//index page
router.get('/', function(req, res, next) {
  res.render('index');
});
// profile page
router.get("/profile", isLoggedIn, function(req, res){
  res.render('profile')
})
// login
router.get("/login", function(req, res){
  res.render('index');
});

//register
router.post('/register', function(req, res){
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  })
  userModel.register(userdata, req.body.password)
  .then(function (registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile')
    })
  })
})
// log in
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile' ,
  failureRedirect: '/login' // corrected the redirect URL
}), function(req, res){ })

// log out 
router.get('/logout', function(req, res, next){
  req.logout(function(err){
    if (err){return next(err);}
    res.redirect('/');
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/');
}

module.exports = router;

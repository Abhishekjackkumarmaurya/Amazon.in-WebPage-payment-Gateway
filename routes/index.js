var express = require('express');
var router = express.Router();
const Razorpay = require('razorpay')

const passport = require('passport');
const userModel = require('./users');
const localStrategy = require('passport-local');

  // razorpay
  const instance = new Razorpay({
    key_id: 'rzp_test_RG8SmW8Vs3CEfQ',
    key_secret: 'Lu6olzRv5WOdTRJEhoYvWykL',
  });
  router.post('/create/orderId', function (req, res) {
    // console.log(req.body.product_Id)
    // let product=await product.findById(req.body.product_Id);
    var options = {
      amount: 3000 * 100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function (err, order) {
      console.log(order);
      res.send(order)
    });
  })

  router.post('/api/payment/verify', function (req, res) {
    var { validatePaymentVerification, validateWebhookSignature } =
    require('../node_modules/razorpay/dist/utils/razorpay-utils');
    const razorpayOrderId=req.body.response.razorpay_order_id;
    const razorpayPaymentId=req.body.response.razorpay_payment_id;
    const signature=req.body.response.razorpay_signature;
    const secret='Lu6olzRv5WOdTRJEhoYvWykL';
    const result= validatePaymentVerification({ "order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
     res.send(result)
   })



passport.use(new localStrategy(userModel.authenticate()));
const product=require('./product');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  var userData = new userModel({
    username: req.body.username,
    email: req.body.email,
  });
  userModel.register(userData, req.body.password).then(function(registeredUser) {
    passport.authenticate("local")(req, res, function() {
      res.redirect('/login');
    });
  });
});


router.get('/login', function(req, res) {
  res.render('loginPage');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}));


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});


router.get('/home', isLoggedIn, async function(req, res, next) {
  try {
    const loggedInUser = await userModel.findOne({ username: req.user.username });
    res.render('home', { loggedInUser });
  } catch (error) {
    next(error);
  }
});




// router.get('/create', (req, res) => {
//   res.render('createProduct');
// });


// router.post('/create', async (req, res) => {
//   try {
//       await Product.create(req.body);
//       res.redirect('/login');
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//   }
// });




module.exports = router;

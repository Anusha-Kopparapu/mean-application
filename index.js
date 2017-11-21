// executed simple node example with express and nodemon with out angular
// var express    = require('express'); // call express
// var app        = express(); // define our app using express

/*  Practise with node js and express Js*/
// app.get('/', function(req, res){
//    res.send("Hello world!");
// });
// //executed express routing with out angular 
// app.get('/hello', function(req, res){
//    res.send("You just called the get method at '/hello'!\n");
// });

// //Executing routing express.router
//     var adminRouter = express.Router();
 
  
//   adminRouter.use(function(req, res, next) {

 	
//  	 	console.log(req.method, req.url);

 	
//  	next(); 
//  });
//    // need to check in (http://localhost:1337/admin)
//   adminRouter.get('/', function(req, res) {
//   	res.send('I am admin!');
//   });
 
//  // need to check in (http://localhost:1337/admin/users)
//  adminRouter.get('/users', function(req, res) {
//  	res.send('I show all the users!');
//  });

//  //route parameters
//  // need to check in  (http://localhost:1337/admin/users/name)
//  adminRouter.get('/users/:name', function(req, res) {
// 	res.send('hello ' + req.params.name + '!');
//  });

//  // need to check in  (http://localhost:1337/admin/posts)
//  adminRouter.get('/posts', function(req, res) {
//  	res.send('I will post you all the updates!');
//  });
//  app.use('/admin', adminRouter); 
//  // apply the routes to our application app.use('/admin', adminRouter);
//  app.listen(3000);
// console.log('server running on the port 3000!');

 /* practise with node js ,express js and mongo Db*/

var express    = require('express'); // call express
var app        = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan     = require('morgan'); // used to see requests
var mongoose   = require('mongoose'); // for working w/ our database
var port       = process.env.PORT || 8000; // set the port for our app
var User     = require('./app/models/user');
var jwt = require('jsonwebtoken');
var superSecret = 'myfavchoclateisdiarymilk';
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
 app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST','PUT');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
Authorization');
next();
 });

 // log all requests to the console 
 app.use(morgan('dev'));
 
 // ROUTES FOR OUR API
 // =============================
 
 // basic route for the home page
 app.get('/', function(req, res) {
    res.send('Welcome to the home page!');
 });
 
 // get an instance of the express router
 var apiRouter = express.Router();
  
 // test route to make sure everything is working 
  // accessed at GET http://localhost:8080/api
 apiRouter.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
  });
 
  app.use('/api', apiRouter);
 
 // START THE SERVER
 // ===============================
  app.listen(port);
 console.log('Magic happens on port ' + port);
 mongoose.connect('mongodb://localhost:27017/test');
  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  apiRouter.post('/authenticate', function(req, res) {
  
    // find the user
   // select the name username and password explicitly
   User.findOne({
     username: req.body.username
   }).select('name username password').exec(function(err, user) {
 
    if (err) throw err;
 
     // no user with that username was found
     if (!user) {
       res.json({ 
         success: false, 
         message: 'Authentication failed. User not found.' 
       });
    } else if (user) {
       // check if password matches
       var validPassword = user.comparePassword(req.body.password);
       if (!validPassword) {
         res.json({ 
           success: false, 
           message: 'Authentication failed. Wrong password.' 
         });
       } else {
 
         // if user is found and password is right
         // create a token
         var token = jwt.sign({
           name: user.name,
          username: user.username
         }, superSecret, {
           //expiresInMinutes: 1440 // expires in 24 hours
         });
 
        // return the information including token as JSON
         res.json({
           success: true,
           message: 'Enjoy your token!',
          token: token
         });
       }   
   }
 
   });
 });
   
 apiRouter.route('/users')
 
    // create a user (accessed at POST http://localhost:8080/api/users)
   .post(function(req, res) {
       
        // create a new instance of the User model
       var user = new User();       
        // set the users information (comes from the request)
       user.name = req.body.name; 
                user.name = req.body.name;  
               user.username = req.body.username;
                user.password = req.body.password;
                console.log(user);
       
                // save the user and check for errors
                user.save(function(err) {
                    if (err) {
                        // duplicate entry
                        if (err.code == 11000) 
                           return res.json({ success: false, message: 'A user with that\
         username already exists. '});
                        else 
                            return res.send(err);
                    }
        
                   res.json({ message: 'User created!' });
               });
               
           })
 
           
          
            // create a user (accessed at POST http://localhost:8080/api/users)
            .post(function(req, res) {
                        
            })
               apiRouter.route('/users/:user_id')
            // get all the users (accessed at GET http://localhost:8080/api/users)
            .get(function(req, res) {
                User.findById(req.params.user_id ,function(err, users) {
                    if (err) res.send(err);
           
                    // return the users
                    res.json(users);
                });
            })
          
          
               apiRouter.route('/users')
              
                // get all the users (accessed at GET http://localhost:8080/api/users)
                .get(function(req, res) {
                    User.find(function(err, users) {
                        if (err) res.send(err);
              
                        // return the users
                        res.json(users);
                    });
                });
              
              // update the user with this id
  // (accessed at PUT http://localhost:8080/api/users/:user_id)
  apiRouter.route('/users/:user_id')
  
      .put(function(req, res) {
    
       // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {
          if (err) res.send(err);
    
         // update the users info only if its new
          if (req.body.name) user.name = req.body.name;
          if (req.body.username) user.username = req.body.username;
          if (req.body.password) user.password = req.body.password;
         // save the user
         user.save(function(err) {
           if (err) res.send(err);
    
           // return a message
            res.json({ message: 'User updated!' });
          });
         });
     })
     apiRouter.route('/users/:user_id')
    
    
        // delete the user with this id 
        // (accessed at DELETE http://localhost:8080/api/users/:user_id)
        .delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err) return res.send(err);
    
            res.json({ message: 'Successfully deleted' });
            });
        });

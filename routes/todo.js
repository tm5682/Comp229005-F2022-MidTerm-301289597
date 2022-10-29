var express = require('express');
const { session } = require('passport');
const { request } = require('../config/app');
var router = express.Router();

let todoController = require('../controllers/todo');

// Helper function for guard purposes
function requireAuth(req, res, next)
{
    // check if the user is logged in
     // ADD YOUR CODE HERE 
     // we are using passport isAuthenticated function to state to go next if authentication is good else redirect to signin page
    if (req.isAuthenticated()) {
        return next ();
    } else {
          //else we redirect user to signin
          res.redirect('/users/signin') 
    }
          

}

/* GET list of items */
router.get('/list', todoController.todoList);

// Route for Details
router.get('/details/:id', todoController.details);

// Routers for edit
router.get('/edit/:id',  requireAuth, todoController.displayEditPage);
router.post('/edit/:id',  requireAuth, todoController.processEditPage);

// Delete
router.get('/delete/:id',  requireAuth, todoController.performDelete);

/* GET Route for displaying the Add page - CREATE Operation */
router.get('/add',  requireAuth, todoController.displayAddPage);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/add',  requireAuth, todoController.processAddPage);

module.exports = router;
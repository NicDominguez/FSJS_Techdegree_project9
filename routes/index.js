const express = require("express");
const router = express.Router();

const db = require("../db");
const { Users } = db.models;

const Sequelize = require('sequelize');


/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            return next(error)
        }
    }
};

/* User authentication handler */
const authenticateUser = (req, res, next) => {
      // Parse the user's credentials from the Authorization header.

  // If the user's credentials are available...
  // Attempt to retrieve the user from the data store
  // by their username (i.e. the user's "key"
  // from the Authorization header).

  // If a user was successfully retrieved from the data store...
  // Use the bcryptjs npm package to compare the user's password
  // (from the Authorization header) to the user's password
  // that was retrieved from the data store.

  // If the passwords match...
  // Then store the retrieved user object on the request object
  // so any middleware functions that follow this middleware function
  // will have access to the user's information.

  // If user authentication failed...
  // Return a response with a 401 Unauthorized HTTP status code.

  // Or if user authentication succeeded...
  // Call the next() method.

    next();
}


// TODO setup your api routes here

router.get('/api/users200', (req, res) => {
    res.json(user)
});

router.post('/api/users201', (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).end();
});

router.get('/api/courses200', (res, req) => {
    //Returns a list of courses (including the user that owns each course)
});

router.get('/api/:id200', (res, req) => {
    //Returns the course (including the user that owns the course) for the provided course ID
});

router.post('/api/courses201', (res, req) => {
    // Creates a course, sets the Location header to the URI for the course, and returns no content
});

router.put('/api/courses/:id204', (res, req) => {
    // Updates a course and returns no content
});

router.delete('/api/courses/:id204', (res, req) => {
    // Deletes a course and returns no content
});

// setup a friendly greeting for the root route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});


module.exports = router;
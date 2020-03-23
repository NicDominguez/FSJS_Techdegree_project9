const express = require("express");
const router = express.Router();
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

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
    const credentials = auth(req)
    // If the user's credentials are available...
    if (credentials) {
        // Attempt to retrieve the user from the data store by their username (i.e. the user's "key" from the Authorization header).
        const user = '' // TODO defin where user is stored    
        
        // If a user was successfully retrieved from the data store...
        if (user) {
            // Use the bcryptjs npm package to compare the user's password (from the Authorization header) to the user's password that was retrieved from the data store.    
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
            
            // If the passwords match...
            if (authenticated) {
                // Then store the retrieved user object on the request object so any middleware functions that follow this middleware function will have access to the user's information. 
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.username}`
            }

        } else {
            message = `User not found for username: ${credentials.name}`;
        }

    } else {
        message = `Auth header not found`;
    }

    // If user authentication failed...
    if (message) {
        console.warn(message);
        // Return a response with a 401 Unauthorized HTTP status code.
        res.status(401).json({message: 'Access Denied'});
    } else {
        // Or if user authentication succeeded...Call the next() method.
        next();   
    }
    




}


// TODO setup your api routes here

router.get('/api/users200', authenticateUser, (req, res) => {
    const user = req.currentUser;
    res.json({
        name: user.name,
        username: user.username,
    });
});

router.post('/api/users201', (req, res) => {
    // Get the user from the request body.
    const user = req.body;
    // Hash the new user's password.
    user.password = bcryptjs.hashSync(user.password);
    users.push(user); // TODO create user in database instead of pushing to array
    res.status(201).end();
});

router.get('/api/courses200', (res, req) => {
    //Returns a list of courses (including the user that owns each course)
});

router.get('/api/courses/:id200', (res, req) => {
    //Returns the course (including the user that owns the course) for the provided course ID
});

router.post('/api/courses201', authenticateUser, (res, req) => {
    const user = req.currentUser;
    res.json({
        name: user.name,
        username: user.username
    });
    // Creates a course, sets the Location header to the URI for the course, and returns no content
});

router.put('/api/courses/:id204', authenticateUser, (res, req) => {
    const user = req.currentUser;
    res.json({
        name: user.name,
        username: user.username
    });
    // Updates a course and returns no content
});

router.delete('/api/courses/:id204', authenticateUser, (res, req) => {
    const user = req.currentUser;
    res.json({
        name: user.name,
        username: user.username
    });
    // Deletes a course and returns no content
});

// setup a friendly greeting for the root route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});


module.exports = router;
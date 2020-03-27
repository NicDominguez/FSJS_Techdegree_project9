const express = require('express');
const router = express.Router();

const db = require('../db');
const { User } = db.models;
const { Course } = db.models;

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

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
const authenticateUser = asyncHandler(async (req, res, next) => {
    let message = null;
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req)
    // If the user's credentials are available...
    if (credentials) {
        // Attempt to retrieve the user from the data store by their username (i.e. the user's "key" from the Authorization header).
        const user = await User.findOne({where: {emailAddress: credentials.name} })// TODO Revise req.header
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
})


// TODO setup your api routes here

router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    res.status(200);
    res.json(req.currentUser);
}));

router.post('/users', asyncHandler(async (req, res) => {    
    // Get the user from the request body.
    const user = req.body;
    // Hash the new user's password.
    user.password = bcryptjs.hashSync(user.password);
    const newUser = await User.create(user);
    console.log(newUser)
    res.status(201).end();
}));

router.get('/courses', asyncHandler(async (req, res) => {
    //Returns a list of courses (including the user that owns each course)
    const courses = await Course.findAll()
    res.status(200);
    res.json(courses)
    
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
    //Returns the course (including the user that owns the course) for the provided course ID
    const course = await Course.findByPk(req.params.id);
    if (course) {
        res.status(200)
        return res.json(course);  
    } else {
        throw error = {
            status: 400,
            message: "I'm Sorry but that course does not exist"
        }
    }
    ;
}));

router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    // Creates a course, sets the Location header to the URI for the course, and returns no content
    const user = req.currentUser;
    const courseDetails = req.body
    const newCourse = await Course.create({
        title: courseDetails.title,
        description: courseDetails.description,
        estimatedTime: courseDetails.estimatedTime,
        materialsNeeded: courseDetails.materialsNeeded
    });
    res.status(201);end()
}));

router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(204);
    res.json({
        name: user.name,
        username: user.username
    });
    // Updates a course and returns no content
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(204);
    res.json({
        name: user.name,
        username: user.username
    });
    // Deletes a course and returns no content
}));

module.exports = router;
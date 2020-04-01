const express = require('express');
const router = express.Router();

const db = require('../db');
const { User } = db.models;
const { Course } = db.models;

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

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

/* Validation Checks */
const emailValidationChain = check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address');


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
                req.currentUser = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress
                };
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

router.post('/users', emailValidationChain, asyncHandler(async (req, res) => {
    // Check if emailValidationChain threw any errors
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({errors: errorMessages});
    }    
    // Get the user from the request body.
    const user = req.body;
    const email = req.body.emailAddress;
    // Check if email address already exists in database
    const emailExistsCheck = await User.findAll( { where: {emailAddress: email} } )
    if (emailExistsCheck.length === 0) {
        // Hash the new user's password.
        user.password = bcryptjs.hashSync(user.password);
        // Create the new user in the database
        await User.create(user);
        res.status(201).end();
    } else {
        throw (error = {
          status: 401,
          message: "That email address has already been registered"
        });
    }
}));

router.get('/courses', asyncHandler(async (req, res) => {
    //Returns a list of courses (including the user that owns each course)
    const courses = await Course.findAll( { attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'] } )
    res.status(200);
    res.json(courses)
    
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
    //Returns the course (including the user that owns the course) for the provided course ID
    const course = await Course.findByPk(req.params.id, {
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId"
      ]
    });
    if (course) {
        res.status(200)
        return res.json(course);  
    } else {
        throw error = {
            status: 400,
            message: "I'm sorry but that course does not exist"
        }
    }
    ;
}));

router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    // Creates a course, sets the Location header to the URI for the course, and returns no content
    await Course.create(req.body);
    res.status(201).end()
}));

router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const courseToUpdate = await Course.update(req.body, { where: {
        id: req.params.id,
        userId: user.id
    } });
    res.status(204).end();
}));
    
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    await Course.destroy( { where: {
        id: req.params.id, 
        userId: user.id
    } });
    res.status(204).end();
    // Deletes a course and returns no content
}));

module.exports = router;
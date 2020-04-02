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
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json(errors);
            } else {
               return next(error) 
            }  
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


// USER ROUTES

// Returns the current authenticated user information
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;

    const authenticatedUser = await User.findByPk(user.id, {
        attributes: ['firstName', 'lastName', 'emailAddress']
    })

    if (authenticatedUser) {
        res.status(200).json(authenticatedUser);
    } else {
        throw (error = {
            status: 400,
            message: "User not found"
        });
    }
}));

// Creates a new user and sets location header to "/", returns no content
router.post('/users', emailValidationChain, asyncHandler(async (req, res) => {
    // Check if supplied request body has any missing values
    if (!req.body.firstName || !req.body.lastName || !req.body.emailAddress || !req.body.password) {
        throw error = {
            status: 400,
            message: "Please provide a first name, last name, email address, and password"
        }
    }
    // Check if emailValidationChain threw any errors
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({errors: errorMessages});
    } else {
        // Get the user and email from the request body.
        const user = req.body;
        const email = req.body.emailAddress;
        // Check if email address already exists in database
        const emailExistsCheck = await User.findAll({ where: { emailAddress: email } })
        if (emailExistsCheck.length === 0) {
            // Hash the new user's password.
            user.password = bcryptjs.hashSync(user.password);
            // Create the new user in the database
            await User.create(user);
            res.status(201).location('/').end();
        } else {
            throw (error = {
                status: 401,
                message: "That email address has already been registered"
            });
        }
    }   
}));


// COURSE ROUTES

//Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({ 
        include: [{
                model: User, 
                attributes: ['firstName', 'lastName', 'emailAddress'] 
            }],
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"]
    })
    res.status(200).json(courses);
}));

//Returns the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [{
            model: User,
            attributes: ['firstName', 'lastName', 'emailAddress']
        }],
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"]
    });
    if (course) {
        res.status(200).json(course);  
    } else {
        throw error = {
            status: 400,
            message: "I'm sorry but that course does not exist"
        }
    };
}));

// Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    if (!req.body.title || !req.body.description) {
        throw error = {
            status: 400,
            message: "Please provide a title and description for the course"
        }
    } else {
        const course = await Course.create(req.body);
        res.status(201).location('/courses/' + course.id).end()
    }
}));

// Updates a course and returns no content
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    if (!req.body.title || !req.body.description) {
        throw error = {
            status: 400,
            message: "Please provide a title and description for the course"
        }
    } else {
        const user = req.currentUser;
        const course = await Course.update(req.body, {
            where: {
                id: req.params.id,
                userId: user.id
            }
        });
        if (course.length === 0) {
            throw error = {
                status: 403,
                message: "I'm sorry but this course does not belong to the current user"
            }
        } else {
            res.status(204).end(); 
        }
    }
}));

    
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id, {where: {userId: user.id}})
    if (!course) {
        throw error = {
            status: 403,
            message: "I'm sorry but this course does not belong to the current user"
        }
    } else {
        await Course.destroy({ where: {
            id: req.params.id,
            userId: user.id
        }});
        res.status(204).end();
    }
}));

module.exports = router;
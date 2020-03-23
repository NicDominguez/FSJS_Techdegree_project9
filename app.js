'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

//User Record
const users = []

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here

app.get('/api/users200', (req, res) => {
  res.json(user)
});

app.post('/api/users201', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).end();
});

app.get('/api/courses200', (res, req) => {
  //Returns a list of courses (including the user that owns each course)
});

app.get('/api/:id200', (res, req) => {
  //Returns the course (including the user that owns the course) for the provided course ID
});

app.post('/api/courses201', (res, req) => {
  // Creates a course, sets the Location header to the URI for the course, and returns no content
});

app.put('/api/courses/:id204', (res, req) => {
  // Updates a course and returns no content
});

app.delete('/api/courses/:id204', (res, req) => {
  // Deletes a course and returns no content
});

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

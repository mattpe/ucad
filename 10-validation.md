# Input Validation and Error Handling

## Data Validation and Sanitization

Input data validation in web applications is a critical process that ensures the integrity, accuracy, and security of the data received from user inputs. It involves verifying that the data entered by users matches the expected format, type, and content before processing or storing it. Effective input validation can prevent a wide range of issues, including security vulnerabilities, data corruption, and application errors.

- **Required Fields**: Ensuring that mandatory fields are not empty.
- **Type Validation**: Ensuring the data is of the correct type, such as string, integer, or date.
- **Format Validation**: Checking if the data adheres to a specific format. For example, email addresses should match a standard email format.
- **Range and Size Validation**: Ensuring the data falls within a defined range (e.g., a number between 1 and 100) or meets size constraints (e.g., a string that is not longer than 255 characters).
- **Consistency Checks**: Verifying that the data is consistent with other data or constraints. For instance, a 'confirm password' field should match the 'password' field.
- **Business Rule Validation**: Applying validations that are specific to the business logic of the application. For example, checking if a user is old enough for a service.
- **Sanitization**: Removing or encoding potentially dangerous characters to prevent issues like:
  - SQL Injections, where an attacker could input malicious SQL code that gets executed on the database.
  - Cross-Site Scripting (XSS), where malicious scripts are injected into webpages viewed by other users.
  - This often means stripping out HTML, JavaScript, or SQL code from the inputs.
  - [SQL vs. XXS Injection Attacks Explained](https://www.keirstenbrager.tech/sql-vs-xxs-injection-attacks-explained/)

### Client-Side Validation

- Performed in the user's browser before the data is sent to the server.
  - Typically implemented within HTML forms by the [HTML5's built-in form validation or using JavaScript](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation).
- Useful for **improving user experience** (e.g. quick feedback on form errors)
- Should not be the only method used as it can be bypassed by the user!

### Server-Side Validation

- Performed on the server after the data is received.
- A critical layer of validation that **ensures security and data integrity**, as it cannot be bypassed by the user.
- Many web development frameworks and libraries provide built-in functions and validators to simplify the process of data validation.

## Server-side data validation with Express

- [express-validator](https://express-validator.github.io/docs/)
  - a set of Express middlewares that wraps the extensive collection of validators and sanitizers offered by [validator.js](https://github.com/validatorjs/validator.js).
  - [List of all validators](https://github.com/validatorjs/validator.js#validators)
  - [Sanitization](https://express-validator.github.io/docs/guides/getting-started#sanitizing-inputs)
- [MDN Example](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms#Using_express-validator)
- [Regular expressions](https://en.wikipedia.org/wiki/Regular_expression) can be used to test strings against a pattern. They are often used for validation and sanitization.
  - [MDN Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
  - [Regex101](https://regex101.com/)
  - [Regexr](https://regexr.com/)

### Example 1: User registration (`POST /api/users`)

(or `POST /api/auth/register`)

- Validation rules:
  - _username_: required, alphanumeric, 3-20 characters
  - _email_: required, valid email address
  - _password_: required, min. 8 characters
  - What about a rule like: "_confirm_password_: required, must match password"? - not needed on server-side, important on client-side

1. Install `express-validator`
1. Example database query function in _user-model.js_:

    ```js
    /**
    * Creates a new user in the database
    * 
    * @param {object} user data
    * @returns {number} - id of the inserted user in db
    */
    const addUser = async (user) => {
      try {
        const sql = `INSERT INTO Users (username, email, password, user_level_id)
                    VALUES (?, ?, ?, ?)`;
        // user level id defaults to 2 (normal user)                 
        const params = [user.username, user.email, user.password, 2];
        const result = await promisePool.query(sql, params);
        return result[0].insertId;
      } catch (e) {
        console.error('error', e.message);
        return {error: e.message};
      }
    }
    ```

1. Add validation middleware to the route handler and validation rules to the request body fields

    ```js
    ...
    import {body} from 'express-validator';
    ...
    // routes for /api/users/
    userRouter.route('/')
      .get(getUsers)
      .post(
        body('email').trim().isEmail(),
        body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
        body('password').trim().isLength({min: 8}),
        postUser
      );
    ...
    ```

1. Handle validation errors in controller

    ```js
    import {validationResult} from 'express-validator';
    import {addUser} from '../models/user-model.js';

    const postUser = async (req, res) => {
      // validation errors can be retrieved from the request object (added by express-validator middleware)
      const errors = validationResult(req);
      // check if any validation errors
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
      const newUserId = await addUser(req.body);
      res.json({message: 'new user added', user_id: newUserId});
    };
    ...
    ```

1. Test the endpoint with Postman or VSC REST Client
   - Try to send invalid data and verify that the validation works as expected

### Example 2: File upload (`POST /api/media`)

- Validation rules:
  - _title_: required, 3-50 characters
  - _description_: optional, max. 255 characters
  - _file_: required, max. 10 MB, only images or videos allowed
    - file needs to be validated with Multer's [fileFilter](https://github.com/expressjs/multer#filefilter)

1. Use fileFilter to validate the file itself, multer can be configured in a separate file, e.g. _middlewares/upload.js_:

    ```js
    import multer from 'multer';
    // multer configuration
    const upload = multer({
      dest: 'uploads/',
      limits: {
        fileSize: 10 * 1024 * 1024, // max 10 MB
      },
      fileFilter: (req, file, cb) => {
        // allow only images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
          // accept file
          cb(null, true);
        } else {
          // reject file
          cb(null, false);
        }
      },
    });
    export default upload;
    ```

1. Add validation middleware to the route handler and validation rules to the request body fields

    ```js
    ...
    import {body} from 'express-validator';
    import upload from '../middlewares/upload.js';
    ...
    mediaRouter
      .route('/')
      .get(getMedia)
      .post(
        authenticateToken,
        upload.single('file'),
        // TODO: add validation rules here
        postMedia);
    ...
    ```

1. Handle validation errors in controller

    ```js
    import {validationResult} from 'express-validator';
    ...
    const postMedia = async (req, res) => {
      // check if file is rejected by multer
      if (!req.file) {
        return res.status(400).json({error: 'Invalid or missing file'});
      }
      // validation errors can be retrieved from the request object (added by express-validator middleware)
      const errors = validationResult(req);
      // check if any validation errors
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
      // TODO: call model function to add the valid media item to database
      ...
    };
    ...
    ```

1. Test the endpoint with Postman or VSC REST Client
   - Try to send invalid data and verify that the validation works as expected

## Handling Errors in Express

- Study: [Error Handling](https://expressjs.com/en/guide/error-handling.html)
- Express comes with a default error handler but the response body is in HTML format
  - not very convenient for Rest API clients (software, not humans)
- Custom error handler middleware can be used to return error responses in JSON format
- Error handler middleware is a function that takes four arguments instead of the usual three: `(err, req, res, next)`
  - The first argument is the error object
  - If the error handler middleware is called, the next middleware in the chain is skipped
  - Error handler middleware should be the last middleware in the chain

1. Add error handler middleware functions to _middlewares/middlewares.js_ (or create a new file _middlewares/error-handler.js_):

    ```js
    ...
    const notFoundHandler = (req, res, next) => {
      const error = new Error(`Not Found - ${req.originalUrl}`);
      error.status = 404;
      next(error); // forward error to error handler
    };
    /**
    * Custom default middleware for handling errors
    */
    const errorHandler = (err, req, res, next) => {
      res.status(err.status || 500); // default is 500 if err.status is not defined
      res.json({
        error: {
          message: err.message,
          status: err.status || 500
        }
      });
    };
    ...
    ```

1. Import the error handler middleware in _index.js_ and add it as the last middleware in the chain

    ```js
    ...
    // Import error handler middlewares on the top of the file
    ...
    ...
    // Default for all routes not handled by routers above
    app.use(notFoundHandler);
    // Add error handler middleware as the last middleware in the chain
    app.use(errorHandler);
    ...
    ```

1. Refactor your code to use the error handler middleware
   - Remove the error responses from your controllers
   - Use `next()` to pass the error to the error handler middleware, some examples:

    ```js
    // user-controller.js
    import {validationResult} from 'express-validator';
    import {addUser} from '../models/user-model.js';

    const postUser = async (req, res, next) => {
      // validation errors can be retrieved from the request object (added by express-validator middleware)
      const errors = validationResult(req);
      // check if any validation errors
      if (!errors.isEmpty()) {
        // pass the error to the error handler middleware
        const error = new Error('Invalid or missing fields');
        error.status = 400;
        return next(error);
      }
      // TODO: add password hashing here and error handling for SQL errors
      const newUserId = await addUser(req.body);
      res.json({message: 'new user added', user_id: newUserId});
    };
    ...
    ```

    ```js
    // media-controller.js
    const postMedia = async (req, res, next) => {
      // check if file is rejected by multer
      if (!req.file) {
        const error = new Error('Invalid or missing file');
        error.status = 400;
        next(error);
      }
      const errors = validationResult(req);
      // check if any validation errors
      if (!errors.isEmpty()) {
        console.log('postMedia errors', errors.array());
        const error = new Error('Invalid or missing fields');
        error.status = 400;
        return next(error);
      }
      const {title, description} = req.body;
      const {filename, mimetype, size} = req.file;
      // req.user is added by authenticateToken middleware
      const user_id = req.user.user_id;
      const newMedia = {title, description, user_id, filename, mimetype, size};
      const result = await addMedia(newMedia);
      if (result.error) {
        return next(new Error(result.error));
      }
      res.status(201).json({message: 'New media item added.', ...result});
    };
    ...
    ```

   - Modify _middlewares/upload.js_ to pass the error to the error handler middleware

    ```js
    // multer configuration
    const upload = multer({
      dest: 'uploads/',
      limits: {
        fileSize: 10 * 1024 * 1024, // max 10 MB
      },
      fileFilter: (req, file, cb) => {
        // only allow images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          const error = new Error('Only images and videos are allowed!');
          error.status = 400;
          cb(error, false);
        }
      },
    });
    ...
    ```

1. Test the error handler by sending invalid requests to the API, for example:
   - `POST /api/users` with an empty request body
   - `POST /api/media` with an empty request body
   - `POST /api/media` with a file that is not an image or video
   - `POST /api/media` with a file that is larger than 10 MB

---

## Assignment 5, part B - Input validation and error handling

1. Continue your existing Express app and create a new branch `validation`
1. Implement error handler middleware (1 p.)
   - Use the error handler in your controllers instead of "hard-coded" sending error responses
1. Implement proper server-side validation and sanitization for all input data (max 2 p.)
   - Use [express-validator](https://express-validator.github.io/docs/)
   - Specify the validation rules for each field in the request bodies

**Returning:** A short report _describing your implementation_ in `readme.md` including a link to your code in Github and screen shots of your running environment (e.g. images displaying HTTP requests and corresponding responsenses in practice). Submit a direct link to the assignment branch to OMA. Check assignment in OMA for more details.

**Grading:** max 3 points, see details in assignment requirements above.

# API Documentation

Documenting a REST API is crucial for both internal development and external API consumption. Good documentation makes it easier for developers to understand and use the API effectively. Documentation should include comprehensive details about the API's capabilities, endpoints, request/response formats, authentication methods, and examples of usage:

- **Introduction**: Briefly describe what the API does. Provide the base URL for the API.
- **Authentication**: Explain how users authenticate with the API (e.g., JWT, API keys, OAuth).
- **Endpoints**, for each endpoint, include:
  - _URL_: Full URL path.
  - _Method_: HTTP method (GET, POST, PUT, DELETE, etc.)
  - _Headers_: Required headers.
  - _Query Parameters_: List of parameters, their types, and whether they are mandatory or optional.
  - _Request Body_: Describe the structure for POST/PUT requests. Include sample JSON/XML as needed.
  - _Sample Request_: Provide a sample request to demonstrate usage.
  - _Success Response_: Example of a successful response, including status code and response body.
  - _Error Response_: Example of an error response.
  - _Description_: Explain what the endpoint does.
- **Errors**: Describe common error codes used in the API (e.g., 400, 404, 500) and their meanings.
- **Rate Limits**: Detail any limits on how often the API can be called.
- Other relevant information may include:
  - FAQ/Troubleshoot: common questions or issues users might encounter.
  - Change Log: Document the history of significant changes to the API.
  - Terms of Use and Contact Information

One example of well-made API docs: [Stripe API Reference](https://stripe.com/docs/api)

## Documentation Tools

- There are several tools, specifications and markup languages available for creating/generating documentation.
- Reading: [Understanding the Differences Between API Documentation, Specifications, and Definitions](https://swagger.io/resources/articles/difference-between-api-documentation-specification/)

### Swagger

- [Swagger](https://swagger.io/) is one of the most popular tools for API documentation.
- Uses [OpenAPI specification](https://www.openapis.org/) format to describe RESTful APIs
- Offers tools for designing and testing APIs, and generating interactive documentation.
- For Node.js and Express, you can use packages like swagger-ui-express to integrate Swagger.
- Example 1: [Documenting your Express API with Swagger](https://blog.logrocket.com/documenting-express-js-api-swagger/)
- Example 2: [How to Build Better APIs in Express with OpenAPI](https://www.freecodecamp.org/news/how-to-build-explicit-apis-with-openapi/)

### ApiDoc

- [ApiDoc](https://apidocjs.com/) is a simple tool that creates documentation from API annotations in your source code.
- Support for multiple programming languages, including Node.js and Express.
- Annotations are added directly in your code comments, which ApiDoc uses to generate the documentation.
- Can be integrated also to swagger by using [apidoc-swagger](https://github.com/amanoooo/apidoc-swagger-3) package

#### Usage example

1. Install apidoc package: `npm install apidoc`
1. Add apidoc script to `package.json`, for example: `"apidoc": "apidoc -i src/ -o docs/"`
1. Add apidoc configuration to `package.json`:

   ```json
   ...
   "apidoc": {
     "title": "My API docs",
     "url": "https://example.com/api/v1",
     "order": [
       "Authentication",
       "User"
     ]
   },
   ...
   ```

   - or create a separate config file: `apidoc.json`:

     ```json
     {
       "name": "apidoc-example",
       "version": "0.3.0",
       "description": "My apiDoc example project",
       "title": "Custom apiDoc browser title",
       "url" : "https://api.example.com/v1",
       "header": {
         "title": "My own header title",
         "filename": "header.md"
       },
       "footer": {
         "title": "My own footer title",
         "filename": "footer.md"
       },
       "order": [
         "GetUser",
         "PostUser"
       ],
       "template": {
         "withCompare": true,
         "withGenerator": true
       }
     }
     ```

1. Add api annotations to your code comments in routers (or to a separate js-file), for example:

   ```js
   /**
    * @api {get} /api/resource/:id Request Resource information
    * @apiName GetResource
    * @apiGroup Resource
    *
    * @apiParam {Number} id Resource unique ID.
    *
    * @apiSuccess {String} firstname Firstname of the Resource.
    * @apiSuccess {String} lastname  Lastname of the Resource.
    */
   ```

1. Generate documentation: `npm run apidoc`
1. Serve the `docs/` folder using `express.static` middleware
1. Add `docs/` folder to `.gitignore` file
1. Browse to `http://localhost:3000/docs/` to see the generated documentation

Example annotations for `auth-router.js`:

```js
const authRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */

/**
 * @apiDefine UnauthorizedError
 * @apiError UnauthorizedError User name or password invalid.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "message": "username/password invalid",
 *         "status": 401
 *       }
 *     }
 */

/**
 * @api {post} /login Login
 * @apiVersion 1.0.0
 * @apiName PostLogin
 * @apiGroup Authentication
 * @apiPermission all
 *
 * @apiDescription Sign in and get an authentication token for the user.
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} password Password of the user.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "username": "johnd",
 *      "password": "examplepass"
 *    }
 *
 * @apiSuccess {String} token Token for the user authentication.
 * @apiSuccess {Object} user User info.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Logged in successfully",
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwid
 *                XNlcm5hbWUiOiJ1dXNpMSIsImVtYWlsIjoidXVzaTFAZXhhbXBsZS5jb20
 *                iLCJ1c2VyX2xldmVsX2lkIjoyLCJpYXQiOjE3MDEyNzkzMjJ9.3TbVTcXS
 *                dryTDm_huuXC_U1Lg4rL0SOFyn_WAsC6W0Y"
 *      "user": {
 *        "user_id": 21,
 *        "username": "johnd",
 *        "email": "johnd@example.com",
 *        "user_level_id": 2
 *      }
 *    }
 *
 * @apiUse UnauthorizedError
 */
authRouter.route('/login').post(postLogin);

/**
 * @api {get} /auth/me Request information about current user
 * @apiVersion 1.0.0
 * @apiName GetMe
 * @apiGroup Authentication
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object} user User info.
 * @apiSuccess {Number} user.user_id Id of the User.
 * @apiSuccess {String} user.username Username of the User.
 * @apiSuccess {String} user.email email of the User.
 * @apiSuccess {Number} user.user_level_id User level id of the User.
 * @apiSuccess {Number} user.iat Token creation timestamp.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user_id": 21,
 *       "username": "johnd",
 *       "email": "johnd@example.com",
 *       "user_level_id": 2,
 *       "iat": 1701279021
 *     }
 *
 * @apiError InvalidToken Authentication token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "invalid token"
 *     }
 */
authRouter.route('/me').get(authenticateToken, getMe);
```

### Other options

- [JSDoc](https://jsdoc.app/) is a Javadoc like documentation generator for JavaScript. It allows you to document your code with special comments that can then be automatically turned into detailed documentation in HTML format. It supports [markdown](https://jsdoc.app/plugins-markdown) in comments. Can be [integrated with Swagger](https://www.npmjs.com/package/swagger-jsdoc), ([related how-to article](https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do)).
- [Postman](https://www.postman.com/) is primarily known as an API testing tool, but it also offers [robust features for API documentation](https://www.postman.com/api-platform/api-documentation/).
- [Slate](https://github.com/slatedocs/slate) is an open-source tool that creates intelligent and responsive API documentation web page. Documentation is written in Markdown format.

---

## Assignment 6, part B - API Documentation

1. Continue your existing Express app and create a new branch `docs`
1. Create API documentation for your RESTful API using [apidoc](https://apidocjs.com/), Swagger or other similar tool of your own choice (max. 3 points)
   - install needed packages
   - generate documentation (for example to `docs` folder using an npm script)
   - serve the documentation withing your app (for example using `express.static` middleware)

**Returning:** A short report _describing your implementation_ including a link to your code in Github and screen shots of your running environment (e.g. images displaying HTTP requests and corresponding responsenses in practise). Check assignment in OMA for more details.

**Grading:** max 3 points, see details in assignment requirements above

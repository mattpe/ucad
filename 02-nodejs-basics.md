# Getting started with Node.js development

Recap: [Node.js](https://github.com/ilkkamtk/web-ohjelmoinnin-perusteet/blob/main/node.md) and [npm](https://github.com/ilkkamtk/web-ohjelmoinnin-perusteet/blob/main/npm.md).

[Getting started with Node.js](https://nodejs.dev/en/learn/) - Node.js official documentation

A note of [beeing dependent on 3rd party packages](https://dev.to/chaitanyasuvarna/how-a-developer-broke-the-internet-by-un-publishing-his-package-containing-11-lines-of-code-31ei)

![Dependency](https://imgs.xkcd.com/comics/dependency.png)

## Setting up the first project

Prerequicities: Toolchain of the previous course installed.

1. `npm init` wizard needs an interactive shell, so use VS Code terminal or Git Bash
1. setup eslint: `npm init @eslint/config`, remember to select `node` environment
   - √ How would you like to use ESLint? To check syntax, find problems, and enforce code style
   - √ What type of modules does your project use? JavaScript modules (import/export)
   - √ Which framework does your project use? none of these
   - √ Does your project use TypeScript? No
   - √ Where does your code run? Node
   - √ How would you like to define a style for your project? Use a popular style guide
   - √ Which style guide do you want to follow? Google
   - √ What format do you want your config file to be in? JavaScript
   - √ Would you like to install them now? Yes
   - √ Which package manager do you want to use? npm
1. install `nodemon` as a development dependency: `npm install --save-dev nodemon`
1. review `package.json`, add a script for starting your app with nodemon and type property

   ```json
   "type": "module",
   "scripts": {
    "dev": "nodemon src/index.js",
    ...
   ```

1. create a `.gitignore` file and add `node_modules` to it, keep it alway up to date
1. create a `src/` folder and a file `index.js` in it

   ```js
   // index.js
   import http from 'http';
   const hostname = '127.0.0.1';
   const port = 3000;

   const server = http.createServer((req, res) => {
     res.writeHead(200, { 'Content-Type': 'text/plain' });
     res.end('Welcome to my REST API!');
   });

   server.listen(port, hostname, () => {
     console.log(`Server running at http://${hostname}:${port}/`);
   });
   ```

1. test your setup: `npm run dev`

`req` variable is an [request object](https://nodejs.org/api/http.html#class-httpclientrequest) containing information about the HTTP request that raised the event. e.g.:

- `req.url`: the request URL string
- `req.method`: the HTTP request method
- `req.headers`: the request headers

In response to `req`, use [response object's](https://nodejs.org/api/http.html#class-httpserverresponse) (`res`) properties/methods to send the desired HTTP response back to the client. e.g.:

- `re.statusCode`: set the response status code
- `res.write()`: add content to response body
- `res.end()`: send te response

Payload data (request body) can be [extracted manually](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction#request-body) from the request stream.

### Simple example of REST API documentation

| Endpoint      | Method | Description                                        | Request Body (Example)            | Response Body (Example)        | Status Codes                         |
|---------------|--------|----------------------------------------------------|----------------------------------|--------------------------------|-------------------------------------|
| `/items`      | GET    | Retrieve a list of all items                       | N/A                              | `[{ "id": 1, "name": "Item1" }, { "id": 2, "name": "Item2" }]` | `200 OK`, `404 Not Found`           |
| `/items`      | POST   | Create a new item                                  | `{ "name": "New Item" }`         | `{ "id": 3, "name": "New Item" }` | `201 Created`, `400 Bad Request`    |
| `/items/:id`  | GET    | Retrieve details of a specific item by its ID      | N/A                              | `{ "id": 1, "name": "Item1" }`  | `200 OK`, `404 Not Found`           |
| `/items/:id`  | PUT    | Update details of a specific item by its ID        | `{ "name": "Updated Item" }`     | `{ "id": 1, "name": "Updated Item" }` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `/items/:id`  | DELETE | Delete a specific item by its ID                   | N/A                              | N/A                            | `204 No Content`, `404 Not Found`    |

- Endpoint: The URL where the API can be accessed.
- Method: The HTTP verb/method used to interact with the endpoint.
- Description: A brief description of what the endpoint does.
- Request Body: The data sent to the server when making a request (if applicable).
- Response Body: The data returned by the server in response to the request.
- Status Codes: Common HTTP status codes returned by the server. Each status code indicates a different outcome or state of the request.

This is a basic table for documentation. Depending on the complexity of the API, real-world documentation might also include:

- Headers required (e.g., authentication tokens).
- Query parameters for filtering, sorting, or pagination.
- Detailed explanations of each field in the request and response.
- Error message details for different status codes.
- Authentication/Authorization details.

## Assignment 1 - Getting started with node.js

1. Create a node.js project, requirements: (1 p.)
   - _eslint_ setup
   - _package.json_
   - _readme.md_
   - _nodemon_ for running the dev environment (use local npm package and start with npm script)
   - git repo: include `.gitignore` and set a remote repo in Github, create and checkout a new branch `node-start`
1. Implement a (dummy) REST API including following resourses/endopoints: (1 p.)
   - read some data from server (send response in json format)
   - send some data to server
   - delete data (just a dummy functionality, test error response too)
   - modify something (just a dummy functionality, test error response too)
   - send 404 response for non-existing resources
1. Adapt HTTP standards: (1 p.)
   - use appropriate [HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) for requests
   - set correct [status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) and [Content-Type](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Configuring_server_MIME_types) headers to responses
1. Test with Postman or similar
1. Add more funtionalities to your REST API (2 p.)
   - e.g. serve some real data, generate something of the data sent to the server
   - can be basically anything, use you imagination and play with the code
   - describe/document your API in readme.md

Note: Do not use the Express framework within this assignment.

Remember that following good coding practices makes your app a lot more easier to maintain, develop and understand:

- Use meaningful and descriptive names for variables, functions, etc.
- Be consistent with naming conventions, indentation, commenting style, application structure, file & folder organisation
- Avoid deep nesting
- [KISS](https://en.wikipedia.org/wiki/KISS_principle) - Keep It Simple, Stupid
- DRY - Don't Repeat Yourself
- Use proper commenting when needed
- Line length: avoid writing horizontally long lines of code
- Avoid large code files, split to smaller modules

**Returning:** A short report describing your implementation including a link to your code in Github and screen shots of your running environment. Check assignment in OMA for more details.

**Grading:** max 5 points, see details in assignment requirements above.

# Getting started with Node.js development

Recap: [Node.js](https://github.com/ilkkamtk/web-ohjelmoinnin-perusteet/blob/main/node.md) and [npm](https://github.com/ilkkamtk/web-ohjelmoinnin-perusteet/blob/main/npm.md).

[Getting started with Node.js](https://nodejs.dev/en/learn/) - Node.js official documentation

A note of [beeing dependent on 3rd party packages](https://dev.to/chaitanyasuvarna/how-a-developer-broke-the-internet-by-un-publishing-his-package-containing-11-lines-of-code-31ei)

![Dependency](https://imgs.xkcd.com/comics/dependency.png)

## Setting up the first project

1. Prerequicities: Toolchain of the previous course installed.
   - Visual Studio Code + Prettier & ESLint extensions
   - Node.js & npm
   - Git (Git bash preferred on Windows)
   - Postman or similar API testing tool
1. Create a new folder for your project.
1. Open the project folder in your code editor.
1. Open a terminal (command-line) in the project folder.
1. Run `npm init` inside the project folder. The wizard needs an interactive shell, use terminal on MacOS/Linux or Git Bash/Powershell on Windows.
1. Setup [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code linting and formatting (Read more about the differences and roles of the tools on [LogRocket Blog](https://blog.logrocket.com/using-prettier-eslint-javascript-formatting/) and [ESLint blog](https://eslint.org/blog/2023/10/deprecating-formatting-rules/)).

   - Install npm packages:

   ```sh
   # --save-exact makes sure that everyone in the project gets the exact same version of Prettier.
   npm install --save-dev --save-exact prettier
   npm install --save-dev eslint @eslint/js eslint-config-prettier globals
   ```

   - Add `eslint.config.js` file with the following content:

   ```js
   import globals from 'globals';
   import js from '@eslint/js';

   export default [
     {
       languageOptions: {
         ecmaVersion: 2021,
         sourceType: 'module',
         globals: {...globals.node},
       },
     },
     js.configs.recommended,
   ];
   ```

   - Add `.prettierrc.cjs` file with the following content:

   ```js
   // sample .prettierrc.cjs
   module.exports = {
     semi: true,
     singleQuote: true,
     bracketSpacing: false,
     trailingComma: 'all',
   };
   ```

1. Install `nodemon` as a development dependency: `npm install --save-dev nodemon`.
   - a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.
1. Review `package.json`, add a script for starting your app with nodemon, and add type property:

   ```json
   ...
   "type": "module",
   "scripts": {
     "start": "node src/index.js", 
     "dev": "nodemon src/index.js",
     ...
   ```

1. Initialize a git repository: `git init` and create a `.gitignore` file and add at least `node_modules` to it. Remember to keep the file always up to date when adding files you don't want to include version control!

   ```gitignore
   .vscode
   node_modules
   .DS_Store
   ```

1. Create a `src/` folder and add a file `index.js` in it

   ```js
   // index.js
   import http from 'http';
   const hostname = '127.0.0.1';
   const port = 3000;

   const server = http.createServer((req, res) => {
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end('Welcome to my REST API!');
   });

   server.listen(port, hostname, () => {
     console.log(`Server running at http://${hostname}:${port}/`);
   });
   ```

1. Test your initial app using the scripts defined in `package.json`:
   - `npm start` to start the server with node
   - `npm run dev` to start the server with nodemon (recommended for development)
   - to stop the server hit _ctrl-c_

1. Create a new local repository and setup a remote repository on GitHub and push your current local project to Github.

    ```sh
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin <YOUR-REPO-URL>
    git push -u origin main
    ```

Now you have a basic Node.js back-end application project setup with ESLint, Prettier, and nodemon. It creates a simple HTTP server that listens on port 3000 and responds with "Welcome to my REST API!" to any incoming request.

`req` variable is an [request object](https://nodejs.org/api/http.html#class-httpclientrequest) containing information about the HTTP request that raised the event. e.g.:

- `req.url`: the request URL string
- `req.method`: the HTTP request method
- `req.headers`: the request headers

In response to `req`, use [response object's](https://nodejs.org/api/http.html#class-httpserverresponse) (`res`) properties/methods to send the desired HTTP response back to the client. e.g.:

- `res.statusCode`: set the response status code
- `res.write()`: add content to response body
- `res.end()`: send te response

Payload data (request body) can be [extracted manually](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction#request-body) from the request stream.

By handling different request URLs and methods and sending appropriate responses, you can start building your REST API by adding more routes and functionality to your `index.js` file or by creating additional modules in the `src/` folder.

### Simple example of REST API documentation

| Endpoint     | Method | Description                                   | Request Body (Example)       | Response Body (Example)                                        | Status Codes                                 |
| ------------ | ------ | --------------------------------------------- | ---------------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| `/items`     | GET    | Retrieve a list of all items                  | N/A                          | `[{ "id": 1, "name": "Item1" }, { "id": 2, "name": "Item2" }]` | `200 OK`, `404 Not Found`                    |
| `/items`     | POST   | Create a new item                             | `{ "name": "New Item" }`     | `{ "id": 3, "name": "New Item" }`                              | `201 Created`, `400 Bad Request`             |
| `/items/:id` | GET    | Retrieve details of a specific item by its ID | N/A                          | `{ "id": 1, "name": "Item1" }`                                 | `200 OK`, `404 Not Found`                    |
| `/items/:id` | PUT    | Update details of a specific item by its ID   | `{ "name": "Updated Item" }` | `{ "id": 1, "name": "Updated Item" }`                          | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `/items/:id` | DELETE | Delete a specific item by its ID              | N/A                          | N/A                                                            | `204 No Content`, `404 Not Found`            |

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

---

## Assignment 1 - Getting started with node.js

1. Create a node.js project, requirements: (1 p.)
   - _eslint_ setup
   - _package.json_
   - _readme.md_
   - _nodemon_ for running the dev environment (use local npm package and start with npm script)
   - git repo: include `.gitignore` and set a remote repo in Github, create and checkout a new branch `node-start`
1. Implement a (dummy) REST API including following resources/endpoints: (1 p.)
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
1. Finally, push your assignment branch (`node-start`) to Github.
   - make sure that your code is locally committed to correct branch
   - push the branch to Github: `git push -u origin node-start`

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

**Returning:** A short report _describing your implementation_ in `readme.md` including a link to your code in Github and screen shots of your running environment (e.g. images displaying HTTP requests and corresponding responsenses in practice). Submit a direct link to the assignment branch to OMA. Check assignment in OMA for more details.

**Grading:** max 5 points, see details in assignment requirements above.

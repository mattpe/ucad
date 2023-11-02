# Express

<https://expressjs.com/>

>Fast, unopinionated, minimalist web framework for Node.js

Express provides a robust web application feature set and many [other popular frameworks](https://expressjs.com/en/resources/frameworks.html) are built on top of the Express framework.

## Installation

```bash
npm install express
```

Express package is saved as a dependency in the project's `package.json` file.

## Hello world web app

Node.js using built-in http module:

```js
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

Node with Express:

```js
import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

## Main features

- [Static file server](https://expressjs.com/en/starter/static-files.html)
- [Routing](https://expressjs.com/en/guide/routing.html): define how an application’s endpoints (URIs) respond to client requests
- [Middlewares](https://expressjs.com/en/guide/using-middleware.html): functions that have access to the request object (req), the response object (res) in the application’s request-response cycle.
- Support for several [template engines](https://expressjs.com/en/guide/using-template-engines.html)
  - [Pug](https://pugjs.org/) (formerly Jade) is the default template engine
- [Express application generator](https://expressjs.com/en/starter/generator.html)
  - quick Express app scaffolding, e.g: `npx express-generator --view=pug pug-app`
  - the app structure created by the generator is just one of many ways to structure Express apps and might need a lot of refactoring to suit your needs

### Serving static files

1. Create a folder `src/public` and add any static files into it, e.g. html, css, js, images, etc.
1. Serve the files: `app.use('/static', express.static(path.join(__dirname, 'public')));`
1. Access the files in `public` folder at `http://localhost:3000/static/...`

Note: If using ES modules (`import` statements instead of CommonJS `require()`) and `path.join()` when serving static files, you don't have `__dirname` variable by default. You need set it manually:

```js
import path from 'path';
import {fileURLToPath} from 'url';
...
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### Using Pug for server-side rendered (SSR) content

1. Install [Pug](https://pugjs.org/) template engine: `npm install pug`
1. Create a folder `src/views` and create a file `index.pug` in it
1. Add the following code to `index.pug`:

   ```pug
   doctype html
   html(lang="en")
     head
       meta(charset="utf-8")
       meta(name="viewport", content="width=device-width, initial-scale=1")
       title= title
     body
       h1= title
       p Welcome to my server!
       p= message
   ```

1. In your Node app, set the view engine and views folder, then render the index page with `res.render()`:

   ```js
   app.set('view engine', 'pug');
   app.set('views', 'src/views');

   app.get('/', (req, res) => {
     // any dynamic data can be passed to the template as an object 
     const values = {title: 'My REST API', message: 'Docs will be here!'}; 
     // use name of the template file without extension
     res.render('index', values);
   });
   ```

### Serving response in JSON format (for client-side rendering, CSR)

```js
// GET http://localhost:3000/api/resource
app.get('/api/resource', (req, res) => {
  const myData = {title: 'This is an item', description: 'Just some dummy data here'};
  res.json(myData);
});
```

### Reading request parameters

Using route parameters (path variables, the preferred way in REST APIs):

```js
// GET http://localhost:3000/api/resource/99
// property name (id) is set in the route definition
app.get('/api/resource/:id', (req, res) => {
  console.log('path variables', req.params);
  if (req.params.id === '99') {
    const myData = {
      title: 'This is a specific item, id: ' + req.params.id,
      description: 'Just some dummy data here',
    };
    res.json(myData);
  } else {
    res.sendStatus(404);
  }
});
```

Using query parameters:

```js
// GET http://localhost:3000/api/resource?id=99&name=foo
app.get('/api/resource', (req, res) => {
  if (req.query.id === '99') {
   console.log('query params object', req.query);
    const myData = {
      title: 'This is a specific item, id: ' + req.query.id,
      description: 'Just some dummy data here',
    };
    res.json(myData);
  } else {
    res.sendStatus(404);
  }
});
```

### Reading data from request body

```js
// needed for reading request body in JSON format
app.use(express.json());

...
// POST http://localhost:3000/api/resource
// sends request data back to client
app.post('/api/resource', (req, res) => {
  const body = req.body;
  res.status(201);
  res.json({your_request: body});
});
```

## Assignment 2 - Getting started with Express framework

Implement a simple REST API with Express framework:

- Use Pug as a template engine for basic HTML landing page `GET /` (1 point)
- Implement a REST API by following [this API reference](./assets/media-api-reference-v1.md) with the mock data included in it (max. 4 points)

1. Continue with the project you created in the previous assignment and create a new branch `express` for this assignment.
   - use the existing code as a starting point or generate a new project with `npm init`
1. Install _Express_ framework and _Pug_ template engine
1. Render a dynamic HTML page with Express and [Pug](https://expressjs.com/en/guide/using-template-engines.html)
   - provide some information about your API, use dynamic content rendering
1. Implement API endpoints following the API documentation and using the mock data provided
   - note that API documentation is not complete, you need to figure out missing details. for example add correct status codes and corresponding messages or data to the responses
1. Serve static media files from `media` folder
   - use e.g. some small-sized images from Internet
   - match the filenames with the mock data
1. Extra: Use [jsDoc](https://jsdoc.app/index.html) comments

**Returning:** A short report describing your implementation including a link to your code in Github and screen shots of your running environment. Check assignment in OMA for more details.

**Grading:** max 5 points, see details in assignment requirements above.

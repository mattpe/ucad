# Framework technologies

Frameworks are used to simplify the development of software applications. They provide a set of tools and libraries that help developers to build applications faster and easier.

## Terminology

_Application framework_ vs. _software framework_ vs. _web framework_ vs. _software library_ vs. _software toolkit_ vs. _software development kit_ ?

These terms are often used interchangeably, and they have overlapping features, but there are some conceptual differences:

### Software Framework

A software framework is a broad term that refers to a collection of code libraries and tools that provide a foundation for developing software in a specific domain. A framework defines the structure and flow of control for programs and might enforce certain design patterns. It's more prescriptive than a library. Software frameworks can be for web development, mobile app development, machine learning, etc.

### Application Framework

An application framework is a comprehensive software framework that provides a standardized way to build and deploy specific types of applications. It dictates the architecture and provides core functionalities such as data handling, security, and user interface rendering. Application frameworks can significantly reduce the time and effort required for building applications by providing a skeleton structure and set of components which developers can extend to create specific functionalities. Examples include .NET Framework for Windows applications, Django for Python web applications, and Spring for Java enterprise applications.

### Web Framework

A web framework is a type of software framework designed specifically for web development. It provides a way to build and run web applications and typically offers capabilities such as handling HTTP requests and responses, managing sessions, routing URLs to appropriate handlers, and integrating with databases. Examples include **Express** for Node.js, Flask and Django for Python, Ruby on Rails for Ruby, and Laravel for PHP.

### Software Library

A software library is a collection of pre-compiled routines, classes, or functions that a program can call upon to perform specific tasks. It's a reusable set of tools that provide specific functionalities but does not impose a structure or dictate the flow of control in applications that use it. Libraries aim to provide helper utilities and building blocks rather than a framework within which you structure your application. Examples include the NumPy library for numerical computing in Python or the jQuery library for simplifying JavaScript.

### Software Toolkit

A software toolkit, often just called a toolkit, is a collection of software tools, libraries, and utilities meant to help developers create applications. Toolkits typically focus on a specific aspect of software development, such as GUI development (like the GTK toolkit for graphical interfaces) or data visualization (like D3.js for creating interactive data visualizations in web applications). Toolkits can be seen as a subset of libraries, often more specialized.

### Software Development Kit (SDK)

An SDK is a set of software tools and programs used by developers to create applications for specific platforms or frameworks. An SDK includes libraries, documentation, code samples, processes, and guides that developers can use and integrate into their apps. SDKs are designed to be used for a specific platform or service, like the iOS SDK for building iPhone and iPad apps, the Android SDK for Android apps, or the Facebook SDK for integrating with Facebook services.

In summary:

- Application Frameworks and Software Frameworks provide a foundation and dictate structure.
- Web Frameworks are specialized frameworks for web development.
- Software Libraries offer a collection of reusable functions and routines.
- Software Toolkits are specialized sets of tools focused on a particular aspect of development.
- SDKs are comprehensive sets of tools and documentation designed for developing on a specific platform or with a specific service.

## Why use a framework?

Based on the assignment last week, what benefits would you get from using a framework?

## Rendering strategies

### Client-Side Rendering (CSR)

In CSR, the server sends a minimal HTML page with a JavaScript file to the browser. When the browser executes the JavaScript, it typically makes additional requests to the server to fetch the content, then renders the user interface (UI) in the browser itself.

Workflow:

1. User requests a page.
1. Server sends a minimal HTML page with JavaScript.
1. Browser executes JavaScript, which may make additional API requests.
1. JavaScript manipulates the DOM to render the page content dynamically.

Advantages:

- Interactive User Interfaces: CSR is excellent for creating rich, interactive web apps.
- Reduced Server Load: Since rendering happens on the client side, the server does fewer rendering tasks, reducing server load.
- Single Page Applications (SPAs): CSR is the foundation of SPAs, where the page doesn't reload completely on navigation.

Disadvantages:

- Initial Load Time: CSR often results in longer initial load times since the browser has to download, parse, and execute JavaScript before displaying content.
- SEO Challenges: Search engines can struggle with content rendered purely on the client side, though advancements in search engine technology have mitigated this.
- Dependent on Client Resources: Rendering is dependent on the user's device capabilities, which can be a limitation for devices with lower processing power.

### Server-Side Rendering (SSR)

In SSR, each page is rendered on the server and sent to the browser as a fully formed HTML document. The browser then displays the HTML content directly without waiting for all JavaScript to be downloaded and executed.

Workflow:

1. User requests a page.
1. Server generates the complete HTML for the requested page.
1. Server sends the fully rendered HTML to the browser.
1. Browser displays the HTML content and then downloads JavaScript for interactivity.

Advantages:

- Faster Initial Page Load: Since the HTML is pre-rendered, the initial page load can be faster, improving perceived performance.
- SEO Friendly: Search engines can easily crawl and index server-rendered content, which can be beneficial for SEO.
- Consistent Performance: Since rendering is done on the server, performance is less dependent on the client's device capabilities.

Disadvantages:

- Server Load: SSR can increase the load on the server, especially with high traffic.
- Less Interactive: Pages are less interactive compared to CSR until all the JavaScript is loaded and executed.
- Full Page Reloads: Navigating to a new page often requires a full page reload, which can be slower than CSR's dynamic content loading.

In modern web development, a hybrid approach called Universal Rendering or Isomorphic Rendering is often used, where the first page load is server-rendered for speed and SEO, and subsequent interactions use client-side rendering for a smooth user experience. Frameworks like Next.js for React (front-end library) and Nuxt.js for Vue.js (front-end framework) are popular for implementing this hybrid approach.

---

Next: [Express](./04-express.md) framework

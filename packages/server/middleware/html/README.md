# `html` middleware

The `html` middleware for `ocelot` handles generating the HTML documents for
ocelot-based apps. This middleware is composed of several components, namely:

- `createResponse`: generate the HTML response
- `createHead`: create all the content in the `<head>` tag
  - Generate resource hints through `preload` and `prefetch`
  - Inline runtime information from Webpack
  - Inline analytics scripts
  - Link external stylesheets
- `createBody`: create all the content in the `<body>` tag

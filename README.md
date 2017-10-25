# contentful-metalsmith-feeds

Metalsmith plugin to generate RSS and JSON feeds from [Contentful](https://www.contentful.com/) posts.

This works in tandem with [contentful-metalsmith](https://github.com/contentful/contentful-metalsmith). You’ll need to install and use that plugin along with this one.

[contentful-metalsmith-feeds on npm](https://npmjs.org/package/contentful-metalsmith-feeds)

## Installation

```
yarn add contentful-metalsmith-feeds
```

or

```
npm install contentful-metalsmith-feeds
```

## Usage

Usage assumes you’ve installed and configured [contentful-metalsmith#getting-started](https://github.com/contentful/contentful-metalsmith#getting-started) according to its configure docs.

Assume the following Metalsmith build script, named `build.js`:

```javascript
const metalsmith = require('metalsmith');
const contentful = require('contentful-metalsmith');
const contentfulFeeds = require('contentful-metalsmith-feeds');

metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(
    contentful({
      access_token: 'YOUR_CONTENTFUL_ACCESS_TOKEN',
      space_id: 'YOUR_CONTENTFUL_SPACE_ID'
    })
    .use(contentfulFeeds({
      contentType: 'YOUR_CONTENTFUL_CONTENT_TYPE'
    }))
  )
  .build(err => {
    if (err) {
      console.log(err);
    }
  });
```

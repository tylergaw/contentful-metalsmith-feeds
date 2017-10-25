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

Here is an example minimum Metalsmith build script, `build.js`:

```javascript
const metalsmith = require('metalsmith');
const contentful = require('contentful-metalsmith');
const contentfulFeeds = require('contentful-metalsmith-feeds');

metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(contentful({
    access_token: 'YOUR_CONTENTFUL_ACCESS_TOKEN',
    space_id: 'YOUR_CONTENTFUL_SPACE_ID'
  }))
  .use(contentfulFeeds({
    contentType: 'YOUR_CONTENTFUL_CONTENT_TYPE',
    title: 'My Website'
  }))
  .build(err => {
    if (err) {
      console.log(err);
    }
  });
```

### Configuration

In the example above we send `title` as an option to `contentfulFeeds`. `title` is **a required setting, if it is not provided, the build will fail.**

In addition to passing configuration values to the function, you can also use the common `site` object in `metadata`.

Here's an expanded example of `build.js` specifying more configuration options via `metadata`:

```javascript
const metalsmith = require('metalsmith');
const contentful = require('contentful-metalsmith');
const contentfulFeeds = require('contentful-metalsmith-feeds');

metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .metadata({
    site: {
      title: 'My Website',
      url: 'https://mywebsite.net',
      author: 'Tyler Gaw',
      description: 'This is a short description of the site and feeds.'
    }
  })
  .use(contentful({
    access_token: 'YOUR_CONTENTFUL_ACCESS_TOKEN',
    space_id: 'YOUR_CONTENTFUL_SPACE_ID'
  }))
  .use(contentfulFeeds({
    contentType: 'YOUR_CONTENTFUL_CONTENT_TYPE'
  }))
  .build(err => {
    if (err) {
      console.log(err);
    }
  });
```

#### Why use `metadata.site`?
We use the `site` object in `metadata` because it's a common pattern in Metalsmith plugins.

#### Which config method takes precedence?
Config values passed to the function take precedence over `metadata.site`.

Take this partial `build.js` as an example:

```javascript
...
.metadata({
  site: {
    title: 'My Website'
  }
})
...
.use(contentfulFeeds({
  contentType: 'YOUR_CONTENTFUL_CONTENT_TYPE',
  title: 'The Real Title of My Website'
}))
...
```

"The Real Title of My Website" will be the title used for the generated feeds. The same is true for any `metadata.site` configuration options.

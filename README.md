# contentful-metalsmith-feeds

Metalsmith plugin to generate RSS and JSON feeds from [Contentful](https://www.contentful.com/) posts.

This works in tandem with [contentful-metalsmith](https://github.com/contentful/contentful-metalsmith). You’ll need to install and use that plugin along with this one.

[https://npmjs.org/package/contentful-metalsmith-feeds](https://npmjs.org/package/contentful-metalsmith-feeds)

## ⚠️ NOTE:
This might not be the most necessary plugin ever. I (Tyler) wrote it to serve a specific need I had on [Unstuck](https://blog.limbo.io). It's opinionated to work for the sites of that site. Much of the feed creation–JSON and RSS–is pulled from other Metalsmith plugins.

**Use this with caution**. If more people end up using it, we can always expand it to make it flexible for more use cases.

Main known issues; Not all RSS and JSON feed items can be configured. The keys and child elements are limited to the small set I needed for Unstuck.

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

## Configuration Options

**Options that can be included in either `metadata.site` or in the plugin function as described above:**

#### `title`
**Required** Used as top-level `title` and `<title>` of JSON and RSS feeds, respectively.

#### `url`
Used as top-level `home_page_url` and `<link>` of JSON and RSS feeds, respectively. This will also be the base of top-level `feed_url` in the JSON feed.

#### `description`
Used as top-level `description` and `<description>` of JSON and RSS feeds, respectively.

**Options that can only be included in the plugin function:**

#### `contentType`
**Required** The Contentful contentType id. This plugin is opinionated about what the content model of this type should be. This should be a standard "blog post" type object.

#### `json.destination`
**Default: feed.json** The name of the file created for the JSON Feed. This will also be the path portion of top-level `feed_url`.

*Example usage:*
```javascript
...
.use(contentfulFeeds({
  contentType: 'YOUR_CONTENTFUL_CONTENT_TYPE',
  url: 'https://mysite.org',
  json: {
    destination: 'mySiteFeed.json'
  }
}))
...
```

This will produce the file `mySiteFeed.json` and set `feed_url: https://mysite.org/mySiteFeed.json`.

#### `rss.destination`
**Default: rss.xml** The name of the file created for the RSS Feed.

*Example usage:*
```javascript
...
.use(contentfulFeeds({
  contentType: 'YOUR_CONTENTFUL_CONTENT_TYPE',
  rss: {
    destination: 'mySiteFeed.xml'
  }
}))
...
```

This will produce the file `mySiteFeed.xml`.

#### `marked`
Custom settings for [marked](https://www.npmjs.com/package/marked). The plugin uses marked to parse post contents.

*Example usage:*

```javascript
...
.use(contentfulFeeds({
  contentType: 'YOUR_CONTENTFUL_CONTENT_TYPE',
  marked: {
    smartypants: true,
    gfm: true,
    tables: true
  }
}))
...
```

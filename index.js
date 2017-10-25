const debug = require("debug")("contentful-metalsmith-feeds");
const marked = require("marked");
const moment = require("moment");
const cheerio = require("cheerio");
const RSS = require("rss");

// Borrowed this, and much of the JSON feed generation from:
// https://github.com/bensmithett/metalsmith-json-feed
const validate = (metadata, settings) => {
  if (!settings.title && !(metadata.site && metadata.site.title)) {
    return "No title set. This is required in JSON feeds";
  }

  return null;
};

const plugin = (options = {}) => {
  const limit = 20;
  const defaults = {
    rss: {
      destination: "rss.xml",
      limit
    },
    json: {
      destination: "feed.json",
      limit
    }
  };

  const jsonSettings = options.json
    ? Object.assign({}, defaults.json, options.json)
    : defaults.json;
  const rssSettings = options.rss
    ? Object.assign({}, defaults.rss, options.rss)
    : defaults.rss;
  const settings = options;

  if (settings.marked) {
    marked.setOptions(settings.marked);
  }

  return (files, metalsmith, done) => {
    const metadata = metalsmith.metadata();
    const error = validate(metadata, settings);

    if (error) {
      return done(new Error(error));
    }

    let jsonFeed = {
      version: "https://jsonfeed.org/version/1",
      title: settings.title || metadata.site.title
    };

    let rssFeed = {
      title: settings.title || metadata.site.title,
      pubDate: moment().format()
    };

    // These are both optional json feed keys. Only add them if they exist.
    const home_page_url =
      jsonSettings.home_page_url || metadata.site.url || null;
    const feed_url = home_page_url
      ? `${home_page_url}/${jsonSettings.destination}`
      : null;

    if (home_page_url) {
      jsonFeed.home_page_url = home_page_url;
      rssFeed.site_url = home_page_url;
    }

    if (feed_url) {
      jsonFeed.feed_url = feed_url;
      rssFeed.feed_url = feed_url;
    }

    // This is an optional setting for both JSON and RSS feeds.
    const feedDescription = settings.description || metadata.site.description;
    if (feedDescription) {
      jsonFeed.description = feedDescription;
      rssFeed.description = feedDescription;
    }

    const feedIcon = settings.iconUrl || metadata.site.iconUrl;
    if (feedIcon) {
      jsonFeed.icon = feedIcon;
    }

    const items = Object.keys(files)
      // Remove any files that don't match the given contentType
      .filter(k => files[k].contentType === settings.contentType)
      .map(k => {
        const { author, body, date, slug, title } = files[k].data.fields;
        const id = `${jsonFeed.home_page_url}/${slug}`;
        const date_published = moment(date).format();
        const markdown = marked(body);

        let item = {
          id,
          url: id,
          title,
          date_published,
          content_html: markdown,
          content_text: cheerio.load(markdown).text()
        };

        // Author is optional and this is also an opiniated content model for
        // author. Each user would have to have this Contentful model in place.
        if (author[0] && author[0].fields) {
          const { name } = author[0].fields;
          if (name) {
            item.author = {
              name
            };
          }
        }

        return item;
      });

    jsonFeed.items = items;

    const r = new RSS(rssFeed);

    // Munge json feed object to an rss feed object.
    items.forEach(item => {
      const {
        title,
        url,
        date_published: date,
        author: { name },
        content_html: description
      } = item;
      const itemObj = {
        title,
        url,
        date,
        author: name,
        description
      };

      r.item(itemObj);
    });

    files[jsonSettings.destination] = {
      contents: Buffer.from(JSON.stringify(jsonFeed, null, "  "), "utf8")
    };

    files[rssSettings.destination] = {
      contents: Buffer.from(r.xml({ indent: true }), "utf8")
    };

    return done();
  };
};

module.exports = plugin;

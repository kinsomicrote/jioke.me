/**
  Your global data folder is controlled by the dir.data configuration option. 
  All *.json and module.exports values from *.js files in this directory will 
  be added into a global data object available to all templates.

  This file can be accessed using: {{ site.title }}
*/

module.exports = {
  title: "Kingsley Silas",
  author: "Kingsley Silas",
  url: "https://www.jioke.me", // Don't end with a slash /
  description: "",
  social_meta: {
    twitter: "@kinsomicrote",
    featured_image: ""
  },
  ENV: process.env.ELEVENTY_ENV
};
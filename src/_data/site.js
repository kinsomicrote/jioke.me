/**
  Your global data folder is controlled by the dir.data configuration option. 
  All *.json and module.exports values from *.js files in this directory will 
  be added into a global data object available to all templates.

  This file can be accessed using: {{ site.title }}
*/

module.exports = {
  title: "Kyanne Rose",
  url: "https://kyanne.dev", // Don't end with a slash /
  description: "I love computers and I love the Internet, so I'm learning how to program them.",
  copyright: {
    from: "2019",
    name: "Kyanne Rose"
  },
  social_meta: {
    twitter: "@kyr0se",
    github: "kyrose",
    featured_image: "/assets/images/featured_image.png"
  },
  ENV: process.env.ELEVENTY_ENV
};

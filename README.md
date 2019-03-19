# A/B Testing for WordPress

WordPress plugin which allow you to run A/B tests from anywhere within your content.

Utilize the new Gutenberg editor to create split tests to serve to your visitors and find out
which variation works best.

![Gutenberg Demo](src/assets/plugin-gutenberg-demo.gif)

## Installing

1. Download `ab-testing-for-wp.zip`
1. Unzip contents and upload "ab-testing-for-wp" folder to the "/wp-content/plugins/" directory.
1. Activate the plugin through the "Plugins" screen in WordPress.
1. You can now add tests to your content!

## Requirements

- At least WordPress 5.0 (uses the new Gutenberg editor)

## Development

Requirements: [Node.js](https://nodejs.org/en/) and [Composer](https://getcomposer.org/).

Clone the project and `npm install`.

Use the following commands:

```
# one time build
npm run build

# development watch mode for JavaScript
npm run dev

# prepare for release (clean, build, archive)
npm run release
```



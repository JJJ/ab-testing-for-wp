---
title: Add Tests Anywhere on Your Site
date: 2019-04-19 16:00:00
description: Create stand-alone A/B tests to add anywhere on your WordPress site
---
In the latest version of [A/B Testing for WordPress](https://wordpress.org/plugins/ab-testing-for-wp/) it is possible to add new tests outside of the regular content editor way.

{% asset_img screenshot-1.png Creating a stand-alone test %}

## Stand-alone Tests

You can create a new stand-alone test from the admin sidebar or by choosing "Add New" on the tests overview page.

These tests will be available through a shortcode, which can be used anywhere on your site.

Make sure you "publish" the stand-alone test and toggle the "Run this test" setting in the general settings to make it available.

## Using in Your Theme / Template

You can place the shortcode of the test anywhere in your theme's PHP code, this means you can for instance place your tests in the header or footer of your site. 
Not only in the content anymore!

Place the following code anywhere in your theme:

<pre><code>&lt;?php echo do_shortcode("[ab-test id=1234]"); ?&gt;</code></pre>

Replace "1234" with the number visible in the sidebar while editing a stand-alone test. You can also find this number in the A/B tests overview. 

## Using Stand-alone Tests in Regular Content

When you have stand-alone tests ready and published, you can also add them to your post and page content through the content editor.

{% asset_img screenshot-2.png Inserting a stand-alone test %} 

Insert an A/B test like you would normally. It gives you the choice to create a new test in the content or insert an existing test.

Pick the test you want to insert, confirm your choice, and a preview of your test will be visible in the content editor.

To edit the stand-alone test: click on the "edit test" button which appears when hovering over the test.

## Tests as a Custom Post Type

In technical terms, stand-alone tests are so called "custom post types" which can be interacted with by other WordPress developers and makes A/B Testing for WordPress a lot more customizable. 

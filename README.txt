=== A/B Testing for WordPress ===
Contributors: clevernode, gayakessler
Tags: "a/b testing", "a/b test", "ab testing", "split test", "measure", "optimise", "marketing"
Donate link: https://abtestingforwp.com/
Requires at least: 5.0
Tested up to: 5.4
Requires PHP: 5.6
Stable tag: 1.18.2
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

== Description ==

**Easiest way to create split tests on your WordPress sites, right from the content editor!**

Improve your website and start measuring your audience now.

Create A/B tests right in the content editor. Test which button colour works best, what content drives people to engage, anything you can imagine!

= Add A/B Tests from Anywhere in the Content Editor =
A/B Testing for WordPress allows you to create split tests right from the visual content editor. Measures the results of your tests and shows you which variant is the most popular choice.

You add a block to your content which you can fill with anything you want to, and switch between variants instantaneously to preview what visitors will see. Define distribution weight, pick the goal of the test, and off you go!

Place tests inside posts, pages, custom post-types, or any part of your template using shortcodes.

= Safe for SEO =
Everything has been implemented with SEO in the back of the mind, which means the plugin will do nothing to affect your SEO. It works just like most A/B testing tools out there, but natively from your own WordPress site without the use of 3th-party services.

= Measure Results =
A/B Testing for WordPress provides an overview of running tests and the measured results. It also shows the **statistical significance of the test results** so you can be confident a test is successful or not.

When you are done running your tests and can come to a conclusion you can break the winning variant out of the test and remove the test from the content with just one click.

= Integrates with Other Plugins =
A/B Testing for WordPress integrates with other WordPress plugins. This provides a streamlined experience to test variations of what the integrated plugin has to offer. Think form submissions, sign ups, product sales.

Integrates with [Mailchimp for WordPress](https://wordpress.org/plugins/mailchimp-for-wp/), [HTML Forms](https://wordpress.org/plugins/html-forms/), [Contact Form 7](https://wordpress.org/plugins/contact-form-7/), [WPForms](https://wordpress.org/plugins/wpforms-lite/), Gravity Forms, [Ninja Forms](https://wordpress.org/plugins/ninja-forms/), [Formidable](https://wordpress.org/plugins/formidable/)

= Test Your Visitors Right Now! =
Start measuring what works best on your site without all the hassle!

== Installation ==
1. Upload "ab-testing-for-wp" folder to the "/wp-content/plugins/" directory.
1. Activate the plugin through the "Plugins" screen in WordPress.
1. You can now add tests to your content!

== Frequently Asked Questions ==

= Is A/B Testing for WordPress free to use? =
Yes, totally. And also no sign up for 3th-party services needed.

= How does A/B Testing for WordPress measure tests? =
When a visitor sees a test variant the visitor will be remembered as a participant of that variant. When the visitor visits the goal page of the test, the visitor will also be logged as a conversion of the variant.

A/B Testing for WordPress will calculate the percentage of the participants who became conversions and determines a winning variant through these numbers.

You can setup pages, posts and outbound links as goals. A/B Testing for WordPress also integrates with popular plugins.

= Does A/B Testing for WordPress affect SEO? =
No. Only the control version of your test is shown to search engines and website caches. The variant which the visitor will see is replaced on the fly using JavaScript.

A/B Testing for WordPress does not treat a search engine any different from a human visitor.

= Does A/B Testing for WordPress allow weight distribution? =
Yes. You can change the amount of visitors should see each variant.

= Can I convert existing content into an A/B test? =
Yes. Existing content blocks can be converted into A/B tests in the editor. You can find this options under "more options" of your blocks. It will take your block and wrap it in an A/B test and put a copy of the block in both variants.

= Does A/B Testing for WordPress allow weight distribution? =
Yes. You can change the amount of visitors which should see each variant.

= How can I force a visitor to be placed in a variant of a test? =
You can add conditions for variants. Visitors with your determined conditions in the URL will be placed in the test variant of your choice. Next time they visit the URL without the parameters, they will still be in the same variation of the test you placed them in.

= What does A/B Testing for WordPress count as a goal? =
You can pick and post, page, or outbound links as a goal to track. Counting custom post types as conversion is not possible (yet).

A/B Testing for WordPress also integrates with popular plugins which can be setup as goals.

= How Can I Add a Test to my Site? =
You can enter tests right in the content of your pages and posts through the editor.

Or create a separate test which you can place anywhere on your site using a shortcode. Works with any template!

= How can I contribute to this plugin? =
You can find the [source and repository over at GitHub](https://github.com/Gaya/ab-testing-for-wp).

== Screenshots ==
1. Creating an A/B Test in the post editor
2. Testing the variants on your website
3. Creating an A/B Test in the post editor (still)
4. Overview of running tests
5. Integration with HTML Forms

== Changelog ==
= 1.18.2 =
* Added max length for varchar fields in utf8mb4 enabled databases

= 1.18.1 =
* Added database repair tool

= 1.18.0 =
* Made the plugin compatible with WordPress 5.4

= 1.17.1 =
* Minor bug fixes

= 1.17.0 =
* Allow forced variation placement through query parameters

= 1.16.3 =
* Exclude .zip from release
* Fix integration tracking of goal (thank you @jeffreyvr)

= 1.16.0 =
* Adhere to DoNotTrack settings (use `ab-testing-for-wp_dnt` filter to disable)

= 1.15.1 =
* Allow concurrent cookie handling

= 1.15.0 =
* Start and stop tests from the test overview
* Various UI improvements and bug fixes

= 1.14.3 =
* Pre-render picked variants without making a round trip to the server
* Bug fixes for querySelectors

= 1.14.2 =
* Added text-domain to translation strings

= 1.14.1 =
* Show outbound conversion goal on overview page

= 1.14.0 =
* Ability to track outbound links as a goal

= 1.13.1 =
* Removes tests from bundled plugin zip

= 1.13.0 =
* Adds e2e testing for development
* Bunch of bug fixes discovered through e2e testing
* Updated dependencies

= 1.12.4 =
* Fixed bug where how to page disappeared

= 1.12.3 =
* Bug fix where pages without any test would throw errors in the admin bar

= 1.12.2 =
* Bug fix for displaying unicode UTF-8 charset in XHR results

= 1.12.1 =
* Updated styles for variant selector

= 1.12.0 =
* Converted code base to TypeScript

= 1.11.0 =
* Updated npm dependencies
* Improved code quality
* Deploys now through GitHub actions

= 1.10.0 =
* Ability to convert existing blocks to tests

= 1.9.1 =
* Fix hardcoded 'wp_ab_testing_for_wp_variant' table name causing errors

= 1.9.0 =
* Allows to create separate tests which can be added anywhere
* Improved in editor test rendering
* Improved A/B tests overview

= 1.8.1 =
* Added integrations for Ninja Forms, Gravity Forms, WPForms, and Formidable
* Fixed rare race condition in cookie setting

= 1.7.0 =
* Shows statistical significance of the results in the overview and test settings so you can be confident that the results can be trusted

= 1.6.0 =
* Added integrations with HTML Forms, Mailchimp for WordPress, and Contact Form 7

= 1.5.0 =
* Ability to pick posts and pages as conversion goals

= 1.4.0 =
* Onboarding tour for first time users

= 1.3.1 =
* Ability to declare a winner of the test. Replacing the test block with the winning variant's content

= 1.2.2 =
* Instant variant previews from the admin bar
* Bug fix saving post revisions
* Update plugin site address

= 1.1.0 =
* Updated assets
* Minor fixes

= 1.0.0 =
* Initial release

== Upgrade Notice ==
No updates yet

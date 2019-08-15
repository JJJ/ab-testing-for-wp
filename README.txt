=== A/B Testing for WordPress ===
Contributors: clevernode, gayakessler
Tags: "a/b testing", "a/b test", "ab testing", "split test", "measure", "optimise", "marketing"
Donate link: https://abtestingforwp.com/
Requires at least: 5.0
Tested up to: 5.2.2
Requires PHP: 5.6
Stable tag: 1.10.0
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

== Description ==

**Easiest way to create split tests on your WordPress sites, right from the content editor!**

Improve your website and start measuring your audience now.

Create A/B tests right in the content editor. Test which button colour works best, what content drives people to engage, anything you can imagine!

= Add A/B Tests from Anywhere in the Content Editor =
A/B Testing for WordPress allows you to create split tests right from the visual content editor. Measures the results of your tests and shows you which variant is the most popular choice.

You add a block to your content which you can fill with anything you want to, and switch between variants instantaneously to preview what visitors will see. Define distribution weight, pick the goal of the test, and off you go!

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
Yes, no sign up for 3th-party services needed.

= How does A/B Testing for WordPress measure tests? =
When a visitor sees a test variant the visitor will be logged as a participant of that variant. When the visitor visits the goal page of the test, the visitor will also be logged as a conversion of the variant.

A/B Testing for WordPress will calculate the percentage of the participants who became conversions and determines a winning variant through these numbers.

= Does A/B Testing for WordPress affect SEO? =
No. Only the control version of your test is shown to search engines and website caches. The variant which the visitor will see is replaced using JavaScript.

= Does A/B Testing for WordPress allow weight distribution? =
Yes. You can change the amount of visitors should see each variant.

= What does A/B Testing for WordPress count as a goal? =
You can pick and post or page as a goal to track. Counting outbound links or custom post types as conversion is not possible (yet).

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

<?php defined('ABSPATH') or exit; ?>
<div class="wrap">
  <h1><?php echo __('How to Use A/B Testing for WordPress', 'ab-testing-for-wp'); ?></h1>
  <div class="welcome-panel how-to">
    <div class="how-to-panel-content">
      <div style="display: flex; align-items: center">
        <div>
          <h3><?php echo __('Introduction to A/B Testing for WordPress', 'ab-testing-for-wp'); ?></h3>
          <p><?php echo __('A/B Testing for WordPress allows you to setup split tests on any of your posts or pages. You can add A/B Test blocks in your content using the Gutenberg content editor.', 'ab-testing-for-wp'); ?></p>
          <p><?php echo __('Each block will contain the variants of your test and allow you to configure the tests. You can find the A/B Test block in the "Widgets" category.', 'ab-testing-for-wp'); ?></p>

          <h3><?php echo __('Adding New Tests in your Content', 'ab-testing-for-wp'); ?></h3>
          <p><?php echo __('To add a new test to your content, go to the edit page of the post or page you want to add the test to.', 'ab-testing-for-wp'); ?></p>
          <p><?php echo __('Add a new "block" to the content, search for "A/B Test" under the category "Widgets".', 'ab-testing-for-wp'); ?></p>
          <p><?php echo __('A prefilled A/B Test container will be put on the page. The test contains two variants: "A" and "B". Change the content of the variants as you please.', 'ab-testing-for-wp'); ?></p>
        </div>
        <img style="width: 33%; flex-shrink: 0; max-width: 250px; margin-left: 30px;" src="<?php echo $assets; ?>how-to-1.png" />
      </div>

      <h3><?php echo __('Converting an Existing Block to a Test', 'ab-testing-for-wp'); ?></h3>
      <p><?php echo __('It\'s also possible to use an existing block on your page and convert it into a test without having to jump through hoops.', 'ab-testing-for-wp'); ?></p>
      <p><?php echo __('Find and select the block you want to convert to a test.', 'ab-testing-for-wp'); ?></p>
      <p><?php echo __('Press the "more settings" button (1. in figure below), then choose to convert to A/B test (2. in figure below)', 'ab-testing-for-wp'); ?></p>

      <img style="width: 100%; margin: 0 auto" src="<?php echo $assets; ?>how-to-2.png" />

      <p><?php echo __('You block will now be wrapped inside of an A/B test, you can find you block in both the A and B variants. Don\'t forgot to change the variants and enable the test.', 'ab-testing-for-wp'); ?></p>
      <p><?php echo __('You cannot convert a block inside of an existing test into a test.', 'ab-testing-for-wp'); ?></p>

      <h3><?php echo __('Adding Tests Anywhere Else', 'ab-testing-for-wp'); ?></h3>
      <p><?php echo __('You can also create stand-alone tests which can be inserted anywhere on your website.', 'ab-testing-for-wp'); ?></p>
      <p><?php echo __('Under the "A/B Testing for WordPress" menu you\'ll find a "Add New A/B Test" which will create a stand-alone test outside of your normal content.', 'ab-testing-for-wp'); ?></p>
      <p><?php echo __('This A/B test will get a so called shortcode which can be inserted anywhere on your website.', 'ab-testing-for-wp'); ?></p>
      <p><?php echo __('This is especially useful when you want to render a test in your footer or header for example.', 'ab-testing-for-wp'); ?></p>
      <pre><code>&lt;?php echo do_shortcode("[ab-test id=1234]"); ?&gt;</code></pre>
      <p><?php echo __('Use this code anywhere in your content or theme\'s code to output the test in that location. Replace "1234" with the ID of your test.', 'ab-testing-for-wp'); ?></p>

      <h3><?php echo __('Enabling the Test', 'ab-testing-for-wp'); ?></h3>
      <p><?php echo __('When the test is not enabled, it will not run. Meaning that only the control variant will be shown to visitors. The test result measurement will stop during this time.', 'ab-testing-for-wp'); ?></p>
      <p><?php echo __('You need to enable a test to start tracking and measuring conversion results.', 'ab-testing-for-wp'); ?></p>

      <img style="width: 33%; max-width: 250px; float: right; margin-left: 30px;" src="<?php echo $assets; ?>how-to-3.png" />
      <h3><?php echo __('Setting up the Testing Goal', 'ab-testing-for-wp'); ?></h3>
      <p><?php echo __('The testing goal is the page or URL the visitor has to visit in order for the variant to count as a conversion. If you create a button the variants, it is a good idea to set the page where it links to as the testing goal.', 'ab-testing-for-wp'); ?></p>
      <p><?php echo __('You can pick a post, page, or an URL as a tracking goal. Outbound links are good for tracking traffic to websites which are not yours.', 'ab-testing-for-wp'); ?></p>

      <div style="clear: both; display: flex; align-items: center">
        <img style="width: 33%; max-width: 250px; flex-shrink: 0; margin-right: 30px;" src="<?php echo $assets; ?>how-to-4.png" />
        <div>
          <h3><?php echo __('Control Variant', 'ab-testing-for-wp'); ?></h3>
          <p><?php echo __('The control variant is the variant which is shown by default and will also be seen by search engines. Changing the control variant is only needed if you do not want to serve variation "A" by default.', 'ab-testing-for-wp'); ?></p>

          <h3><?php echo __('Weight distribution', 'ab-testing-for-wp'); ?></h3>
          <p><?php echo __('With test distribution you can roughly control what percentage of your visitors will be served which variants.', 'ab-testing-for-wp'); ?></p>
          <p><?php echo __('If a variant of the test is a bit risky for instance, you can weigh the variant to test against the control a lot down. It will not affect the measured results.', 'ab-testing-for-wp'); ?></p>

          <h3><?php echo __('Force place visitors in test variant', 'ab-testing-for-wp'); ?></h3>
          <p><?php echo __('You can force visitors to be placed in a chosen test variant with conditions. These conditionals are based on URL parameters also called the query string.', 'ab-testing-for-wp'); ?></p>
          <p><?php echo __('Query parameters are the part of an URL that look like this:', 'ab-testing-for-wp'); ?></p>
          <pre><code><?php echo __('?greeting=hello-world&reply=thanks', 'ab-testing-for-wp'); ?></code></pre>
          <p><?php echo __('You can for example force a visitor to see a variant of your test when they have "greeting=hello-world" in their URL.', 'ab-testing-for-wp'); ?></p>
          <p><?php echo __('Choose "Add condition for A" (or B) in the "Variations" section of your test\'s settings.', 'ab-testing-for-wp'); ?></p>
          <p><?php echo __('Pick a key and value to be present in the URL, and if a visitor sees your test with these values in the URL, they will be placed in the variant you setup.', 'ab-testing-for-wp'); ?></p>
          <p><?php echo __('For convenience you can quickly set utm_source, utm_medium, and utm_campaign as conditions to match your analytics tracking.', 'ab-testing-for-wp'); ?></p>
        </div>
      </div>
    </div>
  </div>
</div>

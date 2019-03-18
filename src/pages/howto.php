<?php defined('ABSPATH') or exit; ?>
<div class="wrap">
  <h1><?php echo __('How to Use A/B Testing'); ?></h1>
  <div class="welcome-panel how-to">
    <div class="how-to-panel-content">
      <h3><?php echo __('Introduction to A/B Testing for WordPress'); ?></h3>
      
      <img style="width: 33%; max-width: 250px; float: right; margin-left: 30px;" src="<?php echo $assets; ?>how-to-1.png" />

      <p><?php echo __('A/B Testing for WordPress allows you to setup split tests on any of your posts or pages. You can add A/B Test blocks in your content using the Gutenberg content editor.'); ?></p>
      <p><?php echo __('Each block will contain the variants of your test and allow you to configure the tests. You can find the A/B Test block in the "Widgets" category.'); ?></p>

      <h3><?php echo __('Adding new Tests'); ?></h3>
      <p><?php echo __('To add a new test to your content, go to the edit page of the post or page you want to add the test to.'); ?></p>
      <p><?php echo __('Add a new "block" to the content, search for "A/B Test" under the category "Widgets".'); ?></p>
      <p><?php echo __('A prefilled A/B Test container will be put on the page. The test contains two variants: "A" and "B". Change the content of the variants as you please.'); ?></p>

      <h3><?php echo __('Enabling the Test'); ?></h3>
      <p><?php echo __('When the test is not enabled, it will not run. Meaning that only the control variant will be shown to visitors. The test result measurement will stop during this time.'); ?></p>
      <p><?php echo __('You need to enable a test to start tracking and measuring conversion results.'); ?></p>

      <h3><?php echo __('Setting up the Testing Goal'); ?></h3>
      <p><?php echo __('The testing goal is the page the visitor has to visit in order for the variant to count as a conversion. If you create a button the variants, it is a good idea to set the page where it links to as the testing goal.'); ?></p>

      <h3><?php echo __('Control Variant'); ?></h3>
      <p><?php echo __('The control variant is the variant which is shown by default and will also be seen by search engines. Changing the control variant is only needed if you do not want to serve variation "A" by default.'); ?></p>

      <h3><?php echo __('Weight distribution'); ?></h3>
      <p><?php echo __('With test distribution you can control what percentage of your visitors roughly will be served the variants.'); ?></p>
      <p><?php echo __('If the test is a bit risky for instance, you can weigh the variant to test the against the control a lot down. It will not affect the measured results.'); ?></p>
    </div>
  </div>
</div>
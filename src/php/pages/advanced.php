<?php defined('ABSPATH') or exit; ?>
<div class="wrap">
  <h1><?php echo __('Advanced Options', 'ab-testing-for-wp'); ?></h1>

  <div class="card">
    <h2><?php echo __('Database fix for A/B Testing for WordPress', 'ab-testing-for-wp'); ?></h2>
    <p><?php echo __('Getting database errors when going to A/B Testing for WordPress pages? It could be that your database is corrupt / incorrect.', 'ab-testing-for-wp'); ?></p>
    <p><?php echo __('This will reset your database and wipe all test tracking data. It will not delete the tests themselves.', 'ab-testing-for-wp'); ?></p>
    <p class="submit">
        <input type="submit" name="submit" id="submit" class="button button-primary" value="<?php echo __('Repair A/B testing tables', 'ab-testing-for-wp'); ?>">
    </p>
  </div>
</div>

<?php

namespace ABTestingForWP;

defined('ABSPATH') or exit;

$didRepair = false;

if (isset($_GET['repair-db']) && $_GET['repair-db'] === 'true') {
    $installer = new Installer(false);

    $installer->repair();

    $didRepair = true;
}

?>

<div class="wrap">
  <h1><?php echo __('Advanced Options', 'ab-testing-for-wp'); ?></h1>

  <div class="card">
    <h2><?php echo __('Database fix for A/B Testing for WordPress', 'ab-testing-for-wp'); ?></h2>

    <?php if ($didRepair): ?>
        <p><?php echo __('Performed database repair. Please check A/B Testing for WordPress pages.', 'ab-testing-for-wp'); ?></p>
    <?php else: ?>
        <p><?php echo __('Getting database errors when going to A/B Testing for WordPress pages? It could be that your database is corrupt / incorrect.', 'ab-testing-for-wp'); ?></p>
        <p><?php echo __('Before you perform this repair, it\'s a good idea to backup your database.', 'ab-testing-for-wp'); ?></p>
        <p><?php echo __('This will reset A/B Testing for WordPress. It will not other WordPress data.', 'ab-testing-for-wp'); ?></p>
        <p>
            <form id="repairForm">
                <input type="hidden" name="page" value="ab-testing-for-wp_advanced" />
                <input type="hidden" name="repair-db" value="true" />
                <?php submit_button(__('Repair A/B Testing for WordPress tables', 'ab-testing-for-wp'), 'primary', 'submit', false); ?>
            </form>
        </p>
    <?php endif; ?>
  </div>
</div>
<script>
    function onsubmitRepair(e) {
        var questions = [
            'Are you sure you want to repair A/B Testing for WordPress tables?',
            'All test data and measurements are maintained after this process.',
            'Make sure you have a database backup in case anything goes wrong.',
            'Process cannot be reversed, only do this when you get A/B Testing for WordPress database errors.',
        ];

        if (!window.confirm(questions.join('\n\n'))) e.preventDefault();
    }

    var form = document.getElementById('repairForm');

    if (form) form.onsubmit = onsubmitRepair;
</script>

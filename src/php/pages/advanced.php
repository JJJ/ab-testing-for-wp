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
        <p><?php echo __('This will reset your database and wipe all measurement data. It will not delete the tests themselves.', 'ab-testing-for-wp'); ?></p>
        <p>
            <form id="repairForm">
                <input type="hidden" name="page" value="ab-testing-for-wp_advanced" />
                <input type="hidden" name="repair-db" value="true" />
                <input type="submit" name="submit" id="submit" class="button button-primary" value="<?php echo __('Repair A/B testing tables', 'ab-testing-for-wp'); ?>">
            </form>
        </p>
    <?php endif; ?>
  </div>
</div>
<script>
    function onsubmitRepair(e) {
        var questions = [
            'Are you sure you want to repair A/B Testing for WordPress tables?',
            'Tests in posts and stand alone tests will remain.',
            'All test results will be lost.',
            'Process cannot be reversed, only do this when you get random A/B testing for WordPress errors.',
        ];

        if (!window.confirm(questions.join('\n\n'))) e.preventDefault();
    }

    var form = document.getElementById('repairForm');

    if (form) form.onsubmit = onsubmitRepair;
</script>

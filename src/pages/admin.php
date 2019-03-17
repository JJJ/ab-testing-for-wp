<?php defined('ABSPATH') or exit; ?>
<div class="wrap">
  <h1><?php echo __('Active A/B Tests in Content'); ?></h1>

  <?php if (sizeof($templateData['activeTests']) > 0) : ?>
    <table class="wp-list-table widefat fixed striped running-tests">
      <thead>
        <tr>
          <th><?php echo __('Started At'); ?></th>
          <th><?php echo __('On Page'); ?></th>
          <th><?php echo __('Goal'); ?></th>
          <th><?php echo __('Is Running'); ?></th>
          <th><?php echo __('Total Participants'); ?></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($templateData['activeTests'] as $test): ?>
          <tr>
            <td><?php echo $test['startedAt']; ?></td>
            <td><?php echo edit_post_link($test['postName'], '', '', $test['postId']); ?></td>
            <td><?php echo $test['goalName']; ?></td>
            <td><?php echo $test['isEnabled'] ? __('Yes') : __('No'); ?></td>
            <td><?php echo $test['totalParticipants']; ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</div>
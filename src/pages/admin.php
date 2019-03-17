<?php defined('ABSPATH') or exit; ?>
<div class="wrap">
  <h1><?php echo __('Active A/B Tests in Content'); ?></h1>

  <?php if (sizeof($templateData['activeTests']) > 0) : ?>
    <style>
      .ABTestVariationsTable {
        width: 100%;
      }

      .ABTestWinning td {
        color: #46B450!important;
      }

      .ABTestLosing td {
        color: #dc3232!important;
      }
    </style>

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
          <tr />
          <tr style="display: none;">
            <td colspan="5">
              <table class="wp-list-table widefat fixed striped variations">
                <thead>
                  <tr>
                    <th><?php echo __('Variation'); ?></th>
                    <th><?php echo __('Conversion Rate'); ?></th>
                    <th><?php echo __('Conversions'); ?></th>
                    <th><?php echo __('Participants'); ?></th>
                  </tr>
                </thead>
                <?php foreach ($test['variants'] as $variant) : ?>
                  <tr class="<?php echo $variant['leading'] && $variant['participants'] > 0 ? 'ABTestWinning' : 'ABTestLosing'; ?>">
                    <td><?php echo $variant['name']; ?></td>
                    <td><?php echo $variant['rate']; ?>%</td>
                    <td><?php echo $variant['conversions']; ?></td>
                    <td><?php echo $variant['participants']; ?></td>
                  </tr>
                <?php endforeach; ?>
              </table>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</div>
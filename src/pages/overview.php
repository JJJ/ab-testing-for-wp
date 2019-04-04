<?php defined('ABSPATH') or exit; ?>
<div class="wrap ab-testing-for-wp">
  <h1><?php echo __('Active A/B Tests'); ?></h1>

  <?php if (sizeof($templateData['activeTests']) > 0) : ?>
    <table class="wp-list-table widefat fixed striped running-tests">
      <thead>
        <tr>
          <th class="check-column"></th>
          <th class="column-primary"><?php echo __('Started At'); ?></th>
          <th><?php echo __('Page'); ?></th>
          <th><?php echo __('Goal'); ?></th>
          <th class="num"><?php echo __('Participants'); ?></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($templateData['activeTests'] as $test): ?>
          <tr>
            <td class="check-column check-column-normal">
              <div class="indicator indicator--<?php echo $test['isEnabled'] ? 'on' : 'off'; ?>"></div>
            </td>
            <td><?php echo $test['startedAt']; ?></td>
            <td class="column-primary"><?php echo edit_post_link($test['postName'], '', '', $test['postId']); ?></td>
            <td>
              <?php if ($test['goalType'] === 'page' || $test['goalType'] === 'post') {
                edit_post_link($test['goalName'], '', '', $test['postGoal']);
              } else {
                echo $test['goalName'];
              }
              ?>
            </td>
            <td class="num"><?php echo $test['totalParticipants']; ?></td>
          </tr>
          <tr></tr>
          <tr style="display: table-row;" id="ABTestResults-<?php echo $test['id']; ?>">
            <td colspan="5" style="display: table-cell">
              <?php if ($test['totalParticipants'] > 0) : ?> 
              <table class="wp-list-table widefat fixed striped variations">
                <thead>
                  <tr>
                    <th class="check-column"></th>
                    <th class="column-primary"><?php echo __('Conversion Rate'); ?></th>
                    <th><?php echo __('Conversions'); ?></th>
                    <th><?php echo __('Participants'); ?></th>
                  </tr>
                </thead>
                <?php foreach ($test['variants'] as $variant) : ?>
                  <tr class="<?php echo $variant['leading'] && $variant['participants'] > 0 ? 'ABTestWinning' : 'ABTestLosing'; ?>">
                    <td class="check-column check-column-normal">
                      <?php echo $variant['name']; ?>
                      <?php if ($variant['id'] === $test['control']) echo '*'; ?>
                    </td>
                    <td class="column-primary"><?php echo $variant['rate']; ?>%</td>
                    <td><?php echo $variant['conversions']; ?></td>
                    <td><?php echo $variant['participants']; ?></td>
                  </tr>
                <?php endforeach; ?>
              </table>
              <?php else : ?>
                <p><em><?php echo __('No results for this test yet.'); ?></em></p>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php else : ?>
    <h2><?php echo __('No active tests found in content.'); ?></h2>
    <p><?php echo __('Edit a page or post to add an A/B Test to the content.'); ?></p>
  <?php endif; ?>
</div>
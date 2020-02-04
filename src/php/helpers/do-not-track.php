<?php

namespace ABTestingForWP\DoNotTrack;

class DoNotTrack {

    public static function isEnabled($request) {
        $doNotTrack = $request->get_header('dnt') === '1' && !current_user_can('edit_posts');

        return apply_filters('ab-testing-for-wp_dnt', $doNotTrack);
    }

}

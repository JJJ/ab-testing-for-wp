<?php

namespace ABTestingForWP;

class DoNotTrack {

    public static function notAdmin() {
        return !current_user_can('edit_posts');
    }

    public static function isEnabled($request) {
        $doNotTrack = $request->get_header('dnt') === '1' && DoNotTrack::notAdmin();

        return apply_filters('ab-testing-for-wp_dnt', $doNotTrack);
    }

}

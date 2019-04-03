<?php

namespace ABTestingForWP;

class GoalActions {

    public function getGoalTypes() {
        $types = get_post_types([
            'public' => true,
        ]);

        var_dump($types);
    }

}
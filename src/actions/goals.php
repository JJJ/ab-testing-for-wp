<?php

namespace ABTestingForWP;

class GoalActions {

    public function getGoalTypes() {
        $types = get_post_types(
            [
                'public' => true,
            ], 
            'objects'
        );

        $allowedTypes = [];

        foreach ($types as $key => $type) {
            if ($key !== 'post' && $key !== 'page') continue;

            array_push($allowedTypes, [ 'name' => $type->name, 'label' => $type->label ]);
        }

        return rest_ensure_response($allowedTypes);
    }

}
<?php

namespace ABTestingForWP;

class BlockRenderer {
  
    private function randomTestDistributionPosition($tests) {
        $max = array_reduce(
            $tests, 
            function ($acc, $test) { 
                return $acc + $test['distribution']; 
            }, 
            0
        );

        return rand(1, $max);
    }

    private function pickTestAt($tests, $number) {
        $total = 0;

        for ($i = 0; $i < sizeof($tests); $i++) {
            $test = $tests[$i];
            $total = $total + $test['distribution'];

            if ($number <= $total) {
                return $test;
            }
        }
    }

    private function getVariantContent($content, $id) {
        $doc = new \DOMDocument();
        $doc->loadHTML('<html>' . $content . '</html>');
        $xpath = new \DOMXPath($doc);

        $nodes = $xpath->query('//div[contains(@class, "' . $id . '")]');

        if (sizeof($nodes) === 0) {
            return '';
        }

        return $doc->saveXML($nodes[0]);
    }

    private function getTest($tests, $parentId) {
        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $cookieData = get_object_vars(json_decode(stripslashes($_COOKIE['ab-testing-for-wp'])));

            if (isset($cookieData[$parentId])) {
                for ($i = 0; $i < sizeof($tests); $i++) {
                    if ($tests[$i]['id'] === $cookieData[$parentId]) {
                        return $tests[$i];
                    }
                }
            }
        }

        return $this->pickTestAt($tests, $this->randomTestDistributionPosition($tests));
    }

    private function wrapData($parentId, $variantId, $content) {
        return '<div class="ABTestWrapper" data-test="' . $parentId . '" data-variant="' . $variantId . '">' . $content . '</div>';
    }

    public function renderTest($attributes, $content) {
        $tests = $attributes['tests'];
        $parentId = $attributes['id'];

        $variant = $this->getTest($tests, $parentId);

        if (!isset($variant)) {
            return '';
        }

        return $this->wrapData($parentId, $variant['id'], $this->getVariantContent($content, $variant['id']));
    }

}
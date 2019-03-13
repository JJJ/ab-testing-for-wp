<?php

namespace ABTestingForWP;

class BlockRenderer {
  
    private function randomTestDistributionPosition($variants) {
        $max = array_reduce(
            $variants, 
            function ($acc, $variant) { 
                return $acc + $variant['distribution']; 
            }, 
            0
        );

        return rand(1, $max);
    }

    private function pickVariantAt($variants, $number) {
        $total = 0;

        for ($i = 0; $i < sizeof($variants); $i++) {
            $variant = $variants[$i];
            $total = $total + $variant['distribution'];

            if ($number <= $total) {
                return $variant;
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

    private function getVariant($variants, $testId) {
        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $cookieData = get_object_vars(json_decode(stripslashes($_COOKIE['ab-testing-for-wp'])));

            if (isset($cookieData[$testId])) {
                for ($i = 0; $i < sizeof($variants); $i++) {
                    if ($variants[$i]['id'] === $cookieData[$testId]) {
                        return $variants[$i];
                    }
                }
            }
        }

        return $this->pickVariantAt($variants, $this->randomTestDistributionPosition($variants));
    }

    private function wrapData($testId, $variantId, $content) {
        return '<div class="ABTestWrapper" data-test="' . $testId . '" data-variant="' . $variantId . '">' . $content . '</div>';
    }

    public function renderTest($attributes, $content) {
        $variants = $attributes['variants'];
        $testId = $attributes['id'];

        $variant = $this->getVariant($variants, $testId);

        if (!isset($variant)) {
            return '';
        }

        return $this->wrapData($testId, $variant['id'], $this->getVariantContent($content, $variant['id']));
    }

}
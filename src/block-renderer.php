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

        foreach ($variants as $variant) {
            $total = $total + $variant['distribution'];

            if ($number <= $total) {
                return $variant;
            }
        }

        return $variants[0];
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

    private function pickVariant($variants, $testId) {
        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $cookieData = get_object_vars(json_decode(stripslashes($_COOKIE['ab-testing-for-wp'])));

            if (isset($cookieData[$testId])) {
                // make sure variant is still in varients
                foreach ($variants as $variant) {
                    if ($variant['id'] === $cookieData[$testId]) {
                        return $variant;
                    }
                }
            }
        }

        return $this->pickVariantAt($variants, $this->randomTestDistributionPosition($variants));
    }

    private function getControlVariant($variants, $testId, $control) {
        // get control variant version
        foreach ($variants as $variant) {
            if ($variant['id'] === $control) {
                return $variant;
            }
        }

        // when all else fails... return the first variant
        return $variants[0];
    }

    private function encodeURIComponent($str) {
        $revert = array('%21'=>'!', '%2A'=>'*', '%27'=>"'", '%28'=>'(', '%29'=>')');
        return strtr(rawurlencode($str), $revert);
    }

    private function variantScriptHTML($controlVariantId, $variantId, $variantContent) {
        if ($controlVariantId === $variantId) {
            return '';
        }

        return '<script>window.abTestForWP=window.abTestForWP||{};window.abTestForWP["' . $variantId . '"]="' . $this->encodeURIComponent($variantContent) . '"</script>';
    }

    private function wrapData($testId, $controlVariantId, $variantId, $controlContent, $variantContent) {
        return 
            '<div class="ABTestWrapper" data-test="' . $testId . '" data-variant="' . $variantId . '" data-control-id="' . $controlVariantId . '">'
                . $this->variantScriptHTML($controlVariantId, $variantId, $variantContent)
                . $controlContent
            . '</div>';
    }

    public function renderTest($attributes, $content) {
        $variants = $attributes['variants'];
        $testId = $attributes['id'];
        $control = $attributes['control'];
        $isEnabled = isset($attributes['isEnabled']) ? $attributes['isEnabled'] : false;

        $controlVariant = $this->getControlVariant($variants, $testId, $control);

        if (!isset($controlVariant)) {
            return '';
        }

        $pickedVariant = $isEnabled ? $this->pickVariant($variants, $testId) : $controlVariant;

        return $this->wrapData(
            $testId, 
            $controlVariant['id'],
            $pickedVariant['id'],
            $this->getVariantContent($content, $controlVariant['id']),
            $this->getVariantContent($content, $pickedVariant['id'])
        );
    }

}
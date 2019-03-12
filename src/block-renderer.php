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

    public function renderTest($attributes, $content) {
        var_dump(htmlentities($content));

        $tests = $attributes['tests'];

        $test = $this->pickTestAt($tests, $this->randomTestDistributionPosition($tests));

        if (!isset($test)) {
            return '';
        }

        return $this->getVariantContent($content, $test['id']);
    }

}
<?php

namespace ABTestingForWP;

class ABTestContentParser {

    public static function testDataFromContent($content) {
        preg_match_all('/<!-- wp:ab-testing-for-wp\/ab-test-block (.+) -->/', $content, $matches);

        $testData = [];

        foreach ($matches[1] as $data) {
            array_push($testData, json_decode($data, true));
        }

        return $testData;
    }

    public static function findTestInContent($content, $testId) {
        $testData = ABTestContentParser::testDataFromContent($content);

        foreach ($testData as $data) {
            if ($data['id'] === $testId) {
                return $data;
            }
        }

      return false;
  }

}

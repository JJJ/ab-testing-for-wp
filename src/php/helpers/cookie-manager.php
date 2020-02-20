<?php

namespace ABTestingForWP;

class CookieManager {

    public static function nameById($testId) {
        return "ab-testing-for-wp_${testId}";
    }

    public static function readLegacyCookie() {
        return json_decode(stripslashes($_COOKIE['ab-testing-for-wp']), true);
    }

    public static function getAllParticipating() {
        $data = [];

        // check if legacy cookie is set
        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $cookieData = CookieManager::readLegacyCookie();

            foreach ($cookieData as $testId => $variant) {
                if ($testId !== 'tracked') {
                    $data[$testId] = $variant;
                }
            }
        }

        // list all picked variants
        foreach ($_COOKIE as $key => $value) {
            if ($key !== 'ab-testing-for-wp' && strpos($key, 'ab-testing-for-wp_') === 0) {
                list($variant, $tracked) = explode(":", $value);
                $testId = substr($key, strlen('ab-testing-for-wp_'));

                $data[$testId] = $variant;
            }
        }

        return $data;
    }

    public static function getCookie($testId) {
        return $_COOKIE[CookieManager::nameById($testId)];
    }

    public static function isAvailable($testId) {
        // check if legacy cookie is set
        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $data = CookieManager::readLegacyCookie();

            // check if test is set
            if (isset($data[$testId])) {
                return true;
            }
        }

        // if cookie is set
        if (isset($_COOKIE[CookieManager::nameById($testId)])) {
            return true;
        }

        return false;
    }

    public static function getData($testId) {
        // find test in legacy cookie format
        if (isset($_COOKIE['ab-testing-for-wp'])) {
            $data = CookieManager::readLegacyCookie();

            if (isset($data[$testId])) {
                return [
                    'variant' => $data[$testId],
                    'tracked' => in_array($data[$testId], $data['tracked']) ? 'P' : 'C'
                ];
            }
        }

        // find test in single cookie format
        if (CookieManager::isAvailable($testId)) {
            list($variant, $tracked) = explode(":", CookieManager::getCookie($testId));

            return [
                'variant' => $variant,
                'tracked' => $tracked
            ];
        }

        throw new Error("No data in cookies for '$testId'");
    }

    public static function setData($testId, $variant, $tracked) {
        setcookie(
            CookieManager::nameById($testId),
            "$variant:$tracked",
            time() + (60*60*24*30),
            '/'
        );
    }

    public static function removeData($testId) {
        $name = CookieManager::nameById($testId);
        unset($_COOKIE[$name]);
        setcookie($name, null, -1, '/');
    }

}

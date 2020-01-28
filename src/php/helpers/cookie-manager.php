<?php

namespace ABTestingForWP;

class CookieManager {

    public static function getCookie() {
        return $_COOKIE['ab-testing-for-wp'];
    }

    public static function isSet() {
        return isset($_COOKIE['ab-testing-for-wp']);
    }

    public static function getData() {
        return json_decode(stripslashes(CookieManager::getCookie()), true);
    }

    public static function setData($data) {
        setcookie('ab-testing-for-wp', json_encode($data), time() + (60*60*24*30), '/');
    }

}

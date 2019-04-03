<?php
/**
 * @package ABTestingForWP
 * @version 1.5.1
 */
/*
    Plugin Name: A/B Testing for WordPress
    Plugin URI: https://abtestingforwp.com
    Description: Easiest way to create split tests on your WordPress sites, right from the content editor!
    Version: 1.5.1
    Author: CleverNode
    Author URI: https://theclevernode.com
    Text Domain: ab-testing-for-wp
    License: GPL v3
    Copyright 2019 - CleverNode
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

namespace ABTestingForWP;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (!defined('ABSPATH')) {
	header('Status: 403 Forbidden');
	header('HTTP/1.1 403 Forbidden');
	exit;
}

require __DIR__ . '/vendor/autoload.php';

function bootstrap() {
    // on every request
    new RegisterGutenbergBlocks(__FILE__);
    new BootStrapIntegrations();

    // only on admin
    if(is_admin()) {
        if(!defined('DOING_AJAX') || !DOING_AJAX) {
            new RegisterAdminPage(__FILE__);
        }
    }

    // only on frontend
    if(!is_admin()) {
        new RegisterRenderScripts(__FILE__);
        new RegisterFrontendAdminBar(__FILE__);
    }
}

function bootstrapREST() {
    new RegisterREST();
}

// register WordPress hooks
new Installer(__FILE__);
add_action('init', 'ABTestingForWP\\bootstrap');
add_action('rest_api_init', 'ABTestingForWP\\bootstrapREST');

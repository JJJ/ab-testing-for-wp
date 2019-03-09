<?php
/*
    Plugin Name: A/B Testing for WordPress
    Plugin URI: https://theclevernode.com
    Description: Incredibly easy A/B testing for WordPress
    Version: 1.0.0
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
if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

require 'src/enqueue-scripts.php';
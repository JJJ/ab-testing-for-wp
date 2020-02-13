---
title: Place Visitors in a Variant using URL Parameters
date: 2020-02-13 20:00:00
description: Through conditions, force a visitor to be placed in a variant of your test.
---

A reoccurring feature request I got was the ability to place visitors in a predetermined variant of a test through the use of query parameters in the URL.

This feature is great if you want to be able to have control over the variant of a test the visitor is placed in.

This feature is now available in [A/B Testing for WordPress](https://wordpress.org/plugins/ab-testing-for-wp/).

{% asset_img ab-test-conditions.png Setup variant conditions for A/B tests %}

## Placing visitors in a variant

When you go to a test's settings you'll find a new option to add conditions under variants.

Choose "add condition to A" to add a condition for variant A. Enter the key and value pair you want to force visitor into this variant.

Key value pairs look like this in the URL of a page: `?key=value&another=thing`. Also known as query parameters.

Once a visitor lands on a page with your test and has the key value pair in their URL, they will be placed in said variant.

## Integrates well with analytics and other marketing tools

For your convenience `utm_source`, `utm_medium`, and `utm_campaign` are added to be quickly added as conditions.

This way you can for instance show your newsletter readers a certain variant of a test _and_ also keep track of it in your analytics tool by using `utm_source=newsletter` as a condition.

## Upgrade now

[Update A/B Testing for WordPress to 1.17.0](https://wordpress.org/plugins/ab-testing-for-wp/) to get this new feature.

#!/bin/bash

read -p "Enter version new: " VERSION
echo "Version is" $VERSION

# Add release numbers
sed -i .copy -e "s/Stable tag: [0-9]*\.[0-9]*\.[0-9]*/Stable tag: $VERSION/" ./README.txt
sed -i .copy -e "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/" ./package.json
sed -i .copy -e "s/@version [0-9]*\.[0-9]*\.[0-9]*/@version $VERSION/" ./ab-testing-for-wp.php
sed -i .copy -e "s/Version: [0-9]*\.[0-9]*\.[0-9]*/Version: $VERSION/" ./ab-testing-for-wp.php

rm *.copy

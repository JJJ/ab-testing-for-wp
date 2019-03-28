#!/bin/bash

read -p "Enter version new: " VERSION
echo "Version is" $VERSION

# Add release numbers
sed -i .copy -e "s/Stable tag: [[:digit:]]\.[[:digit:]]\.[[:digit:]]/Stable tag: $VERSION/" ./README.txt
sed -i .copy -e "s/\"version\": \"[[:digit:]]\.[[:digit:]]\.[[:digit:]]\"/\"version\": \"$VERSION\"/" ./package.json
sed -i .copy -e "s/@version [[:digit:]]\.[[:digit:]]\.[[:digit:]]/@version $VERSION/" ./ab-testing-for-wp.php
sed -i .copy -e "s/Version: [[:digit:]]\.[[:digit:]]\.[[:digit:]]/Version: $VERSION/" ./ab-testing-for-wp.php

rm *.copy

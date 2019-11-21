#!/bin/bash

read -p "Enter SVN dir [./svn]: " SVN_DIR
SVN_DIR=${SVN_DIR:-./svn}
echo "SVN directory is" $SVN_DIR

VERSION=$(cat ab-testing-for-wp.php | grep "Version: \(.*\)" | tr ' ' '\n' | tail -1)

echo "Release version $VERSION (y/n)?"
read answer

if [[ "$answer" != "${answer#[Yy]}" ]]; then
  echo "Releasing to GitHub...";

  git tag $VERSION
  git push --tags
else
  echo "Aborting";
fi;

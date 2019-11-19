#!/bin/bash

read -p "Enter SVN dir [./svn]: " SVN_DIR
SVN_DIR=${SVN_DIR:-./svn}
echo "SVN directory is" $SVN_DIR

VERSION=$(cat ab-testing-for-wp.php | grep "Version: \(.*\)" | tr ' ' '\n' | tail -1)

echo "Release version $VERSION (y/n)?"
read answer

if [[ "$answer" != "${answer#[Yy]}" ]]; then
  echo "Releasing to GitHub...";

  git tag v$VERSION
  git push --tags

  echo "Releasing to SVN...";

  # clean SVN folders
  rm -Rf $SVN_DIR/trunk/*
  rm -Rf $SVN_DIR/assets/*

  # copy files
  rsync -av --exclude-from '.rsyncignore' ./assets $SVN_DIR
  rsync -av --exclude-from '.rsyncignore' ./ $SVN_DIR/trunk
  rsync -av --exclude-from '.rsyncignore' ./ $SVN_DIR/tags/$VERSION

  # commit SVN
  cd $SVN_DIR

  # DO THE ADD ALL NOT KNOWN FILES UNIX COMMAND
  svn add --force * --auto-props --parents --depth infinity -q

  # DO THE REMOVE ALL DELETED FILES UNIX COMMAND
  MISSING_PATHS=$( svn status | sed -e '/^!/!d' -e 's/^!//' )

  # iterate over filepaths
  for MISSING_PATH in $MISSING_PATHS; do
    svn rm --force "$MISSING_PATH"
  done

  svn up
  echo "Commit change in SVN folder to finalize release";
else
  echo "Aborting";
fi;

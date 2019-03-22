#!/bin/bash

read -p "Enter SVN dir [./svn]: " SVN_DIR
SVN_DIR=${SVN_DIR:-./svn}
echo "SVN directory is" $SVN_DIR

read -p "Enter version: " VERSION
echo "Version is" $VERSION

# build
npm run build

# clean SVN folders
rm -rf $SVN_DIR/trunk/*
rm -rf $SVN_DIR/assets/*

# copy files
rsync -av --exclude-from '.rsyncignore' ./assets $SVN_DIR
rsync -av --exclude-from '.rsyncignore' ./ $SVN_DIR/trunk
rsync -av --exclude-from '.rsyncignore' ./ $SVN_DIR/tags/$VERSION

# commit SVN
cd $SVN_DIR
svn add trunk --force
svn add tags --force
svn add assets --force
svn ci -m 'Committing tag' $VERSION
svn up

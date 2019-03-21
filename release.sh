#!/bin/bash

read -p "Enter SVN dir [./svn]: " SVN_DIR
SVN_DIR=${SVN_DIR:-./svn}
echo "SVN directory is" $SVN_DIR

read -p "Enter version: " VERSION
echo "Version is" $VERSION

# build
npm run build

# copy files
rsync -av --exclude='.git' --exclude='node_modules' --exclude='svn' --exclude='assets' ./assets $SVN_DIR/assets
rsync -av --exclude='.git' --exclude='node_modules' --exclude='svn' --exclude='assets' ./ $SVN_DIR/trunk
rsync -av --exclude='.git' --exclude='node_modules' --exclude='svn' --exclude='assets' ./ $SVN_DIR/tags/$VERSION

# commit SVN
cd $SVN_DIR
svn add trunk
svn add tags
svn ci -m 'Committing tag' $VERSION
svn up

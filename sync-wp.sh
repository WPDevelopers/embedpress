#!/bin/sh

# Sync the src folder into wordpress, to auto-update the code while 
# developing. Used with fswatch in Mac OS to detect file changes.

# rsync -rtvu --delete ./src ~/Projects/OSTraining/Git/dev-env-wordpress/www/wp-content/plugins/embedpress
rm -rf ~/Projects/OSTraining/Git/dev-env-wordpress/www/wp-content/plugins/embedpress/*
cp -R ./src/* ~/Projects/OSTraining/Git/dev-env-wordpress/www/wp-content/plugins/embedpress/
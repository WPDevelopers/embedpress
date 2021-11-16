#!/bin/sh

# Author : Priyo Mukul
# Copyright (c) wpdeveloper.com

echo "> Running NPM INSTALL Silently" && npm install -s && echo "> Running NPM BUILD for EmbedPress Gutenberg Scripts" && cd Gutenberg && npm run build -s && cd .. && echo "." && echo "." && echo "." && echo "Making Build ( ZIP ) for WordPress.org" && wp dist-archive ../embedpress ../embedpress --allow-root && echo "√ Please check your wp-content folder.";

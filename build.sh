#!/bin/sh

# Author : Priyo Mukul
# Copyright (c) WPDeveloper.net

echo "Making Build ( ZIP ) for WordPress.org" && wp dist-archive ../embedpress ../embedpress --allow-root && echo "√ Please check your wp-content folder.";
"use strict";

window.addEventListener('hashchange', (e) => {
    console.log('The hash has changed!', e.newURL)
    let x = new URL(e.newURL);
    console.log(x);
    let y = new URLSearchParams(x.hash.substring(1))
    console.log(y.get('themeMode'))

  }, false);
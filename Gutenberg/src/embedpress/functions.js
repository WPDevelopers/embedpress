const { useState, useEffect } = wp.element;

export const mergeAtts = (defaults, attributes) => {
    const out = {};
    Object.keys(defaults).forEach(key => {
        if(key in attributes){
            out[key] = attributes[key];
        }
        else{
            out[key] = defaults[key];
        }
    });
    return out;
}
export const getParams = (params, attributes, defaults) => {
    const atts = mergeAtts(defaults, attributes);
    return {...params, ...atts};
}

export const arrToObject = (defaults) => {
    const defaultsObj = {};

    defaults.forEach(element => {
        defaultsObj[element] = '';
    });
    return defaultsObj;
}
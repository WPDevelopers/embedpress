/**
 * EmbedPress Analytics Component
 */

import React from 'react';
import WorldMap from './WorldMap';

const Example = () => {
    return (
        <div className="embedpress-analytics">
            <div className='viewer-location'>
                <WorldMap />
            </div>
        </div>
    );
};

export default Example;

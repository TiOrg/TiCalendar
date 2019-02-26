import React from 'react';
import * as color from '../assets/css/color';
export function getStackOptions(title) {
    return {
        title: title || '',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: color.FACEBOOK_BLUE
        }
    }
}

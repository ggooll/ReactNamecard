/**
 * Created by imgyucheol on 2017. 9. 6..
 */

import randomInt from 'random-int';

function getAuthenticationNumber() {
    let authenticationNumber = "";

    for (let i = 0; i < 6; i++) {
        authenticationNumber += randomInt(0, 9);
    }
    return authenticationNumber;
}

module.exports = {
    getRandomNumber: getAuthenticationNumber
};
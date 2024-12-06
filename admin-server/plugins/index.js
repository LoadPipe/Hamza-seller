
const cookieParser = require('cookie-parser');
const session = require('express-session');

/**
 * Middleware setup function for custom plugin
 */
const setupMiddleware = (app) => {
    //console.log('*************************************************************************************')
};

/**
 * Medusa plugin export function
 */
module.exports = {
    load: (container) => {
        //console.log('*************************************************************************************')
        // Listen for the server to be created
        container.resolve('expressApp', (app) => {
            setupMiddleware(app); // Call middleware setup
        });
    },
};

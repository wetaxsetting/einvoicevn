'use strict'
const Env = use('Env')
const Utils = use('Utils')

class User {
    async handle({ response, auth }, next) {
        try {
            const User = await auth.getUser();
            if (!User) {
                response.clearCookie('token');
                response.clearCookie('user');
                response.clearCookie("*");
                return response.send(false);
            }
            await next();

        } catch (e) {
            //console.log(e)
            response.clearCookie('token');
            response.clearCookie('user');
            response.clearCookie("*");
            //return response.redirect('/login');
            return response.send(e);
            /*return response.status(401).send(
            	Utils.response(false, 'Middleware: ' + e.message, null, 401)
            );*/
        }
    }
}

module.exports = User;
'use strict'
const Env = use('Env')
const Utils = use('Utils')

class User {
    async handle({ response, auth }, next) {
        try {
            const User = await auth.getUser();
            // console.log("===> middleware : ", JSON.stringify(User)  );

            if (!User) {
                response.clearCookie('token');
                response.clearCookie('user');
                response.clearCookie("*");
                // return response.send(false);
                return response.status(401).json(Utils.responseByRule({success : false, message : "E_INVALID_JWT_TOKEN: invalid token"}));
            }
            await next();

        } catch (e) {
            // console.log("===> catch middleware : ", e.message );
            response.clearCookie('token');
            response.clearCookie('user');
            response.clearCookie("*");
            //return response.redirect('/login');
            // return response.send(e);
            return response.status(401).json(Utils.responseByRule({success : false, message : e.message}));
            /*return response.status(401).send(
            	Utils.response(false, 'Middleware: ' + e.message, null, 401)
            );*/
        }
    }
}

module.exports = User;
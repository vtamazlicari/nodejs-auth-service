const errors = require('@feathersjs/errors');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function createAuthorizationVerifier(userRepository) {
    return {
        validateToken: extractAuthorizationToken,
        verifierId: verifyUserId,
        validateUser: [extractAuthorizationToken, verifyUserId],
    };

    function extractAuthorizationToken(request, response, next) {
        const token = request.headers.authorization;
        if (!token) return next(new errors.Forbidden('TOKEN_NOT_RECEIVED'));
        try {
            request.token = jwt.verify(token, config.jwtconf.secret);
        } catch (err) {
            return next(new errors.Forbidden('UNKNOWN_AUTHORIZATION_ERROR'));
        }

        return next();
    }

    function verifyUserId(request, response, next) {
        return userRepository.exists(request.token.user)
            .then((result) => {
                if (!result) return next(new errors.Forbidden('USER_NOT_FOUND'));
                return next();
            })
            .catch(next);
    }
};

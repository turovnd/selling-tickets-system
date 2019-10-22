'use strict';

const passport      = require('passport');
const JWTStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;

module.exports = () => {

    passport.use( new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_ACCESS_SECRET,
        algorithm: "HS256",
        passReqToCallback: true,
        ignoreExpiration: true
    }, async function (req, payload, done) {
        if (payload.exp > (+new Date() / 1000 - 30))
            return done(null, { id: payload.id, isAdmin: payload.isAdmin || false } );
        return done(null, false);
    }));

    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticateJWT: () => {
            return passport.authenticate('jwt', { session: false } );
        }
    }
};
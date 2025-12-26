import jwt from "jsonwebtoken";
import { tokenTypes } from "../../../config/tokens.js";
import Token from "../../../models/Token.js";
import moment from "moment";

export const generateToken = (userId, userRole, userEmail, type, expires, secret = process.env.JWT_SECRET) => {
    const payload = {
        sub: userId,
        role: userRole,
        email: userEmail,
        type: type
    };
    return jwt.sign(payload, secret, { expiresIn: expires });
};

export const saveToken = async (token, userId, expiredAt, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        type: type,
        expiredAt: expiredAt.toDate(),
        blacklisted,
    });
    return tokenDoc;
};

export const generateAuthTokens = async (user) => {
    const accessTokenExpires = `${process.env.ACCESS_TOKEN_EXPIRES_IN}h`;
    const refreshTokenExpires = `${process.env.REFRESH_TOKEN_EXPIRES_IN}d`;
    const accessToken = generateToken(
        user._id, user.role, user.email, tokenTypes.ACCESS, accessTokenExpires
    );
    
    const refreshToken = generateToken(
        user._id, user.role, user.email, tokenTypes.REFRESH, refreshTokenExpires
    );

    const refreshTokenExpiresAt = moment().add(process.env.REFRESH_TOKEN_EXPIRES_IN, 'days');
    await saveToken(refreshToken, user._id, refreshTokenExpiresAt, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: moment().add(process.env.ACCESS_TOKEN_EXPIRES_IN, "hours").toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpiresAt.toDate(),
        },
    };
};
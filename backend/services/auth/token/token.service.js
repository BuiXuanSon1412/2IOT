import jwt from "jsonwebtoken";
import { tokenTypes } from "../../../config/tokens.js";
import Token from "../../../models/token/Token.js";

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

// export const verifyToken = async (token, type) => {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const tokenDoc = await Token.findOne({ token, user: payload.sub, type: payload.type, blacklisted: false });
//     if (!tokenDoc) {
//         throw new Error('Token not found');
//     }
//     return tokenDoc;
// };

export const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(process.env.ACCESS_TOKEN_EXPIRES_IN, 'hours');
    const accessToken = generateToken(
        user.id, user.role, user.email, tokenTypes.ACCESS, accessTokenExpires
    );

    const refreshTokenExpires = moment().add(process.env.REFRESH_TOKEN_EXPIRES_IN, 'days');
    const refreshToken = generateToken(
        user.id, user.role, user.email, tokenTypes.REFRESH, refreshTokenExpires
    );
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};
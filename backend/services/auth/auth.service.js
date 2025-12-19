import bcrypt from "bcrypt";
import Token from "../../models/token/Token.js";
import { getUserById, getUserByEmail, updateUserLastLoginTime, createUser } from "../user/user.service.js";
import { generateAuthTokens, verifyToken } from "../auth/token/token.service.js";

export const loginService = async (email, password) => {
    const user = await getUserByEmail(email);
    if (!user) {
        return null;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        return null;
    }

    await updateUserLastLoginTime(user._id);

    return { user };
}

export const logoutService = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new Error("Token not found");
    }
    await refreshTokenDoc.remove();
};

export const signupService = async (email, password, name) => {
    const user = await createUser(email, password, name);
    if (!user) return null;

    return { user };
}

export const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
        const user = await getUserById(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.remove();
        return await generateAuthTokens(user);
    } catch (error) {
        throw new Error("Unauthorized");
    }
};

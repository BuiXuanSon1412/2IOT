import bcrypt from "bcrypt";
import User from "../../models/User.js";
import Token from "../../models/Token.js";
import jwt from "jsonwebtoken";

export async function signupService(name, email, password) {
    const existing = await User.findOne({ email });
    if (existing) return null;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        passwordHash
    });

    return user;
}

export async function loginService(email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    return user;
}

export async function logoutService(refreshToken) {
    const tokenDoc = await Token.findOne({ token: refreshToken });
    if (!tokenDoc) return;

    tokenDoc.blacklisted = true;
    await tokenDoc.save();
}

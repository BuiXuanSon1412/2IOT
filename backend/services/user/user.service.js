import User from '../../models/user/User.js';
import bcrypt from "bcrypt";

export const getUserById = async (userId) => {
    const user = await User.findById({ userId });
    if (!user) return null;
    return user;
};

export const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) return null;
    return user;
};

export const createUser = async (email, password, name) => {
    const existing = await User.findOne({ email });
    if (existing) {
        return null;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        passwordHash,
        name,
        role: "user"
    });

    return user;
};

export const updateUserRole = async (userId, newRole) => {
    if (!["user", "admin"].includes(newRole)) {
        throw new Error("Invalid role");
    }
    const user = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
    );

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export const updateUserLastLoginTime = async (userId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { lastLoginAt: new Date() },
        { new: true }
    );

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

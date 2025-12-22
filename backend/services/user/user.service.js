import User from '../../models/User.js';
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

export const getAllUsers = async () => {
    const users = await User.find({});
    return users;
}

export const createUser = async (name, email, password, role) => {
    const existing = await User.findOne({ email });
    if (existing) {
        return null;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        passwordHash,
        role: role,
        createdAt: Date.now()
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

export const updateUserPermissionOnDevice = async (userId, deviceId, permissionLevel) => {
    // TODO
};

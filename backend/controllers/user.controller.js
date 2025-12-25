import { getAllUsers, createUser, createAdmin, updateUserRole, deleteUser } from "../services/user/user.service.js";

export async function fetchAllUser (req, res) {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function addNewUser (req, res) { // add one user at a time
    try {
        const newUser = req.body;
        const addedUser = await createUser(newUser.name, newUser.email, newUser.password);
        res.status(201).json({ message: "Added user", newUser: addedUser });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createNewAdmin (req, res) {
    try {
        const newAdmin = req.body;
        const addedAdmin = await createAdmin(newAdmin.email, newAdmin.password, newAdmin.name);
        res.status(201).json({ message: "Added admin", newAdmin: addedAdmin });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function changeUserRole (req, res) {
    try {
        const updatedUser = await updateUserRole(req.body.userId, req.body.newRole);
        res.status(200).json({ message: "User's role updated", updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function removeUser (req, res) {
    try {
        const { userId } = req.body;
        const deleteResult = await deleteUser(userId);
        res.status(200).json({ message: "User deleted.", deleteResult });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
import { getAllUsers, createUser, createAdmin } from "../services/user/user.service.js";

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
        const addedUser = await createUser(newUser.email, newUser.password, newUser.name);
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

export async function changePermissionOfUserOnDevice (req, res) {
    // TODO
}

export async function changeUserRole (req, res) {
    // TODO
}

export async function removeUser (req, res) {
    // TODO
}
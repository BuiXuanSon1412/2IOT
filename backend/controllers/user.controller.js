import { getAllUsers, createUser } from "../services/user/user.service.js";

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
        const addedUser = await createUser(newUser.name, newUser.email, newUser.password, newUser.role?newUser.role:"user");
        res.status(201).json({ message: "Added user", newUser: addedUser });
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
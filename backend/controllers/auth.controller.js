import { signupService, loginService, logoutService } from "../services/auth/auth.service.js";
import { generateAuthTokens } from "../services/auth/token/token.service.js";

export async function signup(req, res) {
    const { name, email, password } = req.body;

    const user = await signupService(name, email, password);
    if (!user) {
        return res.status(409).json({ message: "Email already exists" });
    }

    const tokens = await generateAuthTokens(user);

    res.status(201).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        tokens
    });
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await loginService(email, password);
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const tokens = await generateAuthTokens(user);

    res.status(200).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        tokens
    });
}

export async function logout(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    await logoutService(refreshToken);
    res.status(204).send();
}

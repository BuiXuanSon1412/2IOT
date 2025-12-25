import { signupService, loginService, logoutService } from "../services/auth/auth.service.js";
import { generateAuthTokens } from "../services/auth/token/token.service.js";

export async function signup(req, res) {
    const user = await signupService(req.body.name, req.body.email, req.body.password, req.body.joinCode);
    if (!user) {
        return res.status(409).json({ message: "Email already exists" });
    }

    const tokens = await generateAuthTokens(user);

    res.status(201).json({
        user: user,
        tokens
    });
}

export async function login(req, res) {
    const user = await loginService(req.body.email, req.body.password);
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
    res.status(200).send();
}

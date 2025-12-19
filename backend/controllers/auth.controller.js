import { loginService, logoutService, signupService } from "../services/auth/auth.service.js";
import { generateAuthTokens } from "../services/auth/token/token.service.js";

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await loginService(email, password);
    const tokens = await generateAuthTokens(user);
    res.send({ user, tokens });
}

export async function logout(req, res) {
    await logoutService(req.body.refreshToken);
    res.status(204).send();
}

export async function signup(req, res) {
    const user = await signupService(req.body);
    const tokens = await generateAuthTokens(user);
    res.status(201).send({ user, tokens });
}

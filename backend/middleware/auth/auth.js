import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = payload; // { _id, role, email }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
}

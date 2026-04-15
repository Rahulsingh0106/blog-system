import crypto from "crypto";

export const getCSRFToken = (req, res) => {
    const csrfToken = crypto.randomBytes(32).toString("hex");

    res.cookie("csrf", csrfToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.json({ csrfToken });
}
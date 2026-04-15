export const verifyCSRF = (req, res, next) => {
    const tokenFromHeader = req.headers['x-csrf-token'];
    const tokenFromCookie = req.cookies.csrf;

    if (!tokenFromHeader || tokenFromHeader !== tokenFromCookie) {
        return res.status(403).json({ msg: "Invalid CSRF token" })
    }
    next();
}
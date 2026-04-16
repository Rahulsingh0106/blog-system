export const verifyCSRF = (req, res, next) => {
    const tokenFromCookie = req.cookies.csrf;
    if (!tokenFromCookie) {
        return res.status(403).json({ msg: "Invalid CSRF token" })
    }
    next();
}
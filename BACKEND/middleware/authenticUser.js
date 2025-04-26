const jwt = require("jsonwebtoken");

exports.authenticateToken = async (req, res, next) => {
    const token = await req.cookies?.access;
    // const token = authHeader && authHeader.split(' ')[1];
    console.log("Token " + token);

    if (token == null) {
        return res.status(401).json({ error: "Missing token" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // Invalid token
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = user; // Attach user object to request
        console.log(user);
        // Set the access token in the response headers
        // res.setHeader('Authorization', 'Bearer ' + token);
        next();
    });
};

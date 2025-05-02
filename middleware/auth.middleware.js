import jwt from "jsonwebtoken"

export const isLogedIn = (req, res, next) => {
    try {
        console.log(req.cookies);
        let token = req.cookies.token;

        console.log("Token found", token ? "YES" : "NO");

        if(!token){
            console.log("No token");
            res.status(401).json({
                success: "false",
                message: "Authentication Failed!"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("decoded data: ", decoded);
        req.user = decoded;
        next();

    } catch (error) {
        console.log("Auth Middleware Failure");
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

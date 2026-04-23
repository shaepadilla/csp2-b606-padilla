const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create Access Token
module.exports.createAccessToken = (user) => {

    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};


// Verify Token
module.exports.verify = (req, res, next) => {

    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.status(403).send({
            auth: "Failed",
            message: "No Token Provided"
        });
    }

    token = token.slice(7, token.length);

    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){

        if(err){
            return res.status(403).send({
                auth: "Failed",
                message: err.message
            });
        }

        req.user = decodedToken;
        next();

    });
};


// Verify Admin
module.exports.verifyAdmin = (req, res, next) => {

    if(req.user.isAdmin){
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }

};


// Verify User Access
module.exports.verifyUserAccess = (req, res, next) => {

    if(req.user.isAdmin){
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }

    next();

};
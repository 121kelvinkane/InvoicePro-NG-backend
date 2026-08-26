const bcrypt = require("bcryptjs");
const User = require("../../models/user.model.js");
const userResponse = require("../../utils/userResponse.js");
const { signInSchema } = require("../../schema/auth.schema.js");
const { generateToken } = require("../../utils/generateToken.js");
const { successResponse, errorResponse } = require("../../utils/response.js");

exports.signIn = async  (req, res) => {
    try {

        const result = signInSchema.safeParse(req.body);
        
        if(!result.success) {
            const errors = result.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));

            return errorResponse(
                res,
                400,
                errors,
            )
        };    

        const { email, password } = result.data;

        const user = await User.findOne({email});

        if(!user){
            return errorResponse(
                res,
                401,
                "Invalid Credentials"
            )
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return errorResponse(
                res,
                401,
                "Invalid Credentials"
            )
        }
        
        // if(!user.isVerified){
        //     return errorResponse(
        //         res,
        //         403,
        //         "Please verify your email before logging in."
        //     )
        // }

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });

        return successResponse(
            res,
            200,
            "Login successful.",
            { user: userResponse(user), }
        );
        
    } catch (error) {
        console.error(error);

        errorResponse(
            res,
            500,
            "Something went wrong while trying to log you in"
        )
    }
}
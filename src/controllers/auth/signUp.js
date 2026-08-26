const User = require("../../models/user.model.js");
const { signUpSchema } = require("../../schema/auth.schema.js");
const userResponse = require("../../utils/userResponse.js");
const { generateToken } = require("../../utils/generateToken.js");
const { successResponse, errorResponse } = require("../../utils/response.js");

exports.signUp = async (req, res) => {
    try {

        const result = signUpSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            return errorResponse(
                res, 
                400,
                "Sign Up failed",
                errors,
            );
        }

        const { fullName, email, password } = result.data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return errorResponse(
                res,
                409,
                "This email already exists, register with another."
            );
        }

        const user = await User.create({
            fullName,
            email,
            password,
        });

        const token = generateToken(user._id);

        return successResponse(
            res,
            201,
            "Account created successfully.",
            {
                token,
                user: userResponse(user),
            }
        );

    } catch (error) {
        console.error("Signup error:", error);

        return errorResponse(
            res,
            500,
            "Internal server error"
        );
    }
};
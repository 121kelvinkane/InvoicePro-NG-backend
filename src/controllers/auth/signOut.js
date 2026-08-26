const { successResponse, errorResponse } = require("../../utils/response.js");

exports.signOut = async (req, res) => {
    try {
        res.clearCookie("token");

        successResponse(
            res,
            200,
            "You have been signed out"
        );
       
    } catch (error) {
        console.error(error)

        errorResponse(
            res,
            500,
            "Something went wrong while trying to log you out"
        )
    }
};
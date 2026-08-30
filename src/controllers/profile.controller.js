const { getProfile, createProfile } = require("../services/profile.service");


// GET PROFILE
const getProfile = async (req, res, next) => {
    try {
        const profile = await getProfile(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Business profile retrieved successfully",
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};


// CREATE PROFILE
const createProfile = async (req, res, next) => {
    try {
        const {
            businessName,
            legalName,
            businessType,
            logo,

            email,
            phone,
            website,

            address,
            city,
            state,
            country,

            tin,
            vatRegistered,
            vatNumber,

            bankName,
            accountName,
            accountNumber,

            invoicePrefix,
            currency,
            paymentTerms,
            defaultNotes,
        } = req.body;

        const profile = await createProfile(
            req.user.id,
            {
                businessName,
                legalName,
                businessType,
                logo,

                email,
                phone,
                website,

                address,
                city,
                state,
                country,

                tin,
                vatRegistered,
                vatNumber,

                bankName,
                accountName,
                accountNumber,

                invoicePrefix,
                currency,
                paymentTerms,
                defaultNotes,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Business profile updated successfully",
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { createProfile, getProfile, };
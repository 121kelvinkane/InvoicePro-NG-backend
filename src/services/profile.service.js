const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProfile = async (
    userId,
    {
        businessName,
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
) => {

    // Check that the user exists
    const userExists = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
        },
    });

    if (!userExists) {
        const error = new Error("User does not exist");
        error.statusCode = 404;

        throw error;
    }


    // Check if user already has a profile
    const existingProfile = await prisma.profile.findUnique({
        where: {
            userId,
        },
    });

    if (existingProfile) {
        const error = new Error(
            "Business profile already exists"
        );

        error.statusCode = 409;
        throw error;
    }


    // Create business profile
    const profile = await prisma.profile.create({
        data: {
            userId,
            businessName,
            businessType,
            logo,

            email,
            phone,
            website,

            address,
            city,
            state,
            country: country || "Nigeria",

            tin,
            vatRegistered: vatRegistered ?? false,
            vatNumber,

            bankName,
            accountName,
            accountNumber,

            invoicePrefix: invoicePrefix || "INV",
            currency: currency || "NGN",
            paymentTerms,
            defaultNotes,
        },
    });

    return profile;
};


const getProfile = async (userId) => {
    const profile = await prisma.profile.findUnique({
        where: {
            userId,
        },
    });

    if (!profile) {
        const error = new Error(
            "Business profile not found"
        );

        error.statusCode = 404;

        throw error;
    }

    return profile;
};

module.exports = { createProfile, getProfile, };
const requireActiveMembership = (req, res, next) => {

    if (req.user.membershipStatus !== "active") {

        return res.status(403).json({
            success: false,
            message: "Premium membership required"
        });

    }

    next();
};

module.exports = requireActiveMembership;
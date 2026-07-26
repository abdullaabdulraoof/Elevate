const Membership = require("../models/membership");
const validationResult = require('express-validator').validationResult;
const logger = require('../logger');
const pagination = require("../utils/pagination");
const sorting = require("../utils/sorting");
const searching = require("../utils/searching");
exports.createMembership = async (req, res) => {
    try {
        const membership = await Membership.create(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.status(201).json({
            success: true,
            message: "Membership created successfully",
            data: membership
        });
    } catch (error) {
        logger.error("Error creating membership");
        res.status(500).json({
            success: false,
            message: "Failed to create membership"
        });
    }
};

exports.getMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find()
            .populate("memberId", "name email phone")
            .populate("planId", "planName price duration durationType")
            .sort({ createdAt: -1 });
        logger.info("Memberships fetched successfully");
        res.status(200).json({
            success: true,
            message: "Memberships fetched successfully",
            data: memberships
        });
    } catch (error) {
        logger.error("Error fetching memberships");
        res.status(500).json({
            success: false,
            message: "Failed to fetch memberships"
        });
    }
};

exports.getMembershipById = async (req, res) => {
    try {
        const membership = await Membership.findById(req.params.id)
            .populate("memberId", "name email phone")
            .populate("planId", "planName price duration durationType");
        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "Membership not found"
            });
        }
        logger.info("Membership fetched successfully");
        res.status(200).json({
            success: true,
            message: "Membership fetched successfully",
            data: membership
        });
    } catch (error) {
        logger.error("Error fetching membership");
        res.status(500).json({
            success: false,
            message: "Failed to fetch membership"
        });
    }
};

exports.updateMembership = async (req, res) => {
    try {
        const membership = await Membership.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "Membership not found"
            });
        }
        logger.info("Membership updated successfully");
        res.status(200).json({
            success: true,
            message: "Membership updated successfully",
            data: membership
        });
    } catch (error) {
        logger.error("Error updating membership");
        res.status(500).json({
            success: false,
            message: "Failed to update membership"
        });
    }
};

exports.deleteMembership = async (req, res) => {
    try {
        const membership = await Membership.findByIdAndDelete(req.params.id);
        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "Membership not found"
            });
        }
        logger.info("Membership deleted successfully");
        res.status(200).json({
            success: true,
            message: "Membership deleted successfully"
        });
    }
    catch (error) {
        logger.error("Error deleting membership");
        res.status(500).json({
            success: false,
            message: "Failed to delete membership"
        });
    }
};

const getAllMembership = async (req, res) => {
    try {
        const { page, limit,sort, searching } = req.query;
        const { skip, page: currentPage, limit: pageLimit } = pagination(page, limit);
        // Filtering
        const allowedFilters = ['status', 'memberId', 'planId'];
        const filter = {};
        allowedFilters.forEach((field) => {
            if (req.query[field]) {
                filter[field] = req.query[field];
            }
        });
         const allowedSortFields = [
    "name",
    "email",
    "phone",
    "status",
    "gender",
    "createdAt"
];
 //searching
    searching(filter, search, [
    "name",
    "email",
    "phone"
]);
const { sortField } = sorting(sort, allowedSortFields);
// Total filtered records
    const totalItems = await Membership.countDocuments(filter);
    // Fetch filtered members
    const { sortField } = sorting(req.query.sort, ['name', 'email', 'createdAt']);
        const membership = await Membership.find(filter)
      .sort(sortField)
      .skip(skip) 
      .limit(pageLimit);
        //calculate metadata
        const totalPages = Math.ceil(totalItems / pageLimit);
        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;
        res.status(200).json({
            success: true,
            data: membership,
            pagintion: {
                page: currentPage,
                limit: pageLimit,
                totalItems,
                totalPages,
                hasNextPage,
                hasPreviousPage
                
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch members"
        });
    }
}
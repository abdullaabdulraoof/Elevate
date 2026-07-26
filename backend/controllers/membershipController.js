const Membership = require("../models/membership");
const { validationResult } = require('express-validator');
const logger = require('../logger');
const pagination = require("../utils/pagination");
const sorting = require("../utils/sorting");
const searching = require("../utils/searching");
const filtering = require("../utils/filtering");
const fieldSelection = require("../utils/fieldSelection");
const apiResponse = require("../utils/apiResponse");
exports.createMembership = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const membership = await Membership.create(req.body);
        apiResponse.success(res, 201, "Membership created successfully", membership);
    } catch (error) {
        logger.error("Error creating membership");
        apiResponse.error(res, 500, "Failed to create membership");
    }
};

exports.getMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find()
            .select("memberId planId membershipStatus startDate endDate assignedTrainer")
            .populate("memberId", "name email phone")
            .populate("planId", "planName price duration durationType")
            .sort({ createdAt: -1 })
            .lean();
        logger.info("Memberships fetched successfully");
        apiResponse.success(res, 200, "Memberships fetched successfully", memberships);
    } catch (error) {
        logger.error("Error fetching memberships");
        apiResponse.error(res, 500, "Failed to fetch memberships");
    }
};

exports.getMembershipById = async (req, res) => {
    try {
        const membership = await Membership.findById(req.params.id)
            .select("memberId planId membershipStatus startDate endDate assignedTrainer")
            .populate("memberId", "name email phone")
            .populate("planId", "planName price duration durationType")
            .lean();
        if (!membership) {
            return apiResponse.error(res, 404, "Membership not found");
        }
        logger.info("Membership fetched successfully");
        apiResponse.success(res, 200, "Membership fetched successfully", membership);
    } catch (error) {
        logger.error("Error fetching membership");
        apiResponse.error(res, 500, "Failed to fetch membership");
    }
};

exports.updateMembership = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const membership = await Membership.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!membership) {
            return apiResponse.error(res, 404, "Membership not found");
        }
        logger.info("Membership updated successfully");
        apiResponse.success(res, 200, "Membership updated successfully", membership);
    } catch (error) {
        logger.error("Error updating membership");
        apiResponse.error(res, 500, "Failed to update membership");
    }
};

exports.deleteMembership = async (req, res) => {
    try {
        const membership = await Membership.findByIdAndDelete(req.params.id);
        if (!membership) {
            return apiResponse.error(res, 404, "Membership not found");
        }
        logger.info("Membership deleted successfully");
        apiResponse.success(res, 200, "Membership deleted successfully");
    }
    catch (error) {
        logger.error("Error deleting membership");
        apiResponse.error(res, 500, "Failed to delete membership");
    }
};

exports.getAllMembership = async (req, res) => {
    try {
        const { page, limit, sort, searching: searchTerm, fields } = req.query;
        const { skip, page: currentPage, limit: pageLimit } = pagination(page, limit);

        const allowedFields = [
            "name",
            "email",
            "phone",
            "gender",
            "status",
            "membershipPlan",
            "createdAt"
        ];
        const selectedFields = fieldSelection(fields, allowedFields);

        const allowedFilters = ["status", "gender", "membershipPlan"];
        const filter = filtering(req.query, allowedFilters);

        searching(filter, searchTerm, ["name", "email", "phone"]);

        const allowedSortFields = ["name", "email", "phone", "status", "gender", "createdAt"];
        const { sortField } = sorting(sort, allowedSortFields);

        const [totalItems, membership] = await Promise.all([
            Membership.countDocuments(filter),
            Membership.find(filter)
                .select(selectedFields)
                .sort(sortField)
                .skip(skip)
                .limit(pageLimit)
                .lean()
        ]);

        const totalPages = Math.ceil(totalItems / pageLimit);
        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;

        apiResponse.success(res, 200, "Memberships fetched successfully", membership, {
            page: currentPage,
            limit: pageLimit,
            totalItems,
            totalPages,
            hasNextPage,
            hasPreviousPage
        });
    } catch (error) {
        apiResponse.error(res, 500, "Failed to fetch memberships");
    }
}
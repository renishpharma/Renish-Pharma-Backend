import Enquiry from "./enquiry.model.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";

export const createEnquiry = catchAsync(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json({
    status: "success",
    data: enquiry
  });
});

export const getAllEnquiries = catchAsync(async (req, res) => {
  const { status, role } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (role) filter.role = role;

  const enquiries = await Enquiry.find(filter)
    .populate("product", "name sku")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: enquiries.length,
    data: enquiries
  });
});

export const updateEnquiryStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "replied"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
  if (!enquiry) throw new ApiError(404, "Enquiry not found");

  res.status(200).json({
    status: "success",
    data: enquiry
  });
});

export const deleteEnquiry = catchAsync(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) throw new ApiError(404, "Enquiry not found");
  res.status(204).json({
    status: "success",
    data: null
  });
});
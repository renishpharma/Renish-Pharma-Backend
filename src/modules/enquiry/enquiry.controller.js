import Enquiry from "./enquiry.model.js";
import catchAsync from "../../utils/catchAsync.js";

export const createEnquiry = catchAsync(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);

  res.status(201).json({
    success: true,
    message: "Enquiry submitted successfully",
    data: enquiry
  });
});

export const getEnquiries = catchAsync(async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    count: enquiries.length,
    data: enquiries
  });
});
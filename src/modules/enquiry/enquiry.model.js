import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"]
    },
    email: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ["doctor", "hospital", "pharmaceutical wholesaler", "pharmaceutical distributor"],
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false
    },
    quantity: {
      type: String
    },
    message: {
      type: String,
      required: [true, "Message is required"]
    },
    status: {
      type: String,
      enum: ["pending", "replied"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
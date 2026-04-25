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
            type: String
        },

        role: {
            type: String,
            enum: [
                "doctor",
                "hospital",
                "pharmaceutical wholesaler",
                "pharmaceutical distributor"
            ],
            required: true
        }
    },
    { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
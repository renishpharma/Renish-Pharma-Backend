import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },

        phone: {
            type: String,
            required: [true, "Phone is required"]
        },

        email: String,

        role: {
            type: String,
            enum: [
                "doctor",
                "hospital",
                "pharmaceutical wholesaler",
                "pharmaceutical distributor"
            ],
            required: true
        },

        message: {
            type: String,
            required: [true, "Message is required"],
            maxlength: [500, "Message cannot exceed 500 characters"]
        }
    },
    { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
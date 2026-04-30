import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true
    },

    description: {
      type: String,
      required: [true, "Description is required"]
    },

    shortDescription: {
      type: String
    },

    packaging: String,
    composition: String,
    featured: { type: Boolean, default: false },

    category: {
      type: String,
      required: [true, "Category is required"]
    },

    additionalInfo: String,
    specialCare: String,

    media: {
      type: [mediaSchema],
      validate: [
        {
          validator: (arr) => arr.length >= 1,
          message: "At least 1 file is required"
        },
        {
          validator: (arr) => arr.length <= 5,
          message: "Maximum 5 files allowed"
        }
      ]
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
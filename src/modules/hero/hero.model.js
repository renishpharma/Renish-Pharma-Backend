import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    desktop: {
      url: { type: String },
      public_id: { type: String }
    },
    tablet: {
      url: { type: String },
      public_id: { type: String }
    },
    mobile: {
      url: { type: String },
      public_id: { type: String }
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;

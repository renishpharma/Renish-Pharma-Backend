import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    url: { 
      type: String, 
      required: true 
    },
    public_id: { 
      type: String, 
      required: true 
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

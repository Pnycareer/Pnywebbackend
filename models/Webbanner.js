import mongoose from "mongoose";

const WebBannerSchema = new mongoose.Schema(
    {
        imageUrl: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("WebBanner", WebBannerSchema);

import Product from "../product/product.model.js";
import Enquiry from "../enquiry/enquiry.model.js";
import User from "../user/user.model.js";
import Blog from "../blog/blog.model.js";

export const getDashboardStats = async (req, res, next) => {
    try {
        const [totalProducts, totalEnquiries, totalUsers, totalBlogs] = await Promise.all([
            Product.countDocuments(),
            Enquiry.countDocuments(),
            User.countDocuments(),
            Blog.countDocuments(),
        ]);

        const recentEnquiries = await Enquiry.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name email createdAt");

        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name category createdAt");

        res.status(200).json({
            status: "success",
            data: {
                counts: {
                    products: totalProducts,
                    enquiries: totalEnquiries,
                    users: totalUsers,
                    blogs: totalBlogs
                },
                recent: {
                    enquiries: recentEnquiries,
                    products: recentProducts
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

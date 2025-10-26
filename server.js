// server.js
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import cors from "cors";
import blogpostrouter from "./routes/special.blogPostRoutes.js";
import specialcityroutes from "./routes/cityCategoryRoutes.js";
import router from "./routes/eflyerRoutes.js";
import routerfaq from "./routes/faqCategoryRoutes.js";
import routerquestion from "./routes/questionRoutes.js";
import routergallery from "./routes/galleryCategoryRoutes.js";
import freetrailrouter from "./routes/freetrialroutes.js";
import eventrouter from "./routes/eventCategoryRoutes.js";
import Everouter from "./routes/eventRoutes.js";
import modelroutes from "./routes/coursemodel.js";
import subCategoryroutes from "./routes/subCategoryroutes.js";
import routersubcourse from "./routes/subCources.js";
import courseRoutes from "./routes/courseRoutes.js";
import Meta from "./routes/Meta.js";
import Webbanner from "./routes/webbanner.js";
import blogroutes from "./routes/blogsRoutes.js";
import Termscondition from "./routes/TermsconditionRoutes.js";
import privacypolicy from "./routes/PrivacyRoutes.js";
import brochureRoutes from "./routes/brochureRoutes.js";
import faqs from "./routes/faqsRoutes.js";
import upload from "./routes/uploadRoutes.js";
import news from "./routes/newsRoutes.js";
import gallery from "./routes/galleryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import certificationRoutes from "./routes/trainerCertificationRoutes.js";
import academiaCourseRoutes from "./routes/academiaCourse.routes.js";
import applicationRoutes from "./routes/application.routes.js";


// Load environment variables
dotenv.config();
// Connect to the database
connectDB();
const app = express();
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
// CORS Middleware Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:10001",
  "https://pnytrainings.com",
  "https://www.pnytrainings.com",
  "https://admin.pnytrainings.com",
  "https://www.admin.pnytrainings.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from allowed origins or requests without origin (Postman, server-side)
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Enable sending cookies and credentials
    methods: "GET, POST, PATCH , PUT, DELETE, OPTIONS", // Allowed HTTP methods
    allowedHeaders: "Content-Type, Authorization", // Allowed request headers
  })
);
// API routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/courses", courseRoutes);
// app.use("/api/blogpost", blogpostrouter);
app.use("/api/blogs", blogroutes);
app.use("/api/citycategory", specialcityroutes);
app.use("/api/eflyer", router);
app.use("/api/faqcat", routerfaq);
app.use("/api/faquestion", routerquestion);
app.use("/api/gallery", routergallery);
app.use("/api/freetrial", freetrailrouter);
app.use("/api/event", eventrouter);
app.use("/api/eventpost", Everouter);
app.use("/api/coursemodel", modelroutes);
app.use("/api/subCategory", subCategoryroutes);
app.use("/api/v1/subCourse", routersubcourse);
app.use("/api/v1/meta", Meta);
app.use("/api/v1/webbanner", Webbanner);
app.use("/api/v1/terms", Termscondition);
app.use("/api/v1/privacy", privacypolicy);
app.use("/api/v1/brochure", brochureRoutes);
app.use("/api/v1/faqs", faqs);
app.use("/upload", upload);
app.use("/api/v1/news", news);
app.use("/api/v1/gallery", gallery);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/certification", certificationRoutes);
app.use("/api/academia/courses", academiaCourseRoutes);
app.use("/api/applications", applicationRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

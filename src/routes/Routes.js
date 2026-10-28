const express = require("express");
const router = express.Router();

const {
  createEnquiry,
} = require("../controllers/enquiryController");
const {
createBlog,
getAllBlogs,
getBlogBySlug,
updateBlog,
deleteBlog
} = require("../controllers/blogController")
const upload = require("../middleware/upload")

router.post("/enquiry", createEnquiry);

// blogs
router.post("/blog", upload.single("image"), createBlog);
router.get("/blog", getAllBlogs);
// router.get("/blog/:id", getSingleBlog);
// ✅ SLUG ROUTE
router.get("/blog/:slug", getBlogBySlug);
router.put("/blog/:id", upload.single("image"), updateBlog);
router.delete("/blog/:id", deleteBlog);

module.exports = router;
const Blog = require("../models/Blog");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");

/* =========================================
   CREATE BLOG
========================================= */
exports.createBlog = async (req, res) => {
  try {

    const { title, description, short_description } = req.body;

    if (!title || !description || !short_description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let image = null;
    let public_id = null;

    // ✅ Upload image to Cloudinary
    if (req.file) {

      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "blogs",
        }
      );

      image = result.secure_url;
      public_id = result.public_id;
    }

    // ✅ Generate unique slug
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;

    let existing = await Blog.findOne({ slug });
    let count = 1;

    while (existing) {
      slug = `${baseSlug}-${count}`;
      existing = await Blog.findOne({ slug });
      count++;
    }

    // ✅ Create Blog
    const newBlog = await Blog.create({
      title,
      description,
      short_description,
      image,
      public_id,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });

  }
};

/* =========================================
   GET ALL BLOGS
========================================= */
exports.getAllBlogs = async (req, res) => {
  try {

    const blogs = await Blog.find()
      .select("title description  short_description image slug createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: blogs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });

  }
};

/* =========================================
   GET BLOG BY SLUG
========================================= */
exports.getBlogBySlug = async (req, res) => {
  try {

    const blog = await Blog.findOne({
      slug: req.params.slug,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });

  }
};

/* =========================================
   UPDATE BLOG
========================================= */
exports.updateBlog = async (req, res) => {
  try {

    const { title, description, short_description } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.short_description =
      short_description || blog.short_description;

    // ✅ Update image
    if (req.file) {

      // delete old image from cloudinary
      if (blog.public_id) {
        await cloudinary.uploader.destroy(blog.public_id);
      }

      // upload new image
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "blogs",
        }
      );

      blog.image = result.secure_url;
      blog.public_id = result.public_id;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });

  }
};

/* =========================================
   DELETE BLOG
========================================= */
exports.deleteBlog = async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // delete from cloudinary
    if (blog.public_id) {

      const result = await cloudinary.uploader.destroy(
        blog.public_id
      );

      console.log(result);
    }

    // delete from mongodb
    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });

  }
};
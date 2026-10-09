
const Enquiry = require("../models/Enquiry");
const { sendEnquiryEmail } = require("../services/emailService");

const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      requirement,
      vehicleType,
    } = req.body;

    // 1. Validate required fields
    if (
      !name?.trim() ||
      !phone?.trim() ||
      !email?.trim() ||
      !requirement?.trim() ||
      !vehicleType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Validate vehicle type
    const allowedVehicles = [
      "car",
      "heavy commercial vehicle",
      "jcb/earth moving",
    ];

    if (!allowedVehicles.includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle type",
      });
    }

    // 3. Save enquiry in MongoDB
    const enquiry = await Enquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      requirement: requirement.trim(),
      vehicleType,
    });

    // 4. Send email through Brevo
    // Email failure will not fail the enquiry submission.
    try {
      await sendEnquiryEmail(enquiry);
    } catch (emailError) {
      console.error(
        "Brevo email failed:",
        emailError.body || emailError.message || emailError
      );
    }

    // 5. Send response to frontend
    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Create Enquiry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit enquiry",
    });
  }
};

module.exports = {
  createEnquiry,
};


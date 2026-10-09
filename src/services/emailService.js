const { BrevoClient } = require("@getbrevo/brevo");

const sendEnquiryEmail = async (Enquiry) => {
  try {
    const brevo = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY,
    });

    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: `New Enquiry - ${
         "Blram Automotive"
      }`,

      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },

      to: [
        {
          email: process.env.ADMIN_EMAIL_1,
        },
      
      ],

      htmlContent: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
            
            <div style="max-width: 650px; margin: auto; background: #ffffff; padding: 30px; border-radius: 12px;">
              
              <h2 style="color: #ff6500;">
                New Enquiry - Blram Automotive
              </h2>

              <p>
                You have received a new enquiry from the website.
              </p>

              <hr />

              <p>
                <strong>Name:</strong> ${Enquiry.name}
              </p>

              <p>
                <strong>Email:</strong> ${Enquiry.email}
              </p>

              <p>
                <strong>Phone:</strong> ${
                  Enquiry.phone || "Not provided"
                }
              </p>

              <p>
                <strong>Vehicle Type:</strong> ${
                  Enquiry.vehicleType || "Not provided"
                }
              </p>

              <p>
                <strong>Requirement:</strong>
              </p>

              <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                ${Enquiry.requirement}
              </div>

              <hr />

              <p style="font-size: 12px; color: #777;">
                This enquiry was submitted from the Blram Automotive website.
              </p>

            </div>

          </body>
        </html>
      `,
    });

    console.log("Brevo email sent successfully:", result);

    return result;
  } catch (error) {
    console.error(
      "Brevo email error:",
      error.body || error.message || error
    );

    throw error;
  }
};

module.exports = {
  sendEnquiryEmail,
};
require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");

// Shopify API credentials
const shopifyApiKey = process.env.SHOPIFY_API_KEY;
const shopifyApiPassword = process.env.SHOPIFY_API_PASSWORD;
const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
const shopDomain = process.env.SHOP_DOMAIN;

app.use(cors());
app.use(express.json());

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Define the destination directory for uploads
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Set a unique filename
//   },
// });

// const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("hello from server timeless beauty");
});

const sendContactUsMail = async (
  firstName,
  email,
  country,
  mobile,
  message
) => {
  try {
    // Create transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.in",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: "timelesscare@timelessbeautysecrets.com",
        pass: "ixujWVwx6qyf",
      },
      tls: {
        rejectUnauthorized: false, // Add this line if you encounter certificate issues
      },
    });

    // Define the email options
    const mailOptions = {
      from: '"Timeless Beauty Secrets" <timelesscare@timelessbeautysecrets.com>', // Use your Zoho email
      to: "timelesscare@timelessbeautysecrets.in", // Your email or recipient
      subject: "Contact Us Form Submission",
      replyTo: email, // User's email for reply-to
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
            
           
            <div style="text-align: center; padding-bottom: 20px;">
              <h2 style="color: #555555; font-size: 24px; margin: 0; padding-top: 10px;">New Message from Contact Us Form</h2>
            </div>

          
            <div style="font-size: 16px; color: #333333;">
              <p><strong>First Name:</strong> ${firstName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Country:</strong> ${country}</p>
              <p><strong>Mobile Number:</strong> ${mobile}</p>
            </div>

          
            <div style="margin-top: 20px;">
              <h3 style="color: #444444; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Message</h3>
              <p style="font-size: 16px; color: #555555; line-height: 1.6; background-color: #f8f8f8; padding: 15px; border-radius: 5px; border: 1px solid #eaeaea;">
                ${message}
              </p>
            </div>

           
            <div style="margin-top: 30px; font-size: 14px; color: #777777; text-align: center;">
              <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
              <p>This message was sent from the <a href="https://timelessbeautysecrets.com" style="color: #0073aa; text-decoration: none;">Timeless Beauty Secrets</a> Contact Form.</p>
              <p style="color: #999999;">&copy; ${new Date().getFullYear()} Timeless Beauty Secrets. All Rights Reserved.</p>
            </div>

          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

// Function to send email for the order query form
const sendOrderQueryMail = async (
  name,
  mobile,
  email,
  subject,
  description,
  orderNumber
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: "timelesscare@timelessbeautysecrets.com",
        pass: "ixujWVwx6qyf",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: '"Timeless Beauty Secrets" <timelesscare@timelessbeautysecrets.com>',
      to: "timelesscare@timelessbeautysecrets.in",
      subject: "Order Query Form Submission",
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h2 style="color: #555555; font-size: 24px; margin: 0; padding-top: 10px;">New Order Query</h2>
            </div>
            <div style="font-size: 16px; color: #333333;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Mobile:</strong> ${mobile}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Description:</strong> ${description}</p>
              <p><strong>Order Number:</strong> ${orderNumber}</p>
            </div>
            <div style="margin-top: 30px; font-size: 14px; color: #777777; text-align: center;">
              <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
              <p>This message was sent from the <a href="https://timelessbeautysecrets.com" style="color: #0073aa; text-decoration: none;">Timeless Beauty Secrets</a> Order Query Form.</p>
              <p style="color: #999999;">&copy; ${new Date().getFullYear()} Timeless Beauty Secrets. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order query email sent successfully");
  } catch (error) {
    console.error("Error sending order query email:", error);
    throw new Error("Error sending order query email");
  }
};

app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, email, country, mobile, message } = req.body;

    if (!firstName || !country || !email || !mobile || !message) {
      return res.status(400).send({ msg: "All fields are required" });
    }
    await sendContactUsMail(firstName, email, country, mobile, message);

    res.status(201).send("Your message has been sent successfully!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Something went wrong, please try again");
  }
});

// Endpoint to handle order query submissions
app.post("/api/order-query", async (req, res) => {
  try {
    const { name, mobile, email, subject, description, orderNumber } = req.body;

    // Check if all fields are provided
    if (
      !name ||
      !mobile ||
      !email ||
      !subject ||
      !description ||
      !orderNumber
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Send the order query email
    await sendOrderQueryMail(
      name,
      mobile,
      email,
      subject,
      description,
      orderNumber
    );

    // Send a JSON response
    res
      .status(201)
      .json({ msg: "Your order query has been submitted successfully!" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ msg: "Something went wrong, please try again" });
  }
});

// Endpoint to fetch product data
app.get("/api/product/:id", async (req, res) => {
  const productId = req.params.id;
  const url = `https://${shopDomain}/admin/api/2023-10/products/${productId}.json`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyAccessToken,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.put("/api/customer/:id/password", async (req, res) => {
  const customerId = req.params.id;
  const { password, password_confirmation } = req.body.customer;
  const url = `https://${shopDomain}/admin/api/2023-10/customers/${customerId}.json`;

  if (password !== password_confirmation) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyAccessToken,
      },
      body: JSON.stringify({
        customer: {
          id: customerId,
          password: password,
          password_confirmation: password_confirmation,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update password");
    }

    const data = await response.json();
    res.status(200).json({ msg: "Password Changed", data });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

app.get("/tracking-number/:id", async (req, res) => {
  const orderId = req.params.id;
  const url = `https://${shopDomain}/admin/api/2023-10/orders/${orderId}.json`;
  try {
    // Fetch the order data from Shopify
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyAccessToken,
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from Shopify" });
    }

    // Parse the response data
    const data = await response.json();

    // Extract fulfillment data
    const fulfillments = data.order.fulfillments;
    if (fulfillments && fulfillments.length > 0) {
      const fulfillment = fulfillments[0]; // Assuming we're only using the first fulfillment
      const trackingNumber = fulfillment.tracking_number;
      const trackingUrl =
        fulfillment.tracking_url || fulfillment.tracking_urls[0]; // Get the first tracking URL
      const shipmentStatus = fulfillment.shipment_status || "N/A"; // 'confirmed', 'in_transit', 'delivered', etc.
      const fulfillmentStatus =
        fulfillment.status || "No fulfillment information available"; // 'success', etc.

      return res.json({
        trackingNumber,
        trackingUrl,
        shipmentStatus,
        fulfillmentStatus,
      });
    } else {
      // No fulfillment available
      return res.json({
        trackingNumber: "N/A",
        trackingUrl: "N/A",
        shipmentStatus: "No shipment information available",
        fulfillmentStatus: "No fulfillment information available",
      });
    }
  } catch (error) {
    console.error("Error fetching Shopify data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/awb/:id", async (req, res) => {
  const awbId = req.params.id;
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUyNjIxMjIsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzI5MTQ3MDQyLCJqdGkiOiJLTGJnU0F6REVUaHpWT1BwIiwiaWF0IjoxNzI4MjgzMDQyLCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTcyODI4MzA0MiwiY2lkIjozNDU2NDU5LCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.zL4weD19rRXAoB24TurVgOOr4REtfxUw04YtWu31-Us"; // Replace with your Shiprocket API token

  try {
    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbId}`,

      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    // Return the response data from Shiprocket API
    return res.status(200).json(data);
  } catch (error) {
    console.error(
      "Error fetching AWB details:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ error: "Error fetching AWB details" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

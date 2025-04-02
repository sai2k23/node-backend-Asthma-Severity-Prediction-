require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));


app.get('/', (req, res) => {
    res.send('Backend is working! 🎉');
  });
  // Twilio Credentials
const TWILIO_VERIFY_SID = process.env.TWILIO_VERIFY_SID;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER  = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Send OTP
app.post("/api/send-otp", async (req, res) => {
    const { mobile } = req.body;
    try {
        const response = await client.verify.v2.services(TWILIO_VERIFY_SID)
      .verifications.create({ to: mobile, channel: "sms" });

    console.log("OTP Sent:", response.status);
        res.json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});

app.post("/api/verify-otp", async (req, res) => {
    const { mobile, otp } = req.body;
    try {
        const verification = await client.verify.v2.services(TWILIO_VERIFY_SID)
            .verificationChecks.create({ to: mobile, code: otp });

        if (verification.status === "approved") {
            res.json({ success: true, message: "OTP verified successfully!" });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ success: false, message: "OTP verification failed" });
    }
});

// Route to send SMS
app.post("/send-sms", async (req, res) => {
    let { phone, message } = req.body;
    
    if (!phone || !message) {
        return res.status(400).send("Missing phone or message");
    }

    // Ensure phone number is in +91XXXXXXXXXX format
    if (!phone.startsWith("+")) {
        phone = `+91${phone}`;
    }

    try {
        const response = await client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: phone, 
        });

        console.log("SMS Sent:", response.sid);
        return res.status(200).send("SMS sent successfully!");
    } catch (error) {
        console.error("Twilio SMS Error:", error);
        return res.status(500).send("Failed to send SMS.");
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

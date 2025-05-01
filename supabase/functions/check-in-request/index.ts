
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { userId, userName, userEmail, currentMood } = await req.json();
    
    // Current timestamp in a readable format
    const timestamp = new Date().toLocaleString();
    
    // Get SMTP configuration from environment
    const host = Deno.env.get("SMTP_HOST");
    const port = Number(Deno.env.get("SMTP_PORT") || "587");
    const user = Deno.env.get("SMTP_USER");
    const pass = Deno.env.get("SMTP_PASSWORD");
    
    // Get email recipients from environment variable or use default values
    const recipientsEnv = Deno.env.get("EMAIL_RECIPIENTS");
    const recipients = recipientsEnv 
      ? recipientsEnv.split(',').map(email => email.trim()) 
      : ["kirthicvishnu@gmail.com", "vishnukirthic@gmail.com"];
    
    // Log SMTP configuration (without password) and recipients
    console.log(`Attempting to connect to SMTP server: ${host}:${port} with user: ${user}`);
    console.log(`Email will be sent to: ${recipients.join(", ")}`);
    
    // Create a transporter with improved configuration
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      },
      debug: true, // Enable debug mode
    });
    
    // Configure email data
    const subject = "M(in)dvincible: Student Check-in Request";
    
    // Get mood color for styling
    const moodColors = {
      "Happy": "#F5DF4D",
      "Excited": "#FF8A48",
      "Surprised": "#FC68B3",
      "Calm": "#3DFDFF",
      "Sad": "#6E7582",
      "Worried": "#D5D5F1",
      "Angry": "#FF6B6B",
      "Anxious": "#A78BFA",
      "Neutral": "#94A3B8"
    };
    
    const moodColor = moodColors[currentMood as keyof typeof moodColors] || "#94A3B8";
    
    // Create HTML email content
    const htmlMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Check-in Request</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            background-color: #FF8A48;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            border-left: 1px solid #e1e1e1;
            border-right: 1px solid #e1e1e1;
            background-color: #fafafa;
          }
          .footer {
            border-radius: 0 0 8px 8px;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #666666;
            border: 1px solid #e1e1e1;
            border-top: none;
          }
          .mood-indicator {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            margin-right: 5px;
            background-color: ${moodColor};
          }
          .info-row {
            padding: 10px 0;
            border-bottom: 1px solid #eeeeee;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: bold;
            width: 120px;
            display: inline-block;
          }
          .value {
            display: inline-block;
          }
          .alert {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            margin-top: 20px;
            border-radius: 5px;
            font-weight: bold;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3D59FF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
          .wavy-border {
            height: 10px;
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='10' viewBox='0 0 100 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 5 Q 10 0, 20 5 T 40 5 T 60 5 T 80 5 T 100 5' stroke='%23FF8A48' fill='none' stroke-width='2'/%3E%3C/svg%3E");
            background-repeat: repeat-x;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>M(in)dvincible</h1>
            <p>Student Check-in Request</p>
          </div>
          <div class="wavy-border"></div>
          <div class="content">
            <p>A student has requested to be checked in on.</p>
            
            <div class="info-row">
              <span class="label">Student Name:</span>
              <span class="value">${userName}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${userEmail}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Current Mood:</span>
              <span class="value">
                <span class="mood-indicator"></span>${currentMood}
              </span>
            </div>
            
            <div class="info-row">
              <span class="label">Request Time:</span>
              <span class="value">${timestamp}</span>
            </div>
            
            <div class="alert">
              This student may need support. Please follow up as soon as possible.
            </div>
          </div>
          <div class="wavy-border"></div>
          <div class="footer">
            <p>This is an automated notification from the M(in)dvincible app.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Plain text alternative for email clients that don't support HTML
    const textMessage = `M(in)dvincible: Student Check-in Request
    
Student: ${userName}
Email: ${userEmail}
Current Mood: ${currentMood}
Request Time: ${timestamp}

This student has requested to be checked in on. Please follow up as soon as possible.

This is an automated notification from the M(in)dvincible app. Please do not reply to this email.`;
    
    console.log("Sending email to:", recipients);
    console.log("Email subject:", subject);
    
    try {
      // Verify SMTP connection before sending
      await transporter.verify();
      console.log("SMTP connection verified successfully");
      
      // Send the email
      const info = await transporter.sendMail({
        from: user || "notifications@mindvincible.app",
        to: recipients.join(", "),
        subject: subject,
        text: textMessage, // Plain text version
        html: htmlMessage,  // HTML version
      });
      
      console.log("Email sent successfully:", info.messageId);
      
      return new Response(
        JSON.stringify({ success: true, message: "Check-in request sent" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (smtpError) {
      console.error("SMTP Error:", smtpError);
      throw new Error(`SMTP Error: ${smtpError.message}`);
    }
  } catch (error) {
    console.error("Error sending check-in request:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "There was an error sending the check-in request. Please check your SMTP configuration."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

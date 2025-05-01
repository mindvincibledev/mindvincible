
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
    
    // Log SMTP configuration (without password)
    console.log(`Attempting to connect to SMTP server: ${host}:${port} with user: ${user}`);
    
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
    const recipients = ["kirthicvishnu@gmail.com", "vishnukirthic@gmail.com"];
    const subject = "M(in)dvincible: Student Check-in Request";
    const messageBody = `Hey, the student ${userName}, with the email ${userEmail} has requested to be checked in on at ${timestamp}. Their current mood is ${currentMood}. This is an auto-generated email from M(in)dvincible. Please do not reply to it.`;
    
    console.log("Sending email to:", recipients);
    console.log("Email subject:", subject);
    console.log("Email body:", messageBody);
    
    try {
      // Verify SMTP connection before sending
      await transporter.verify();
      console.log("SMTP connection verified successfully");
      
      // Send the email
      const info = await transporter.sendMail({
        from: user || "notifications@mindvincible.app",
        to: recipients.join(", "),
        subject: subject,
        text: messageBody,
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

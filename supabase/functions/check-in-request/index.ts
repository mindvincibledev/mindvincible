
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
    
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: Deno.env.get("SMTP_HOST") || "",
      port: Number(Deno.env.get("SMTP_PORT")) || 465,
      secure: true,
      auth: {
        user: Deno.env.get("SMTP_USER") || "",
        pass: Deno.env.get("SMTP_PASSWORD") || "",
      },
    });
    
    // Configure email data
    const recipients = ["kirthicvishnu@gmail.com", "vishnukirthic@gmail.com"];
    const subject = "M(in)dvincible: Student Check-in Request";
    const messageBody = `Hey, the student ${userName}, with the email ${userEmail} has requested to be checked in on at ${timestamp}. Their current mood is ${currentMood}. This is an auto-generated email from M(in)dvincible. Please do not reply to it.`;
    
    console.log("Sending email to:", recipients);
    console.log("Email subject:", subject);
    console.log("Email body:", messageBody);
    
    // Send the email
    const info = await transporter.sendMail({
      from: Deno.env.get("SMTP_USER") || "",
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
  } catch (error) {
    console.error("Error sending check-in request:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

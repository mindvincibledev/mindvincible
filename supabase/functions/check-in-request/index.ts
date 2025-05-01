
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { RequestData } from "./types.ts";
import { corsHeaders, generateEmailContent, sendEmail } from "./emailUtils.ts";
import { saveCheckInRequest, getUserData, getUserMoodEntries, updateCheckInRequestStatus } from "./databaseUtils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting check-in request function...");
    
    // Parse the request body
    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody));
    
    const { userId, userName, userEmail, currentMood } = requestBody as RequestData;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing check-in request for user ${userId}`);

    // Save the request to the database
    await saveCheckInRequest(userId, currentMood);

    // Get the user's profile
    const userData = await getUserData(userId);

    // Get the user's last 3 mood entries
    const moodEntries = await getUserMoodEntries(userId);

    // Get SMTP configuration from environment variables
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUsername = Deno.env.get("SMTP_USERNAME");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL");
    
    // Validate SMTP configuration
    if (!smtpHost || !smtpUsername || !smtpPassword || !fromEmail) {
      console.error("Missing SMTP configuration");
      return new Response(
        JSON.stringify({ error: "Server mail configuration is incomplete" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the clinician emails from environment variable
    const clinicianEmailsEnv = Deno.env.get("CLINICIAN_ALERT_EMAILS") || "";
    const clinicianEmails = clinicianEmailsEnv.split(",").map(email => email.trim());
    console.log(`Found ${clinicianEmails.length} clinician email(s): ${clinicianEmailsEnv.replace(/@/g, '[at]')}`);
    
    if (!clinicianEmails || clinicianEmails.length === 0 || clinicianEmails[0] === "") {
      console.error("No clinician emails configured");
      throw new Error("No clinician emails configured");
    }

    const studentName = userData?.name || userName || "Unknown student";
    const studentEmail = userData?.email || userEmail || "No email provided";
    const studentMood = currentMood || "Not specified";
    
    // Generate the email content
    const { subject, emailBody } = generateEmailContent(
      studentName,
      studentEmail,
      studentMood,
      moodEntries
    );

    // Send emails to all clinicians
    let emailsSent = 0;
    const smtpConfig = {
      host: smtpHost,
      port: smtpPort,
      username: smtpUsername,
      password: smtpPassword,
      fromEmail: fromEmail
    };

    for (const email of clinicianEmails) {
      if (email) {
        try {
          console.log(`Attempting to send email to ${email.replace(/@/g, '[at]')}`);
          const sent = await sendEmail(smtpConfig, email, subject, emailBody);
          if (sent) {
            emailsSent++;
            console.log(`Email sent to ${email.replace(/@/g, '[at]')}`);
          }
        } catch (emailError) {
          console.error(`Failed to send email to ${email.replace(/@/g, '[at]')}:`, emailError);
        }
      }
    }

    // Update the request to mark the alert as sent if at least one email was sent
    if (emailsSent > 0) {
      await updateCheckInRequestStatus(userId, true);
      console.log("Check-in request marked as sent");
    } else {
      console.error("No emails were sent successfully");
      throw new Error("Failed to send notification emails");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Check-in request sent successfully",
        emailsSent
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in check-in request function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

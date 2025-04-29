
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseUrl = "https://mbuegumluulltutadsyr.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure SMTP client
const client = new SmtpClient();

interface MoodEntry {
  id: string;
  mood: string;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  time_of_day: string;
}

interface RequestData {
  userId: string;
  userName: string;
  userEmail: string;
}

// Format the mood entries for the email
function formatMoodEntries(entries: MoodEntry[]): string {
  if (!entries || entries.length === 0) {
    return "<p>No recent mood entries found.</p>";
  }

  let entriesHtml = "";
  entries.forEach((entry) => {
    const date = new Date(entry.created_at).toLocaleDateString();
    const time = entry.time_of_day;
    const tagsString = entry.tags ? entry.tags.join(", ") : "None";
    const notes = entry.notes || "None";

    entriesHtml += `
      <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        <strong>Date:</strong> ${date} at ${time}<br>
        <strong>Mood:</strong> ${entry.mood}<br>
        <strong>Tags:</strong> ${tagsString}<br>
        <strong>Notes:</strong> ${notes}
      </div>
    `;
  });

  return entriesHtml;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log environment variables (except sensitive ones)
    console.log("SMTP_HOST set:", !!Deno.env.get("SMTP_HOST"));
    console.log("SMTP_PORT set:", !!Deno.env.get("SMTP_PORT"));
    console.log("SMTP_USERNAME set:", !!Deno.env.get("SMTP_USERNAME"));
    console.log("SMTP_PASSWORD set:", !!Deno.env.get("SMTP_PASSWORD") ? "Yes" : "No");
    console.log("SMTP_FROM_EMAIL set:", !!Deno.env.get("SMTP_FROM_EMAIL"));
    console.log("CLINICIAN_ALERT_EMAILS set:", !!Deno.env.get("CLINICIAN_ALERT_EMAILS"));
    console.log("SUPABASE_SERVICE_ROLE_KEY set:", !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    
    // Parse the request body
    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody));
    
    const { userId, userName, userEmail } = requestBody as RequestData;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing check-in request for user ${userId}`);

    // Save the request to the database
    const { error: insertError } = await supabase
      .from("check_in_requests")
      .insert({
        user_id: userId,
        notes: "Requested via mood entry page",
        alert_sent: false
      });

    if (insertError) {
      console.error("Error inserting check-in request:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Get the user's profile
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      throw new Error(`User data error: ${userError.message}`);
    }

    // Get the user's last 3 mood entries
    const { data: moodEntries, error: moodError } = await supabase
      .from("mood_data")
      .select("id, mood, notes, tags, created_at, time_of_day")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (moodError) {
      console.error("Error fetching mood entries:", moodError);
      throw new Error(`Mood data error: ${moodError.message}`);
    }

    try {
      // Connect to the SMTP server
      await client.connectTLS({
        hostname: Deno.env.get("SMTP_HOST") || "",
        port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
        username: Deno.env.get("SMTP_USERNAME") || "",
        password: Deno.env.get("SMTP_PASSWORD") || "",
      });
      console.log("Successfully connected to SMTP server");
    } catch (smtpError) {
      console.error("SMTP connection error:", smtpError);
      throw new Error(`SMTP connection error: ${smtpError.message}`);
    }

    // Get the clinician emails from environment variable
    const clinicianEmailsEnv = Deno.env.get("CLINICIAN_ALERT_EMAILS") || "";
    const clinicianEmails = clinicianEmailsEnv.split(",");
    console.log(`Found ${clinicianEmails.length} clinician email(s): ${clinicianEmailsEnv.replace(/@/g, '[at]')}`);
    
    if (!clinicianEmails || clinicianEmails.length === 0 || clinicianEmails[0] === "") {
      console.error("No clinician emails configured");
      throw new Error("No clinician emails configured");
    }

    const studentName = userData?.name || userEmail || userName || "Unknown student";
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "";
    if (!fromEmail) {
      console.error("SMTP_FROM_EMAIL not configured");
      throw new Error("SMTP_FROM_EMAIL not configured");
    }

    // Format the email
    const emailSubject = `URGENT: Check-in Request from ${studentName}`;
    const moodEntriesHtml = formatMoodEntries(moodEntries || []);
    
    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF8A48; color: white; padding: 15px; border-radius: 5px 5px 0 0; }
            .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #777; }
            .alert { background-color: #ffebee; border-left: 5px solid #f44336; padding: 15px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Student Check-in Request</h2>
            </div>
            <div class="content">
              <div class="alert">
                <strong>${studentName}</strong> has requested to be checked in on.
              </div>
              
              <h3>Student Information:</h3>
              <p><strong>Name:</strong> ${studentName}</p>
              <p><strong>Email:</strong> ${userData?.email || userEmail || "Not provided"}</p>
              
              <h3>Recent Mood Entries:</h3>
              ${moodEntriesHtml}
              
              <p>Please reach out to the student as soon as possible.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from M(in)dvincible. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email to all clinicians
    let emailsSent = 0;
    for (const email of clinicianEmails) {
      if (email.trim()) {
        try {
          console.log(`Attempting to send email to ${email.trim().replace(/@/g, '[at]')}`);
          
          await client.send({
            from: fromEmail,
            to: email.trim(),
            subject: emailSubject,
            content: emailBody,
            html: emailBody,
          });
          
          console.log(`Email sent to ${email.trim().replace(/@/g, '[at]')}`);
          emailsSent++;
        } catch (emailError) {
          console.error(`Failed to send email to ${email.trim().replace(/@/g, '[at]')}:`, emailError);
        }
      }
    }

    // Close the connection
    try {
      await client.close();
      console.log("SMTP connection closed");
    } catch (closeError) {
      console.error("Error closing SMTP connection:", closeError);
    }

    // Update the request to mark the alert as sent if at least one email was sent
    if (emailsSent > 0) {
      await supabase
        .from("check_in_requests")
        .update({ alert_sent: true })
        .eq("user_id", userId)
        .is("resolved", false)
        .order("created_at", { ascending: false })
        .limit(1);
      
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
    
    // Ensure the SMTP client is closed on error
    try {
      await client.close();
      console.log("SMTP connection closed after error");
    } catch (e) {
      console.error("Error closing SMTP client:", e);
    }
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

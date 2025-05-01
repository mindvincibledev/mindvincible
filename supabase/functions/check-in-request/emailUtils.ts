
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { MoodEntry, SMTPConfig } from "./types.ts";

// CORS headers for preflight requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Format the mood entries for the email
export function formatMoodEntries(entries: MoodEntry[]): string {
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

// Generate email content for check-in request
export function generateEmailContent(
  studentName: string, 
  studentEmail: string, 
  studentMood: string, 
  moodEntries: MoodEntry[]
): { subject: string, emailBody: string } {
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
          .current-mood { font-weight: bold; color: #FF8A48; }
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
              <p>Current mood: <span class="current-mood">${studentMood}</span></p>
            </div>
            
            <h3>Student Information:</h3>
            <p><strong>Name:</strong> ${studentName}</p>
            <p><strong>Email:</strong> ${studentEmail}</p>
            
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

  return { subject: emailSubject, emailBody };
}

// Send email using SMTP
export async function sendEmail(
  config: SMTPConfig, 
  recipientEmail: string, 
  subject: string, 
  htmlContent: string
): Promise<boolean> {
  try {
    // Configure client with more options for stability
    const client = new SMTPClient({
      connection: {
        hostname: config.host,
        port: config.port,
        tls: true,
        auth: {
          username: config.username,
          password: config.password,
        }
      },
      // Set reasonable timeouts
      pool: false, // Don't use connection pool to avoid potential issues
      debug: {
        log: true // Enable logging for troubleshooting
      }
    });

    console.log("SMTP client configured successfully");
    
    // Send the email
    await client.send({
      from: config.fromEmail,
      to: recipientEmail,
      subject: subject,
      content: "This email requires HTML support to view",
      html: htmlContent,
      // Add text alternative to avoid content type issues
      mail: {
        headers: {
          "content-type": "text/html; charset=utf-8"
        }
      }
    });
    
    // Close the client connection
    await client.close();
    console.log("SMTP connection closed");
    
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${recipientEmail.replace(/@/g, '[at]')}:`, error);
    return false;
  }
}

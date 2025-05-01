
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { MoodEntry, SMTPConfig } from "./types.ts";

// CORS headers for preflight requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate email content for check-in request - simplified version
export function generateEmailContent(
  studentName: string, 
  studentEmail: string, 
  studentMood: string,
  moodEntries: MoodEntry[]
): { subject: string, emailBody: string } {
  const emailSubject = `Check-in Request from ${studentName}`;
  
  // Simplified email body with just the essential information
  const emailBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
        </style>
      </head>
      <body>
        <p><strong>${studentName}</strong> (${studentEmail}) has requested to be checked in on.</p>
        <p>Current mood: ${studentMood}</p>
      </body>
    </html>
  `;

  return { subject: emailSubject, emailBody };
}

// Send email using SMTP - with improved error handling
export async function sendEmail(
  config: SMTPConfig, 
  recipientEmail: string, 
  subject: string, 
  htmlContent: string
): Promise<boolean> {
  try {
    // Configure client with basic settings
    const client = new SMTPClient({
      connection: {
        hostname: config.host,
        port: config.port,
        tls: true,
        auth: {
          username: config.username,
          password: config.password,
        }
      }
    });

    console.log("SMTP client configured successfully");
    
    // Send the email with plain text alternative
    await client.send({
      from: config.fromEmail,
      to: recipientEmail,
      subject: subject,
      content: "A student has requested to be checked in on. Please enable HTML to see the details.",
      html: htmlContent,
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

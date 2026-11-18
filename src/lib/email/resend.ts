import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || "ListKaro <notifications@listkaro.in>";

/**
 * Send welcome email on store connection
 */
export async function sendWelcomeEmail(toEmail: string, shopDomain: string) {
  const subject = `Welcome to ListKaro! Your Shopify store is connected`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">ListKaro</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Shopify to Indian Marketplaces in 1 Click</p>
      </div>

      <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 18px; margin-top: 0;">Store Connected Successfully 🎉</h2>
        <p>Your store <strong>${shopDomain}</strong> is now synced with ListKaro.</p>
        <p>What you can do next:</p>
        <ul style="padding-left: 20px; line-height: 1.6;">
          <li><strong>AI Category Matching:</strong> Match your Shopify products to Amazon, Flipkart, Meesho, Myntra, and JioMart verticals.</li>
          <li><strong>AI Listing Optimizer:</strong> Auto-generate compliant titles, bullet points, HSN codes, and GST slabs.</li>
          <li><strong>Image Checker:</strong> Verify pure white backgrounds and zoom resolution requirements.</li>
          <li><strong>1-Click Export:</strong> Download official bulk-upload sheets ready for seller portal import.</li>
        </ul>
        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Open Dashboard</a>
        </div>
      </div>

      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
        ListKaro Technologies India · Dedicated to Indian D2C Brands
      </p>
    </div>
  `;

  if (!resend) {
    console.log(`[Resend Mock] Welcome email sent to ${toEmail} for ${shopDomain}`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject,
      html,
    });
    return { success: true, data };
  } catch (err) {
    console.error("Failed to send welcome email via Resend:", err);
    return { success: false, error: err };
  }
}

/**
 * Send export job finished email with download link
 */
export async function sendExportFinishedEmail(
  toEmail: string,
  marketplaceName: string,
  downloadUrl: string,
  itemCount: number
) {
  const subject = `Your ${marketplaceName} Bulk Upload File is Ready!`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">ListKaro</h1>
      </div>

      <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 18px; margin-top: 0; color: #15803d;">Export Completed Successfully ✅</h2>
        <p>Your catalog export for <strong>${marketplaceName}</strong> containing <strong>${itemCount} optimized products</strong> is ready.</p>
        <p>The file conforms to the official ${marketplaceName} bulk upload specifications with validated HSN codes, GST slabs, and formatted titles.</p>
        <div style="margin-top: 24px; text-align: center;">
          <a href="${downloadUrl}" style="background-color: #15803d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Download Catalog File</a>
        </div>
      </div>
    </div>
  `;

  if (!resend) {
    console.log(`[Resend Mock] Export ready email sent to ${toEmail} for ${marketplaceName}`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject,
      html,
    });
    return { success: true, data };
  } catch (err) {
    console.error("Failed to send export ready email:", err);
    return { success: false, error: err };
  }
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceiptEmail(
  toEmail: string,
  planName: string,
  amount: string,
  invoiceId: string
) {
  const subject = `Payment Receipt: ListKaro ${planName} Plan`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">ListKaro</h1>
      </div>

      <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 18px; margin-top: 0;">Payment Receipt</h2>
        <p>Thank you for subscribing to ListKaro. Here are your transaction details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Plan</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${planName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Amount Paid</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${amount}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Transaction Reference</td>
            <td style="padding: 8px 0; font-family: monospace; text-align: right;">${invoiceId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Status</td>
            <td style="padding: 8px 0; font-weight: 600; color: #15803d; text-align: right;">PAID (Verified)</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  if (!resend) {
    console.log(`[Resend Mock] Payment receipt sent to ${toEmail} for ${planName} (${amount})`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject,
      html,
    });
    return { success: true, data };
  } catch (err) {
    console.error("Failed to send payment receipt:", err);
    return { success: false, error: err };
  }
}

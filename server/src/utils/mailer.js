import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const isConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
});

/**
 * Verify transporter configuration
 */
export async function verifyMailConnection() {
  if (!isConfigured) {
    console.log("[Mailer] SMTP credentials not fully configured in .env. Running in simulation mode.");
    return { configured: false, message: "SMTP credentials not provided in .env" };
  }
  try {
    await transporter.verify();
    console.log("[Mailer] SMTP Server connection established successfully.");
    return { configured: true, message: "SMTP connection verified" };
  } catch (err) {
    console.error("[Mailer] SMTP Verification Error:", err.message);
    return { configured: false, error: err.message };
  }
}

/**
 * Send an email with automatic simulation fallback
 */
export async function sendMail({ to, bcc, subject, html, text }) {
  const rawFrom = process.env.SMTP_FROM || process.env.SMTP_USER || "career@datainfolenz.com";
  const fromEmail = rawFrom.includes('<') ? (rawFrom.match(/<([^>]+)>/)?.[1] || rawFrom) : rawFrom;
  const from = rawFrom.includes('<') ? rawFrom : `"Yahiya Traders" <${rawFrom}>`;

  if (!isConfigured) {
    console.log("\n=======================================================");
    console.log(`[Mailer - Simulation] Email To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`From: ${from}`);
    console.log("-------------------------------------------------------");
    console.log(text || "HTML content generated.");
    console.log("=======================================================\n");
    return {
      simulated: true,
      messageId: `sim_${Date.now()}`,
      to,
      subject
    };
  }

  try {
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
      replyTo: fromEmail
    };
    if (bcc) {
      mailOptions.bcc = bcc;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[Mailer] Error sending email to ${to}:`, err.message);
    throw err;
  }
}

/**
 * Send a luxury HTML order confirmation email to the customer
 */
export async function sendOrderConfirmationEmail(order) {
  if (!order || !order.customer_email) {
    console.warn("[Mailer] Cannot send confirmation: order or customer_email missing", order);
    return;
  }

  let formattedAddress = 'Standard Courier Delivery';
  if (order.shipping_address) {
    if (typeof order.shipping_address === 'string') {
      try {
        const parsed = JSON.parse(order.shipping_address);
        formattedAddress = [parsed.addressLine, parsed.city, parsed.state, parsed.postalCode].filter(Boolean).join(', ');
      } catch (e) {
        formattedAddress = order.shipping_address;
      }
    } else if (typeof order.shipping_address === 'object') {
      const sa = order.shipping_address;
      formattedAddress = [sa.addressLine, sa.city, sa.state, sa.postalCode].filter(Boolean).join(', ');
    }
  }

  const items = order.items || [];
  const itemsHtml = items.map(item => `
    <tr style="border-bottom: 1px solid #f0f0f0;">
      <td style="padding: 12px 8px; font-weight: 600; color: #1d1d1d;">
        ${item.product_name}
      </td>
      <td style="padding: 12px 8px; text-align: center; color: #666;">
        × ${item.quantity}
      </td>
      <td style="padding: 12px 8px; text-align: right; font-weight: 700; color: #1d1d1d;">
        ₹${Number(item.total_price || item.unit_price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Yahiya Traders</title>
    </head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf9f6; color: #1d1d1d;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #ebe5df; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1d1d1d; padding: 28px 24px; text-align: center; border-bottom: 3px solid #fee000;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
            Yahiya Traders
          </h1>
          <p style="color: #fee000; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
            100% Certified Authentic Harvest
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px;">
          <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 8px 0; color: #1d1d1d;">
            Thank you for your order, ${order.customer_name}!
          </h2>
          <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 24px 0;">
            Your order <strong>#${order.order_number}</strong> has been received and verified. Our artisans are carefully preparing your fresh harvest for aroma-sealed express dispatch.
          </p>

          <!-- Order Overview Box -->
          <div style="background-color: #fdfbf7; border: 1px solid #faeccb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <table style="width: 100%; font-size: 13px;">
              <tr>
                <td style="color: #666; padding-bottom: 6px;">Order Number:</td>
                <td style="font-weight: 700; text-align: right; padding-bottom: 6px;">${order.order_number}</td>
              </tr>
              <tr>
                <td style="color: #666; padding-bottom: 6px;">Order Date:</td>
                <td style="font-weight: 600; text-align: right; padding-bottom: 6px;">${new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
              </tr>
              <tr>
                <td style="color: #666; padding-bottom: 6px;">Payment Status:</td>
                <td style="font-weight: 700; color: #108474; text-align: right; padding-bottom: 6px;">PAID (Verified)</td>
              </tr>
              <tr>
                <td style="color: #666;">Shipping Address:</td>
                <td style="font-weight: 600; text-align: right; max-width: 250px;">${formattedAddress}</td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <h3 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #888; margin: 0 0 12px 0;">
            Items Ordered
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
            <thead>
              <tr style="border-bottom: 2px solid #ebe5df; color: #666; font-size: 12px; text-transform: uppercase;">
                <th style="padding: 8px; text-align: left;">Product</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 16px 8px 8px 8px; text-align: right; font-weight: 600; color: #666;">Total Paid:</td>
                <td style="padding: 16px 8px 8px 8px; text-align: right; font-size: 18px; font-weight: 800; color: #1d1d1d;">₹${Number(order.total_amount).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #f5f5f5; border-radius: 12px; padding: 16px; font-size: 12px; color: #666; line-height: 1.5;">
            <strong>Need assistance?</strong> Contact our fresh customer support anytime at <a href="mailto:career@datainfolenz.com" style="color: #108474; text-decoration: none; font-weight: 600;">career@datainfolenz.com</a> or track your order directly on our store.
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f7f7f7; padding: 18px 24px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #ebe5df;">
          © ${new Date().getFullYear()} Data Infolenz. All rights reserved.
        </div>

      </div>
    </body>
    </html>
  `;

  const adminEmail = process.env.SMTP_USER || 'career@datainfolenz.com';
  const shouldBcc = adminEmail && adminEmail.toLowerCase() !== (order.customer_email || '').toLowerCase();

  return sendMail({
    to: order.customer_email,
    bcc: shouldBcc ? adminEmail : undefined,
    subject: `Order Confirmation #${order.order_number} - Yahiya Traders`,
    html,
    text: `Thank you for your order, ${order.customer_name}! Order #${order.order_number} has been received for ₹${Number(order.total_amount).toLocaleString('en-IN')}. We will ship to: ${formattedAddress}.`
  });
}

/**
 * Send an order status update email (shipped, delivered, etc.)
 */
export async function sendOrderStatusEmail(order, newStatus) {
  if (!order || !order.customer_email) return;

  const statusDescriptions = {
    pending: "Your order is pending confirmation.",
    processing: "Your order is currently being hand-packed with fresh aroma-seal.",
    shipped: "Your order has been dispatched via cold-chain courier and is on its way!",
    delivered: "Your package has been successfully delivered. Enjoy your fresh harvest!"
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; padding: 20px; color: #1d1d1d; background: #fafafa;">
      <div style="max-width: 550px; margin: auto; background: #fff; border-radius: 12px; border: 1px solid #eee; padding: 24px;">
        <h2 style="margin-top: 0; color: #1d1d1d;">Yahiya Traders Order Update</h2>
        <p>Dear ${order.customer_name || 'Customer'},</p>
        <p>The status of your order <strong>#${order.order_number}</strong> has been updated to: <strong style="text-transform: uppercase; color: #108474;">${newStatus}</strong>.</p>
        <p style="background: #fdfbf7; padding: 12px; border-radius: 8px; border: 1px solid #faeccb;">
          ${statusDescriptions[newStatus] || `Your order status is now ${newStatus}.`}
        </p>
        <p style="font-size: 12px; color: #888;">Thank you for shopping with Yahiya Traders.</p>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to: order.customer_email,
    subject: `Order #${order.order_number} Status Update: ${newStatus.toUpperCase()} - Yahiya Traders`,
    html,
    text: `Your order #${order.order_number} has been updated to: ${newStatus}.`
  });
}

export default transporter;

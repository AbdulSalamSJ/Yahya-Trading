import { jsPDF } from 'jspdf';
import { formatSize } from './productSizes';

/**
 * Generates an official, beautifully styled PDF order bill / tax invoice.
 * @param {Object} params
 * @param {Object} params.order - The order data
 * @param {Object} params.formData - Customer form data
 * @param {Array} params.cartItems - Items ordered
 * @param {Object} params.pricing - Pricing breakdown (subtotal, tax, discount, shipping, total)
 * @returns {jsPDF} The jsPDF document instance
 */
export function generateOrderPdf({ order, formData, cartItems, pricing }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const orderNumber = order?.order_number || `#ORD-${Date.now()}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ', ' + now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~297 mm
  const margin = 14;
  let y = 16;

  // --- BRAND HEADER BLOCK ---
  // Top Banner
  doc.setFillColor(33, 23, 20); // Dark roasted cocoa #211714
  doc.rect(margin, y, pageWidth - margin * 2, 28, 'F');

  // Brand Name
  doc.setTextColor(254, 224, 0); // Gold #fee000
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('YAHIYA TRADERS', margin + 6, y + 9);

  // Subtitle
  doc.setTextColor(235, 224, 216);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('PREMIUM ROYAL DATES • CALIFORNIA ALMONDS • IMPORTED DELICACIES', margin + 6, y + 15);

  doc.setFontSize(7.5);
  doc.setTextColor(190, 175, 165);
  doc.text('14B, Telungar Street, Puliangudi - 627855, Tamil Nadu | +91 63690 90536', margin + 6, y + 21);

  // Invoice Tag on Right
  doc.setFillColor(254, 224, 0);
  doc.roundedRect(pageWidth - margin - 46, y + 6, 40, 15, 2, 2, 'F');
  doc.setTextColor(29, 29, 29);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TAX INVOICE', pageWidth - margin - 26, y + 12, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('ORDER BILL', pageWidth - margin - 26, y + 17, { align: 'center' });

  y += 34;

  // --- ORDER METADATA & CUSTOMER INFO BOXES ---
  const colWidth = (pageWidth - margin * 2 - 4) / 2;

  // Box 1: Order Details
  doc.setFillColor(248, 245, 242);
  doc.setDrawColor(225, 215, 205);
  doc.roundedRect(margin, y, colWidth, 34, 2, 2, 'FD');

  doc.setTextColor(120, 80, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('ORDER DETAILS', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 50, 45);
  doc.text('Invoice / Order ID:', margin + 4, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.text(orderNumber, margin + 35, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.text('Date & Time:', margin + 4, y + 19);
  doc.text(dateStr, margin + 35, y + 19);

  doc.text('Payment Status:', margin + 4, y + 25);
  doc.setTextColor(16, 132, 116); // emerald green
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFIED & CONFIRMED', margin + 35, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 50, 45);
  doc.text('Dispatch Origin:', margin + 4, y + 31);
  doc.text('Puliangudi Hub (TN)', margin + 35, y + 31);

  // Box 2: Billed To / Shipping Address
  const box2X = margin + colWidth + 4;
  doc.setFillColor(248, 245, 242);
  doc.setDrawColor(225, 215, 205);
  doc.roundedRect(box2X, y, colWidth, 34, 2, 2, 'FD');

  doc.setTextColor(120, 80, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DELIVERY & CUSTOMER DETAILS', box2X + 4, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 25, 25);
  doc.text(formData.fullName || 'Valued Customer', box2X + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 60, 55);
  doc.text(`Phone: ${formData.phone || 'N/A'}`, box2X + 4, y + 18.5);
  doc.text(`Email: ${formData.email || 'N/A'}`, box2X + 4, y + 23.5);

  const addressLine = `${formData.addressLine || ''}, ${formData.city || ''}, ${formData.state || 'TN'} - ${formData.postalCode || ''}`;
  const splitAddress = doc.splitTextToSize(addressLine, colWidth - 8);
  doc.text(splitAddress, box2X + 4, y + 28.5);

  y += 40;

  // --- ITEMS TABLE HEADER ---
  doc.setFillColor(45, 35, 30);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 8, 1, 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  const colX = {
    num: margin + 3,
    desc: margin + 12,
    size: margin + 95,
    rate: margin + 125,
    qty: margin + 150,
    amount: pageWidth - margin - 4
  };

  doc.text('#', colX.num, y + 5.5);
  doc.text('Harvest Item Description', colX.desc, y + 5.5);
  doc.text('Pack Weight', colX.size, y + 5.5);
  doc.text('Rate (₹)', colX.rate, y + 5.5);
  doc.text('Qty', colX.qty, y + 5.5);
  doc.text('Total (₹)', colX.amount, y + 5.5, { align: 'right' });

  y += 9;

  // --- ITEM ROWS ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const items = cartItems || [];
  items.forEach((item, index) => {
    // Strip duplicate weight if item.name already contains parenthesis
    const rawName = String(item.name || 'Harvest Item').replace(/\s*\(\d+\s*(?:g|gm|kg)\)/i, '').trim();
    const cleanSize = formatSize(item.selectedSize) || '250 GM';
    const unitPrice = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const total = unitPrice * quantity;

    // Alternating row background
    if (index % 2 === 1) {
      doc.setFillColor(250, 248, 245);
      doc.rect(margin, y - 1, pageWidth - margin * 2, 8, 'F');
    }

    doc.setTextColor(50, 45, 40);
    doc.text(String(index + 1), colX.num, y + 4.5);

    // Truncate name if too long
    const cleanDesc = rawName.length > 45 ? rawName.slice(0, 42) + '...' : rawName;
    doc.setFont('helvetica', 'bold');
    doc.text(cleanDesc, colX.desc, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 80, 75);
    doc.text(cleanSize, colX.size, y + 4.5);
    doc.text(unitPrice.toLocaleString('en-IN'), colX.rate, y + 4.5);
    doc.text(String(quantity), colX.qty, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 25, 25);
    doc.text(total.toLocaleString('en-IN'), colX.amount, y + 4.5, { align: 'right' });

    y += 8;
  });

  // Table bottom border
  doc.setDrawColor(210, 200, 190);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // --- TOTALS SECTION ---
  const totalsWidth = 78;
  const totalsX = pageWidth - margin - totalsWidth;

  doc.setFillColor(252, 250, 248);
  doc.setDrawColor(225, 215, 205);
  doc.roundedRect(totalsX, y, totalsWidth, 38, 2, 2, 'FD');

  const subtotal = Number(pricing.subtotal || 0);
  const discountAmount = Number(pricing.discountAmount || 0);
  const taxAmount = Number(pricing.taxAmount || 0);
  const shippingFee = Number(pricing.shippingFee || 0);
  const grandTotal = Number(pricing.totalAmount || 0);

  let totY = y + 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 60, 55);

  doc.text('Subtotal:', totalsX + 4, totY);
  doc.text(`₹ ${subtotal.toLocaleString('en-IN')}`, totalsX + totalsWidth - 4, totY, { align: 'right' });

  if (discountAmount > 0) {
    totY += 5.5;
    doc.setTextColor(16, 132, 116);
    doc.text(`Discount (${pricing.promoCode || 'PROMO'}):`, totalsX + 4, totY);
    doc.text(`- ₹ ${discountAmount.toLocaleString('en-IN')}`, totalsX + totalsWidth - 4, totY, { align: 'right' });
    doc.setTextColor(70, 60, 55);
  }

  totY += 5.5;
  doc.text('GST (18% Included):', totalsX + 4, totY);
  doc.text(`₹ ${taxAmount.toLocaleString('en-IN')}`, totalsX + totalsWidth - 4, totY, { align: 'right' });

  totY += 5.5;
  doc.text('Nitrogen Aroma Shipping:', totalsX + 4, totY);
  doc.text(shippingFee === 0 ? 'FREE' : `₹ ${shippingFee}`, totalsX + totalsWidth - 4, totY, { align: 'right' });

  totY += 7;
  doc.setFillColor(254, 224, 0); // Gold highlight bar for total
  doc.roundedRect(totalsX + 2, totY - 4.5, totalsWidth - 4, 7.5, 1, 1, 'F');

  doc.setTextColor(29, 29, 29);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Grand Total Bill:', totalsX + 4, totY + 0.5);
  doc.text(`₹ ${grandTotal.toLocaleString('en-IN')}`, totalsX + totalsWidth - 4, totY + 0.5, { align: 'right' });

  // Left Note block
  const notesWidth = pageWidth - margin * 2 - totalsWidth - 6;
  doc.setFillColor(245, 242, 238);
  doc.roundedRect(margin, y, notesWidth, 38, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 45, 40);
  doc.text('AUTHENTICITY & FRESHNESS GUARANTEE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 80, 75);
  doc.text('• Nitrogen Fresh Aroma-Lock Pouch packing.', margin + 4, y + 12);
  doc.text('• 100% natural royal dry fruits, no preservatives.', margin + 4, y + 17);
  doc.text('• Dispatched directly from Puliangudi Hub.', margin + 4, y + 22);
  doc.text('• Digital computerized bill, valid for all warranty.', margin + 4, y + 27);

  doc.setTextColor(16, 132, 116);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ Verified Shop Order Dispatch', margin + 4, y + 33);

  y += 44;

  // --- FOOTER SECTION ---
  doc.setDrawColor(220, 210, 200);
  doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(130, 120, 115);
  doc.text(
    'Thank you for ordering with Yahiya Traders! For customer support, WhatsApp us at +91 63690 90536.',
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );
  doc.text(
    'This is a digitally generated invoice. No signature required.',
    pageWidth / 2,
    pageHeight - 11,
    { align: 'center' }
  );

  return doc;
}

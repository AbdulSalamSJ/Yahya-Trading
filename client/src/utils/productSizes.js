// Helper utilities for product pack sizes and dynamic pricing

export const DEFAULT_SIZES = ['250G', '500G', '1KG', '100G'];

export function getSizeGrams(sizeStr) {
  if (!sizeStr) return 250;
  const upper = String(sizeStr).toUpperCase().trim();
  if (upper.endsWith('KG')) {
    const num = parseFloat(upper.replace('KG', '')) || 1;
    return num * 1000;
  }
  if (upper.endsWith('G')) {
    return parseFloat(upper.replace('G', '')) || 250;
  }
  return parseFloat(upper) || 250;
}

export function getProductSizes(product) {
  if (!product) return DEFAULT_SIZES;
  const baseGrams = Number(product.cocoa_percentage) || 500;
  // If product is small herb/saffron under 10g
  if (baseGrams <= 10) {
    return ['1G', '2G', '5G', '10G'];
  }
  return DEFAULT_SIZES;
}

export function getPriceForSize(product, sizeStr) {
  if (!product) return 0;
  const basePrice = Number(product.price) || 0;
  const baseGrams = Number(product.cocoa_percentage) || 500;
  const targetGrams = getSizeGrams(sizeStr);

  if (targetGrams === baseGrams) {
    return basePrice;
  }

  const ratio = targetGrams / baseGrams;
  let multiplier = ratio;

  // Bulk discount for 1kg or larger: 5% off
  if (targetGrams >= 1000) {
    multiplier = ratio * 0.95;
  } else if (targetGrams <= 100) {
    multiplier = ratio * 1.08; // minor small-pack packaging premium
  } else if (targetGrams === 250 && baseGrams === 500) {
    multiplier = 0.52;
  }

  const raw = basePrice * multiplier;
  if (raw >= 100) {
    return Math.round(raw / 5) * 5; // clean ₹5 rounding
  }
  return Math.round(raw);
}


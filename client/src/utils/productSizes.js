// Helper utilities for product pack sizes and dynamic pricing

export const DEFAULT_SIZES = ['250 GM', '500 GM', '1 KG', '100 GM'];

export function getSizeGrams(sizeStr) {
  if (!sizeStr) return 250;
  const upper = String(sizeStr).toUpperCase().trim();
  if (upper.includes('KG')) {
    const num = parseFloat(upper.replace(/[^0-9.]/g, '')) || 1;
    return num * 1000;
  }
  if (upper.includes('GM') || upper.includes('G')) {
    return parseFloat(upper.replace(/[^0-9.]/g, '')) || 250;
  }
  return parseFloat(upper) || 250;
}

export function formatSize(sizeStr) {
  if (!sizeStr) return '250 GM';
  const str = String(sizeStr).trim();
  // Strip any existing - Unavailable suffix if present
  const cleanStr = str.replace(/-?\s*Unavailable/i, '').trim();
  const grams = getSizeGrams(cleanStr);
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${Number(kg.toFixed(2))} KG`;
  }
  return `${grams} GM`;
}

export function isSizeAvailable(product, sizeStr) {
  if (!product) return true;
  if (product.stock !== undefined && product.stock !== null && Number(product.stock) <= 0) {
    return false;
  }
  if (product.is_available === false || product.available === false || product.in_stock === false) {
    return false;
  }
  if (Array.isArray(product.unavailable_sizes)) {
    const cleanSize = formatSize(sizeStr);
    const rawUpper = String(sizeStr).trim().toUpperCase();
    if (product.unavailable_sizes.some(s => {
      const sClean = formatSize(s);
      const sRaw = String(s).trim().toUpperCase();
      return sClean === cleanSize || sRaw === rawUpper;
    })) {
      return false;
    }
  }
  return true;
}

export function formatSizeOption(product, sizeStr) {
  const formatted = formatSize(sizeStr);
  const available = isSizeAvailable(product, sizeStr);
  return available ? formatted : `${formatted} - Unavailable`;
}

export function getProductSizes(product) {
  if (!product) return DEFAULT_SIZES;
  const baseGrams = Number(product.cocoa_percentage) || 500;
  // If product is small herb/saffron under 10g
  if (baseGrams <= 10) {
    return ['1 GM', '2 GM', '5 GM', '10 GM'];
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


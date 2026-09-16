// Resolve the active PackageOption (price/inventory/sku) from the user's hero
// selection. Shared by the shell (purchase panel) and the hero (price display)
// so they never disagree. Supports package-based (supplement), size-based
// (travel) and price-only (generic) products.

import type { ProductDetail, PdpSelection, PackageOption, Pricing } from './types';

export function resolveCurrentPackage(detail: ProductDetail, selection: PdpSelection): PackageOption {
  const fallbackSku = `WLH-${detail.id}`;

  if (detail.packages?.length) {
    return detail.packages[selection.pkgIdx] ?? detail.packages[0];
  }

  const sizes = detail.variants?.sizes;
  if (sizes?.length) {
    const size = sizes[selection.sizeIdx] ?? sizes[0];
    const pricing: Pricing = size.pricing ?? detail.pricing;
    return {
      label: size.label,
      price: pricing.price,
      originalPrice: pricing.originalPrice,
      priceValue: pricing.priceValue,
      originalValue: pricing.originalValue,
      inventory: size.inventory ?? 99,
      sku: size.sku ?? fallbackSku,
      best: false,
    };
  }

  return {
    label: '',
    price: detail.pricing.price,
    originalPrice: detail.pricing.originalPrice,
    priceValue: detail.pricing.priceValue,
    originalValue: detail.pricing.originalValue,
    inventory: 99,
    sku: fallbackSku,
    best: false,
  };
}

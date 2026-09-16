// Shared contract every category template implements.

import type React from 'react';
import type { Product } from '../../../components/home/ProductCard';
import type { ProductDetail, PdpSelection } from '../types';

export interface TemplateProps {
  detail: ProductDetail;
  /** Hero variant selections; owned by the shell so the purchase panel can react. */
  selection: PdpSelection;
  onSelect: (patch: Partial<PdpSelection>) => void;
  /** Click handler for related-product cards. */
  onProductClick?: (p: Product) => void;
  /** Breadcrumb "Home" handler. */
  onHome: () => void;
  /** Fully-styled mobile purchase block the template drops in after the hero. */
  mobilePurchase: React.ReactNode;
}

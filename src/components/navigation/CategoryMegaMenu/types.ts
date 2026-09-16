export interface MenuSubItem {
  id: string;
  label: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  /** Sub-categories shown below the header */
  items?: MenuSubItem[];
  /** Optional "View all X" link rendered at the bottom of this group */
  viewAllLabel?: string;
  viewAllCategoryId?: string;
}

export interface MenuColumn {
  groups: MenuGroup[];
}

export interface NavMegaMenu {
  /** Must match nav item ID */
  id: string;
  /** Number of columns in the grid (default 5) */
  columnCount?: number;
  /**
   * 'fixed' (default) → one menu column per data column.
   * 'flow' → every group flows into a responsive auto-filling grid that wraps
   * (used by the wide "All Categories" marketplace hub).
   */
  layout?: 'fixed' | 'flow';
  columns: MenuColumn[];
  /** "Shop all X" link shown at the bottom of the last column */
  shopAllLabel?: string;
  shopAllCategoryId?: string;
}

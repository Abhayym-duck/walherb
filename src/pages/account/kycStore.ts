'use client';

/**
 * Mock KYC store.
 *
 * Holds the user's KYC submission in module scope so it survives component
 * remounts (navigating away/back, browser history). Swap `getKyc`/`setKyc`
 * with real API calls when a backend is available — the UI doesn't change.
 */

export type KycStatus = 'not-started' | 'pending' | 'verified';

export interface KycDoc {
  name: string;
  size: string;
  /** Object URL for viewing the uploaded file (image preview / open). */
  url: string;
  isImage: boolean;
  /** e.g. "PDF", "JPG", "PNG" — shown in the document meta line. */
  fileType: string;
  /** Date the file was uploaded, e.g. "18 June 2026". */
  uploadedOn: string;
}

export interface KycRecord {
  status: KycStatus;
  fullName: string;
  panDoc: KycDoc | null;
  aadhaarDoc: KycDoc | null;
  /** KYC reference id, e.g. "KYC-2026-04832". Generated on submission. */
  reference: string | null;
  /** Residential address used for the Customer Details card. */
  address: string;
  /** Submission timestamp, e.g. "18 Jun 2026, 3:42 PM". */
  submittedAt: string | null;
  /** Verification timestamp, e.g. "19 Jun 2026, 11:05 AM". */
  verifiedAt: string | null;
}

let record: KycRecord = {
  status: 'not-started',
  fullName: '',
  panDoc: null,
  aadhaarDoc: null,
  reference: null,
  address: '12, MG Road, Andheri East, Mumbai, Maharashtra 400069',
  submittedAt: null,
  verifiedAt: null,
};

export const getKyc = (): KycRecord => record;

export const setKyc = (patch: Partial<KycRecord>): KycRecord => {
  record = { ...record, ...patch };
  return record;
};

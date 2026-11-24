import type { Picture } from './model';

export type PhotoImportState = {
  status:
    | 'authorizing'
    | 'selecting'
    | 'importing'
    | 'ready'
    | 'complete'
    | 'cancelled';
  pickerId?: string;
  pickerUrl?: string;
  expiresAt?: number;
  nextPollAt: number;
  timeoutAt: number;
  pollIntervalMs: number;
  cursor?: string;
  pictures: Picture[];
  skipped: number;
  oauthNonce?: string;
  error?: string;
};
export type PhotoImportProgress = Pick<
  PhotoImportState,
  | 'status'
  | 'pickerUrl'
  | 'nextPollAt'
  | 'timeoutAt'
  | 'pictures'
  | 'skipped'
  | 'error'
> & {
  id: string;
  articleId: string;
};

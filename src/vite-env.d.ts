/// <reference types="vite/client" />

interface TheranRuntime {
  cleanups?: Record<string, (() => void) | undefined>;
  mountSite?: () => (() => void) | void;
  mountOcean?: () => (() => void) | void;
  mountArchive?: () => (() => void) | void;
  mountJamesPhone?: () => (() => void) | void;
  mountStores?: () => (() => void) | void;
  mountSampleReader?: () => (() => void) | void;
}

interface Window {
  THERAN?: TheranRuntime;
  THERAN_CONFIG?: unknown;
}

/// <reference types="vite/client" />

interface Window {
  __CARDVILLE_BUILD_ID__?: string;
  __CARDVILLE_BASE_PATH__?: string;
  __CARDVILLE_APP_STARTED__?: boolean;
  __CARDVILLE_MARK_HTML_BOOTED__?: () => void;
  __CARDVILLE_HTML_BOOT_VISIBLE_AT__?: number;
}

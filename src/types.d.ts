// Ambient module shims for optional peer deps.
//
// puppeteer and @babel/standalone are only needed by specific tools
// (media_screenshot_url / media_validate_code). Rather than bundle a
// 200MB Chromium + a 2MB transpiler with every install, we treat them
// as optional — the tool that needs them imports dynamically and
// throws a friendly error if the module isn't installed.
//
// These shims let TypeScript compile the call sites without requiring
// the real @types packages to be present.

declare module 'puppeteer'
declare module '@babel/standalone'


function getImageMime(ext) {
function getImageMime(ext) {
  const map = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'ico': 'image/x-icon',
    'bmp': 'image/bmp',
    'avif': 'image/avif',
  };
  return map[ext] || null;
}
}
function showImageContent(path, dataUrl, size) {
function showImageContent(path, dataUrl, size) {
  const fileViewer = document.getElementById('modal-file-viewer');
  fileViewer.innerHTML = `
    <div class="file-viewer-header">${escapeHtml(path)} <span style="margin-left: auto;">${size} bytes</span></div>
    <img class="image-viewer" src="${dataUrl}" alt="${escapeHtml(path)}" loading="lazy" />
  `;
}
}
// simulate showImageContent by capturing html
const captured = [];
const mockViewer = { innerHTML: '' };
global.document = { getElementById: () => mockViewer };

const cases = ['png','jpg','jpeg','gif','svg','webp','ico','bmp','avif','md','js','txt'];
for (const ext of cases) {
  console.log(ext, '->', getImageMime(ext));
}
// build a data URL like the real code does
const fakeContent = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const mime = getImageMime('png');
const dataUrl = mime ? `data:${mime};base64,${fakeContent}` : null;
console.log('dataUrl:', dataUrl);
console.log('valid data URL prefix:', dataUrl ? dataUrl.startsWith('data:image/png;base64,') : 'none');

// --------------------------------------------------
// 1. SPA SECTION SWITCHER
// --------------------------------------------------
function showSection(id, element) {
  document.querySelectorAll('.content section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-links p').forEach(link => link.classList.remove('active'));

  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  if (element) element.classList.add('active');
}

// --------------------------------------------------
// 2. THEME TOGGLE
// --------------------------------------------------
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

// --------------------------------------------------
// 3. LIVE 3-HAND SVG CLOCK ENGINE
// --------------------------------------------------
function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const hourHand = document.getElementById('hour-hand');
  const minHand = document.getElementById('min-hand');
  const secHand = document.getElementById('sec-hand');

  if (hourHand && minHand && secHand) {
      hourHand.setAttribute('transform', `rotate(${hours * 30}, 16, 16)`);
      minHand.setAttribute('transform', `rotate(${minutes * 6}, 16, 16)`);
      secHand.setAttribute('transform', `rotate(${seconds * 6}, 16, 16)`);
    }
  requestAnimationFrame(updateClock);
}
updateClock();

// --------------------------------------------------
// 4. BORDERLESS MICRO-CONSTELLATION CANVAS ENGINE
// --------------------------------------------------
const canvas = document.getElementById('constellation-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let nodes = [];
  let mouse = { x: -1000, y: -1000 };

  function resizeCanvas() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    initNodes();
  }

  function initNodes() {
    nodes = [];
    const cols = 12;
    const rows = 7;
    const spacingX = width / cols;
    const spacingY = height / rows;

    for (let r = 0.5; r < rows; r++) {
      for (let c = 0.5; c < cols; c++) {
        nodes.push({
          x: c * spacingX + (Math.random() - 0.5) * 16,
          y: r * spacingY + (Math.random() - 0.5) * 16,
          angle: Math.random() * Math.PI * 2,
          driftSpeed: (Math.random() - 0.5) * 0.006
        });
      }
    }
  }

  window.addEventListener('resize', resizeCanvas);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.body.classList.contains('dark-theme');
    const strokeRGB = isDark ? '229, 229, 229' : '28, 28, 26';

    const baseOpacity = isDark ? 0.2 : 0.28;
    const activeOpacity = isDark ? 0.75 : 0.85;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.angle += n.driftSpeed;
      let currentAngle = n.angle;

      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const dist = Math.hypot(dx, dy);

      let size = 3.5;
      let opacity = baseOpacity;

      if (dist < 130) {
        const targetAngle = Math.atan2(dy, dx);
        const influence = Math.pow(1 - dist / 130, 2);
        currentAngle = currentAngle * (1 - influence) + targetAngle * influence;
        opacity = baseOpacity + (activeOpacity - baseOpacity) * influence;
        size = 3.5 + influence * 2;
      }

      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        // FIXED: Using proper 2D Euclidean distance (n2.y - n.y) so lines spread in all directions
        const linkDist = Math.hypot(n2.x - n.x, n2.y - n.y);
        const mouseDist2 = Math.hypot(mouse.x - n2.x, mouse.y - n2.y);

        if (linkDist < 60 && (dist < 110 || mouseDist2 < 110)) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(${strokeRGB}, ${0.12 * (1 - linkDist / 60)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(currentAngle);

      ctx.strokeStyle = `rgba(${strokeRGB}, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-size, 0); ctx.lineTo(size, 0);
      ctx.moveTo(0, -size); ctx.lineTo(0, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${strokeRGB}, ${Math.min(1, opacity + 0.2)})`;
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();
}

// --------------------------------------------------
// 5. GITHUB REST API INTEGRATION
// --------------------------------------------------
async function fetchGitHubRepos() {
  const container = document.getElementById('repo-list-container');
  if (!container) return;

  try {
    const response = await fetch('https://api.github.com/users/babbie101/repos?sort=updated&per_page=6');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const repos = await response.json();
    container.innerHTML = '';

    if (repos.length === 0) {
      container.innerHTML = '<p class="tag">no public repositories found.</p>';
      return;
    }

    repos.forEach(repo => {
          const card = document.createElement('div');
          card.className = 'repo-card';
          card.style.cursor = 'pointer';
          card.dataset.repoName = repo.name;

          const description = repo.description ? repo.description : 'No description provided.';
          const language = repo.language ? repo.language.toLowerCase() : 'code';

          card.innerHTML = `
            <div class="repo-header">
              <a href="${repo.html_url}" target="_blank" class="repo-title">${repo.name}</a>
              <span class="repo-stars">★ ${repo.stargazers_count}</span>
            </div>
            <p class="repo-desc">${description}</p>
            <span class="repo-lang">#${language}</span>
          `;

          card.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;
            openRepoModal(repo.name);
          });

          container.appendChild(card);
        });

  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    container.innerHTML = `
      <p class="tag">could not load repositories from github.</p>
      <a href="https://github.com/babbie101" target="_blank" class="repo-title" style="font-size: 0.9rem;">visit github.com/babbie101 ↗</a>
    `;
  }
}

fetchGitHubRepos();

// --------------------------------------------------
// 6. REPO MODAL (Directory Tree + File Viewer)
// --------------------------------------------------
let currentRepo = null;
let currentTree = null;

function openRepoModal(repoName) {
  currentRepo = repoName;
  const modal = document.getElementById('repo-modal');
  const title = document.getElementById('modal-title');
  const treeContainer = document.getElementById('modal-tree');
  const fileViewer = document.getElementById('modal-file-viewer');

  title.textContent = `// ${repoName}`;
  treeContainer.innerHTML = '<div class="modal-loading">Loading directory tree...</div>';
  fileViewer.innerHTML = '<p class="modal-placeholder">Select a file from the tree to view its contents</p>';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  fetchRepoTree(repoName);
}

function closeRepoModal() {
  const modal = document.getElementById('repo-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  currentRepo = null;
  currentTree = null;
}

async function fetchRepoTree(repoName) {
  const treeContainer = document.getElementById('modal-tree');
  try {
    const response = await fetch(`https://api.github.com/repos/babbie101/${repoName}/git/trees/main?recursive=1`);
    if (!response.ok) {
      if (response.status === 404) {
        // Try 'master' branch
        const masterResponse = await fetch(`https://api.github.com/repos/babbie101/${repoName}/git/trees/master?recursive=1`);
        if (!masterResponse.ok) throw new Error('Branch not found');
        currentTree = await masterResponse.json();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      currentTree = await response.json();
    }
    renderTree(currentTree.tree);
    openReadmeIfPresent(currentTree.tree);
  } catch (error) {
    console.error('Failed to fetch repo tree:', error);
    treeContainer.innerHTML = `<p class="tag" style="color: var(--muted-color);">Failed to load tree: ${error.message}</p>`;
  }
}

function renderTree(tree) {
  const treeContainer = document.getElementById('modal-tree');
  if (!tree || tree.length === 0) {
    treeContainer.innerHTML = '<p class="tag" style="color: var(--muted-color);">Empty repository</p>';
    return;
  }

  // Build directory structure
  const root = { name: '', type: 'tree', path: '', children: [] };
  const pathMap = { '': root };

  tree.forEach(item => {
    const parts = item.path.split('/');
    let currentPath = '';
    parts.forEach((part, i) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      if (!pathMap[currentPath]) {
        const isFile = i === parts.length - 1 && item.type === 'blob';
        pathMap[currentPath] = {
          name: part,
          type: isFile ? 'blob' : 'tree',
          path: currentPath,
          sha: item.sha,
          size: item.size,
          children: isFile ? null : []
        };
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '';
        pathMap[parentPath].children.push(pathMap[currentPath]);
      }
    });
  });

  treeContainer.innerHTML = '';
  renderTreeNode(root, treeContainer, 0);
}

function renderTreeNode(node, container, depth) {
  if (node.children) {
    // Directory
    const dirEl = document.createElement('div');
    dirEl.className = 'tree-item dir';
    dirEl.dataset.path = node.path;
    dirEl.innerHTML = `<span class="tree-indent" style="margin-left: ${depth * 1.2}rem;"></span><span class="tree-icon">-</span>${escapeHtml(node.name || '(root)')}`;
    container.appendChild(dirEl);

    if (node.children.length > 0) {
      const childrenContainer = document.createElement('div');
      childrenContainer.style.marginLeft = '1rem';
      node.children.forEach(child => renderTreeNode(child, childrenContainer, depth + 1));
      container.appendChild(childrenContainer);
    }
  } else {
    // File
    const fileEl = document.createElement('div');
    fileEl.className = 'tree-item file';
    fileEl.dataset.path = node.path;
    fileEl.dataset.sha = node.sha;
    fileEl.innerHTML = `<span class="tree-indent" style="margin-left: ${depth * 1.2}rem;"></span><span class="tree-icon">-</span>${escapeHtml(node.name)}`;
    fileEl.addEventListener('click', () => fetchAndShowFile(node.path, node.sha));
    container.appendChild(fileEl);
  }
}

async function fetchAndShowFile(path, sha) {
  const fileViewer = document.getElementById('modal-file-viewer');
  fileViewer.innerHTML = '<div class="modal-loading">Loading file...</div>';

  try {
    const response = await fetch(`https://api.github.com/repos/babbie101/${currentRepo}/git/blobs/${sha}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const blob = await response.json();
    const base64 = blob.content.replace(/[^A-Za-z0-9+/=]/g, '');
    const ext = path.split('.').pop().toLowerCase();
    const mime = getImageMime(ext);

    if (mime) {
      const dataUrl = `data:${mime};base64,${base64}`;
      showImageContent(path, dataUrl, blob.size);
      return;
    }

    const bytes = base64ToBytes(base64);
    const content = decodeBytes(bytes);
    showFileContent(path, content);
  } catch (error) {
    console.error('Failed to fetch file:', error);
    fileViewer.innerHTML = `<p class="tag" style="color: var(--muted-color);">Failed to load file: ${error.message}</p>`;
  }
}

/* ---- base64 + text decoding helpers (handles UTF-8, UTF-16, UTF-32) ---- */
function base64ToBytes(base64) {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    bytes[i] = bin.charCodeAt(i) & 0xFF;
  }
  return bytes;
}

function decodeBytes(bytes) {
  if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
    if (bytes[2] === 0x00 && bytes[3] === 0x00 && bytes[4] === 0xFF && bytes[5] === 0xFF) {
      return new TextDecoder('utf-32le').decode(bytes.slice(4));
    }
    return new TextDecoder('utf-16le').decode(bytes.slice(2));
  }
  if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0xFE && bytes[3] === 0xFF) {
    return new TextDecoder('utf-32be').decode(bytes.slice(4));
  }
  if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
    return new TextDecoder('utf-8').decode(bytes.slice(3));
  }
  try {
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    return new TextDecoder('windows-1252').decode(bytes);
  }
}

function showFileContent(path, content) {
  const fileViewer = document.getElementById('modal-file-viewer');
  const lines = content.split('\n');
  const ext = path.split('.').pop().toLowerCase();
  const isMarkdown = ext === 'md' || ext === 'markdown';

  const header = `<div class="file-viewer-header">${escapeHtml(path)} <span style="margin-left: auto;">${lines.length} lines</span></div>`;

  if (isMarkdown) {
    fileViewer.innerHTML = header + `<div class="file-viewer-rendered">${renderMarkdown(content)}</div>`;
  } else {
    fileViewer.innerHTML = header + `<pre class="file-viewer">${lines.map((line, i) => `<span class="line-number">${i + 1}</span>${escapeHtml(line)}`).join('\n')}</pre>`;
  }
}

function showImageContent(path, dataUrl, size) {
  const fileViewer = document.getElementById('modal-file-viewer');
  fileViewer.innerHTML = `
    <div class="file-viewer-header">${escapeHtml(path)} <span style="margin-left: auto;">${size} bytes</span></div>
    <img class="image-viewer" src="${dataUrl}" alt="${escapeHtml(path)}" loading="lazy" />
  `;
}

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

function renderMarkdown(text) {
  // Escape HTML first to prevent injection, then apply markdown formatting
  text = escapeHtml(text);

  const lines = text.split('\n');
  let html = '';
  let listItems = [];
  let inList = false;
  let paragraph = '';

  function closeParagraph() {
    if (paragraph.trim()) {
      html += '<p>' + inline(paragraph) + '</p>\n';
      paragraph = '';
    }
  }

  function closeList() {
    if (inList) {
      html += '<ul>' + listItems.join('') + '</ul>\n';
      listItems = [];
      inList = false;
    }
  }

  function inline(text) {
    // Code spans
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    return text;
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeParagraph();
      continue;
    }

    // Heading (#, ##, ###)
    let m = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (m) {
      closeParagraph();
      closeList();
      const level = m[1].length;
      html += `<h${level}>${inline(m[2])}</h${level}>\n`;
      continue;
    }

    // Unordered list item (* or -)
    if (/^\* /.test(trimmed) || /^- /.test(trimmed)) {
      closeParagraph();
      listItems.push('<li>' + inline(trimmed.slice(2).trim()) + '</li>');
      inList = true;
      continue;
    }

    // Horizontal rule (---, ***, ___)
    if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      closeParagraph();
      closeList();
      html += '<hr>\n';
      continue;
    }

    // Regular paragraph line
    paragraph += (paragraph ? ' ' : '') + trimmed;
  }

  closeParagraph();
  closeList();
  return html;
}

function openReadmeIfPresent(tree) {
  if (!tree) return;
  const readme = tree.find(item => item.type === 'blob' && item.path.toLowerCase() === 'readme.md');
  if (readme) {
    fetchAndShowFile(readme.path, readme.sha);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeRepoModal();
});

// Close modal on backdrop click (already handled by onclick in HTML)
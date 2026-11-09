// 1. DYNAMIC TAB SWITCHING (SPA LOGIC)
function showSection(sectionId, clickedElement) {
  // Hide all main content sections
  const sections = document.querySelectorAll('.content section');
  sections.forEach(function(section) {
    section.classList.remove('active');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Remove active state from all sidebar links
  const links = document.querySelectorAll('.nav-links p');
  links.forEach(function(link) {
    link.classList.remove('active');
  });

  // Highlight clicked sidebar link
  if (clickedElement) {
    clickedElement.classList.add('active');
  }
}

// 2. DARK / LIGHT THEME TOGGLE LOGIC
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

// 3. LIVE REAL-TIME SVG CLOCK LOGIC
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Calculate rotation angles (360 degrees total)
  const hourDeg = (hours % 12 + minutes / 60) * 30; // 30 deg/hr
  const minDeg = (minutes + seconds / 60) * 6;      // 6 deg/min

  // Rotate SVG hands around pivot
  const hourHand = document.getElementById('hour-hand');
  const minHand = document.getElementById('min-hand');

  if (hourHand && minHand) {
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minHand.style.transform = `rotate(${minDeg}deg)`;
  }
}

// Start clock interval and run once on page load
setInterval(updateClock, 1000);
updateClock();
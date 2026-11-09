// 1. DYNAMIC SECTION SWITCHING (SPA LOGIC)
function showSection(sectionId, clickedElement) {
  // Hide all sections in the content area
  const sections = document.querySelectorAll('.content section');
  sections.forEach(function(section) {
    section.classList.remove('active');
  });

  // Show only the section matching the clicked ID
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Remove active styling from all sidebar links
  const links = document.querySelectorAll('.nav-links p');
  links.forEach(function(link) {
    link.classList.remove('active');
  });

  // Highlight the clicked sidebar link
  if (clickedElement) {
    clickedElement.classList.add('active');
  }
}

// 2. LIVE REAL-TIME CLOCK LOGIC
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Calculate rotation angles (360 degrees total)
  const hourDeg = (hours % 12 + minutes / 60) * 30; // 30 deg per hour
  const minDeg = (minutes + seconds / 60) * 6;      // 6 deg per minute

  // Rotate SVG clock hands around pivot point
  const hourHand = document.getElementById('hour-hand');
  const minHand = document.getElementById('min-hand');

  if (hourHand && minHand) {
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minHand.style.transform = `rotate(${minDeg}deg)`;
  }
}

// Run the clock every 1000ms (1 second) and trigger initial update
setInterval(updateClock, 1000);
updateClock();
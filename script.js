function showSection(sectionId) {
  const sections = document.querySelectorAll('.content section');
  
  sections.forEach(function(section) {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}
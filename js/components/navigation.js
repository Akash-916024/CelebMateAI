/**
 * CelebMate AI — Navigation Component
 * Handles sidebar tab switching and mobile drawer responsiveness
 * @module components/navigation
 */

import { qsa, qs } from '../utils/dom-helpers.js';

/**
 * Initializes navigation events across sidebar links and mobile toggle.
 * @param {(sectionId: string) => void} onSectionChange - Callback when active section changes
 */
export function initNavigation(onSectionChange) {
  const navLinks = qsa('.nav-link');
  const sidebar = qs('#appSidebar');
  const mobileToggle = qs('#mobileMenuBtn');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = link.dataset.section;
      if (!targetSection) return;

      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }

      onSectionChange(targetSection);
    });
  });

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

/**
 * Switches the displayed view section in the main page wrapper.
 * @param {string} sectionId - Section ID to activate
 */
export function switchSection(sectionId) {
  const sections = qsa('.app-section');
  sections.forEach((sec) => {
    if (sec.id === `section-${sectionId}`) {
      sec.classList.remove('hidden');
      sec.setAttribute('aria-hidden', 'false');
    } else {
      sec.classList.add('hidden');
      sec.setAttribute('aria-hidden', 'true');
    }
  });

  const headerTitle = qs('#headerTitle');
  if (headerTitle) {
    const activeLink = qs(`.nav-link[data-section="${sectionId}"]`);
    if (activeLink) {
      headerTitle.textContent = activeLink.textContent.trim();
    }
  }
}

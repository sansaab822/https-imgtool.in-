// --- Common.js: Handles Header/Footer Loading & Global Logic ---

// Absolute path ensure karta hai ki file hamesha mile, chahe user /tools/ folder me ho ya root par
const basePath = '/include';

// 1. Load Header
fetch(`${basePath}/header.html`)
  .then(response => {
    if (!response.ok) throw new Error(`Failed to load header from ${basePath}/header.html`);
    return response.text();
  })
  .then(data => {
    const headerEl = document.getElementById('header');
    if (headerEl) {
        headerEl.innerHTML = data;
        // Header DOM me aane ke baad hi script initialize karein
        initializeHeaderScripts();
        highlightActiveLink();
    }
  })
  .catch(err => console.error('Header load error:', err));

// 2. Load Footer
fetch(`${basePath}/footer.html`)
  .then(response => {
    if (!response.ok) throw new Error(`Failed to load footer from ${basePath}/footer.html`);
    return response.text();
  })
  .then(data => {
    const footerEl = document.getElementById('footer');
    if (footerEl) {
        footerEl.innerHTML = data;
        // Copyright year auto-update
        const yearSpan = document.getElementById('year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    }
  })
  .catch(err => console.error('Footer load error:', err));


// --- Logic Functions ---

function initializeHeaderScripts() {
  // Naye Tailwind Header ke IDs select karein
  const btn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-mobile-menu');
  const sidebar = document.getElementById('mobile-sidebar');
  const overlay = document.getElementById('mobile-overlay');
  
  // Toggle Function
  function toggleMenu(show) {
      if (!sidebar || !overlay) return;
      
      if (show) {
          sidebar.classList.remove('-translate-x-full'); // Sidebar layein
          overlay.classList.remove('hidden');
          // Animation ke liye thoda wait
          setTimeout(() => overlay.classList.remove('opacity-0'), 10);
          document.body.style.overflow = 'hidden'; // Scroll rokein
      } else {
          sidebar.classList.add('-translate-x-full'); // Sidebar hatayein
          overlay.classList.add('opacity-0');
          setTimeout(() => overlay.classList.add('hidden'), 300);
          document.body.style.overflow = ''; // Scroll wapas layein
      }
  }

  // Event Listeners
  if (btn) btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu(true);
  });
  
  if (closeBtn) closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu(false);
  });
  
  if (overlay) overlay.addEventListener('click', () => toggleMenu(false));

  // Sidebar ke andar link click karne par menu band ho jaye
  if (sidebar) {
      const links = sidebar.querySelectorAll('a');
      links.forEach(link => {
          link.addEventListener('click', () => toggleMenu(false));
      });
  }

  // Escape key dabane par menu band ho
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(false);
  });
}

// Current Page ko Header me Highlight karne ke liye
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('nav a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        // Agar link current path se match kare (Home '/' ko chhodkar exact match dekhein)
        if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('text-blue-600', 'bg-blue-50'); // Active Style
            link.classList.remove('text-slate-600');
        }
    });
}
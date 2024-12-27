class Sidebar extends HTMLElement {
    constructor() {
        super();
        console.log('Sidebar constructor called');
    }

    connectedCallback() {
        console.log('Sidebar connected to DOM');
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop();
        const isIndexPage = currentPage === '' || currentPage === 'index.html';
        const prefix = isIndexPage ? 'pages/' : '';
        
        this.innerHTML = `
            <div id="sidebar" class="sidebar">
                <div class="sidebar-header">
                    <div class="close-menu" id="closeMenu">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                </div>
                <div class="sidebar-content">
                    <div class="sidebar-links">
                        <a href="${prefix}bubble-sort.html" class="sidebar-link">Bubble Sort</a>
                        <a href="${prefix}insertion-sort.html" class="sidebar-link">Insertion Sort</a>
                        <a href="${prefix}merge-sort.html" class="sidebar-link">Merge Sort</a>
                        <a href="${prefix}selection-sort.html" class="sidebar-link">Selection Sort</a>
                        <a href="${prefix}quick-sort.html" class="sidebar-link">Quick Sort</a>
                        <a href="${prefix}heap-sort.html" class="sidebar-link">Heap Sort</a>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('Setting up sidebar event listeners');
        const sidebar = this.querySelector('#sidebar');
        const closeMenu = this.querySelector('#closeMenu');
        const menuBtn = document.getElementById('menuBtn');
        const exploreBtn = document.querySelector('.explore-btn');

        console.log('Elements found:', {
            sidebar: !!sidebar,
            closeMenu: !!closeMenu,
            menuBtn: !!menuBtn,
            exploreBtn: !!exploreBtn
        });

        // Close button
        if (closeMenu) {
            closeMenu.addEventListener('click', () => {
                console.log('Close button clicked');
                sidebar.classList.remove('open');
            });
        }

        // Menu button
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                console.log('Menu button clicked');
                sidebar.classList.add('open');
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            console.log('Document clicked, target:', e.target);
            const isClickInside = sidebar.contains(e.target) || 
                                (menuBtn && menuBtn.contains(e.target)) ||
                                (exploreBtn && exploreBtn.contains(e.target));
            
            if (sidebar.classList.contains('open') && !isClickInside) {
                console.log('Closing sidebar from outside click');
                sidebar.classList.remove('open');
            }
        });

        // Make sidebar functions global
        window.openSidebar = (e) => {
            console.log('openSidebar called');
            if (e) e.stopPropagation(); // Stop event propagation
            if (sidebar) {
                console.log('Adding open class to sidebar');
                sidebar.classList.add('open');
            } else {
                console.error('Sidebar element not found');
            }
        };

        window.closeSidebar = () => {
            console.log('closeSidebar called');
            if (sidebar) {
                console.log('Removing open class from sidebar');
                sidebar.classList.remove('open');
            } else {
                console.error('Sidebar element not found');
            }
        };
    }
}

customElements.define('app-sidebar', Sidebar);

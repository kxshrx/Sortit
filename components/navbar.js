class Navbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath === '/' || currentPath.endsWith('index.html');
        const prefix = isIndexPage ? '' : '../';

        // Get algorithm name from path
        const pathSegments = currentPath.split('/').filter(Boolean);
        const lastSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
        const algorithmName = !isIndexPage ? lastSegment.replace('.html', '').split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') : '';
        
        this.innerHTML = `
            <style>
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: rgba(31, 28, 44, 0.8);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(146, 141, 171, 0.2);
                    height: var(--navbar-height);
                    display: flex;
                    align-items: center;
                }

                .nav-container {
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .nav-left {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .nav-center {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    color: var(--accent);
                    font-size: 1.1rem;
                    font-weight: 500;
                    letter-spacing: 0.05em;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .nav-center.visible {
                    opacity: 1;
                }

                .menu-icon {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }

                .menu-icon svg {
                    color: var(--text-primary);
                    width: 24px;
                    height: 24px;
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    text-decoration: none;
                    letter-spacing: 0.05em;
                }

                .nav-right {
                    display: flex;
                    align-items: center;
                }

                .nav-right a {
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .nav-right a:hover {
                    color: var(--accent);
                }

                @media (max-width: 768px) {
                    .nav-container {
                        padding: 0 1rem;
                    }
                    .nav-center {
                        display: none;
                    }
                }
            </style>
            <nav class="navbar">
                <div class="nav-container">
                    <div class="nav-left">
                        <div class="menu-icon" id="menuBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </div>
                        <a href="${prefix}index.html" class="brand">
                            SortIt
                        </a>
                    </div>
                    <div class="nav-center ${algorithmName ? 'visible' : ''}">
                        ${algorithmName}
                    </div>
                    <div class="nav-right">
                        <a href="https://github.com/username/Sorting-Visualizer" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22">
                                </path>
                            </svg>
                        </a>
                    </div>
                </div>
            </nav>
        `;
    }
}

customElements.define('app-navbar', Navbar);

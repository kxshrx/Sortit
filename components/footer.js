class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath === '/' || currentPath.endsWith('index.html');

        // Format the pathname to get the last segment after the final slash
        const pathSegments = currentPath.split('/').filter(Boolean); // Split and remove empty parts
        const lastSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : 'Home';

        // Always show "SortIt" followed by the last segment of the path
        const pageTitle = isIndexPage ? 'Sortit' : `Sortit > ${lastSegment.replace(/-/g, ' ')}`;

        // Set the inner HTML of the footer with styles and content
        this.innerHTML = `
            <style>
                .footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 40px;
                    z-index: 1000;
                    background: rgba(31, 28, 50, 0.1);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(146, 141, 171, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                }

                .footer span {
                    color: var(--text-secondary);
                    font-family: 'Poppins', sans-serif;
                    font-size: 0.875rem;
                    letter-spacing: 0.05em;
                }

                .footer span.algorithm {
                    color: var(--accent);
                    font-weight: 500;
                }

                .footer a {
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: all 0.2s ease;
                    font-family: 'Poppins', sans-serif;
                    font-size: 0.875rem;
                    letter-spacing: 0.05em;
                }

                .footer a:hover {
                    color: var(--accent);
                    transform: scale(1.02);
                }

                @media (max-width: 640px) {
                    .footer {
                        padding: 0 1rem;
                    }
                    .footer span, .footer a {
                        font-size: 0.75rem;
                    }
                }
            </style>
            <div class="footer">
                <span class="algorithm">${pageTitle}</span>
                <a href="#" target="_blank">2023 Kishore</a>
            </div>
        `;
    }
}

// Define the custom element
customElements.define('app-footer', Footer);

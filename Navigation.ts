/* Navigation Styles */
.nav-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: var(--primary-color);
    padding: 1rem;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
}

.nav-links a {
    color: white;
    text-decoration: none;
    padding: 0.5rem;
    transition: color 0.3s ease;
}

.nav-links a:hover,
.nav-links a.active {
    color: var(--accent-color);
}

.hamburger {
    display: none;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0.5rem;
}

.hamburger span {
    display: block;
    width: 25px;
    height: 3px;
    background: white;
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }

    .nav-links {
        position: fixed;
        top: 70px;
        right: -100%;
        flex-direction: column;
        background: var(--primary-color);
        width: 100%;
        text-align: center;
        transition: right 0.3s ease;
        padding: 2rem 0;
    }

    .nav-links.active {
        right: 0;
    }
}

/* JavaScript for Navigation */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Set active link based on current page
    const currentPage = window.location.pathname;
    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger
        const bars = hamburger.querySelectorAll('span');
        bars[0].style.transform = navLinks.classList.contains('active') 
            ? 'rotate(45deg) translate(6px, 6px)' 
            : 'none';
        bars[1].style.opacity = navLinks.classList.contains('active') 
            ? '0' 
            : '1';
        bars[2].style.transform = navLinks.classList.contains('active') 
            ? 'rotate(-45deg) translate(8px, -8px)' 
            : 'none';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            const bars = hamburger.querySelectorAll('span');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
});

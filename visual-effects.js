// Cursor Effects
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);

// Update cursor position
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

// Cursor hover effects
document.querySelectorAll('a, button, .card').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
    });
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
    });
});

// Parallax Scrolling
const parallaxElements = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Smooth Page Transitions
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.href.includes(window.location.origin)) {
            e.preventDefault();
            document.body.classList.add('page-transition');
            setTimeout(() => {
                window.location = this.href;
            }, 500);
        }
    });
});

// SVG Animation on Scroll
const animateSVG = () => {
    const svgs = document.querySelectorAll('.animate-svg');
    svgs.forEach(svg => {
        const rect = svg.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);
        if (isVisible) {
            svg.classList.add('svg-animate');
        }
    });
};

window.addEventListener('scroll', animateSVG);
animateSVG(); // Initial check

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 
class MemoryOptimizer {
    constructor() {
        this.intersectionObserver = null;
        this.readingProgress = new Map();
        this.contentChunks = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.initializeContentChunks();
        this.setupEventListeners();
        this.initializeReadingProgress();
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            }
        );
    }

    initializeContentChunks() {
        document.querySelectorAll('.content-chunk').forEach(chunk => {
            const header = chunk.querySelector('.chunk-header');
            const content = chunk.querySelector('.chunk-content');
            
            if (header && content) {
                this.contentChunks.set(header, {
                    content,
                    isLoaded: false,
                    importance: chunk.dataset.importance || 'low'
                });

                header.setAttribute('aria-expanded', 'false');
                this.intersectionObserver.observe(chunk);
            }
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.chunk-header').forEach(header => {
            header.addEventListener('click', () => this.toggleContent(header));
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleContent(header);
                }
            });
        });

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.optimizeHiddenContent();
            }
        });

        // Handle memory pressure
        if ('onmemorypressure' in window) {
            window.addEventListener('memorypressure', (e) => {
                this.handleMemoryPressure(e.pressure);
            });
        }
    }

    initializeReadingProgress() {
        document.querySelectorAll('.chunk-content').forEach(content => {
            const progressBar = content.querySelector('.reading-indicator');
            if (progressBar) {
                this.readingProgress.set(content, {
                    bar: progressBar,
                    lastPosition: 0
                });
            }
        });
    }

    async toggleContent(header) {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const chunkData = this.contentChunks.get(header);

        if (!chunkData) return;

        header.setAttribute('aria-expanded', !isExpanded);

        if (!isExpanded && !chunkData.isLoaded) {
            await this.loadContent(header, chunkData);
        }

        this.updateReadingProgress(chunkData.content);
    }

    async loadContent(header, chunkData) {
        try {
            // Simulate dynamic content loading if needed
            if (chunkData.content.dataset.src) {
                const response = await fetch(chunkData.content.dataset.src);
                const data = await response.text();
                chunkData.content.innerHTML = data;
            }

            chunkData.isLoaded = true;
            this.setupIntersectionObserverForImages(chunkData.content);
            this.initializeReadingTracking(chunkData.content);
        } catch (error) {
            console.error('Error loading content:', error);
            chunkData.content.innerHTML = '<p>Error loading content. Please try again later.</p>';
        }
    }

    setupIntersectionObserverForImages(container) {
        const imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            },
            { rootMargin: '50px' }
        );

        container.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    initializeReadingTracking(content) {
        let lastKnownY = window.scrollY;
        const progressData = this.readingProgress.get(content);

        if (!progressData) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const currentY = window.scrollY;
                    const isScrollingDown = currentY > lastKnownY;
                    lastKnownY = currentY;

                    if (entry.isIntersecting && isScrollingDown) {
                        const progress = (entry.intersectionRatio * 100).toFixed(0);
                        progressData.bar.style.width = `${progress}%`;
                        progressData.lastPosition = progress;
                    }
                });
            },
            {
                threshold: Array.from({ length: 100 }, (_, i) => i / 100)
            }
        );

        observer.observe(content);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chunk = entry.target;
                const header = chunk.querySelector('.chunk-header');
                const chunkData = this.contentChunks.get(header);

                if (chunkData && !chunkData.isLoaded && chunkData.importance === 'high') {
                    this.loadContent(header, chunkData);
                }
            }
        });
    }

    optimizeHiddenContent() {
        this.contentChunks.forEach((data, header) => {
            if (header.getAttribute('aria-expanded') === 'false' && data.importance !== 'high') {
                data.content.innerHTML = '';
                data.isLoaded = false;
            }
        });
    }

    handleMemoryPressure(pressure) {
        if (pressure === 'critical') {
            this.optimizeHiddenContent();
        }
    }
}

class InteractionManager {
    constructor() {
        this.setupCardInteractions();
        this.setupFormFeedback();
        this.setupLoadingStates();
        this.setupNavigationFeedback();
    }

    setupCardInteractions() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });
        });
    }

    setupFormFeedback() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                
                try {
                    submitBtn.classList.add('loading');
                    // Simulate form submission
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    submitBtn.classList.remove('loading');
                    form.classList.add('success');
                    setTimeout(() => form.classList.remove('success'), 1000);
                    
                    // Optional: Clear form
                    form.reset();
                } catch (error) {
                    submitBtn.classList.remove('loading');
                    form.classList.add('error');
                    setTimeout(() => form.classList.remove('error'), 1000);
                }
            });
        });
    }

    setupLoadingStates() {
        document.querySelectorAll('[data-loading]').forEach(element => {
            element.addEventListener('click', () => {
                element.classList.add('loading');
                setTimeout(() => element.classList.remove('loading'), 1000);
            });
        });
    }

    setupNavigationFeedback() {
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === window.location.pathname) {
                    e.preventDefault();
                    link.classList.add('error');
                    setTimeout(() => link.classList.remove('error'), 500);
                }
            });
        });
    }
}

// Initialize both managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.memoryOptimizer = new MemoryOptimizer();
    window.interactionManager = new InteractionManager();
}); 
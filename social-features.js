class SocialFeatures {
    constructor() {
        this.visitorCount = this.getStoredVisitorCount();
        this.testimonials = this.getStoredTestimonials();
        this.shareCount = this.getStoredShareCount();
        this.setupVisitorCounter();
        this.setupTestimonials();
        this.setupSocialSharing();
    }

    // Visitor Counter Methods
    getStoredVisitorCount() {
        return JSON.parse(localStorage.getItem('visitorCount')) || {
            total: 0,
            active: Math.floor(Math.random() * 5) + 1
        };
    }

    updateVisitorCount() {
        // Simulate real-time visitors
        setInterval(() => {
            const change = Math.random() > 0.5 ? 1 : -1;
            this.visitorCount.active = Math.max(1, 
                Math.min(10, this.visitorCount.active + change));
            this.updateVisitorDisplay();
        }, 30000);

        // Increment total visitors and show notification
        this.visitorCount.total++;
        this.showNewVisitorNotification();
        this.updateVisitorDisplay();
        localStorage.setItem('visitorCount', JSON.stringify(this.visitorCount));
    }

    updateVisitorDisplay() {
        const counter = document.querySelector('.visitor-count');
        if (counter) {
            counter.textContent = `${this.visitorCount.active} online • ${this.visitorCount.total} total`;
        }
    }

    showNewVisitorNotification() {
        const notification = document.createElement('div');
        notification.className = 'visitor-notification';
        notification.textContent = 'New visitor arrived! 👋';
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after animation
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    setupVisitorCounter() {
        const counter = document.createElement('div');
        counter.className = 'visitor-counter';
        counter.innerHTML = `
            <span class="visitor-icon">👥</span>
            <span class="visitor-count"></span>
        `;
        document.body.appendChild(counter);
        this.updateVisitorCount();
    }

    // Testimonials Methods
    getStoredTestimonials() {
        return JSON.parse(localStorage.getItem('testimonials')) || [];
    }

    addTestimonial(data) {
        const testimonial = {
            id: Date.now(),
            name: data.name,
            role: data.role,
            content: data.content,
            date: new Date().toISOString(),
            avatar: data.name.charAt(0).toUpperCase()
        };

        this.testimonials.unshift(testimonial);
        localStorage.setItem('testimonials', JSON.stringify(this.testimonials));
        this.renderTestimonials();
        return testimonial;
    }

    renderTestimonials() {
        const container = document.querySelector('.testimonials-grid');
        if (!container) return;

        container.innerHTML = this.testimonials.map(testimonial => `
            <div class="testimonial-card ${testimonial.id === this.testimonials[0].id ? 'new-testimonial' : ''}">
                <div class="testimonial-header">
                    <div class="testimonial-avatar">${testimonial.avatar}</div>
                    <div class="testimonial-info">
                        <h3>${testimonial.name}</h3>
                        <div class="testimonial-date">
                            ${new Date(testimonial.date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div class="testimonial-content">
                    <p>${testimonial.content}</p>
                </div>
            </div>
        `).join('');
    }

    setupTestimonials() {
        const form = document.querySelector('.testimonial-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    role: formData.get('role'),
                    content: formData.get('content')
                };
                this.addTestimonial(data);
                form.reset();
            });
        }
        this.renderTestimonials();
    }

    // Social Sharing Methods
    getStoredShareCount() {
        return JSON.parse(localStorage.getItem('shareCount')) || {};
    }

    setupSocialSharing() {
        document.querySelectorAll('.share-button').forEach(button => {
            const platform = button.dataset.platform;
            const count = this.shareCount[platform] || 0;
            const countEl = button.querySelector('.share-count');
            if (countEl) {
                countEl.textContent = count;
            }

            button.addEventListener('click', () => this.handleShare(platform));
        });
    }

    handleShare(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        let shareUrl;

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            this.incrementShareCount(platform);
        }
    }

    incrementShareCount(platform) {
        this.shareCount[platform] = (this.shareCount[platform] || 0) + 1;
        localStorage.setItem('shareCount', JSON.stringify(this.shareCount));
        
        const countEl = document.querySelector(`[data-platform="${platform}"] .share-count`);
        if (countEl) {
            countEl.textContent = this.shareCount[platform];
        }
    }
}

// Initialize social features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.socialFeatures = new SocialFeatures();
}); 
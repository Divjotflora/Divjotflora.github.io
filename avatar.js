class AvatarAgent {
    constructor() {
        this.container = document.querySelector('.ai-avatar');
        this.messageEl = this.container.querySelector('.avatar-message');
        this.avatarImage = this.container.querySelector('.avatar-image');
        this.actionsMenu = this.container.querySelector('.avatar-actions');
        this.currentState = 'happy';
        this.isFirstVisit = !localStorage.getItem('lastVisit');
        this.setupEventListeners();
        this.initializeAvatar();
    }

    initializeAvatar() {
        // Set up returning visitor recognition
        const lastVisit = localStorage.getItem('lastVisit');
        const username = localStorage.getItem('username');
        
        if (this.isFirstVisit) {
            this.showWelcomeMessage();
        } else {
            this.showReturningVisitorMessage(username);
        }

        // Update last visit time
        localStorage.setItem('lastVisit', new Date().toISOString());
        
        // Initialize avatar state
        this.setState('happy');
    }

    setState(state) {
        this.currentState = state;
        this.avatarImage.setAttribute('data-state', state);
    }

    async setMessage(message, state = null) {
        this.messageEl.classList.add('typing');
        await this.wait(1000);
        this.messageEl.textContent = message;
        this.messageEl.classList.remove('typing');
        
        if (state) {
            this.setState(state);
        }
    }

    setupEventListeners() {
        // Toggle actions menu
        this.container.addEventListener('click', (e) => {
            if (!e.target.closest('.avatar-action-btn')) {
                this.actionsMenu.classList.toggle('show');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.actionsMenu.classList.remove('show');
            }
        });

        // Setup action button handlers
        this.setupActionButtons();

        // Track user activity
        this.setupActivityTracking();
    }

    setupActionButtons() {
        // Get all action buttons
        const actionButtons = this.container.querySelectorAll('.avatar-action-btn');

        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent menu toggle
                const action = button.getAttribute('data-action');
                this.handleAction(action);
            });
        });
    }

    async handleAction(action) {
        switch (action) {
            case 'tour':
                this.startTour();
                break;
            case 'help':
                this.showHelp();
                break;
            case 'navigate':
                this.showNavigation();
                break;
            case 'theme':
                this.toggleTheme();
                break;
        }
        this.actionsMenu.classList.remove('show');
    }

    async startTour() {
        this.setState('excited');
        await this.setMessage("Let me show you around! First, let's look at the main sections.");
        
        const sections = ['about', 'projects', 'skills', 'contact'];
        for (const section of sections) {
            await this.wait(2000);
            this.setState('thinking');
            await this.setMessage(`Here's the ${section} section...`);
            const element = document.querySelector(`#${section}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

        await this.wait(1000);
        this.setState('happy');
        await this.setMessage("That's our quick tour! Click me anytime for help!");
    }

    async showHelp() {
        this.setState('helpful');
        await this.setMessage("I can help you with:");
        await this.wait(1000);
        await this.setMessage("• Navigation\n• Finding information\n• Theme customization\n• And more!");
    }

    async showNavigation() {
        this.setState('thinking');
        const sections = ['About', 'Projects', 'Skills', 'Contact'];
        await this.setMessage("Where would you like to go? Click me again to choose!");
        
        // Create temporary navigation buttons
        const nav = document.createElement('div');
        nav.className = 'avatar-nav-options';
        sections.forEach(section => {
            const btn = document.createElement('button');
            btn.className = 'avatar-action-btn';
            btn.textContent = section;
            btn.onclick = () => this.provideNavigation(section.toLowerCase());
            nav.appendChild(btn);
        });
        
        this.messageEl.appendChild(nav);
    }

    async toggleTheme() {
        this.setState('excited');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        await this.setMessage(`Theme changed to ${newTheme} mode! How's that?`, 'happy');
    }

    showWelcomeMessage() {
        this.setMessage("Hi! I'm your AI assistant. Click me to see what I can do!", 'excited');
        this.container.classList.add('greeting');
        this.promptForName();
    }

    showReturningVisitorMessage(username) {
        const timeOfDay = this.getTimeOfDay();
        const message = username 
            ? `Good ${timeOfDay}, ${username}! Click me for assistance!` 
            : `Good ${timeOfDay}! Click me for assistance!`;
        
        this.setMessage(message, 'happy');
    }

    promptForName() {
        if (!localStorage.getItem('username')) {
            setTimeout(() => {
                const name = prompt('What should I call you?');
                if (name) {
                    localStorage.setItem('username', name);
                    this.setMessage(`Nice to meet you, ${name}! I'm here to help.`, 'excited');
                }
            }, 2000);
        }
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    }

    setupActivityTracking() {
        let idleTime = 0;
        const idleInterval = setInterval(() => {
            idleTime++;
            if (idleTime > 2) { // After 2 minutes of inactivity
                this.offerAssistance();
            }
        }, 60000); // Check every minute

        // Reset idle time on user activity
        const resetIdle = () => {
            idleTime = 0;
        };

        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetIdle);
        });
    }

    offerAssistance() {
        if (!this.messageEl.classList.contains('typing')) {
            this.setState('thinking');
            this.setMessage("Need help finding anything?", 'helpful');
        }
    }

    async provideNavigation(section) {
        this.setState('thinking');
        await this.setMessage(`Let me help you find the ${section} section...`);
        
        // Smooth scroll to section
        const element = document.querySelector(`#${section}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            await this.wait(1000);
            this.setMessage(`Here's the ${section} section!`, 'happy');
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize avatar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const avatar = new AvatarAgent();
}); 
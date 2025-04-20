// Context Manager Class
class ContextManager {
    constructor() {
        this.currentTheme = 'light';
        this.deviceCapabilities = {};
        this.userPreferences = {
            reducedMotion: false,
            theme: 'auto'
        };

        // Initialize
        this.detectDeviceCapabilities();
        this.setupTimeBasedFeatures();
        this.setupLocationFeatures();
        this.initializeThemeSystem();
        this.setupEventListeners();
    }

    // Device Capability Detection
    detectDeviceCapabilities() {
        this.deviceCapabilities = {
            touchScreen: ('ontouchstart' in window),
            highPerformance: !this.isLowEndDevice(),
            screenSize: this.getScreenCategory(),
            connection: this.getConnectionType(),
            memory: navigator.deviceMemory || 4,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };

        // Apply performance optimizations
        this.optimizeForDevice();
    }

    isLowEndDevice() {
        return (
            !window.requestAnimationFrame ||
            (navigator.deviceMemory && navigator.deviceMemory < 4) ||
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
        );
    }

    getScreenCategory() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    getConnectionType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return connection ? connection.effectiveType : '4g';
    }

    // Time-based Features
    setupTimeBasedFeatures() {
        const updateTimeBasedFeatures = () => {
            const hour = new Date().getHours();
            
            // Auto theme based on time
            if (this.userPreferences.theme === 'auto') {
                this.setTheme(hour >= 18 || hour < 6 ? 'dark' : 'light');
            }

            // Adjust color temperature
            this.adjustColorTemperature(hour);
        };

        // Update every hour
        updateTimeBasedFeatures();
        setInterval(updateTimeBasedFeatures, 3600000);
    }

    // Location Features
    setupLocationFeatures() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                // Get user's timezone and locale
                this.localeSetup();
            });
        }
    }

    async localeSetup() {
        try {
            const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_API_KEY&format=json&by=position&lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`);
            const data = await response.json();
            this.timezone = data.zoneName;
            
            // Adjust content based on timezone
            this.localizeContent();
        } catch (error) {
            console.log('Timezone detection failed, using browser default');
        }
    }

    // Theme System
    initializeThemeSystem() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
            this.userPreferences.theme = savedTheme;
        } else {
            // Check system preferences
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
            if (this.userPreferences.theme === 'auto') {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        if (theme === this.currentTheme) return;

        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme); // Save theme preference

        // Update theme-specific elements
        this.updateThemeElements(theme);
    }

    // Performance Optimization
    optimizeForDevice() {
        if (!this.deviceCapabilities.highPerformance) {
            // Reduce animations
            document.body.classList.add('reduce-animations');
            
            // Optimize images
            this.optimizeImages();
            
            // Reduce parallax effects
            document.body.classList.add('reduce-parallax');
        }

        // Adjust for connection speed
        if (this.deviceCapabilities.connection === 'slow-2g' || 
            this.deviceCapabilities.connection === '2g') {
            this.enableLowBandwidthMode();
        }
    }

    optimizeImages() {
        document.querySelectorAll('img').forEach(img => {
            if (this.deviceCapabilities.connection === 'slow-2g' || 
                this.deviceCapabilities.connection === '2g') {
                // Load low-res versions
                img.src = img.src.replace('original', 'low-res');
            }
        });
    }

    enableLowBandwidthMode() {
        document.body.classList.add('low-bandwidth');
        // Disable non-essential features
        this.disableNonEssentialFeatures();
    }

    // Event Listeners
    setupEventListeners() {
        // Add theme toggle listener
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
                this.userPreferences.theme = newTheme;
            });
        }

        // Listen for device orientation changes
        window.addEventListener('orientationchange', () => {
            this.deviceCapabilities.screenSize = this.getScreenCategory();
            this.optimizeForDevice();
        });

        // Listen for online/offline events
        window.addEventListener('online', () => this.handleConnectivityChange(true));
        window.addEventListener('offline', () => this.handleConnectivityChange(false));

        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseNonEssentialOperations();
            } else {
                this.resumeOperations();
            }
        });
    }

    // Utility Methods
    adjustColorTemperature(hour) {
        let temperature = '6500K'; // Default
        if (hour >= 18 || hour < 6) {
            temperature = '3500K'; // Warmer at night
        } else if (hour < 9 || hour >= 16) {
            temperature = '5000K'; // Slightly warm during morning/evening
        }

        document.documentElement.style.setProperty('--color-temperature', temperature);
    }

    localizeContent() {
        // Format dates and times
        document.querySelectorAll('[data-localize-date]').forEach(element => {
            const timestamp = element.getAttribute('data-timestamp');
            const date = new Date(parseInt(timestamp));
            element.textContent = date.toLocaleDateString();
        });
    }

    updateThemeElements(theme) {
        // Update theme-specific images
        document.querySelectorAll('[data-theme-src]').forEach(img => {
            img.src = img.getAttribute(`data-${theme}-src`);
        });

        // Update theme-specific colors
        const colors = theme === 'dark' ? {
            primary: '#ffffff',
            background: '#1a1a1a',
            text: '#ffffff'
        } : {
            primary: '#2d3436',
            background: '#f5f6fa',
            text: '#2d3436'
        };

        Object.entries(colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--${key}-color`, value);
        });
    }

    pauseNonEssentialOperations() {
        // Pause animations and non-essential background tasks
        document.body.classList.add('reduced-activity');
    }

    resumeOperations() {
        document.body.classList.remove('reduced-activity');
    }

    handleConnectivityChange(isOnline) {
        document.body.classList.toggle('offline-mode', !isOnline);
        if (!isOnline) {
            this.enableLowBandwidthMode();
        } else {
            this.optimizeForDevice();
        }
    }

    disableNonEssentialFeatures() {
        // Disable heavy animations
        document.body.classList.add('minimal-mode');
        
        // Remove non-critical elements
        document.querySelectorAll('.non-essential').forEach(element => {
            element.style.display = 'none';
        });
    }
}

// Initialize Context Manager
document.addEventListener('DOMContentLoaded', () => {
    window.contextManager = new ContextManager();
}); 
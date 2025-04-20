// Audio Manager Class
class AudioManager {
    constructor() {
        this.sounds = {
            hover: new Audio('sounds/hover.mp3'),
            click: new Audio('sounds/click.mp3'),
            submit: new Audio('sounds/submit.mp3')
        };

        this.ambientSounds = {
            home: new Audio('sounds/ambient-home.mp3'),
            projects: new Audio('sounds/ambient-projects.mp3'),
            skills: new Audio('sounds/ambient-skills.mp3')
        };

        this.currentAmbient = null;
        this.isMuted = false;
        this.volume = 0.5;

        // Initialize all audio elements
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.2;
        });

        Object.values(this.ambientSounds).forEach(sound => {
            sound.volume = 0.1;
            sound.loop = true;
        });

        this.initializeControls();
        this.setupEventListeners();
    }

    initializeControls() {
        // Create audio control panel
        const controls = document.createElement('div');
        controls.className = 'audio-controls';
        controls.innerHTML = `
            <button class="audio-toggle" aria-label="Toggle Sound">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path class="sound-on" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    <path class="sound-off" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
            </button>
            <div class="volume-slider">
                <input type="range" min="0" max="100" value="50" class="slider" aria-label="Volume Control">
            </div>
        `;
        document.body.appendChild(controls);

        // Initialize controls
        this.toggleButton = controls.querySelector('.audio-toggle');
        this.volumeSlider = controls.querySelector('.volume-slider input');
        
        // Set initial states
        this.updateToggleButton();
        this.volumeSlider.value = this.volume * 100;
    }

    setupEventListeners() {
        // Toggle mute
        this.toggleButton.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            this.updateToggleButton();
            this.updateVolume();
        });

        // Volume control
        this.volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            this.updateVolume();
        });

        // Interaction sounds
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a, button, .card')) {
                this.playSound('hover');
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('a, button')) {
                this.playSound('click');
            }
        });

        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                this.playSound('submit');
            }
        });

        // Section-based ambient sounds
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.dataset.ambient) {
                    this.playAmbient(entry.target.dataset.ambient);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-ambient]').forEach(section => {
            observer.observe(section);
        });
    }

    playSound(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;
        
        // Clone the audio to allow overlapping sounds
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = this.volume * 0.2;
        sound.play().catch(() => {});
    }

    playAmbient(soundName) {
        if (this.currentAmbient === soundName) return;
        
        // Fade out current ambient sound
        if (this.currentAmbient && this.ambientSounds[this.currentAmbient]) {
            const current = this.ambientSounds[this.currentAmbient];
            this.fadeOut(current);
        }

        // Fade in new ambient sound
        if (this.ambientSounds[soundName]) {
            const newAmbient = this.ambientSounds[soundName];
            newAmbient.currentTime = 0;
            newAmbient.volume = 0;
            this.fadeIn(newAmbient);
            this.currentAmbient = soundName;
        }
    }

    fadeOut(audio, duration = 1000) {
        const steps = 20;
        const step = duration / steps;
        const volumeStep = audio.volume / steps;

        const fade = setInterval(() => {
            if (audio.volume > volumeStep) {
                audio.volume -= volumeStep;
            } else {
                audio.pause();
                audio.volume = 0;
                clearInterval(fade);
            }
        }, step);
    }

    fadeIn(audio, duration = 1000) {
        const targetVolume = this.isMuted ? 0 : this.volume * 0.1;
        const steps = 20;
        const step = duration / steps;
        const volumeStep = targetVolume / steps;

        audio.play().catch(() => {});
        
        const fade = setInterval(() => {
            if (audio.volume < targetVolume - volumeStep) {
                audio.volume += volumeStep;
            } else {
                audio.volume = targetVolume;
                clearInterval(fade);
            }
        }, step);
    }

    updateToggleButton() {
        this.toggleButton.classList.toggle('muted', this.isMuted);
        this.toggleButton.setAttribute('aria-label', this.isMuted ? 'Unmute Sound' : 'Mute Sound');
    }

    updateVolume() {
        const effectiveVolume = this.isMuted ? 0 : this.volume;
        
        // Update UI
        this.volumeSlider.value = this.volume * 100;
        
        // Update ambient sound
        if (this.currentAmbient && this.ambientSounds[this.currentAmbient]) {
            this.ambientSounds[this.currentAmbient].volume = effectiveVolume * 0.1;
        }
    }
}

// Initialize audio manager
// const audioManager = new AudioManager(); 

const sound = document.getElementById('sound');
const playSound = () => {
    sound.currentTime = 0; // to resest it
    sound.play();
};

document.addEventListener('click', function(){
    playSound();
    console.log("clicked");
});
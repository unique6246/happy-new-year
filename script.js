g// Mobile-Optimized New Year Surprise
document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // TESTING FLAG - SET TO TRUE FOR IMMEDIATE TESTING
    // ======================
    const TEST_MODE = false; // Set to true to test immediately, false for real countdown
    
    // Initialize variables
    let celebrationTriggered = false;
    let newYearReached = false;
    let autoMessageInterval;
    
    // DOM Elements
    const bgMusic = document.getElementById('bg-music');
    const celebrationSound = document.getElementById('celebration-sound');
    const clickSound = document.getElementById('click-sound');
    const heartbeatSound = document.getElementById('heartbeat-sound');
    const unlockSound = document.getElementById('unlock-sound');
    const continueBtn = document.getElementById('continue-btn');
    const loveMeter = document.getElementById('love-meter');
    const progressBarInitial = document.getElementById('progress-bar-initial');
    const progressTextInitial = document.getElementById('progress-text-initial');
    const autoMessage = document.getElementById('auto-message');
    
    // Page sections
    const initialCountdown = document.getElementById('initial-countdown');
    const mainContainer = document.getElementById('main-container');
    const celebrationMessage = document.getElementById('celebration-message');
    const celebrationOverlay = document.getElementById('celebration-overlay');
    
    // Popup elements
    const resolutionPopup = document.getElementById('resolution-popup');
    const memoryGallery = document.getElementById('memory-gallery');
    const closeResolution = document.getElementById('close-resolution');
    const closeGallery = document.getElementById('close-gallery');
    
    // Initial countdown elements
    const initialDaysEl = document.getElementById('initial-days');
    const initialHoursEl = document.getElementById('initial-hours');
    const initialMinutesEl = document.getElementById('initial-minutes');
    const initialSecondsEl = document.getElementById('initial-seconds');
    
    // Test button (will be created if in test mode)
    let testButton = null;
    
    // Initialize
    init();
    
    function init() {
        // Set initial volume
        bgMusic.volume = 0.5;
        celebrationSound.volume = 0.7;
        clickSound.volume = 0.3;
        heartbeatSound.volume = 0.2;
        unlockSound.volume = 0.5;
        
        // Create visual effects
        createFireworks();
        createHearts();
        createSparkles();
        
        // If in test mode, create test button and trigger immediately
        if (TEST_MODE) {
            createTestButton();
            // Trigger celebration after a short delay
            setTimeout(() => {
                triggerNewYearCelebration();
            }, 1000);
        } else {
            // Normal mode: Start countdown
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
        
        // Start auto messages
        startAutoMessages();
        
        // Setup event listeners
        setupEventListeners();
        
        // Check if it's already New Year (only in normal mode)
        if (!TEST_MODE) {
            checkNewYearStatus();
        }
        
        // Enable scrolling on initial countdown
        enableScrolling();
    }
    
    function createTestButton() {
        // Create a test button for quick testing
        testButton = document.createElement('button');
        testButton.id = 'test-button';
        testButton.innerHTML = '🎯 TEST: Trigger New Year Now';
        testButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(45deg, #FF4081, #FF8C00);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            z-index: 10000;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.3s;
        `;
        
        testButton.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            if (!celebrationTriggered) {
                triggerNewYearCelebration();
            } else {
                // If celebration already triggered, show message
                alert("New Year celebration already in progress! 🎉");
            }
        });
        
        testButton.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        testButton.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(testButton);
        
        // Also show test indicator in countdown
        progressTextInitial.textContent = "TEST MODE: Click button below →";
        initialDaysEl.textContent = '00';
        initialHoursEl.textContent = '00';
        initialMinutesEl.textContent = '00';
        initialSecondsEl.textContent = '00';
        progressBarInitial.style.width = '100%';
        
        // Add test instruction
        const testInstruction = document.createElement('div');
        testInstruction.innerHTML = `
            <div style="
                background: rgba(255, 64, 129, 0.2);
                border: 2px solid #FF4081;
                border-radius: 15px;
                padding: 20px;
                margin-top: 30px;
                text-align: center;
            ">
                <h3 style="color: #FF4081; margin-bottom: 10px;">
                    <i class="fas fa-vial"></i> Test Mode Active
                </h3>
                <p style="margin-bottom: 15px;">
                    Click the floating test button or wait 1 second to trigger the New Year celebration!
                </p>
                <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <button onclick="document.getElementById('test-button').click()" style="
                        background: #FF4081;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 20px;
                        cursor: pointer;
                    ">
                        <i class="fas fa-play"></i> Trigger Now
                    </button>
                    <button onclick="resetTest()" style="
                        background: #4A00E0;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 20px;
                        cursor: pointer;
                    ">
                        <i class="fas fa-redo"></i> Reset Test
                    </button>
                </div>
            </div>
        `;
        
        document.querySelector('.countdown-instruction').appendChild(testInstruction);
        
        // Add global reset function
        window.resetTest = function() {
            celebrationTriggered = false;
            newYearReached = false;
            celebrationMessage.classList.remove('active');
            celebrationOverlay.style.opacity = '0';
            mainContainer.style.display = 'none';
            mainContainer.classList.remove('visible');
            initialCountdown.classList.remove('hidden');
            initialCountdown.style.display = 'block';
            document.body.style.overflow = 'auto';
            bgMusic.pause();
            bgMusic.currentTime = 0;
            
            // Clear any existing intervals
            if (autoMessageInterval) {
                clearInterval(autoMessageInterval);
            }
            
            // Show test message
            progressTextInitial.textContent = "TEST MODE: Click button below →";
            
            // Re-enable test button
            if (testButton) {
                testButton.style.display = 'block';
            }
            
            alert("Test reset! Click the test button to start again.");
        };
    }
    
    function enableScrolling() {
        // Allow scrolling on the initial countdown page
        document.body.style.overflow = 'auto';
        if (initialCountdown) {
            initialCountdown.style.overflowY = 'auto';
            initialCountdown.style.minHeight = '100vh';
        }
    }
    
    // Visual Effects
    function createFireworks() {
        const container = document.getElementById('fireworks-container');
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800'];
        
        for (let i = 0; i < 15; i++) {
            createFirework(container, colors);
        }
        
        // Add more fireworks periodically after New Year
        setInterval(() => {
            if (!newYearReached) return;
            for (let i = 0; i < 5; i++) {
                createFirework(container, colors);
            }
        }, 3000);
    }
    
    function createFirework(container, colors) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        // Random position
        firework.style.left = `${Math.random() * 100}vw`;
        firework.style.top = `${Math.random() * 100}vh`;
        
        // Random color
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size
        const size = Math.random() * 4 + 2;
        firework.style.width = `${size}px`;
        firework.style.height = `${size}px`;
        
        // Random animation
        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 1;
        
        // Create animation
        const keyframes = `
            @keyframes firework-${Date.now()} {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        firework.style.animation = `firework-${Date.now()} ${duration}s ease-out ${delay}s forwards`;
        
        container.appendChild(firework);
        
        // Clean up
        setTimeout(() => {
            if (firework.parentNode) {
                firework.remove();
            }
        }, (duration + delay) * 1000);
    }
    
    function createHearts() {
        const container = document.getElementById('hearts-container');
        
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤️';
            
            // Random position
            heart.style.left = `${Math.random() * 100}vw`;
            
            // Random animation delay
            heart.style.animationDelay = `${Math.random() * 5}s`;
            
            // Random size
            const size = Math.random() * 1.2 + 0.8;
            heart.style.fontSize = `${size}rem`;
            
            container.appendChild(heart);
        }
    }
    
    function createSparkles() {
        const container = document.getElementById('sparkles-container');
        
        for (let i = 0; i < 30; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.innerHTML = '✨';
            
            // Random position
            sparkle.style.position = 'absolute';
            sparkle.style.left = `${Math.random() * 100}vw`;
            sparkle.style.top = `${Math.random() * 100}vh`;
            
            // Random animation
            sparkle.style.animation = `sparkle ${Math.random() * 3 + 2}s infinite`;
            sparkle.style.fontSize = `${Math.random() * 1 + 0.8}rem`;
            sparkle.style.opacity = Math.random() * 0.5 + 0.3;
            
            container.appendChild(sparkle);
        }
    }
    
    // Countdown Functions
    function updateCountdown() {
        if (celebrationTriggered) return;
        
        const now = new Date();
        const currentYear = 2025;
        const newYear = new Date(`January 1, ${currentYear + 1} 00:00:00`);
        const diff = newYear - now;
        
        // Check if New Year has arrived
        if (diff <= 0) {
            if (!celebrationTriggered) {
                triggerNewYearCelebration();
            }
            return;
        }
        
        // Update countdown display
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        initialDaysEl.textContent = days.toString().padStart(2, '0');
        initialHoursEl.textContent = hours.toString().padStart(2, '0');
        initialMinutesEl.textContent = minutes.toString().padStart(2, '0');
        initialSecondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // Update progress bar
        const totalSecondsInYear = 365 * 24 * 60 * 60 * 1000;
        const progress = ((totalSecondsInYear - diff) / totalSecondsInYear) * 100;
        progressBarInitial.style.width = `${progress}%`;
        progressTextInitial.textContent = `${Math.round(progress)}% to My Message`;
    }
    
    function checkNewYearStatus() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const newYear = new Date(`January 1, ${currentYear + 1} 00:00:00`);
        
        if (now >= newYear) {
            triggerNewYearCelebration();
        }
    }
    
    // New Year Celebration
    function triggerNewYearCelebration() {
        if (celebrationTriggered) return;
        
        celebrationTriggered = true;
        newYearReached = true;
        
        // Hide test button if it exists
        if (testButton) {
            testButton.style.display = 'none';
        }
        
        // Update countdown to zeros
        initialDaysEl.textContent = '00';
        initialHoursEl.textContent = '00';
        initialMinutesEl.textContent = '00';
        initialSecondsEl.textContent = '00';
        progressBarInitial.style.width = '100%';
        progressTextInitial.textContent = TEST_MODE ? 'TEST: Message Unlocked! 🎉' : 'Message Unlocked! 🎉';
        
        // Play celebration sound
        celebrationSound.play().catch(e => console.log("Celebration sound failed:", e));
        
        // Play unlock sound
        setTimeout(() => {
            unlockSound.play().catch(e => console.log("Unlock sound failed:", e));
        }, 500);
        
        // Disable scrolling during transition
        document.body.style.overflow = 'hidden';
        
        // Hide initial countdown with animation
        setTimeout(() => {
            initialCountdown.classList.add('hidden');
            
            // Show celebration message after countdown hides
            setTimeout(() => {
                celebrationMessage.classList.add('active');
                celebrationOverlay.style.opacity = '1';
                
                // Add celebration effects
                createConfettiBurst();
                createHeartExplosion();
                
                // Vibrate if supported
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200]);
                }
                
                // Re-enable scrolling for the modal
                document.body.style.overflow = 'auto';
            }, 500);
        }, 1000);
        
        // Auto-play background music
        setTimeout(() => {
            bgMusic.play().catch(e => {
                console.log("Background music play failed:", e);
            });
        }, 2000);
        
        // Update title
        document.title = TEST_MODE ? "🎯 TEST: Happy New Year, My Love! 🎉" : "🎉 Happy New Year, My Love! 🎉";
        
        // Update love meter animation
        if (loveMeter) {
            loveMeter.style.animation = 'meter-glow 1s infinite alternate';
        }
        
        // Create continuous celebration effects
        startContinuousCelebration();
    }
    
    function createConfettiBurst() {
        const container = document.getElementById('confetti-container');
        const colors = ['#FF0080', '#4A00E0', '#ffff00', '#00ffff', '#ff8800'];
        
        // Create 100 pieces of confetti
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-10px';
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 6 + 3}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '2px';
            confetti.style.opacity = '0';
            
            // Animation
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 1;
            confetti.style.animation = `confetti-fall ${duration}s ease-in ${delay}s forwards`;
            
            container.appendChild(confetti);
            
            // Clean up
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, (duration + delay) * 1000);
        }
    }
    
    function createHeartExplosion() {
        const container = document.getElementById('hearts-container');
        const heartTypes = ['❤️', '💖', '💕', '💗', '💓', '💞'];
        
        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
            heart.style.position = 'absolute';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = `${Math.random() * 2 + 1.5}rem`;
            heart.style.color = '#FF4081';
            heart.style.opacity = '0';
            heart.style.transform = 'translate(-50%, -50%)';
            
            // Random explosion animation
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 200 + 100;
            const duration = Math.random() * 2 + 1;
            
            heart.style.animation = `
                heart-explosion ${duration}s ease-out forwards
            `;
            
            // Add keyframes
            const keyframes = `
                @keyframes heart-explosion-${Date.now()} {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(0);
                    }
                    20% {
                        opacity: 1;
                        transform: translate(
                            ${Math.cos(angle) * distance}px,
                            ${Math.sin(angle) * distance}px
                        ) scale(1.2);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(
                            ${Math.cos(angle) * distance * 1.5}px,
                            ${Math.sin(angle) * distance * 1.5}px
                        ) scale(0);
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);
            
            heart.style.animationName = `heart-explosion-${Date.now()}`;
            
            container.appendChild(heart);
            
            // Clean up
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, duration * 1000);
        }
    }
    
    function startContinuousCelebration() {
        // Periodic confetti
        setInterval(() => {
            if (newYearReached) {
                createConfettiBurst();
            }
        }, 5000);
        
        // Periodic heartbeat sound
        setInterval(() => {
            if (newYearReached) {
                heartbeatSound.currentTime = 0;
                heartbeatSound.play().catch(e => console.log("Audio play failed:", e));
            }
        }, 10000);
    }
    
    // Auto Messages
    function startAutoMessages() {
        const messages = [
            "LOVE YOU ALWAYS AND FOREVER ❤️"
        ];

        if (!autoMessage) return;

        let messageIndex = 0;

        // Clear any old interval
        if (autoMessageInterval) {
            clearInterval(autoMessageInterval);
        }

        // Show first message immediately
        autoMessage.querySelector('span').textContent = messages[messageIndex];

        autoMessageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            autoMessage.querySelector('span').textContent = messages[messageIndex];
        }, 3600000); // every hour
    }
    
    // Event Listeners
    function setupEventListeners() {
        // Continue celebration button - shows main content
        continueBtn.addEventListener('click', function() {
            clickSound.play().catch(e => console.log("Click sound failed:", e));
            
            // Hide celebration message
            celebrationMessage.classList.remove('active');
            celebrationOverlay.style.opacity = '0';
            bgMusic.currentTime = 0;
            bgMusic.play().catch(() => {});
            // Enable scrolling for main content
            document.body.style.overflow = 'auto';
            
            // Show main container with animation
            setTimeout(() => {
                mainContainer.style.display = 'block';
                setTimeout(() => {
                    mainContainer.classList.add('visible');
                    // Scroll to top of main content
                    window.scrollTo(0, 0);
                    // Start auto messages now
                    startAutoMessages();
                }, 50);
            }, 300);
        });
        
        continueBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            continueBtn.click();
        });
        
        // Close buttons
        closeResolution.addEventListener('click', function() {
            resolutionPopup.classList.remove('active');
            clickSound.play().catch(e => console.log("Click sound failed:", e));
        });
        
        closeGallery.addEventListener('click', function() {
            memoryGallery.classList.remove('active');
            clickSound.play().catch(e => console.log("Click sound failed:", e));
        });
        
        // Close popups when clicking outside
        resolutionPopup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
        
        memoryGallery.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
        
        // Touch feedback for all buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
            
            button.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            });
            
            button.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });
    }
    
    // Prevent pull-to-refresh on mobile
    document.addEventListener('touchmove', function(e) {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        // Brief timeout to allow orientation to complete
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });

});

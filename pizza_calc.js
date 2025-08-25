// PizzaCalc Pro™ Enterprise Edition
// Professional Pizza Resource Management System
// Version 2.0.1 - Stable Release

(function() {
    'use strict';
    
    // Global madness tracking
    let madnessLevel = 0;
    let calculationCount = 0;
    let totalTimeSpent = 0;
    let startTime = Date.now();
    let totalPizzasOrdered = 0;
    let totalBudgetSpent = 0;
    
    // Achievement System
    const achievements = {
        firstCalculation: { 
            id: 'first_calc',
            name: 'Hello World', 
            description: 'Successfully compiled your first pizza order',
            icon: '👋',
            unlocked: false
        },
        tenCalculations: {
            id: 'ten_calcs',
            name: 'For Loop Master',
            description: 'Iterated through 10 pizza calculations',
            icon: '🔁',
            unlocked: false
        },
        fiftyPizzas: {
            id: 'fifty_pizzas',
            name: 'Stack Overflow',
            description: 'Ordered 50+ pizzas total (hope you have the storage)',
            icon: '📚',
            unlocked: false
        },
        bigSpender: {
            id: 'big_spender',
            name: 'Enterprise License',
            description: 'Spent over $500 on pizza (expense report required)',
            icon: '💳',
            unlocked: false
        },
        madnessReached: {
            id: 'madness_5',
            name: 'Undefined Behavior',
            description: 'System stability questionable (madness level 5)',
            icon: '🤪',
            unlocked: false
        },
        totalChaos: {
            id: 'madness_10',
            name: 'Kernel Panic',
            description: 'Complete system failure achieved',
            icon: '💀',
            unlocked: false
        },
        pizzaParty: {
            id: 'party_size',
            name: 'Scrum Master',
            description: 'Calculated for 20+ team members',
            icon: '🎉',
            unlocked: false
        },
        allNighter: {
            id: 'hackathon',
            name: 'git push --force',
            description: 'Ordered pizza for a 24-hour session',
            icon: '🌙',
            unlocked: false
        },
        minMaxer: {
            id: 'min_max',
            name: 'Edge Case Tester',
            description: 'Tested with 1 person and 500 people',
            icon: '🧪',
            unlocked: false
        },
        speedRunner: {
            id: 'speed_run',
            name: 'Agile Developer',
            description: 'Completed 5 calculations in 30 seconds',
            icon: '⚡',
            unlocked: false
        },
        longSession: {
            id: 'long_session',
            name: 'Memory Leak',
            description: 'Used calculator for over 5 minutes straight',
            icon: '⏰',
            unlocked: false
        },
        partyPizza: {
            id: 'party_pizza',
            name: 'Microservices Architecture',
            description: 'Selected party size pizza (distributed system)',
            icon: '🍕',
            unlocked: false
        },
        hungryCrew: {
            id: 'hungry_crew',
            name: 'Buffer Overflow',
            description: 'Set hunger to critical post-deploy stress',
            icon: '🍖',
            unlocked: false
        },
        resetMaster: {
            id: 'reset_master',
            name: 'git reset --hard',
            description: 'Reset the form 10 times (commitment issues)',
            icon: '♻️',
            unlocked: false
        },
        pizzaProphet: {
            id: 'pizza_prophet',
            name: 'Machine Learning Expert',
            description: 'The system learned your preferences',
            icon: '🔮',
            unlocked: false
        }
    };
    
    let resetCount = 0;
    let speedRunStart = Date.now();
    let speedRunCount = 0;
    let testedMin = false;
    let testedMax = false;
    
    // Check and unlock achievements
    function checkAchievements(context) {
        const unlocked = [];
        
        // First calculation
        if (!achievements.firstCalculation.unlocked && calculationCount === 1) {
            achievements.firstCalculation.unlocked = true;
            achievements.firstCalculation.unlockedAt = new Date().toISOString();
            unlocked.push(achievements.firstCalculation);
        }
        
        // Ten calculations
        if (!achievements.tenCalculations.unlocked && calculationCount >= 10) {
            achievements.tenCalculations.unlocked = true;
            achievements.tenCalculations.unlockedAt = new Date().toISOString();
            unlocked.push(achievements.tenCalculations);
        }
        
        // Fifty pizzas
        if (!achievements.fiftyPizzas.unlocked && totalPizzasOrdered >= 50) {
            achievements.fiftyPizzas.unlocked = true;
            achievements.fiftyPizzas.unlockedAt = new Date().toISOString();
            unlocked.push(achievements.fiftyPizzas);
        }
        
        // Big spender
        if (!achievements.bigSpender.unlocked && totalBudgetSpent >= 500) {
            achievements.bigSpender.unlocked = true;
            achievements.bigSpender.unlockedAt = new Date().toISOString();
            unlocked.push(achievements.bigSpender);
        }
        
        // Madness levels
        if (!achievements.madnessReached.unlocked && madnessLevel >= 5) {
            achievements.madnessReached.unlocked = true;
            achievements.madnessReached.unlockedAt = new Date().toISOString();
            unlocked.push(achievements.madnessReached);
        }
        
        if (!achievements.totalChaos.unlocked && madnessLevel >= 10) {
            achievements.totalChaos.unlocked = true;
            achievements.totalChaos.unlockedAt = new Date().toISOString();
            unlocked.push(achievements.totalChaos);
        }
        
        // Context-specific achievements
        if (context) {
            if (context.teamSize >= 20 && !achievements.pizzaParty.unlocked) {
                achievements.pizzaParty.unlocked = true;
                achievements.pizzaParty.unlockedAt = new Date().toISOString();
                unlocked.push(achievements.pizzaParty);
            }
            
            if (context.duration === 24 && !achievements.allNighter.unlocked) {
                achievements.allNighter.unlocked = true;
                achievements.allNighter.unlockedAt = new Date().toISOString();
                unlocked.push(achievements.allNighter);
            }
            
            if (context.pizzaType === 'party' && !achievements.partyPizza.unlocked) {
                achievements.partyPizza.unlocked = true;
                achievements.partyPizza.unlockedAt = new Date().toISOString();
                unlocked.push(achievements.partyPizza);
            }
            
            if (context.hunger === 3 && !achievements.hungryCrew.unlocked) {
                achievements.hungryCrew.unlocked = true;
                achievements.hungryCrew.unlockedAt = new Date().toISOString();
                unlocked.push(achievements.hungryCrew);
            }
            
            // Min/Max testing
            if (context.teamSize === 1) testedMin = true;
            if (context.teamSize === 500) testedMax = true;
            if (testedMin && testedMax && !achievements.minMaxer.unlocked) {
                achievements.minMaxer.unlocked = true;
                achievements.minMaxer.unlockedAt = new Date().toISOString();
                unlocked.push(achievements.minMaxer);
            }
        }
        
        // Speed runner
        const now = Date.now();
        if (now - speedRunStart < 30000) {
            speedRunCount++;
            if (speedRunCount >= 5 && !achievements.speedRunner.unlocked) {
                achievements.speedRunner.unlocked = true;
                achievements.speedRunner.unlockedAt = new Date().toISOString();
                unlocked.push(achievements.speedRunner);
            }
        } else {
            speedRunStart = now;
            speedRunCount = 1;
        }
        
        // Long session
        if ((now - startTime) > 300000 && !achievements.longSession.unlocked) {
            achievements.longSession.unlocked = true;
            achievements.longSession.unlockedAt = new Date().toISOString();
            unlocked.push(achievements.longSession);
        }
        
        // Reset master
        if (resetCount >= 10 && !achievements.resetMaster.unlocked) {
            achievements.resetMaster.unlocked = true;
            achievements.resetMaster.unlockedAt = new Date().toISOString();
            unlocked.push(achievements.resetMaster);
        }
        
        // Pizza prophet (learns after 20 calculations)
        if (calculationCount >= 20 && !achievements.pizzaProphet.unlocked) {
            achievements.pizzaProphet.unlocked = true;
            achievements.pizzaProphet.unlockedAt = new Date().toISOString();
            unlocked.push(achievements.pizzaProphet);
        }
        
        // Show achievement notifications with special effects
        unlocked.forEach((achievement, index) => {
            setTimeout(() => {
                showAchievement(achievement);
                
                // Pulse the achievement tracker button
                const tracker = document.getElementById('achievementTracker');
                if (tracker) {
                    tracker.style.animation = 'pulse 0.5s ease-in-out 3';
                    setTimeout(() => {
                        updateAchievementDisplay(); // Refresh the display after animation
                    }, 1500);
                }
                
                // Special effects for certain achievements
                if (achievement.id === 'firstCalculation') {
                    showToast('Welcome to the Pizza Matrix! 🍕');
                } else if (achievement.id === 'madnessReached') {
                    // Screen starts glitching
                    document.body.style.filter = 'hue-rotate(45deg)';
                    setTimeout(() => {
                        document.body.style.filter = '';
                    }, 2000);
                } else if (achievement.id === 'totalChaos') {
                    // Pizza explosion for total chaos
                    for (let i = 0; i < 30; i++) {
                        setTimeout(() => createFallingPizza(), i * 100);
                    }
                    document.body.style.animation = 'earthquake 0.5s';
                    setTimeout(() => {
                        document.body.style.animation = '';
                    }, 500);
                } else if (achievement.id === 'pizzaProphet') {
                    // Rainbow effect for pizza mastery
                    document.body.style.animation = 'rainbow 3s linear';
                    setTimeout(() => {
                        document.body.style.animation = '';
                    }, 3000);
                    showToast('THE PROPHECY IS FULFILLED! 🍕✨');
                } else if (achievement.id === 'speedRunner') {
                    // Speed lines effect
                    const speedLines = document.createElement('div');
                    speedLines.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, 
                            transparent, rgba(255,255,0,0.3), transparent);
                        animation: speedLines 0.5s linear;
                        pointer-events: none;
                        z-index: 99999;
                    `;
                    document.body.appendChild(speedLines);
                    setTimeout(() => speedLines.remove(), 500);
                } else if (achievement.id === 'pizzaParty') {
                    // Confetti effect
                    for (let i = 0; i < 20; i++) {
                        const confetti = document.createElement('div');
                        confetti.textContent = ['🎉', '🎊', '🍕', '🎈'][Math.floor(Math.random() * 4)];
                        confetti.style.cssText = `
                            position: fixed;
                            top: -50px;
                            left: ${Math.random() * window.innerWidth}px;
                            font-size: 30px;
                            animation: fall 3s linear;
                            pointer-events: none;
                            z-index: 9999;
                        `;
                        document.body.appendChild(confetti);
                        setTimeout(() => confetti.remove(), 3000);
                    }
                }
            }, index * 1500);
        });
        
        // Update achievement display  
        updateAchievementDisplay();
        
        // Save to localStorage
        localStorage.setItem('pizzaAchievements', JSON.stringify(achievements));
    }
    
    // Show achievement notification
    function showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('achievement-styles')) {
            const styles = document.createElement('style');
            styles.id = 'achievement-styles';
            styles.textContent = `
                .achievement-notification {
                    position: fixed;
                    top: 20px;
                    right: -400px;
                    width: 350px;
                    background: white;
                    border: 2px solid var(--corp-primary);
                    border-radius: 8px;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    animation: slideInOut 4s ease;
                }
                
                @keyframes slideInOut {
                    0% { right: -400px; }
                    10% { right: 20px; }
                    90% { right: 20px; }
                    100% { right: -400px; }
                }
                
                .achievement-icon {
                    font-size: 2rem;
                }
                
                .achievement-title {
                    font-size: 0.75rem;
                    color: var(--corp-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .achievement-name {
                    font-weight: 600;
                    color: var(--corp-primary);
                    margin: 0.25rem 0;
                }
                
                .achievement-desc {
                    font-size: 0.875rem;
                    color: var(--corp-text-muted);
                }
                
                .achievement-tracker {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: white;
                    border: 1px solid var(--corp-border);
                    border-radius: 8px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    color: var(--corp-text-muted);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 1000;
                }
                
                .achievement-tracker:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
    
    // Update achievement display
    function updateAchievementDisplay() {
        let tracker = document.getElementById('achievementTracker');
        if (!tracker) {
            tracker = document.createElement('div');
            tracker.id = 'achievementTracker';
            tracker.className = 'achievement-tracker';
            tracker.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${madnessLevel >= 8 ? 'linear-gradient(135deg, #ff0000, #ffff00)' : 'linear-gradient(135deg, #004080, #0066cc)'};
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                z-index: 1000;
                font-weight: bold;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                user-select: none;
                ${madnessLevel >= 5 ? 'animation: gentle-breathe 3s ease-in-out infinite;' : ''}
            `;
            
            // Add hover effect
            tracker.onmouseenter = function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
            };
            tracker.onmouseleave = function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            };
            
            document.body.appendChild(tracker);
        }
        
        const total = Object.keys(achievements).length;
        const unlocked = Object.values(achievements).filter(a => a.unlocked).length;
        const percentage = Math.round((unlocked / total) * 100);
        
        // Update content with progress
        tracker.innerHTML = `
            <span style="font-size: 1.2em;">🏆</span> 
            Achievements: ${unlocked}/${total} 
            <span style="font-size: 0.9em; opacity: 0.9;">(${percentage}%)</span>
        `;
        
        // Update styling based on progress
        if (percentage === 100) {
            tracker.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
            tracker.style.animation = 'pulse 1s ease-in-out infinite, rainbow 5s linear infinite';
        } else if (madnessLevel >= 8) {
            tracker.style.background = 'linear-gradient(135deg, #ff0000, #ffff00)';
        }
        
        // Add click handler to show all achievements
        tracker.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            showAllAchievements();
        };
        
        // Add tooltip
        tracker.title = 'Click to view all achievements';
    }
    
    // Show all achievements modal
    function showAllAchievements() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100000;
            animation: fadeIn 0.3s ease;
            backdrop-filter: blur(2px);
        `;
        
        // Click outside to close
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        };
        
        // Create modal content
        const content = document.createElement('div');
        content.style.cssText = `
            background: ${madnessLevel >= 8 ? 'linear-gradient(45deg, #1a1a1a, #2a2a2a)' : 'white'};
            border-radius: 12px;
            padding: 2rem;
            max-width: 90%;
            width: 800px;
            max-height: 85vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            ${madnessLevel >= 5 ? 'animation: gentle-wobble 4s ease-in-out infinite;' : ''}
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid ${madnessLevel >= 8 ? '#ff0000' : '#004080'};
        `;
        
        const title = document.createElement('h2');
        title.textContent = madnessLevel >= 9 ? '🍕 PIZZA ACHIEVEMENTS 🍕' : 'Corporate Achievement Dashboard';
        title.style.cssText = `
            color: ${madnessLevel >= 8 ? '#ffff00' : '#004080'};
            margin: 0;
            font-size: 1.8rem;
            ${madnessLevel >= 7 ? 'text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);' : ''}
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = madnessLevel >= 9 ? '🍕' : '✕';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: ${madnessLevel >= 8 ? '#ff0000' : '#666'};
            padding: 0.5rem;
        `;
        closeBtn.onclick = () => modal.remove();
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        content.appendChild(header);
        
        // Stats
        const stats = document.createElement('div');
        const achievementArray = Object.values(achievements);
        const unlockedCount = achievementArray.filter(a => a.unlocked).length;
        const totalCount = achievementArray.length;
        const percentage = Math.round((unlockedCount / totalCount) * 100);
        
        stats.innerHTML = `
            <div style="background: ${madnessLevel >= 8 ? '#2a2a2a' : '#f5f5f5'}; 
                        padding: 1rem; 
                        border-radius: 8px; 
                        margin-bottom: 1.5rem;
                        ${madnessLevel >= 6 ? 'border: 2px dashed #ff0000;' : ''}">
                <p style="margin: 0; color: ${madnessLevel >= 8 ? '#00ff00' : '#333'};">
                    <strong>${madnessLevel >= 9 ? 'PIZZA DOMINATION:' : 'Progress:'}</strong> 
                    ${unlockedCount} / ${totalCount} (${percentage}%)
                </p>
                <div style="background: #ddd; height: 20px; border-radius: 10px; margin-top: 0.5rem; overflow: hidden;">
                    <div style="background: ${madnessLevel >= 8 ? 'linear-gradient(90deg, #ff0000, #ffff00, #00ff00)' : 'linear-gradient(90deg, #004080, #0066cc)'}; 
                                width: ${percentage}%; 
                                height: 100%; 
                                transition: width 0.3s ease;
                                ${madnessLevel >= 7 ? 'animation: pulse 1s infinite;' : ''}"></div>
                </div>
            </div>
        `;
        content.appendChild(stats);
        
        // Achievement grid
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
        `;
        
        achievementArray.forEach(achievement => {
            const card = document.createElement('div');
            const isUnlocked = achievement.unlocked;
            
            card.style.cssText = `
                background: ${isUnlocked 
                    ? (madnessLevel >= 8 ? '#1a3a1a' : '#e8f5e9')
                    : (madnessLevel >= 8 ? '#3a1a1a' : '#f5f5f5')};
                border: 2px solid ${isUnlocked 
                    ? (madnessLevel >= 8 ? '#00ff00' : '#4caf50')
                    : (madnessLevel >= 8 ? '#666' : '#ddd')};
                border-radius: 8px;
                padding: 1rem;
                position: relative;
                transition: transform 0.2s ease;
                cursor: pointer;
                ${!isUnlocked ? 'opacity: 0.7;' : ''}
                ${madnessLevel >= 6 && isUnlocked ? 'animation: gentle-breathe 3s ease-in-out infinite;' : ''}
            `;
            
            card.onmouseenter = () => {
                card.style.transform = 'scale(1.05)';
                if (madnessLevel >= 7 && isUnlocked) {
                    card.style.transform = 'scale(1.05) rotate(' + (Math.random() * 6 - 3) + 'deg)';
                }
            };
            card.onmouseleave = () => {
                card.style.transform = 'scale(1)';
            };
            
            // Icon
            const icon = document.createElement('div');
            icon.textContent = isUnlocked ? achievement.icon : '🔒';
            icon.style.cssText = `
                font-size: 2rem;
                margin-bottom: 0.5rem;
                ${isUnlocked && madnessLevel >= 7 ? 'animation: spin 3s linear infinite;' : ''}
            `;
            
            // Title
            const titleEl = document.createElement('h4');
            titleEl.textContent = achievement.name;
            titleEl.style.cssText = `
                margin: 0.5rem 0;
                color: ${madnessLevel >= 8 
                    ? (isUnlocked ? '#ffff00' : '#999')
                    : (isUnlocked ? '#2e7d32' : '#666')};
                font-size: 1rem;
            `;
            
            // Description
            const desc = document.createElement('p');
            desc.textContent = isUnlocked ? achievement.description : '???';
            desc.style.cssText = `
                margin: 0;
                font-size: 0.85rem;
                color: ${madnessLevel >= 8 ? '#ccc' : '#666'};
                ${!isUnlocked ? 'font-style: italic;' : ''}
            `;
            
            // Unlock date
            if (isUnlocked && achievement.unlockedAt) {
                const date = document.createElement('div');
                const unlockedDate = new Date(achievement.unlockedAt);
                date.textContent = madnessLevel >= 9 
                    ? '🍕 ' + unlockedDate.toLocaleString()
                    : 'Achieved: ' + unlockedDate.toLocaleDateString();
                date.style.cssText = `
                    margin-top: 0.5rem;
                    font-size: 0.7rem;
                    color: ${madnessLevel >= 8 ? '#888' : '#999'};
                `;
                card.appendChild(date);
            }
            
            card.appendChild(icon);
            card.appendChild(titleEl);
            card.appendChild(desc);
            
            grid.appendChild(card);
        });
        
        content.appendChild(grid);
        
        // Footer with secret message
        if (percentage === 100) {
            const footer = document.createElement('div');
            footer.style.cssText = `
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 2px solid ${madnessLevel >= 8 ? '#ff0000' : '#004080'};
                text-align: center;
            `;
            footer.innerHTML = `
                <p style="color: ${madnessLevel >= 8 ? '#ffff00' : '#004080'}; 
                          font-weight: bold;
                          ${madnessLevel >= 9 ? 'animation: rainbow 2s linear infinite;' : ''}">
                    ${madnessLevel >= 9 
                        ? '🍕 YOU ARE THE PIZZA MASTER! THE PROPHECY IS COMPLETE! 🍕'
                        : '🎉 Congratulations! You\'ve achieved maximum corporate synergy!'}
                </p>
            `;
            content.appendChild(footer);
        }
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Add fade-in animation
        modal.style.animation = 'fadeIn 0.3s ease';
    }
    
    // Maxis-style loading messages that gradually get weird
    const loadingMessages = [
        // Level 0: Completely professional
        [
            "Initializing resource allocation system...",
            "Loading team appetite profiles...",
            "Analyzing meeting duration parameters...",
            "Calculating optimal distribution...",
            "Generating procurement recommendations..."
        ],
        
        // Level 1-2: Professional with slight personality
        [
            "Reticulating splines...",
            "Adjusting for local pizza availability...",
            "Factoring in dietary preferences...",
            "Optimizing delivery logistics...",
            "Applying standard deviation to hunger metrics..."
        ],
        
        // Level 3-4: SimCity style quirky
        [
            "Consulting the pizza advisory board...",
            "Downloading latest cheese firmware...",
            "Establishing secure connection to Pizza Hub...",
            "Running Monte Carlo simulations on toppings...",
            "Deploying hunger assessment drones..."
        ],
        
        // Level 5-6: IT humor creeping in
        [
            "Migrating appetite data to cloud...",
            "Executing stored procedure: sp_GetPizza...",
            "Cache miss! Recalculating from scratch...",
            "Applying machine learning to crust preferences...",
            "Docker container 'pizza-calc' starting..."
        ],
        
        // Level 7-8: Full IT madness
        [
            "sudo apt-get install more-cheese...",
            "Git merge conflict in toppings branch...",
            "Stack overflow in hunger calculation...",
            "Kubernetes pods scaling to handle appetite...",
            "npm WARN: 47,293 pizza vulnerabilities found..."
        ],
        
        // Level 9-10: Complete chaos
        [
            "SEGFAULT: Core dumped (extra cheese)...",
            "Pizza daemon summoned successfully...",
            "Reality.exe has stopped responding...",
            "ALL YOUR PIZZA ARE BELONG TO US",
            "🍕 ACHIEVING PIZZA SINGULARITY 🍕"
        ]
    ];
    
    // Track page interactions
    let mouseMovements = 0;
    let clickCount = 0;
    let keyPresses = 0;
    
    document.addEventListener('mousemove', () => {
        mouseMovements++;
        checkMadnessProgression();
    });
    
    document.addEventListener('click', () => {
        clickCount++;
        checkMadnessProgression();
    });
    
    document.addEventListener('keypress', () => {
        keyPresses++;
        checkMadnessProgression();
    });
    
    // Check and progress madness level
    function checkMadnessProgression() {
        const timeSpent = (Date.now() - startTime) / 1000; // seconds
        const interactionScore = (mouseMovements / 100) + (clickCount * 2) + (keyPresses * 1.5);
        const timeScore = timeSpent / 30; // Every 30 seconds adds to madness
        
        const newMadnessLevel = Math.min(10, Math.floor(
            (calculationCount * 2) + (timeScore * 0.5) + (interactionScore * 0.1)
        ));
        
        if (newMadnessLevel > madnessLevel) {
            madnessLevel = newMadnessLevel;
            applyMadnessEffects();
        }
    }
    
    // Apply visual and behavioral changes based on madness
    function applyMadnessEffects() {
        const body = document.body;
        
        // Remove all previous madness classes
        for (let i = 0; i <= 10; i++) {
            body.classList.remove(`madness-${i}`);
        }
        
        // Apply current madness class
        if (madnessLevel > 0) {
            body.classList.add(`madness-${madnessLevel}`);
        }
        
        // Update madness indicator
        const indicator = document.getElementById('madnessIndicator');
        const madnessText = document.getElementById('madnessText');
        
        const statusMessages = [
            "System Status: Normal",
            "System Status: Optimal",
            "System Status: Elevated",
            "System Status: Warming Up",
            "System Status: Interesting...",
            "System Status: Spicy 🌶️",
            "System Status: ELEVATED",
            "System Status: CRITICAL",
            "SYSTEM STATUS: MAXIMUM",
            "SY5T3M ST4TU5: CH405",
            "🍕🍕🍕 PIZZA MODE 🍕🍕🍕"
        ];
        
        madnessText.textContent = statusMessages[madnessLevel];
        
        if (madnessLevel >= 3) {
            indicator.classList.add('visible');
        }
        
        // Apply progressive UI changes
        applyProgressiveChanges();
    }
    
    function applyProgressiveChanges() {
        // Level 1-2: Subtle changes
        if (madnessLevel >= 1) {
            document.querySelector('.brand-name').textContent = 'PizzaCalc Pro™';
        }
        
        if (madnessLevel >= 2) {
            document.querySelector('.version-badge').textContent = 'Enterprise v2.0.1 (Stable)';
        }
        
        // Level 3-4: Text starts changing
        if (madnessLevel >= 3) {
            document.querySelector('.card-subtitle').textContent = 
                'Optimize pizza ordering for technical team meetings and intense debugging sessions';
            document.querySelector('.brand-name').textContent = 'PizzaCalc Pro™ 🍕';
        }
        
        if (madnessLevel >= 4) {
            document.querySelector('.version-badge').textContent = 'v2.0.1 (Mostly Stable)';
            document.querySelectorAll('.form-helper')[0].textContent = 'How many hungry developers?';
        }
        
        // Level 5-6: More obvious changes
        if (madnessLevel >= 5) {
            document.querySelector('.card-title').textContent = 'Pizza Resource Allocation Calculator';
            document.querySelector('.logo').textContent = '🍕';
            addRandomEmojis();
        }
        
        if (madnessLevel >= 6) {
            document.querySelector('.version-badge').textContent = 'v2.?.? (Stability Optional)';
            document.querySelector('.card-subtitle').textContent = 
                'Because debugging requires cheese-based fuel ⚡';
            makeButtonsNervous();
        }
        
        // Level 7-8: Things get weird
        if (madnessLevel >= 7) {
            document.querySelector('.brand-name').innerHTML = 'Pizza<span style="color: red;">Calc</span> Pro™ 🍕🔥';
            document.querySelector('.card-title').textContent = '🍕 PIZZA CALCULATION MATRIX 🍕';
            addGlitchText();
        }
        
        if (madnessLevel >= 8) {
            document.querySelector('.version-badge').textContent = 'v?.?.? (CHAOS MODE)';
            document.body.style.fontFamily = '"Comic Sans MS", cursive';
            startRandomToasts();
        }
        
        // Level 9-10: Complete chaos
        if (madnessLevel >= 9) {
            document.querySelector('.brand-name').innerHTML = '🍕 PIZZA 🍕 CALC 🍕 PRO 🍕';
            unleashFullChaos();
        }
        
        if (madnessLevel >= 10) {
            document.title = '🍕🍕🍕 PIZZA TIME 🍕🍕🍕';
            pizzaApocalypse();
        }
    }
    
    // Add random emojis to inputs
    function addRandomEmojis() {
        const emojis = ['🍕', '🧀', '🍅', '🌶️', '🥓', '🍄'];
        document.querySelectorAll('.form-helper').forEach(helper => {
            if (Math.random() > 0.7) {
                helper.textContent += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
            }
        });
    }
    
    // Make buttons nervous (shake on hover)
    function makeButtonsNervous() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                if (Math.random() > 0.5) {
                    this.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);
                }
            });
        });
    }
    
    // Add glitch effect to text
    function addGlitchText() {
        const glitchTargets = document.querySelectorAll('.card-title, .form-label');
        glitchTargets.forEach(target => {
            if (Math.random() > 0.8) {
                const originalText = target.textContent;
                const glitched = originalText.split('').map(char => 
                    Math.random() > 0.9 ? String.fromCharCode(Math.random() * 100 + 33) : char
                ).join('');
                target.textContent = glitched;
                setTimeout(() => {
                    target.textContent = originalText;
                }, 100);
            }
        });
        
        if (madnessLevel >= 7) {
            setTimeout(addGlitchText, 3000);
        }
    }
    
    // Random toast messages
    function startRandomToasts() {
        const messages = [
            "Pizza is the answer",
            "Have you tried turning it off and on again?",
            "Undefined is not a topping",
            "404: Vegetables not found",
            "Segmentation fault (core dumped)",
            "Pizza overflow detected",
            "Warning: Low cheese levels",
            "Critical: Pineapple detected"
        ];
        
        if (Math.random() > 0.8 && madnessLevel >= 8) {
            showToast(messages[Math.floor(Math.random() * messages.length)]);
            setTimeout(startRandomToasts, 5000);
        }
    }
    
    // Full chaos mode
    function unleashFullChaos() {
        // Random button text changes
        document.querySelectorAll('.btn').forEach(btn => {
            if (Math.random() > 0.5) {
                const chaosText = ['CALCULATE!!!', 'FEED ME', 'MOAR PIZZA', 'DO IT', 'PIZZA TIME', 'CLICK ME'];
                btn.querySelector('span').textContent = chaosText[Math.floor(Math.random() * chaosText.length)];
            }
        });
        
        // Add pizza rain occasionally
        if (Math.random() > 0.7) {
            for (let i = 0; i < 5; i++) {
                createFallingPizza();
            }
        }
    }
    
    // The pizza apocalypse
    function pizzaApocalypse() {
        document.body.style.animation = 'total-chaos 0.5s infinite';
        
        // Everything becomes pizza
        document.querySelectorAll('input[type="number"], select').forEach(input => {
            if (Math.random() > 0.5) {
                input.value = '🍕';
            }
        });
        
        // Pizza invasion
        setInterval(() => {
            if (Math.random() > 0.8) {
                const pizza = document.createElement('div');
                pizza.textContent = '🍕';
                pizza.style.position = 'fixed';
                pizza.style.fontSize = Math.random() * 50 + 20 + 'px';
                pizza.style.left = Math.random() * window.innerWidth + 'px';
                pizza.style.top = Math.random() * window.innerHeight + 'px';
                pizza.style.zIndex = '9999';
                pizza.style.pointerEvents = 'none';
                pizza.style.animation = 'spin 2s linear infinite';
                document.body.appendChild(pizza);
                setTimeout(() => pizza.remove(), 3000);
            }
        }, 500);
    }
    
    // Create falling pizza animation
    function createFallingPizza() {
        const pizza = document.createElement('div');
        pizza.textContent = '🍕';
        pizza.style.position = 'fixed';
        pizza.style.fontSize = '30px';
        pizza.style.left = Math.random() * window.innerWidth + 'px';
        pizza.style.top = '-50px';
        pizza.style.zIndex = '9998';
        pizza.style.pointerEvents = 'none';
        pizza.style.transition = 'top 3s linear';
        document.body.appendChild(pizza);
        
        setTimeout(() => {
            pizza.style.top = window.innerHeight + 'px';
        }, 10);
        
        setTimeout(() => pizza.remove(), 3000);
    }
    
    // Toast notification system
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = madnessLevel >= 7 ? 'linear-gradient(45deg, #ff0000, #ffff00)' : '#333';
        toast.style.color = 'white';
        toast.style.padding = '1rem 2rem';
        toast.style.borderRadius = '8px';
        toast.style.zIndex = '10000';
        toast.style.animation = 'slideIn 0.3s ease';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    // Main calculation function with accurate math
    window.calculatePizza = function() {
        calculationCount++;
        checkMadnessProgression();
        
        const teamSize = parseInt(document.getElementById('teamSize').value);
        const duration = parseInt(document.getElementById('duration').value);
        const hunger = parseFloat(document.getElementById('hunger').value);
        const pizzaType = document.getElementById('pizzaType').value;
        
        // Show loading overlay
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        const loadingSubtext = document.getElementById('loadingSubtext');
        
        overlay.classList.add('active');
        
        // Select loading messages based on madness level
        const messageLevel = Math.min(Math.floor(madnessLevel / 2), loadingMessages.length - 1);
        const messageSet = loadingMessages[messageLevel];
        let messageIndex = 0;
        
        // Cycle through loading messages
        const messageInterval = setInterval(() => {
            if (messageIndex < messageSet.length) {
                loadingText.textContent = messageSet[messageIndex];
                
                // Add increasingly weird subtexts
                const subtexts = [
                    "Optimizing for maximum satisfaction",
                    "Cross-referencing with historical data",
                    "Applying Six Sigma methodology",
                    "Consulting the pizza oracle",
                    "Deploying appetite assessment algorithms",
                    "Reticulating splines recursively",
                    "THE CHEESE REMEMBERS",
                    "PIZZA.EXE HAS TAKEN CONTROL",
                    "🍕 RESISTANCE IS FUTILE 🍕",
                    "🍕🍕🍕 PIZZA SINGULARITY ACHIEVED 🍕🍕🍕"
                ];
                
                loadingSubtext.textContent = subtexts[Math.min(madnessLevel, subtexts.length - 1)];
                messageIndex++;
            }
        }, 600);
        
        // Calculate results with accurate pizza math
        setTimeout(() => {
            clearInterval(messageInterval);
            overlay.classList.remove('active');
            
            // Pizza size configurations (realistic)
            const slicesPerPizza = {
                'standard': 8,   // 14" pizza
                'large': 10,     // 16" pizza
                'xl': 12,        // 18" pizza
                'party': 16      // 20"+ pizza
            }[pizzaType];
            
            // Base consumption rates (slices per person per hour)
            // Studies show average person eats 2-3 slices in a sitting
            const baseConsumptionRate = {
                1: 2,      // 1 hour - just a snack
                2: 2.5,    // 2 hours - standard meeting
                4: 3,      // 4 hours - working lunch
                8: 4,      // 8 hours - full day (includes lunch)
                16: 6,     // 16 hours - hackathon (multiple meals)
                24: 8      // 24 hours - emergency (3 meals)
            }[duration] || 2.5;
            
            // Apply hunger multiplier
            const adjustedConsumption = baseConsumptionRate * hunger;
            
            // Total slices needed
            const totalSlicesNeeded = Math.ceil(teamSize * adjustedConsumption);
            
            // Add 10% buffer for safety (no one wants to run out)
            const slicesWithBuffer = Math.ceil(totalSlicesNeeded * 1.1);
            
            // Calculate pizzas needed
            const pizzasNeeded = Math.ceil(slicesWithBuffer / slicesPerPizza);
            const totalSlices = pizzasNeeded * slicesPerPizza;
            const slicesPerPerson = Math.floor(totalSlices / teamSize);
            
            // Calculate realistic budget
            const pricePerPizza = {
                'standard': 12.99,
                'large': 15.99,
                'xl': 18.99,
                'party': 24.99
            }[pizzaType];
            
            // Add chaos to calculations at higher madness levels
            let displayPizzas = pizzasNeeded;
            let displayBudget = (pizzasNeeded * pricePerPizza).toFixed(2);
            
            if (madnessLevel >= 5) {
                displayPizzas += Math.floor(Math.random() * 5);
            }
            if (madnessLevel >= 7) {
                displayPizzas = displayPizzas * 2 + Math.floor(Math.random() * 10);
            }
            if (madnessLevel >= 9) {
                displayPizzas = 42; // The answer to everything
            }
            if (madnessLevel >= 10) {
                displayPizzas = '∞';
                displayBudget = 'YES';
            }
            
            // Track totals for achievements
            totalPizzasOrdered += pizzasNeeded;
            totalBudgetSpent += parseFloat(displayBudget);
            
            // Check achievements with context
            checkAchievements({
                teamSize: teamSize,
                duration: duration,
                hunger: hunger,
                pizzaType: pizzaType,
                pizzasOrdered: pizzasNeeded,
                budget: parseFloat(displayBudget)
            });
            
            // Display results
            document.getElementById('totalPizzas').textContent = displayPizzas;
            document.getElementById('totalSlices').textContent = 
                madnessLevel >= 10 ? '∞' : totalSlices;
            document.getElementById('perPerson').textContent = 
                madnessLevel >= 10 ? 'ALL' : slicesPerPerson;
            document.getElementById('budget').textContent = 
                madnessLevel >= 10 ? '$YES' : `$${displayBudget}`;
            
            // Add bonus metrics based on madness level
            addBonusMetrics(pizzasNeeded, teamSize, duration);
            
            document.getElementById('results').classList.add('visible');
            
            // Add celebration at high madness
            if (madnessLevel >= 8) {
                celebrate();
            }
        }, 2000 + (madnessLevel * 200)); // Loading gets longer with madness
    };
    
    // Celebration animation
    function celebrate() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createFallingPizza(), i * 100);
        }
        
        if (madnessLevel >= 10) {
            document.body.style.animation = 'total-chaos 0.5s';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 500);
        }
    }
    
    // Reset form function
    window.resetForm = function() {
        document.getElementById('pizzaForm').reset();
        document.getElementById('results').classList.remove('visible');
        
        // Track resets for achievement
        resetCount++;
        checkAchievements();
        
        // Random chance to increase madness on reset
        if (Math.random() > 0.7) {
            madnessLevel = Math.min(10, madnessLevel + 1);
            applyMadnessEffects();
        }
    };
    
    // Corporate buzzword generator
    const corporateBuzzwords = {
        normal: ['synergize', 'optimize', 'leverage', 'streamline', 'implement', 'facilitate'],
        medium: ['actualize', 'incentivize', 'revolutionize', 'gamify', 'disrupt', 'pivot'],
        insane: ['blockchain-ify', 'quantumize', 'metaverse-enable', 'AI-powered', 'web3-ready', 'NFT-backed']
    };
    
    function generateBuzzword() {
        const level = madnessLevel < 3 ? 'normal' : madnessLevel < 7 ? 'medium' : 'insane';
        const words = corporateBuzzwords[level];
        return words[Math.floor(Math.random() * words.length)];
    }
    
    // Add bonus metrics to results based on madness
    function addBonusMetrics(pizzas, teamSize, duration) {
        if (madnessLevel < 2) return;
        
        const metricsContainer = document.querySelector('.metric-grid');
        if (!metricsContainer) return;
        
        // Remove existing bonus metrics
        document.querySelectorAll('.bonus-metric').forEach(m => m.remove());
        
        const bonusMetrics = [];
        
        if (madnessLevel >= 2) {
            bonusMetrics.push({
                value: Math.floor(Math.random() * 100) + '%',
                label: 'Pizza ROI',
                tooltip: 'Return on Investment (Happiness per Dollar)'
            });
        }
        
        if (madnessLevel >= 3) {
            bonusMetrics.push({
                value: (Math.random() * 10).toFixed(1) + 'x',
                label: 'Productivity Multiplier',
                tooltip: 'Expected increase in code output'
            });
        }
        
        if (madnessLevel >= 4) {
            const synergy = ['Low', 'Medium', 'High', 'MAXIMUM', 'TRANSCENDENT'][Math.floor(Math.random() * 5)];
            bonusMetrics.push({
                value: synergy,
                label: 'Synergy Index',
                tooltip: 'Cross-functional pizza alignment score'
            });
        }
        
        if (madnessLevel >= 5) {
            bonusMetrics.push({
                value: Math.floor(Math.random() * 1000) + ' pts',
                label: 'Pizza Credit Score',
                tooltip: 'Your eligibility for premium toppings'
            });
        }
        
        if (madnessLevel >= 6) {
            const vibes = ['Immaculate', 'Chaotic', 'Feral', 'Ascending', 'Quantum'][Math.floor(Math.random() * 5)];
            bonusMetrics.push({
                value: vibes,
                label: 'Vibe Check',
                tooltip: 'Current team pizza energy levels'
            });
        }
        
        if (madnessLevel >= 7) {
            bonusMetrics.push({
                value: Math.floor(Math.random() * 50) + ' bugs',
                label: 'Bugs Fixed Per Pizza',
                tooltip: 'Scientifically proven correlation'
            });
        }
        
        if (madnessLevel >= 8) {
            bonusMetrics.push({
                value: '🍕'.repeat(Math.floor(Math.random() * 5) + 1),
                label: 'Pizza Happiness Units',
                tooltip: 'Measured in Standard Pizza Emoji'
            });
        }
        
        if (madnessLevel >= 9) {
            bonusMetrics.push({
                value: 'YES',
                label: 'Will It Pizza?',
                tooltip: 'Advanced AI prediction: It will pizza'
            });
        }
        
        // Add bonus metrics to display
        bonusMetrics.forEach((metric, index) => {
            setTimeout(() => {
                const metricDiv = document.createElement('div');
                metricDiv.className = 'metric-item bonus-metric';
                metricDiv.style.cssText = `
                    animation: slideIn 0.5s ease;
                    background: linear-gradient(135deg, #f0f0f0, #ffffff);
                    border: 2px dashed #${Math.floor(Math.random()*16777215).toString(16)};
                `;
                metricDiv.innerHTML = `
                    <div class="metric-value" style="color: #${Math.floor(Math.random()*16777215).toString(16)};">${metric.value}</div>
                    <div class="metric-label" title="${metric.tooltip}">${metric.label}</div>
                `;
                metricsContainer.appendChild(metricDiv);
            }, index * 200);
        });
    }
    
    // Secret Easter Eggs
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activatePizzaMode();
            konamiCode = [];
        }
    });
    
    function activatePizzaMode() {
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        // Pizza rain
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const pizza = document.createElement('div');
                pizza.textContent = '🍕';
                pizza.style.cssText = `
                    position: fixed;
                    top: -50px;
                    left: ${Math.random() * window.innerWidth}px;
                    font-size: ${Math.random() * 30 + 20}px;
                    z-index: 99999;
                    pointer-events: none;
                    animation: fall 3s linear;
                `;
                document.body.appendChild(pizza);
                setTimeout(() => pizza.remove(), 3000);
            }, i * 100);
        }
        
        showToast('🍕 ULTIMATE PIZZA MODE ACTIVATED! 🍕');
        madnessLevel = Math.min(10, madnessLevel + 2);
        applyMadnessEffects();
    }
    
    // Add secret click zones
    let logoClickCount = 0;
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('logo')) {
            logoClickCount++;
            if (logoClickCount >= 7) {
                showToast('You found the secret pizza portal!');
                madnessLevel = Math.min(10, madnessLevel + 1);
                applyMadnessEffects();
                logoClickCount = 0;
            }
        }
    });
    
    // Pizza Emergency Hotline
    function createEmergencyHotline() {
        if (document.getElementById('emergencyHotline')) return;
        
        const hotline = document.createElement('div');
        hotline.id = 'emergencyHotline';
        hotline.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: linear-gradient(135deg, #ff0000, #ff6600);
            color: white;
            padding: 10px 20px;
            border-radius: 30px;
            cursor: pointer;
            z-index: 999;
            font-weight: bold;
            animation: pulse 2s infinite;
            display: none;
        `;
        hotline.innerHTML = '🚨 PIZZA EMERGENCY HOTLINE';
        hotline.onclick = function() {
            const messages = [
                'Hello, you have reached the Pizza Emergency Response Team. All operators are currently eating pizza. Please hold.',
                'ALERT: Critical cheese levels detected. Deploying emergency mozzarella.',
                'Pizza paramedics dispatched. ETA: 30 minutes or it\'s free.',
                'Have you tried turning the pizza off and on again?',
                'Error 404: Pizza not found. Initiating backup protocols.',
                'This is a known issue. Pizza patch 2.0.1 will be deployed next sprint.'
            ];
            alert(messages[Math.floor(Math.random() * messages.length)]);
        };
        document.body.appendChild(hotline);
        
        // Show after 5 calculations
        if (calculationCount >= 5) {
            hotline.style.display = 'block';
        }
    }
    
    // Random IT error popups
    function showRandomError() {
        if (Math.random() > 0.9 && madnessLevel >= 3) {
            const errors = [
                { code: 'PZA-001', msg: 'Pizza buffer overflow detected. Stack trace: cheese > crust capacity' },
                { code: 'PZA-418', msg: 'I\'m a teapot. Cannot make pizza.' },
                { code: 'PZA-503', msg: 'Pizza service unavailable. Retrying with pasta...' },
                { code: 'PZA-BSOD', msg: 'Blue Screen of Dough. Your pizza has encountered a problem and needs to restart.' },
                { code: 'PZA-NULL', msg: 'NullPepperoniException: Cannot invoke pizza.addTopping() on null pizza' },
                { code: 'PZA-MEM', msg: 'Out of memory. Please delete some pizza to continue.' },
                { code: 'PZA-401', msg: 'Unauthorized pizza access. Please authenticate with valid hunger credentials.' },
                { code: 'PZA-SEGFAULT', msg: 'Segmentation fault (core dumped). Pizza core saved to /dev/stomach' }
            ];
            
            const error = errors[Math.floor(Math.random() * errors.length)];
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: ${Math.random() * 60 + 20}%;
                left: ${Math.random() * 60 + 20}%;
                background: white;
                border: 2px solid #ff0000;
                padding: 20px;
                border-radius: 8px;
                z-index: 10000;
                box-shadow: 0 4px 20px rgba(255,0,0,0.3);
                animation: glitch 0.3s;
                max-width: 400px;
            `;
            errorDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: #ff0000; font-weight: bold;">⚠️ ERROR ${error.code}</span>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; font-size: 20px;">✕</button>
                </div>
                <p style="margin: 0; color: #333;">${error.msg}</p>
                <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 15px; background: #ff0000; color: white; border: none; border-radius: 4px; cursor: pointer;">OK</button>
            `;
            document.body.appendChild(errorDiv);
            
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }
    
    // Pizza Mood Detector
    function detectPizzaMood() {
        const moods = [
            { mood: 'Optimistic', desc: 'Team believes in pizza-driven development' },
            { mood: 'Hangry', desc: 'Critical hunger levels detected. Deploy pizza immediately!' },
            { mood: 'Caffeinated', desc: 'High coffee levels detected. Pizza absorption rate increased by 200%' },
            { mood: 'Debugging', desc: 'Stress eating mode activated. Double the cheese!' },
            { mood: 'In Meeting', desc: 'Boredom levels critical. Pizza is the only solution.' },
            { mood: 'Post-Deploy', desc: 'Celebration mode! Or consolation mode. Either way, pizza.' },
            { mood: 'Code Review', desc: 'Passive-aggressive hunger detected. Extra toppings recommended.' },
            { mood: 'Sprint Planning', desc: 'Existential dread levels high. Pizza provides meaning.' }
        ];
        
        const detected = moods[Math.floor(Math.random() * moods.length)];
        
        if (madnessLevel >= 4 && Math.random() > 0.7) {
            const moodDiv = document.createElement('div');
            moodDiv.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                color: white;
                padding: 15px;
                border-radius: 12px;
                max-width: 300px;
                z-index: 1000;
                animation: slideIn 0.5s ease;
            `;
            moodDiv.innerHTML = `
                <h4 style="margin: 0 0 10px 0;">🧠 Pizza Mood Detected</h4>
                <p style="margin: 0 0 5px 0; font-weight: bold;">${detected.mood}</p>
                <p style="margin: 0; font-size: 0.9em; opacity: 0.9;">${detected.desc}</p>
            `;
            document.body.appendChild(moodDiv);
            setTimeout(() => moodDiv.remove(), 4000);
        }
    }
    
    // Add fake premium features
    function addPremiumFeatures() {
        if (madnessLevel >= 6 && !document.getElementById('premiumBanner')) {
            const banner = document.createElement('div');
            banner.id = 'premiumBanner';
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(90deg, #ffd700, #ffed4e);
                color: #333;
                padding: 10px;
                text-align: center;
                z-index: 9999;
                font-weight: bold;
                animation: slideDown 0.5s ease;
            `;
            banner.innerHTML = `
                ⭐ UPGRADE TO PIZZA PREMIUM™ - Unlock: Quantum Toppings, AI Crust Optimization, Blockchain Delivery Tracking ⭐
                <button onclick="alert('Payment failed: Credit card tastes better with ranch dressing')" style="margin-left: 20px; padding: 5px 15px; background: #333; color: #ffd700; border: none; border-radius: 4px; cursor: pointer;">UPGRADE NOW</button>
            `;
            document.body.appendChild(banner);
        }
    }
    
    // Initialize enhancements
    applyMadnessEffects();
    updateAchievementDisplay();
    createEmergencyHotline();
    
    // Enhanced time-based progression
    setInterval(() => {
        checkMadnessProgression();
        showRandomError();
        detectPizzaMood();
        addPremiumFeatures();
    }, 10000);
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translate(-50%, 100px);
                opacity: 0;
            }
            to {
                transform: translate(-50%, 0);
                opacity: 1;
            }
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes earthquake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-1deg); }
            50% { transform: translateX(5px) rotate(1deg); }
            75% { transform: translateX(-3px) rotate(-0.5deg); }
        }
        
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        @keyframes speedLines {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fall {
            0% { 
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% { 
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes gentle-wobble {
            0%, 100% { transform: rotate(-0.5deg); }
            50% { transform: rotate(0.5deg); }
        }
        
        @keyframes gentle-breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
})();
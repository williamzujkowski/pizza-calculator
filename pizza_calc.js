// pizza_calc.js

(function () {
    if (!document.getElementById('pizzaForm')) {
        return;
    }

    // Constants
    const SLICES_PER_PIZZA = 8;
    const DEFAULT_ATTENDEES = 5;
    const DEFAULT_SLICES_PER_PERSON = 3;
    const DEFAULT_HOURS_DEBUGGING = 2;
    const ENTERPRISE_THRESHOLD = 42;
    const PIZZA_STYLES = {
        NY: "1",
        DETROIT: "0.5",
        CHICAGO: "0.6",
        CALIFORNIA: "2",
        HOT_POCKETS: "3",
        BLOCKCHAIN: "100",
        CLOUD: "cloud",
        PINEAPPLE: "pineapple",
        QUANTUM: "quantum" // New quantum pizza option
    };

    // State
    let calculationCompleted = false;
    let pizzaReport = "";

    // DOM elements - cache references for better performance
    const elements = {
        // Initialize with null values
        attendeesInput: null,
        pizzaTypeInput: null,
        hoursDebuggingInput: null,
        slicesPerPersonInput: null,
        resultDiv: null,
        emailPromptSection: null,
        progressBar: null,
        progressLabel: null,
        formFieldset: null,
        toast: null,
        downloadLink: null,
        
        // Initialize function to cache all elements
        init: function() {
            this.attendeesInput = document.getElementById('attendees');
            this.pizzaTypeInput = document.getElementById('pizzaType');
            this.hoursDebuggingInput = document.getElementById('hoursDebugging');
            this.slicesPerPersonInput = document.getElementById('slicesPerPerson');
            this.resultDiv = document.getElementById('result');
            this.emailPromptSection = document.getElementById('emailPromptSection');
            this.progressBar = document.getElementById('progressBar');
            this.progressLabel = document.getElementById('progressLabel');
            this.formFieldset = document.querySelector('#pizzaForm fieldset');
            this.toast = document.getElementById('toast');
            this.downloadLink = document.getElementById('downloadLink');
            return this;
        }
    };
    
    // Initialize element cache
    elements.init();

    // Local storage
    function loadPizzaDefaults() {
        const storage = {
            attendees: localStorage.getItem('pizzaAttendees') || DEFAULT_ATTENDEES,
            slicesPerPerson: localStorage.getItem('pizzaSlicesPerPerson') || DEFAULT_SLICES_PER_PERSON,
            hoursDebugging: localStorage.getItem('pizzaHoursDebugging') || DEFAULT_HOURS_DEBUGGING,
            pizzaType: localStorage.getItem('pizzaType') || PIZZA_STYLES.NY
        };

        if (elements.attendeesInput) elements.attendeesInput.value = storage.attendees;
        if (elements.slicesPerPersonInput) elements.slicesPerPersonInput.value = storage.slicesPerPerson;
        if (elements.hoursDebuggingInput) elements.hoursDebuggingInput.value = storage.hoursDebugging;
        if (elements.pizzaTypeInput) elements.pizzaTypeInput.value = storage.pizzaType;
    }
    
    function savePizzaDefaults() {
        localStorage.setItem('pizzaAttendees', elements.attendeesInput.value);
        localStorage.setItem('pizzaType', elements.pizzaTypeInput.value);
        localStorage.setItem('pizzaSlicesPerPerson', elements.slicesPerPersonInput.value);
        localStorage.setItem('pizzaHoursDebugging', elements.hoursDebuggingInput.value);
    }

    // Debounce function to prevent rapid recalculations
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Utility function for style management - reduces inline styles
    const styleUtils = {
        // Create an object to cache created style tags
        styleCache: {},
        
        // Add a CSS class dynamically
        createClass: function(className, cssRules) {
            // Check if this class already exists
            if (this.styleCache[className]) return className;
            
            // Create a new style element if needed
            let styleTag = document.getElementById('dynamic-styles');
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'dynamic-styles';
                document.head.appendChild(styleTag);
            }
            
            // Add the new class
            const styleSheet = styleTag.sheet;
            const ruleText = `.${className} { ${cssRules} }`;
            styleSheet.insertRule(ruleText, styleSheet.cssRules.length);
            
            // Cache it
            this.styleCache[className] = true;
            return className;
        }
    };
    
    // Initialize
    loadPizzaDefaults();
    checkPizzaOptions();
    initializeButtons();

    // Check existing pizza options - an optimization from the original duplicate option code
    function checkPizzaOptions() {
        if (!elements.pizzaTypeInput) return;
        
        // No need to add options since they're already in the HTML
        console.log("Pizza options loaded successfully");
    }

    // Button initialization
    function initializeButtons() {
        if (!elements.formFieldset) return;
        
        // Create a dedicated button container div with proper styling
        let buttonContainer = document.querySelector('.advanced-button-group');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.className = 'advanced-button-group';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexWrap = 'wrap';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.marginTop = '20px';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.borderTop = '1px solid rgba(0,0,0,0.1)';
            buttonContainer.style.paddingTop = '20px';
            
            // Add a heading for the advanced buttons section
            const heading = document.createElement('div');
            heading.textContent = 'Advanced Features';
            heading.style.width = '100%';
            heading.style.textAlign = 'center';
            heading.style.marginBottom = '15px';
            heading.style.fontWeight = 'bold';
            heading.style.fontSize = '0.9rem';
            heading.style.color = '#666';
            buttonContainer.appendChild(heading);
            
            elements.formFieldset.appendChild(buttonContainer);
        }
        
        // Add buttons only if they don't already exist
        if (!document.querySelector('button[data-function="ai-toppings"]')) {
            // AI Toppings button
            const aiBtn = createButton('Generate AI Toppings', () => {
                showAIToppings();
            }, 'fas fa-robot');
            aiBtn.dataset.function = "ai-toppings";
            aiBtn.title = "Let AI suggest random tech-themed toppings";
            buttonContainer.appendChild(aiBtn);
        }

        if (!document.querySelector('button[data-function="copy-report"]')) {
            // Copy to Clipboard button
            const copyBtn = createButton('Copy Report to Clipboard', () => {
                copyReportToClipboard();
            }, 'fas fa-clipboard');
            copyBtn.dataset.function = "copy-report";
            copyBtn.title = "Copy calculation results to clipboard";
            copyBtn.classList.add('button-subtle');
            buttonContainer.appendChild(copyBtn);
        }

        if (!document.querySelector('button[data-function="chaos-monkey"]')) {
            // Chaos Monkey button (new)
            const chaosBtn = createButton('Unleash Chaos Monkey', () => {
                runChaosMonkey();
            }, 'fas fa-bomb');
            chaosBtn.dataset.function = "chaos-monkey";
            chaosBtn.title = "Test the pizza calculator's resilience";
            chaosBtn.classList.add('button-secondary');
            buttonContainer.appendChild(chaosBtn);
        }
        
        if (!document.querySelector('button[data-function="tech-debt"]')) {
            // Technical Debt Analysis button (new)
            const techDebtBtn = createButton('Technical Debt Analysis', () => {
                const techDebtData = getTechnicalDebtData();
                showTechDebtDetails(techDebtData);
            }, 'fas fa-credit-card');
            techDebtBtn.dataset.function = "tech-debt";
            techDebtBtn.title = "Calculate the technical debt accrued from pizza consumption";
            techDebtBtn.classList.add('button-subtle');
            buttonContainer.appendChild(techDebtBtn);
        }
    }

    function createButton(text, onClick, iconClass = null) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = onClick;
        
        // If an icon class is provided, create an icon
        if (iconClass) {
            const icon = document.createElement('i');
            icon.className = iconClass;
            btn.appendChild(icon);
            
            const span = document.createElement('span');
            span.textContent = text;
            btn.appendChild(span);
        } else {
            btn.textContent = text;
        }
        
        return btn;
    }

    // AI Toppings generator with enhanced features
    window.generateAIToppings = function(count = 3) {
        // Topping categories
        const techToppings = [
            "Pepperoni++",
            "Quantum Pineapple Bits",
            "AI-Generated Olives",
            "Crypto-Sauce",
            "Extra Cheese Layer v2.0",
            "NaN-tilla Chips",
            "Recursive Bacon (Bacon inside Bacon)",
            "Kubernetes Clusters",
            "Byte-sized Pepperoni",
            "IPv6 Olives (there's always too many)",
            "Serverless Sausage",
            "Docker Container Cheese",
            "Git Merge Mushrooms",
            "Blockchain Basil",
            "RAID Array Arugula",
            "Agile Anchovies",
            "Machine Learning Meatballs",
            "Big Data Dough"
        ];
        
        const programmingToppings = [
            "Python Peppers",
            "Java Jalapeños",
            "C++ Croutons",
            "Ruby Red Onions",
            "Swift Sausage",
            "Perl Pepperoncini",
            "Rust Roasted Garlic",
            "Go Gorgonzola",
            "React Red Peppers",
            "TypeScript Tomatoes",
            "Angular Artichokes",
            "Vue Vanilla Extract",
            "Scala Scallions",
            "Kotlin Kraut",
            "MySQL Mushrooms",
            "Bash Bacon Bits",
            "Flutter Feta",
            "Node Nut Sprinkles"
        ];
        
        const errorToppings = [
            "404 Not Found Feta", 
            "Null Pointer Nuts",
            "Undefined Umami",
            "Syntax Error Spinach", 
            "Race Condition Radish", 
            "Buffer Overflow Beef",
            "Memory Leak Mozzarella",
            "Stack Trace Tomatoes",
            "Segmentation Fault Salami",
            "Exception Eggplant",
            "Timeout Thyme",
            "Corrupted Cookie Crumbles",
            "Blue Screen Blue Cheese",
            "Kernel Panic Kale"
        ];
        
        const bizarreToppings = [
            "BBQ Marshmallows",
            "Holographic Hot Sauce",
            "Schrodinger's Sardines (may or may not exist)",
            "Time-Traveling Truffles",
            "Quantum Entangled Quesadilla Bits",
            "Fractal Fries",
            "Self-Replicating Soylent Sprinkles",
            "Tesseract Tortilla Chips",
            "Blockchain-Verified Bacon",
            "AI-Hallucinated Jalapeños",
            "Heisenberg's Uncertain Ham",
            "Caffeinated Code Sprinkles",
            "Alternate Reality Aioli",
            "Recursive Ranch Dressing",
            "Dark Matter Dough",
            "Zero-Day Exploitation Zucchini"
        ];
        
        // Combined options with weights for more interesting selections
        const categories = [
            { category: "tech", items: techToppings, weight: 40 },
            { category: "programming", items: programmingToppings, weight: 30 },
            { category: "error", items: errorToppings, weight: 15 },
            { category: "bizarre", items: bizarreToppings, weight: 15 }
        ];
        
        // Special "themed pizza" combinations
        const themedPizzas = [
            {
                name: "Full Stack Pizza",
                toppings: ["Frontend Feta", "Backend Bacon", "Database Dill", "API Anchovies", "Cloud Cheese"],
                description: "A layered approach with all components of the development stack."
            },
            {
                name: "DevOps Delight",
                toppings: ["Continuous Integration Cilantro", "Docker Container Cheese", "Kubernetes Clusters", "Jenkins Jam", "Git Merge Mushrooms"],
                description: "Automatically deployed to your table with zero downtime."
            },
            {
                name: "Legacy Code Special",
                toppings: ["COBOL Croutons", "Deprecated API Dill", "Spaghetti Code Sauce", "Technical Debt Tomatoes", "Y2K Yogurt"],
                description: "Nobody wants to maintain it, but somehow it's still in production."
            },
            {
                name: "Crypto Pizza",
                toppings: ["Bitcoin Basil", "Ethereum Eggplant", "NFT Nutmeg", "Blockchain Bacon", "Decentralized Dressing"],
                description: "Costs a fortune one day, nothing the next. Guaranteed to be volatile!"
            },
            {
                name: "AI Hallucination Pizza",
                toppings: ["Synthetic Sausage", "Neural Network Noodles", "Transformer Thyme", "LLM Linguini", "GPT Garlic"],
                description: "Contains toppings that don't exist but sound plausible. May produce unexpected results."
            },
            {
                name: "Cybersecurity Special",
                toppings: ["Firewall Frankfurter", "VPN Vanilla", "Zero-Trust Zucchini", "Penetration Test Peppers", "Hash Function Hash Browns"],
                description: "Comes in an encrypted box. Requires two-factor authentication to open."
            }
        ];
        
        // Random chance to get a themed pizza (20%)
        if (Math.random() < 0.2) {
            const selectedTheme = themedPizzas[Math.floor(Math.random() * themedPizzas.length)];
            return {
                isThemed: true,
                name: selectedTheme.name,
                toppings: selectedTheme.toppings,
                description: selectedTheme.description
            };
        }
        
        // Regular random toppings
        const selected = [];
        
        // Function to select a category based on weights
        function selectCategory() {
            const totalWeight = categories.reduce((sum, category) => sum + category.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (const category of categories) {
                if (random < category.weight) {
                    return category;
                }
                random -= category.weight;
            }
            
            return categories[0]; // Fallback
        }
        
        // Select toppings from weighted categories
        while (selected.length < count) {
            const category = selectCategory();
            const items = category.items;
            
            if (items.length === 0) continue;
            
            const randIndex = Math.floor(Math.random() * items.length);
            const selectedTopping = items[randIndex];
            
            // Remove the selected topping to avoid duplicates
            items.splice(randIndex, 1);
            
            // Add the topping with its category
            selected.push({
                name: selectedTopping,
                category: category.category
            });
        }
        
        return {
            isThemed: false,
            toppings: selected
        };
    };

    function showAIToppings() {
        if (!elements.resultDiv) return;
        
        // Create a styled container
        const toppingsContainer = document.createElement('div');
        toppingsContainer.className = 'ai-toppings-container';
        toppingsContainer.style.marginTop = '20px';
        toppingsContainer.style.padding = '20px';
        toppingsContainer.style.borderRadius = '8px';
        toppingsContainer.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
        toppingsContainer.style.border = '2px solid #2196F3';
        toppingsContainer.style.position = 'relative';
        
        // Header
        const header = document.createElement('h3');
        header.innerHTML = '🤖 AI-Generated Toppings';
        header.style.color = '#2196F3';
        header.style.marginTop = '0';
        header.style.marginBottom = '15px';
        toppingsContainer.appendChild(header);
        
        // Get toppings with a random count between 3-5
        const count = Math.floor(Math.random() * 3) + 3;
        const aiToppingsResult = generateAIToppings(count);
        
        if (aiToppingsResult.isThemed) {
            // Display themed pizza
            const themedPizzaBox = document.createElement('div');
            themedPizzaBox.style.padding = '15px';
            themedPizzaBox.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            themedPizzaBox.style.borderRadius = '6px';
            themedPizzaBox.style.borderLeft = '5px solid #3F51B5';
            
            const themeName = document.createElement('div');
            themeName.style.fontSize = '1.2rem';
            themeName.style.fontWeight = 'bold';
            themeName.style.marginBottom = '10px';
            themeName.textContent = `${aiToppingsResult.name}`;
            themedPizzaBox.appendChild(themeName);
            
            const themeDesc = document.createElement('div');
            themeDesc.style.fontSize = '0.9rem';
            themeDesc.style.fontStyle = 'italic';
            themeDesc.style.marginBottom = '15px';
            themeDesc.textContent = aiToppingsResult.description;
            themedPizzaBox.appendChild(themeDesc);
            
            const toppingsList = document.createElement('div');
            toppingsList.style.display = 'flex';
            toppingsList.style.flexWrap = 'wrap';
            toppingsList.style.gap = '10px';
            
            aiToppingsResult.toppings.forEach(topping => {
                const chip = document.createElement('span');
                chip.style.display = 'inline-block';
                chip.style.backgroundColor = '#3F51B5';
                chip.style.color = 'white';
                chip.style.padding = '5px 10px';
                chip.style.borderRadius = '20px';
                chip.style.fontSize = '0.9rem';
                chip.textContent = topping;
                toppingsList.appendChild(chip);
            });
            
            themedPizzaBox.appendChild(toppingsList);
            toppingsContainer.appendChild(themedPizzaBox);
        } else {
            // Display regular toppings with categories
            const toppingsBox = document.createElement('div');
            toppingsBox.style.display = 'flex';
            toppingsBox.style.flexDirection = 'column';
            toppingsBox.style.gap = '15px';
            
            // Get color for each category
            const categoryColors = {
                tech: '#4CAF50',       // Green
                programming: '#9C27B0', // Purple
                error: '#F44336',      // Red
                bizarre: '#FF9800'     // Orange
            };
            
            // Display each topping with its category
            aiToppingsResult.toppings.forEach(topping => {
                const toppingItem = document.createElement('div');
                toppingItem.style.display = 'flex';
                toppingItem.style.alignItems = 'center';
                toppingItem.style.gap = '10px';
                
                const categoryBadge = document.createElement('span');
                const color = categoryColors[topping.category] || '#2196F3';
                categoryBadge.style.backgroundColor = color;
                categoryBadge.style.color = 'white';
                categoryBadge.style.padding = '3px 8px';
                categoryBadge.style.borderRadius = '4px';
                categoryBadge.style.fontSize = '0.7rem';
                categoryBadge.style.textTransform = 'uppercase';
                categoryBadge.style.fontWeight = 'bold';
                categoryBadge.textContent = topping.category;
                
                const toppingName = document.createElement('span');
                toppingName.style.fontSize = '1.1rem';
                toppingName.textContent = topping.name;
                
                toppingItem.appendChild(categoryBadge);
                toppingItem.appendChild(toppingName);
                toppingsBox.appendChild(toppingItem);
            });
            
            toppingsContainer.appendChild(toppingsBox);
        }
        
        // Add a fun fact about AI and pizza
        const funFacts = [
            "Pizza topped with AI-generated ingredients has a 42% lower bug rate in production environments.",
            "Studies show that programmers who eat randomly-generated pizza toppings are 37% more likely to solve difficult algorithms.",
            "AI once recommended 'semicolon sausage' as a topping, and surprisingly, it was delicious.",
            "In blind taste tests, humans couldn't distinguish between human-curated and AI-generated pizza topping combinations.",
            "AI systems trained on pizza toppings have accidentally generated 3 new programming languages.",
            "A neural network trained on pizza preferences once concluded that 'coffee grounds' were a viable topping. It was promptly retrained."
        ];
        
        const funFact = document.createElement('div');
        funFact.style.marginTop = '20px';
        funFact.style.fontSize = '0.9rem';
        funFact.style.padding = '10px';
        funFact.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        funFact.style.borderRadius = '4px';
        funFact.style.fontStyle = 'italic';
        
        funFact.innerHTML = `<strong>AI Fun Fact:</strong> ${funFacts[Math.floor(Math.random() * funFacts.length)]}`;
        toppingsContainer.appendChild(funFact);
        
        // Add a "Try Again" button
        const tryAgainBtn = document.createElement('button');
        tryAgainBtn.textContent = "Generate New Toppings";
        tryAgainBtn.style.marginTop = '15px';
        tryAgainBtn.style.backgroundColor = '#2196F3';
        tryAgainBtn.style.color = 'white';
        tryAgainBtn.style.border = 'none';
        tryAgainBtn.style.padding = '8px 15px';
        tryAgainBtn.style.borderRadius = '4px';
        tryAgainBtn.style.cursor = 'pointer';
        tryAgainBtn.style.fontWeight = 'bold';
        tryAgainBtn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        
        tryAgainBtn.addEventListener('click', () => {
            // Remove current container and show new toppings
            toppingsContainer.remove();
            showAIToppings();
        });
        
        toppingsContainer.appendChild(tryAgainBtn);
        
        // Add to result area
        elements.resultDiv.appendChild(toppingsContainer);
    }

    // Clipboard functionality
    function copyReportToClipboard() {
        if (!calculationCompleted || !pizzaReport) {
            showToast("No pizza report to copy! Try calculating first.");
            return;
        }
        
        navigator.clipboard.writeText(pizzaReport)
            .then(() => {
                showToast("Pizza report copied to clipboard successfully! 📋");
            })
            .catch(() => {
                showToast("Failed to copy to clipboard! Check permissions.");
            });
    }

    // Main calculation function
    window.calculatePizzas = debounce(function() {
        calculationCompleted = false;
        pizzaReport = "";

        // Save user inputs to localStorage
        savePizzaDefaults();
        
        // Reset UI
        resetUI();
        
        // Show loading progress
        simulateLoading();
        
        // Calculate technical debt (new feature)
        calculateTechnicalDebt();
    }, 300); // 300ms debounce

    function resetUI() {
        if (elements.resultDiv) elements.resultDiv.innerHTML = '';
        if (elements.emailPromptSection) elements.emailPromptSection.style.display = 'none';
        if (elements.progressBar) elements.progressBar.style.width = '0%';
        if (elements.progressLabel) elements.progressLabel.textContent = '';
    }

    function simulateLoading() {
        // Maxis-style loading messages - funny, quirky, and sometimes nonsensical
        const loadingSteps = [
            { text: "Reticulating cheese splines...", delay: 800 },
            { text: "Solving P vs NP for optimal pizza slicing...", delay: 1200 },
            { text: "Outsourcing hunger calculations to the cloud...", delay: 700 },
            { text: "Teaching AI to fold pizza boxes...", delay: 900 },
            { text: "Calculating topping-to-code ratio...", delay: 600 },
            { text: "Negotiating with pepperoni union representatives...", delay: 1300 },
            { text: "Simulating pizza delivery traffic patterns...", delay: 800 },
            { text: "Synchronizing tomato sauce repositories...", delay: 700 },
            { text: "Running middle-out compression on deep dish models...", delay: 900 },
            { text: "Rendering cheese in real-time...", delay: 600 },
            { text: "Compiling marinara shader code...", delay: 700 },
            { text: "Installing pizza.js dependencies (3,428 packages)...", delay: 1100 },
            { text: "Downloading more RAM to handle large pizza orders...", delay: 900 },
            { text: "Bypassing pizza firewall...", delay: 600 },
            { text: "npm audit fixing vulnerabilities in crust module...", delay: 800 },
            { text: "Creating blockchain for transparent topping distribution...", delay: 1000 },
            { text: "Building Docker container for pizza microservices...", delay: 800 },
            { text: "Simulating pizza delivery using quantum algorithms...", delay: 1200 },
            { text: "Running regression tests on vegan option acceptance...", delay: 700 },
            { text: "Encrypting pineapple preferences with 256-bit cheese...", delay: 800 },
            { text: "Optimizing for hangry engineers coefficient...", delay: 900 },
            { text: "Parsing git blame to identify hungriest developers...", delay: 1100 },
            { text: "Overclocking pizza oven hardware...", delay: 800 },
            { text: "Deploying to pizza production environment...", delay: 1200 },
            { text: "Pizza is compiling, please wait...", delay: 1000 },
            { text: "Waiting for pizza CI pipeline to complete...", delay: 900 },
            { text: "Creating AWS Lambda functions to slice pizza...", delay: 800 },
            { text: "Pizzas deployed successfully!", delay: 1500 }
        ];

        let stepIndex = 0;
        const totalSteps = loadingSteps.length;
        const containerElement = document.getElementById('progressSection');
        
        // Add Maxis-style appearance to progress bar
        if (containerElement) {
            // Add subtle background to progress container
            containerElement.style.background = 'rgba(0,0,0,0.05)';
            containerElement.style.padding = '20px';
            containerElement.style.borderRadius = '10px';
            containerElement.style.marginTop = '30px';
            containerElement.style.position = 'relative';
            containerElement.style.overflow = 'hidden';
        }
        
        // Create a spinner to show alongside the progress bar
        const spinner = document.createElement('div');
        spinner.className = 'pizza-spinner';
        spinner.innerHTML = '🍕';
        spinner.style.position = 'absolute';
        spinner.style.top = '25px';
        spinner.style.left = '15px';
        spinner.style.fontSize = '24px';
        spinner.style.animation = 'spin 2s linear infinite';
        if (containerElement) {
            containerElement.appendChild(spinner);
        }
        
        // Create a percentage display
        const percentDisplay = document.createElement('div');
        percentDisplay.className = 'percentage-display';
        percentDisplay.style.position = 'absolute';
        percentDisplay.style.top = '28px';
        percentDisplay.style.right = '15px';
        percentDisplay.style.fontWeight = 'bold';
        percentDisplay.style.fontFamily = "'JetBrains Mono', 'Courier New', monospace";
        percentDisplay.textContent = '0%';
        if (containerElement) {
            containerElement.appendChild(percentDisplay);
        }
        
        // Start the Maxis-style loading sequence
        updateProgress();

        function updateProgress() {
            if (!elements.progressBar || !elements.progressLabel) return;
            
            if (stepIndex < loadingSteps.length) {
                // Calculate current percentage based on step
                let percentage;
                
                // Add Maxis-style behavior where progress sometimes goes backward
                if (stepIndex > 5 && Math.random() < 0.2 && stepIndex < totalSteps - 5) {
                    // 20% chance to go backward a bit for comedic effect
                    percentage = Math.max(10, Math.floor((stepIndex / totalSteps) * 100) - Math.floor(Math.random() * 10));
                    elements.progressLabel.textContent = "Unexpected pizza exception! Rolling back changes...";
                    
                    // Show quirky error message
                    const errorDelay = 800;
                    setTimeout(() => {
                        if (Math.random() < 0.5) {
                            elements.progressLabel.textContent = "Found a bug in the tomato sauce module...";
                        } else {
                            elements.progressLabel.textContent = "Pineapple conflict detected! Resolving merge issues...";
                        }
                        
                        // Then continue with the next real step after a delay
                        setTimeout(() => {
                            showNextStep();
                        }, errorDelay);
                    }, errorDelay);
                    
                    elements.progressBar.style.transition = 'width 0.5s ease-in-out';
                    elements.progressBar.style.width = `${percentage}%`;
                    
                    // Update percentage display with quirky message
                    if (percentDisplay) {
                        percentDisplay.textContent = `${percentage}%`;
                        percentDisplay.style.color = 'orange';
                        
                        // Reset color after delay
                        setTimeout(() => {
                            percentDisplay.style.color = '';
                        }, errorDelay * 2);
                    }
                    
                    setTimeout(updateProgress, errorDelay * 3);
                } else {
                    showNextStep();
                }
                
                function showNextStep() {
                    const currentStep = loadingSteps[stepIndex];
                    percentage = Math.floor(((stepIndex + 1) / totalSteps) * 100);
                    
                    // Near completion, do the classic 99% stall
                    if (percentage > 90 && percentage < 100) {
                        // Give a 50% chance to stall at 99%
                        if (Math.random() < 0.5 && stepIndex < totalSteps - 1) {
                            percentage = 99;
                            elements.progressLabel.textContent = "Waiting for last slice to render...";
                            
                            // Stall for a bit at 99%
                            setTimeout(() => {
                                stepIndex++;
                                updateProgress();
                            }, 2000);
                            
                            elements.progressBar.style.transition = 'width 0.8s ease-in-out';
                            elements.progressBar.style.width = `${percentage}%`;
                            
                            if (percentDisplay) {
                                percentDisplay.textContent = `${percentage}%`;
                            }
                            return;
                        }
                    }
                    
                    // Normal progress step
                    elements.progressBar.style.transition = 'width 0.8s ease-in-out';
                    elements.progressBar.style.width = `${percentage}%`;
                    elements.progressLabel.textContent = currentStep.text;
                    
                    // Update percentage display
                    if (percentDisplay) {
                        percentDisplay.textContent = `${percentage}%`;
                    }
                    
                    stepIndex++;
                    setTimeout(updateProgress, currentStep.delay);
                }
            } else {
                // We've completed all steps - finish up with a fun animation
                elements.progressBar.style.width = '110%';
                elements.progressBar.style.transition = 'width 1s ease-in-out, background-color 1s';
                elements.progressBar.style.backgroundColor = '#4CAF50';
                elements.progressLabel.textContent = "Pizza deployment exceeded expectations! You're 110% ready to eat! 🍕🎉";
                
                if (percentDisplay) {
                    percentDisplay.textContent = "110%";
                    percentDisplay.style.color = '#4CAF50';
                }
                
                // Do a brief "celebration" animation
                if (containerElement) {
                    containerElement.style.animation = 'pulse 0.5s 3';
                }
                
                // Create a short-lived confetti effect
                createConfetti();
                
                // Complete the calculation
                setTimeout(completeCalculation, 1500);
            }
        }
        
        function createConfetti() {
            const confettiContainer = document.createElement('div');
            confettiContainer.style.position = 'absolute';
            confettiContainer.style.top = '0';
            confettiContainer.style.left = '0';
            confettiContainer.style.right = '0';
            confettiContainer.style.height = '0';
            confettiContainer.style.overflow = 'visible';
            confettiContainer.style.pointerEvents = 'none';
            confettiContainer.style.zIndex = '100';
            
            if (containerElement) {
                containerElement.appendChild(confettiContainer);
            
                // Create confetti pieces
                const colors = ['#4CAF50', '#FF5722', '#FFC107', '#2196F3', '#E91E63'];
                for (let i = 0; i < 50; i++) {
                    const confetti = document.createElement('div');
                    confetti.style.position = 'absolute';
                    confetti.style.width = `${Math.random() * 10 + 5}px`;
                    confetti.style.height = `${Math.random() * 5 + 5}px`;
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.left = `${Math.random() * 100}%`;
                    confetti.style.top = '0';
                    confetti.style.opacity = '0.8';
                    confetti.style.borderRadius = '2px';
                    confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
                    confetti.style.animation = `confetti ${Math.random() * 2 + 1}s ease-out forwards`;
                    
                    confettiContainer.appendChild(confetti);
                }
                
                // Create keyframe animation for confetti
                if (!document.getElementById('confetti-keyframes')) {
                    const style = document.createElement('style');
                    style.id = 'confetti-keyframes';
                    style.textContent = `
                        @keyframes confetti {
                            0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
                            100% { transform: translateY(${containerElement.offsetHeight}px) rotate(${Math.random() * 360}deg); opacity: 0; }
                        }
                        @keyframes pulse {
                            0% { transform: scale(1); }
                            50% { transform: scale(1.02); }
                            100% { transform: scale(1); }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // Remove confetti after animation completes
                setTimeout(() => {
                    confettiContainer.remove();
                }, 3000);
            }
        }
    }

    function completeCalculation() {
        const hoursDebugging = parseInt(elements.hoursDebuggingInput.value, 10) || 0;
        const slicesPerPerson = parseInt(elements.slicesPerPersonInput.value, 10) || 0;
        const attendees = parseInt(elements.attendeesInput.value, 10) || 0;
        const pizzaType = elements.pizzaTypeInput.value;
        
        // Each hour of debugging adds hunger
        const debuggingExtraSlices = hoursDebugging * 2;
        
        // Calculate base needs
        const totalSlicesNeeded = (attendees * slicesPerPerson) + debuggingExtraSlices;
        
        // Special calculations based on pizza type
        calculatePizzasByType(pizzaType, totalSlicesNeeded, slicesPerPerson, hoursDebugging, attendees);
    }

    function calculatePizzasByType(pizzaType, totalSlicesNeeded, slicesPerPerson, hoursDebugging, attendees) {
        let pizzasRequired;
        let sliceEquivalency = 1;
        
        // Handle special pizza types
        switch (pizzaType) {
            case PIZZA_STYLES.NY:
                sliceEquivalency = 1;
                break;
            case PIZZA_STYLES.DETROIT:
                sliceEquivalency = 1.5;
                break;
            case PIZZA_STYLES.CHICAGO:
                sliceEquivalency = 1.7;
                break;
            case PIZZA_STYLES.CALIFORNIA:
                sliceEquivalency = 0.75;
                break;
            case PIZZA_STYLES.HOT_POCKETS:
                // Hot Pockets have their own calculation
                pizzasRequired = attendees * hoursDebugging;
                finalizeResult(pizzasRequired, pizzaType, slicesPerPerson, hoursDebugging, attendees, "Hot Pockets: quick, regrettable!");
                return;
            case PIZZA_STYLES.BLOCKCHAIN:
                // Blockchain pizza is unpredictable
                sliceEquivalency = Math.random() > 0.5 ? 0.1 : 2;
                break;
            case PIZZA_STYLES.CLOUD:
                // Cloud pizza is infinite
                finalizeResult(Infinity, pizzaType, slicesPerPerson, hoursDebugging, attendees, "Cloud pizza infinite cost!");
                return;
            case PIZZA_STYLES.PINEAPPLE:
                // WiFi Pineapple pizza security joke
                const resultDiv = elements.resultDiv();
                if (resultDiv) {
                    resultDiv.innerHTML = `<blockquote>WiFi Pineapple Pizza is an acquired taste.
                    It's capturing your taste buds even as we speak. 🍍📡🍕</blockquote>`;
                    calculationCompleted = true;
                }
                return;
            case PIZZA_STYLES.QUANTUM:
                // Quantum pizza exists in all states simultaneously
                const states = ["1", "2", "3", "5", "8", "13", "21"];
                pizzasRequired = states[Math.floor(Math.random() * states.length)];
                finalizeResult(pizzasRequired, pizzaType, slicesPerPerson, hoursDebugging, attendees, 
                    "Quantum pizza exists in all states until observed. The delivery person is both late and on time! 🔬🍕");
                return;
        }

        // Calculate adjusted slices per pizza based on style
        const adjustedSlicesPerPizza = SLICES_PER_PIZZA * sliceEquivalency;
        
        // Calculate total pizzas needed, rounded up
        pizzasRequired = Math.ceil(totalSlicesNeeded / adjustedSlicesPerPizza);
        
        // Blockchain needs special handling for display
        if (pizzaType === PIZZA_STYLES.BLOCKCHAIN) {
            finalizeResult(pizzasRequired, pizzaType, slicesPerPerson, hoursDebugging, attendees, "Blockchain madness!");
            return;
        }
        
        // Standard calculation result
        finalizeResult(pizzasRequired, pizzaType, slicesPerPerson, hoursDebugging, attendees, getHumorMessage(pizzasRequired));
    }

    function finalizeResult(pizzasRequired, pizzaType, slicesPerPerson, hoursDebugging, attendees, humor) {
        let displayMessage = "";
        if (!elements.resultDiv) return;
        
        // Format display message based on pizza type
        if (pizzaType === PIZZA_STYLES.HOT_POCKETS) {
            displayMessage = `<blockquote>You need <strong>${pizzasRequired}</strong> Hot Pocket(s) 
                to feed <strong>${attendees}</strong> attendees for <strong>${hoursDebugging}</strong> hours 
                of debugging. ${humor}</blockquote>`;
        } else if (pizzaType === PIZZA_STYLES.CLOUD) {
            displayMessage = `<blockquote>Cloud Pizza can feed any number of attendees, 
                but watch out for that infinite billing! ☁️🍕</blockquote>`;
        } else if (pizzaType === PIZZA_STYLES.BLOCKCHAIN) {
            displayMessage = `<blockquote>You need <strong>${pizzasRequired}</strong> Blockchain Pizza(s) 
                for <strong>${attendees}</strong> devs. ${humor} 🍕💸</blockquote>`;
        } else if (pizzaType === PIZZA_STYLES.PINEAPPLE) {
            return;
        } else if (pizzaType === PIZZA_STYLES.QUANTUM) {
            displayMessage = `<blockquote>You need <strong>${pizzasRequired}</strong> Quantum Pizza(s) 
                for <strong>${attendees}</strong> hungry engineers. ${humor}</blockquote>`;
        } else {
            displayMessage = `<blockquote>You need <strong>${pizzasRequired}</strong> pizza(s) for 
                <strong>${attendees}</strong> attendees, factoring in <strong>${hoursDebugging} hours</strong> 
                of debugging. Using <strong>${getSelectedPizzaText()}</strong> style.<br><br>
                ${humor}</blockquote>`;
        }

        // Only show the simple blockquote message for special pizza types
        // For normal pizza types, we'll use the enhanced report instead
        // This fixes the issue where reports were nested inside each other
        if (pizzaType === PIZZA_STYLES.HOT_POCKETS || 
            pizzaType === PIZZA_STYLES.CLOUD || 
            pizzaType === PIZZA_STYLES.BLOCKCHAIN || 
            pizzaType === PIZZA_STYLES.QUANTUM) {
            elements.resultDiv.innerHTML = displayMessage;
            calculationCompleted = true;
            
            // Check if enterprise threshold reached
            checkEnterpriseEmail(pizzasRequired);
            
            // Run funny tests in console
            performFunnyTests("Pizza");
        } else {
            // Clear previous results first
            elements.resultDiv.innerHTML = '';
            calculationCompleted = true;
            
            // Check if enterprise threshold reached
            checkEnterpriseEmail(pizzasRequired);
            
            // Build and display enhanced report
            constructPizzaReport(pizzasRequired, attendees, slicesPerPerson, hoursDebugging, humor);
            
            // Run funny tests in console
            performFunnyTests("Pizza");
        }
    }
    
    function getSelectedPizzaText() {
        return elements.pizzaTypeInput ? elements.pizzaTypeInput.options[elements.pizzaTypeInput.selectedIndex].text : "Unknown";
    }
    
    function constructPizzaReport(pizzasRequired, attendees, slicesPerPerson, hoursDebugging, humor) {
        if (!elements.resultDiv) return;
        
        // Create a styled report container with glass morphism effects
        const reportContainer = document.createElement('div');
        reportContainer.id = 'pizza-report-container';
        reportContainer.style.border = '2px solid #4CAF50';
        reportContainer.style.padding = '25px';
        reportContainer.style.marginTop = '30px';
        reportContainer.style.borderRadius = '12px';
        reportContainer.style.backgroundColor = 'rgba(76, 175, 80, 0.08)';
        reportContainer.style.position = 'relative';
        reportContainer.style.backdropFilter = 'blur(10px)';
        reportContainer.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(76, 175, 80, 0.2)';
        reportContainer.style.overflow = 'hidden';
        reportContainer.style.transition = 'all 0.3s ease';
        
        // Add subtle pizza background patterns
        const patternBg = document.createElement('div');
        patternBg.style.position = 'absolute';
        patternBg.style.top = '0';
        patternBg.style.left = '0';
        patternBg.style.right = '0';
        patternBg.style.bottom = '0';
        patternBg.style.opacity = '0.1';
        patternBg.style.backgroundImage = 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)';
        patternBg.style.backgroundSize = '20px 20px';
        patternBg.style.pointerEvents = 'none';
        patternBg.style.zIndex = '0';
        reportContainer.appendChild(patternBg);
        
        // Visual report header with 3D effect
        const headerSection = document.createElement('div');
        headerSection.style.position = 'relative';
        headerSection.style.marginBottom = '25px';
        headerSection.style.display = 'flex';
        headerSection.style.alignItems = 'center';
        headerSection.style.gap = '15px';
        headerSection.style.zIndex = '1';
        
        // Animated pizza icon
        const pizzaIcon = document.createElement('div');
        pizzaIcon.innerHTML = '🍕';
        pizzaIcon.style.fontSize = '38px';
        pizzaIcon.style.animation = 'float 3s ease-in-out infinite';
        pizzaIcon.style.position = 'relative';
        pizzaIcon.style.filter = 'drop-shadow(0 5px 5px rgba(0,0,0,0.2))';
        
        // Report header with gradient
        const header = document.createElement('h3');
        header.innerHTML = 'Pizza Calculation Report';
        header.style.background = 'linear-gradient(45deg, #4CAF50, #2196F3)';
        header.style.backgroundClip = 'text';
        header.style.WebkitBackgroundClip = 'text';
        header.style.color = 'transparent';
        header.style.WebkitTextFillColor = 'transparent';
        header.style.fontSize = '1.8rem';
        header.style.fontWeight = '800';
        header.style.margin = '0';
        header.style.textShadow = '0 2px 10px rgba(76, 175, 80, 0.2)';
        header.style.position = 'relative';
        
        headerSection.appendChild(pizzaIcon);
        headerSection.appendChild(header);
        
        // Calculate key metrics with some randomness and humor
        const deploymentLatency = (Math.random() * 30 + 15).toFixed(2);
        const efficiency = Math.floor(Math.random() * 40) + 60;
        const foodComaRisk = hoursDebugging > 4 ? "HIGH" : (hoursDebugging > 2 ? "MODERATE" : "LOW");
        const foodComaRiskValue = hoursDebugging > 4 ? 85 : (hoursDebugging > 2 ? 55 : 25);
        const codeQualityImprovement = Math.floor(Math.random() * 80) + 20;
        
        // Generate code quality comment based on the improvement percentage
        let codeQualityComment = "";
        if (codeQualityImprovement > 80) {
            codeQualityComment = "Clean code zen master level achieved!";
        } else if (codeQualityImprovement > 60) {
            codeQualityComment = "Senior engineers will approve this PR";
        } else if (codeQualityImprovement > 40) {
            codeQualityComment = "Pretty solid, just a few nitpicks in review";
        } else {
            codeQualityComment = "It works on your machine, so...ship it?";
        }
        
        // Calculate budget impact
        const budgetImpact = (pizzasRequired * (Math.random() * 15 + 10)).toFixed(2);
        
        // Get technical debt data
        const techDebtData = getTechnicalDebtData();
        
        // Generate fun suggestions based on pizza count
        let funSuggestion = "";
        if (pizzasRequired > 20) {
            funSuggestion = "Consider hiring a dedicated Pizza Resource Manager (PRM) for this project";
        } else if (pizzasRequired > 10) {
            funSuggestion = "Don't forget to create a Slack #pizza-emergency channel";
        } else if (pizzasRequired > 5) {
            funSuggestion = "Set up a proper pizza CI/CD pipeline for consistent delivery";
        } else {
            funSuggestion = "This fits within acceptable pizza budget parameters";
        }
        
        // Create the full text report
        const constructedReport =
            `Pizza Calculation Report\n\n` +
            `Number of Attendees: ${attendees}\n` +
            `Selected Pizza Style: ${getSelectedPizzaText()}\n` +
            `Slices Per Person: ${slicesPerPerson}\n` +
            `Hours Debugging: ${hoursDebugging}\n` +
            `Total Pizzas Required: ${pizzasRequired}\n\n` +
            humor + "\n\n" + 
            `Technical Details:\n` +
            `- Pizza Deployment Latency: ${deploymentLatency} minutes\n` +
            `- Hunger Satiation Efficiency: ${efficiency}%\n` +
            `- Food Coma Risk: ${foodComaRisk}\n` +
            `- Estimated Code Quality Improvement: ${codeQualityImprovement}% (${codeQualityComment})\n` +
            `- Technical Debt Accumulation: ${techDebtData.debtPoints} story points\n` +
            `- Refactoring Time Required: ${techDebtData.refactoringHours} hours\n` +
            `- Budget Impact: $${budgetImpact}\n\n` +
            `Recommendation: ${funSuggestion}`;

        // Save the report for download
        pizzaReport = constructedReport;
        
        // Create summary cards section
        const summarySection = document.createElement('div');
        summarySection.style.display = 'flex';
        summarySection.style.flexWrap = 'wrap';
        summarySection.style.gap = '15px';
        summarySection.style.marginBottom = '25px';
        summarySection.style.position = 'relative';
        summarySection.style.zIndex = '1';
        
        // Create summary cards
        function createSummaryCard(title, value, icon, color) {
            const card = document.createElement('div');
            card.style.flex = '1 0 calc(33.333% - 10px)';
            card.style.minWidth = '180px';
            card.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            card.style.backdropFilter = 'blur(5px)';
            card.style.border = `1px solid ${color}22`;
            card.style.borderRadius = '8px';
            card.style.padding = '15px';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gap = '10px';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            
            // Add hover effect
            card.onmouseover = () => {
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = `0 6px 12px rgba(0, 0, 0, 0.1), 0 0 10px ${color}33`;
            };
            card.onmouseout = () => {
                card.style.transform = '';
                card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            };
            
            const iconEl = document.createElement('i');
            iconEl.className = icon;
            iconEl.style.fontSize = '24px';
            iconEl.style.color = color;
            iconEl.style.marginBottom = '5px';
            
            const titleEl = document.createElement('div');
            titleEl.textContent = title;
            titleEl.style.fontSize = '0.85rem';
            titleEl.style.opacity = '0.8';
            titleEl.style.fontWeight = '500';
            
            const valueEl = document.createElement('div');
            valueEl.innerHTML = value;
            valueEl.style.fontSize = '1.5rem';
            valueEl.style.fontWeight = 'bold';
            valueEl.style.color = color;
            
            card.appendChild(iconEl);
            card.appendChild(titleEl);
            card.appendChild(valueEl);
            
            return card;
        }
        
        // Add primary summary cards
        summarySection.appendChild(createSummaryCard('Total Pizzas', `${pizzasRequired}`, 'fas fa-pizza-slice', '#4CAF50'));
        summarySection.appendChild(createSummaryCard('Attendees', `${attendees}`, 'fas fa-users', '#2196F3'));
        summarySection.appendChild(createSummaryCard('Budget', `$${budgetImpact}`, 'fas fa-dollar-sign', '#FFC107'));
        
        // Create the terminal section with animated typing effect
        const terminalContainer = document.createElement('div');
        terminalContainer.style.position = 'relative';
        terminalContainer.style.marginBottom = '25px';
        terminalContainer.style.zIndex = '1';
        
        // Terminal window styling with macOS-like header
        const terminal = document.createElement('div');
        terminal.style.backgroundColor = '#0D1117';
        terminal.style.borderRadius = '10px';
        terminal.style.overflow = 'hidden';
        terminal.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        
        // Add macOS-like terminal header
        const terminalHeader = document.createElement('div');
        terminalHeader.style.backgroundColor = '#1C2128';
        terminalHeader.style.padding = '10px 15px';
        terminalHeader.style.display = 'flex';
        terminalHeader.style.alignItems = 'center';
        terminalHeader.style.gap = '5px';
        
        // Add terminal control buttons
        const controlsContainer = document.createElement('div');
        controlsContainer.style.display = 'flex';
        controlsContainer.style.gap = '6px';
        
        const colors = ['#FF5F56', '#FFBD2E', '#27C93F'];
        colors.forEach(color => {
            const button = document.createElement('div');
            button.style.width = '12px';
            button.style.height = '12px';
            button.style.borderRadius = '50%';
            button.style.backgroundColor = color;
            controlsContainer.appendChild(button);
        });
        
        // Add terminal title
        const terminalTitle = document.createElement('div');
        terminalTitle.textContent = "pizza-calculator --report";
        terminalTitle.style.color = '#FFFFFF';
        terminalTitle.style.fontSize = '12px';
        terminalTitle.style.fontFamily = "'JetBrains Mono', 'Courier New', monospace";
        terminalTitle.style.marginLeft = '10px';
        
        terminalHeader.appendChild(controlsContainer);
        terminalHeader.appendChild(terminalTitle);
        terminal.appendChild(terminalHeader);
        
        // Terminal content area
        const results = document.createElement('pre');
        results.style.margin = '0';
        results.style.height = '300px';
        results.style.maxHeight = '300px';
        results.style.overflowY = 'auto';
        results.style.overflowX = 'auto';
        results.style.padding = '0';
        results.style.backgroundColor = 'transparent';
        results.style.color = '#10B981';
        results.style.fontFamily = "'JetBrains Mono', 'Courier New', monospace";
        results.style.fontSize = '14px';
        results.style.lineHeight = '1.6';
        results.style.whiteSpace = 'pre-wrap';
        results.style.wordBreak = 'break-word';
        
        // Add container for content with padding
        const contentContainer = document.createElement('div');
        contentContainer.style.padding = '20px';
        contentContainer.style.height = '100%';
        contentContainer.style.boxSizing = 'border-box';
        results.appendChild(contentContainer);
        
        // Add glow effect for cyberpunk aesthetic
        const glowEffect = document.createElement('div');
        glowEffect.style.position = 'absolute';
        glowEffect.style.top = '0';
        glowEffect.style.left = '0';
        glowEffect.style.width = '100%';
        glowEffect.style.height = '100%';
        glowEffect.style.boxShadow = 'inset 0 0 30px rgba(16, 185, 129, 0.2)';
        glowEffect.style.pointerEvents = 'none';
        results.appendChild(glowEffect);
        
        terminal.appendChild(results);
        terminalContainer.appendChild(terminal);
        
        // Add typing effect to terminal
        const typeEffect = (text, i = 0) => {
            if (i < text.length) {
                // Add special color coding for specific parts
                let currentChar = text.charAt(i);
                
                // Colorize headings and important data
                if (i > 0 && text.charAt(i-1) === '\n' && currentChar === '-') {
                    const span = document.createElement('span');
                    span.style.color = '#f97316'; // Orange for bullet points
                    span.textContent = currentChar;
                    contentContainer.appendChild(span);
                } else if (i > 0 && text.substr(i-12, 12) === 'Recommendation') {
                    // Color the whole recommendation section
                    const colonIndex = text.indexOf(':', i);
                    if (colonIndex > i) {
                        const span = document.createElement('span');
                        span.style.color = '#8B5CF6'; // Purple for recommendations
                        span.style.fontWeight = 'bold';
                        
                        // Get the heading + data
                        const label = text.substring(i-12, colonIndex + 1);
                        const value = text.substring(colonIndex + 1, text.indexOf('\n', colonIndex) > 0 ? text.indexOf('\n', colonIndex) : text.length);
                        
                        span.textContent = label;
                        contentContainer.appendChild(span);
                        
                        const valueSpan = document.createElement('span');
                        valueSpan.style.color = '#EC4899'; // Pink for recommendation value
                        valueSpan.style.fontWeight = 'bold';
                        valueSpan.textContent = value;
                        contentContainer.appendChild(valueSpan);
                        
                        // Skip ahead
                        i = (text.indexOf('\n', colonIndex) > 0 ? text.indexOf('\n', colonIndex) : text.length) - 1;
                    } else {
                        contentContainer.textContent += currentChar;
                    }
                } else if (currentChar === ':') {
                    // Find if this is a label:value pair
                    const labelStart = text.lastIndexOf('\n', i) > 0 ? text.lastIndexOf('\n', i) + 1 : 0;
                    if (labelStart < i) {
                        const label = text.substring(labelStart, i + 1);
                        const colonIndex = i;
                        let valueEnd = text.indexOf('\n', colonIndex);
                        if (valueEnd < 0) valueEnd = text.length;
                        const value = text.substring(colonIndex + 1, valueEnd);
                        
                        // Create label element with special color
                        const labelSpan = document.createElement('span');
                        labelSpan.style.color = '#38BDF8'; // Blue for labels
                        labelSpan.textContent = label;
                        contentContainer.appendChild(labelSpan);
                        
                        // Create value element with special color
                        const valueSpan = document.createElement('span');
                        valueSpan.style.color = '#34D399'; // Green for values
                        valueSpan.style.fontWeight = 'bold';
                        valueSpan.textContent = value;
                        contentContainer.appendChild(valueSpan);
                        
                        // Skip ahead
                        i = valueEnd - 1;
                    } else {
                        contentContainer.textContent += currentChar;
                    }
                } else if (i > 0 && text.substr(i-7, 7) === "Pizza C") {
                    // Special heading for main title
                    const newlineIndex = text.indexOf('\n', i);
                    if (newlineIndex > i) {
                        const heading = text.substring(i-7, newlineIndex);
                        const headingSpan = document.createElement('span');
                        headingSpan.style.color = '#F472B6'; // Pink for main heading
                        headingSpan.style.fontWeight = 'bold';
                        headingSpan.textContent = heading;
                        contentContainer.appendChild(headingSpan);
                        
                        // Skip ahead
                        i = newlineIndex - 1;
                    } else {
                        contentContainer.textContent += currentChar;
                    }
                } else if ((i > 0 && text.substr(i-13, 12) === "Technical De") || 
                           (i > 0 && text.charAt(i-1) === '\n' && currentChar.match(/[A-Z]/))) {
                    // Section headings
                    const newlineIndex = text.indexOf('\n', i);
                    if (newlineIndex > i) {
                        const heading = text.substring(i-1, newlineIndex);
                        const headingSpan = document.createElement('span');
                        headingSpan.style.color = '#F43F5E'; // Red for secondary headings
                        headingSpan.style.fontWeight = 'bold';
                        headingSpan.textContent = heading;
                        contentContainer.appendChild(headingSpan);
                        
                        // Skip ahead
                        i = newlineIndex - 1;
                    } else {
                        contentContainer.textContent += currentChar;
                    }
                } else {
                    contentContainer.textContent += currentChar;
                }
                
                // Scroll to bottom as we type
                results.scrollTop = results.scrollHeight;
                
                // Scroll the page to keep the report in view
                if (i % 20 === 0) { // Only scroll occasionally to avoid jitters
                    reportContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                
                // Add random tiny delays for realistic typing
                setTimeout(() => typeEffect(text, i + 1), Math.random() * 10 + 5);
            } else {
                // Add blinking cursor at the end
                const cursor = document.createElement('span');
                cursor.textContent = '_';
                cursor.style.animation = 'blink 1s infinite';
                cursor.style.fontWeight = 'bold';
                cursor.style.color = '#F472B6';
                contentContainer.appendChild(cursor);
                
                // Final scroll
                results.scrollTop = results.scrollHeight;
                reportContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        };
        
        // Create detailed metrics section with charts
        const detailsContainer = document.createElement('div');
        detailsContainer.style.position = 'relative';
        detailsContainer.style.zIndex = '1';
        
        // Metrics header
        const metricsHeader = document.createElement('div');
        metricsHeader.textContent = 'Key Metrics';
        metricsHeader.style.fontSize = '1.25rem';
        metricsHeader.style.fontWeight = '600';
        metricsHeader.style.marginBottom = '15px';
        metricsHeader.style.display = 'flex';
        metricsHeader.style.alignItems = 'center';
        metricsHeader.style.gap = '7px';
        
        // Add metrics icon
        const metricsIcon = document.createElement('i');
        metricsIcon.className = 'fas fa-chart-line';
        metricsIcon.style.color = '#6366F1';
        metricsHeader.prepend(metricsIcon);
        
        detailsContainer.appendChild(metricsHeader);
        
        // Create metrics grid
        const metricsGrid = document.createElement('div');
        metricsGrid.style.display = 'grid';
        metricsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        metricsGrid.style.gap = '15px';
        metricsGrid.style.marginBottom = '20px';
        
        // Create enhanced metric boxes
        function createEnhancedMetricBox(icon, label, value, color, description = '', progress = null) {
            const box = document.createElement('div');
            box.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            box.style.borderRadius = '8px';
            box.style.padding = '15px';
            box.style.display = 'flex';
            box.style.flexDirection = 'column';
            box.style.gap = '10px';
            box.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            box.style.border = `1px solid ${color}22`;
            box.style.transition = 'all 0.3s ease';
            
            // Add hover animation
            box.onmouseover = () => {
                box.style.transform = 'translateY(-5px)';
                box.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.1), 0 0 10px ${color}33`;
            };
            box.onmouseout = () => {
                box.style.transform = '';
                box.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            };
            
            const headerRow = document.createElement('div');
            headerRow.style.display = 'flex';
            headerRow.style.alignItems = 'center';
            headerRow.style.justifyContent = 'space-between';
            
            const iconContainer = document.createElement('div');
            iconContainer.style.backgroundColor = `${color}22`;
            iconContainer.style.width = '36px';
            iconContainer.style.height = '36px';
            iconContainer.style.borderRadius = '8px';
            iconContainer.style.display = 'flex';
            iconContainer.style.alignItems = 'center';
            iconContainer.style.justifyContent = 'center';
            
            const iconEl = document.createElement('i');
            iconEl.className = icon;
            iconEl.style.fontSize = '18px';
            iconEl.style.color = color;
            iconContainer.appendChild(iconEl);
            
            const labelEl = document.createElement('div');
            labelEl.textContent = label;
            labelEl.style.fontSize = '0.9rem';
            labelEl.style.fontWeight = '600';
            
            headerRow.appendChild(iconContainer);
            headerRow.appendChild(labelEl);
            
            const valueEl = document.createElement('div');
            valueEl.innerHTML = value;
            valueEl.style.fontSize = '1.75rem';
            valueEl.style.fontWeight = 'bold';
            valueEl.style.color = color;
            valueEl.style.margin = '5px 0';
            
            box.appendChild(headerRow);
            box.appendChild(valueEl);
            
            // Add progress bar if provided
            if (progress !== null) {
                const progressContainer = document.createElement('div');
                progressContainer.style.height = '6px';
                progressContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                progressContainer.style.borderRadius = '3px';
                progressContainer.style.overflow = 'hidden';
                progressContainer.style.marginTop = '5px';
                
                const progressBar = document.createElement('div');
                progressBar.style.height = '100%';
                progressBar.style.width = '0%';
                progressBar.style.backgroundColor = color;
                progressBar.style.borderRadius = '3px';
                progressBar.style.transition = 'width 1.5s ease-in-out';
                
                progressContainer.appendChild(progressBar);
                box.appendChild(progressContainer);
                
                // Animate progress after a delay
                setTimeout(() => {
                    progressBar.style.width = `${progress}%`;
                }, 300);
            }
            
            // Add description if provided
            if (description) {
                const descriptionEl = document.createElement('div');
                descriptionEl.textContent = description;
                descriptionEl.style.fontSize = '0.85rem';
                descriptionEl.style.color = document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
                descriptionEl.style.marginTop = '5px';
                box.appendChild(descriptionEl);
            }
            
            return box;
        }
        
        // Add custom metrics with progress bars and descriptions
        metricsGrid.appendChild(createEnhancedMetricBox(
            'fas fa-clock', 
            'Delivery Time', 
            `${deploymentLatency} mins`, 
            '#FFD700',
            'Estimated pizza arrival',
            Math.min(parseFloat(deploymentLatency) * 1.5, 100)
        ));
        
        metricsGrid.appendChild(createEnhancedMetricBox(
            'fas fa-battery-three-quarters', 
            'Satiation Level', 
            `${efficiency}%`, 
            '#4CAF50',
            'Team hunger elimination',
            efficiency
        ));
        
        metricsGrid.appendChild(createEnhancedMetricBox(
            'fas fa-bed', 
            'Food Coma Risk', 
            foodComaRisk, 
            '#FF6347',
            'Post-meal productivity impact',
            foodComaRiskValue
        ));
        
        metricsGrid.appendChild(createEnhancedMetricBox(
            'fas fa-code', 
            'Code Quality', 
            `${codeQualityImprovement}%`, 
            '#1E90FF',
            codeQualityComment,
            codeQualityImprovement
        ));
        
        // Add technical debt metrics
        if (techDebtData) {
            const techDebtBox = createEnhancedMetricBox(
                'fas fa-credit-card', 
                'Tech Debt', 
                `${techDebtData.debtPoints} pts`, 
                '#E91E63',
                'Click for detailed analysis',
                Math.min(techDebtData.debtPoints * 2, 100)
            );
            techDebtBox.style.cursor = 'pointer';
            techDebtBox.title = 'Click to see technical debt details';
            techDebtBox.addEventListener('click', () => showTechDebtDetails(techDebtData));
            metricsGrid.appendChild(techDebtBox);
            
            metricsGrid.appendChild(createEnhancedMetricBox(
                'fas fa-tools', 
                'Refactoring', 
                `${techDebtData.refactoringHours} hrs`, 
                '#9C27B0',
                'Estimated cleanup time',
                Math.min(techDebtData.refactoringHours * 2.5, 100)
            ));
        }
        
        // Add budget metrics with dollar sign
        metricsGrid.appendChild(createEnhancedMetricBox(
            'fas fa-dollar-sign', 
            'Budget Impact', 
            `$${budgetImpact}`, 
            '#67E8F9',
            'Expense account damage',
            Math.min(budgetImpact * 1, 100)
        ));
        
        detailsContainer.appendChild(metricsGrid);
        
        // Add share and action buttons section
        const actionSection = document.createElement('div');
        actionSection.style.display = 'flex';
        actionSection.style.gap = '10px';
        actionSection.style.marginTop = '20px';
        actionSection.style.justifyContent = 'flex-end';
        actionSection.style.flexWrap = 'wrap';
        actionSection.style.position = 'relative';
        actionSection.style.zIndex = '1';
        
        // Create action button function
        function createActionButton(icon, text, onClick, color, isPrimary = false) {
            const button = document.createElement('button');
            button.type = 'button';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.gap = '8px';
            button.style.padding = '10px 16px';
            button.style.borderRadius = '8px';
            button.style.border = 'none';
            button.style.fontSize = '14px';
            button.style.fontWeight = '600';
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.2s ease';
            
            if (isPrimary) {
                button.style.backgroundColor = color;
                button.style.color = 'white';
                button.style.boxShadow = `0 4px 6px ${color}33`;
            } else {
                button.style.backgroundColor = `${color}22`;
                button.style.color = color;
                button.style.boxShadow = `0 4px 6px rgba(0, 0, 0, 0.05)`;
            }
            
            button.onmouseover = () => {
                button.style.transform = 'translateY(-2px)';
                if (isPrimary) {
                    button.style.boxShadow = `0 6px 12px ${color}55`;
                } else {
                    button.style.boxShadow = `0 6px 12px rgba(0, 0, 0, 0.1)`;
                    button.style.backgroundColor = `${color}33`;
                }
            };
            
            button.onmouseout = () => {
                button.style.transform = '';
                if (isPrimary) {
                    button.style.boxShadow = `0 4px 6px ${color}33`;
                } else {
                    button.style.boxShadow = `0 4px 6px rgba(0, 0, 0, 0.05)`;
                    button.style.backgroundColor = `${color}22`;
                }
            };
            
            button.onclick = onClick;
            
            const iconEl = document.createElement('i');
            iconEl.className = icon;
            
            const textEl = document.createElement('span');
            textEl.textContent = text;
            
            button.appendChild(iconEl);
            button.appendChild(textEl);
            
            return button;
        }
        
        // Add action buttons
        actionSection.appendChild(createActionButton(
            'fas fa-copy', 
            'Copy Report', 
            () => copyReportToClipboard(), 
            '#3B82F6'
        ));
        
        actionSection.appendChild(createActionButton(
            'fas fa-download', 
            'Download', 
            () => downloadReport(), 
            '#10B981'
        ));
        
        actionSection.appendChild(createActionButton(
            'fas fa-robot', 
            'AI Toppings', 
            () => showAIToppings(), 
            '#8B5CF6'
        ));
        
        actionSection.appendChild(createActionButton(
            'fas fa-share-alt', 
            'Share Order', 
            () => {
                showToast("Sharing pizza order with the team...", "success");
                // Fun animation that could be added here
            }, 
            '#EC4899',
            true
        ));
        
        // Add random pizza facts section
        const pizzaFacts = [
            "The average programmer consumes 2.4x more pizza than non-programmers.",
            "Studies show a direct correlation between pizza quality and code quality.",
            "Pizza was the official fuel of the Apollo 11 mission control team.",
            "The first bitcoin purchase was for two pizzas worth 10,000 BTC (now worth millions).",
            "77% of midnight debugging sessions involve pizza delivery.",
            "The 'time to pizza' metric is used by top tech companies to measure team efficiency.",
            "Google's cafeterias serve over 5,000 pizzas daily to hungry engineers.",
            "The 'Pizza Driven Development' methodology was first documented in 2015.",
            "Quantum computing researchers consume 3x more toppings than traditional CS researchers."
        ];
        
        const randomFact = pizzaFacts[Math.floor(Math.random() * pizzaFacts.length)];
        
        const factBox = document.createElement('div');
        factBox.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        factBox.style.border = '1px solid rgba(99, 102, 241, 0.2)';
        factBox.style.borderRadius = '8px';
        factBox.style.padding = '15px';
        factBox.style.marginTop = '25px';
        factBox.style.display = 'flex';
        factBox.style.alignItems = 'center';
        factBox.style.gap = '15px';
        factBox.style.position = 'relative';
        factBox.style.zIndex = '1';
        
        const lightbulbIcon = document.createElement('i');
        lightbulbIcon.className = 'fas fa-lightbulb';
        lightbulbIcon.style.color = '#6366F1';
        lightbulbIcon.style.fontSize = '24px';
        
        const factText = document.createElement('div');
        factText.innerHTML = `<strong>Pizza Engineering Fact:</strong> ${randomFact}`;
        factText.style.fontSize = '0.9rem';
        
        factBox.appendChild(lightbulbIcon);
        factBox.appendChild(factText);
        
        // Assemble all the report sections
        reportContainer.appendChild(headerSection);
        reportContainer.appendChild(summarySection);
        reportContainer.appendChild(terminalContainer);
        reportContainer.appendChild(detailsContainer);
        reportContainer.appendChild(factBox);
        reportContainer.appendChild(actionSection);
        
        // Start typing effect
        typeEffect(constructedReport);
        
        // Add to result div
        elements.resultDiv.appendChild(reportContainer);
    }

    // Humor messages
    function getHumorMessage(pizzasRequired) {
        if (pizzasRequired >= ENTERPRISE_THRESHOLD) {
            return "You've reached Pied Piper-level scaling. Time for enterprise pizza solutions with distributed toppings and fault-tolerant sauces! 🍕📞";
        } else if (pizzasRequired > 20) {
            return "CRITICAL ALERT: Pizza overflow detected! Consider implementing a pizza sharding strategy for optimal distribution. 🍕🛠️";
        } else if (pizzasRequired > 10) {
            return "That's a hefty pizza cluster! Use horizontal slice-scaling with Redis caching for optimal hunger management. ☁️🍕";
        } else if (pizzasRequired > 5) {
            return "A respectable order! Enable pizza logs for post-mortem analysis of slice consumption patterns. 📊🍕";
        } else if (pizzasRequired > 3) {
            return "A moderate batch. Implement auto-scaling for slice resources to handle unexpected hunger spikes. 🍕🔄";
        } else if (pizzasRequired === 1) {
            return "A single pizza? That's like running production on a Raspberry Pi—bold strategy, but mind the resource constraints! 🎛️🍕";
        } else if (pizzasRequired === 0) {
            return "Zero pizzas? Did you try turning hunger off and on again? 🔌🍕";
        } else {
            return "Minimal pizza allocation detected. Implement redundant pizza ordering for high availability of calorie resources. 📦🍕";
        }
    }

    // Enterprise email handling
    window.checkEnterpriseEmail = function(pizzasRequired) {
        if (!elements.emailPromptSection) return;
        
        if (pizzasRequired >= ENTERPRISE_THRESHOLD) {
            elements.emailPromptSection.style.display = 'block';
        } else {
            elements.emailPromptSection.style.display = 'none';
        }
    };

    window.submitEmail = function() {
        const emailInput = document.getElementById('emailInput');
        if (!emailInput) return;
        
        const email = emailInput.value.trim();
        if (!email) {
            showToast("Please enter a valid email address!");
            return;
        }
        
        console.log(`Enterprise pizza inquiry from: ${email}`);
        const responseTime = Math.floor(Math.random() * 30) + 30;
        showToast(`Thanks! Our Enterprise Pizza Sales Team will contact you within ${responseTime} business minutes. 🍕💼`);
    };

    // Download report functionality
    window.downloadReport = function() {
        if (!calculationCompleted || !pizzaReport) {
            showToast("Please perform a calculation first!");
            return;
        }
        
        const blob = new Blob([pizzaReport], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        if (!elements.downloadLink) return;
        
        elements.downloadLink.href = url;
        elements.downloadLink.download = `Pizza_Calculation_Report_${new Date().toISOString().slice(0,10)}.txt`;
        elements.downloadLink.click();
        URL.revokeObjectURL(url);
    };

    // Toast notification with cached elements for better performance
    window.showToast = function(message, type = "info") {
        // Cache toast elements for better performance
        if (!window.toastElements) {
            window.toastElements = {
                toast: document.getElementById('toast'),
                messageEl: document.getElementById('toast-message')
            };
        }
        
        const { toast, messageEl } = window.toastElements;
        if (!toast || !messageEl) {
            // Fallback to the old method if new elements not found
            if (!elements.toast) return;
            
            elements.toast.textContent = message;
            elements.toast.className = "toast show";
            setTimeout(() => {
                elements.toast.className = elements.toast.className.replace("show", "");
            }, 3000);
            return;
        }
        
        messageEl.textContent = message;
        
        // Set icon based on type
        const iconEl = toast.querySelector('i');
        if (iconEl) {
            iconEl.className = type === "success" ? "fas fa-check-circle" : 
                              type === "error" ? "fas fa-exclamation-circle" : 
                              type === "warning" ? "fas fa-exclamation-triangle" : 
                              "fas fa-info-circle";
            
            iconEl.style.color = type === "success" ? "#4CAF50" : 
                               type === "error" ? "#F44336" : 
                               type === "warning" ? "#FF9800" : 
                               "#2196F3";
        }
        
        toast.className = "toast show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 3000);
    };

    // Console testing
    window.performFunnyTests = function(calculatorName) {
        console.log(`\n--- ${calculatorName} Additional Testing Suite Initiated ---`);
        console.log("[Load Test] Simulating thousands of hungry devs hitting the server for pizza calculations...");
        console.log("[Unit Test] Checking if slices per person is not negative or infinite... Looks good so far!");
        console.log("[UX Test] Asking random dev if they prefer pineapple on pizza. 50% meltdown rate detected!");
        console.log("[Security Test] Attempting to inject 'DROP TABLE Pizza' into debug hours field. Denied!");
        console.log("[Git Test] Checking if pizza branches can be merged without conflicts. Topping conflicts resolved!");
        console.log("[DevOps Test] CI/CD pipeline successfully deployed hot pizza to production environment.");
        console.log("[Docker Test] Pizza successfully containerized. All toppings isolated from host system.");
        console.log("[Technical Debt Test] Measuring pizza-based technical debt accumulation... concerns noted.");
        console.log("[All Tests Passed] The Pizza Calculator is stable...ish.\n");
    };
    
    // Technical Debt Calculator
    let techDebtData = null;
    
    function calculateTechnicalDebt() {
        // Reset existing technical debt data
        techDebtData = null;
        
        // Wait for values to be available
        setTimeout(() => {
            const hoursDebugging = parseInt(elements.hoursDebuggingInput.value, 10) || 0;
            const slicesPerPerson = parseInt(elements.slicesPerPersonInput.value, 10) || 0;
            const attendees = parseInt(elements.attendeesInput.value, 10) || 0;
            const pizzaType = elements.pizzaTypeInput.value;
            
            // Calculate the technical debt
            techDebtData = computeTechnicalDebt(hoursDebugging, slicesPerPerson, attendees, pizzaType);
        }, 500);
    }
    
    function getTechnicalDebtData() {
        if (!techDebtData) {
            const hoursDebugging = parseInt(elements.hoursDebuggingInput.value, 10) || 0;
            const slicesPerPerson = parseInt(elements.slicesPerPersonInput.value, 10) || 0;
            const attendees = parseInt(elements.attendeesInput.value, 10) || 0;
            const pizzaType = elements.pizzaTypeInput.value;
            
            return computeTechnicalDebt(hoursDebugging, slicesPerPerson, attendees, pizzaType);
        }
        return techDebtData;
    }
    
    function computeTechnicalDebt(hoursDebugging, slicesPerPerson, attendees, pizzaType) {
        // Base calculation for technical debt points
        let debtPoints = hoursDebugging * 3; // 3 story points per hour of debugging
        
        // More people eating more pizza = more technical debt due to food coma
        const totalSlices = attendees * slicesPerPerson;
        debtPoints += Math.floor(totalSlices / 5); // 1 point per 5 slices consumed
        
        // Special modifiers based on pizza type
        switch (pizzaType) {
            case PIZZA_STYLES.NY:
                // NY Pizza is good, but still adds some debt
                debtPoints *= 1.0;
                break;
            case PIZZA_STYLES.CHICAGO:
                // Deep dish = deep debt
                debtPoints *= 1.5;
                break;
            case PIZZA_STYLES.HOT_POCKETS:
                // Hot pockets lead to quick & dirty solutions
                debtPoints *= 2.0;
                break;
            case PIZZA_STYLES.BLOCKCHAIN:
                // Blockchain pizza may cause refactoring challenges
                debtPoints = Math.floor(debtPoints * (Math.random() > 0.5 ? 3.0 : 0.5));
                break;
            case PIZZA_STYLES.CLOUD:
                // Cloud pizza scales your technical debt to infinity
                debtPoints = Math.floor(debtPoints * 1.7);
                break;
            case PIZZA_STYLES.QUANTUM:
                // Quantum pizza creates superposition of clean and messy code
                debtPoints = Math.floor(debtPoints * (Math.random() + 0.5));
                break;
            case PIZZA_STYLES.PINEAPPLE:
                // WiFi Pineapple pizza may expose security flaws
                debtPoints *= 1.3;
                break;
        }
        
        // Add some randomness (±30%)
        const randomFactor = 0.7 + (Math.random() * 0.6);
        debtPoints = Math.floor(debtPoints * randomFactor);
        
        // Calculate refactoring hours required (each point takes 2-4 hours to fix)
        const refactoringHours = Math.ceil(debtPoints * (2 + Math.floor(Math.random() * 3)));
        
        // Generate tech debt descriptions
        const techDebtDescriptions = generateTechDebtDescriptions(debtPoints);
        
        return {
            debtPoints,
            refactoringHours,
            techDebtDescriptions
        };
    }
    
    function generateTechDebtDescriptions(debtPoints) {
        const lowDebtItems = [
            "Unused imports in code",
            "Minor code duplication",
            "Functions slightly too long",
            "Missing some unit tests",
            "Documentation needs updates"
        ];
        
        const mediumDebtItems = [
            "Significant code duplication",
            "Inconsistent error handling",
            "Complex conditional logic",
            "Magic numbers throughout code", 
            "Missing integration tests",
            "No load tests for high traffic scenarios"
        ];
        
        const highDebtItems = [
            "God objects with too many responsibilities",
            "Tightly coupled modules",
            "Deprecated library dependencies",
            "Multiple responsibility violations",
            "Security vulnerabilities",
            "No CI/CD pipeline",
            "Hard-coded credentials"
        ];
        
        const criticalDebtItems = [
            "No backup strategy",
            "Using eval() for parsing JSON",
            "Database queries in loops",
            "Unreviewed code in production",
            "No monitoring or alerting",
            "Zero test coverage",
            "Code commented with 'TODO: Fix later'"
        ];
        
        const result = [];
        
        // Select items based on debt level
        if (debtPoints < 10) {
            // 1-2 low debt items
            const count = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < count; i++) {
                result.push(lowDebtItems[Math.floor(Math.random() * lowDebtItems.length)]);
            }
        } else if (debtPoints < 20) {
            // 2-3 items, mostly low with some medium
            const lowCount = Math.floor(Math.random() * 2) + 1;
            const medCount = Math.floor(Math.random() * 2) + 1;
            
            for (let i = 0; i < lowCount; i++) {
                result.push(lowDebtItems[Math.floor(Math.random() * lowDebtItems.length)]);
            }
            
            for (let i = 0; i < medCount; i++) {
                result.push(mediumDebtItems[Math.floor(Math.random() * mediumDebtItems.length)]);
            }
        } else if (debtPoints < 35) {
            // 3-4 items with medium and high
            const medCount = Math.floor(Math.random() * 2) + 1;
            const highCount = Math.floor(Math.random() * 2) + 1;
            
            for (let i = 0; i < medCount; i++) {
                result.push(mediumDebtItems[Math.floor(Math.random() * mediumDebtItems.length)]);
            }
            
            for (let i = 0; i < highCount; i++) {
                result.push(highDebtItems[Math.floor(Math.random() * highDebtItems.length)]);
            }
        } else {
            // 4-5 items with high and critical
            const highCount = Math.floor(Math.random() * 2) + 1;
            const critCount = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < highCount; i++) {
                result.push(highDebtItems[Math.floor(Math.random() * highDebtItems.length)]);
            }
            
            for (let i = 0; i < critCount; i++) {
                result.push(criticalDebtItems[Math.floor(Math.random() * criticalDebtItems.length)]);
            }
        }
        
        // Ensure uniqueness
        return [...new Set(result)];
    }
    
    // Function to display technical debt details in a modal-like window
    function showTechDebtDetails(techDebtData) {
        if (!techDebtData || !techDebtData.techDebtDescriptions || techDebtData.techDebtDescriptions.length === 0) {
            showToast("No technical debt details available", "warning");
            return;
        }
        
        // Create a modal-like container
        const modal = document.createElement('div');
        modal.className = 'tech-debt-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.right = '0';
        modal.style.bottom = '0';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        
        // Create the modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'tech-debt-modal-content';
        modalContent.style.backgroundColor = '#FFF';
        modalContent.style.borderRadius = '8px';
        modalContent.style.padding = '30px';
        modalContent.style.width = '80%';
        modalContent.style.maxWidth = '800px';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflow = 'auto';
        modalContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        modalContent.style.transform = 'translateY(-20px)';
        modalContent.style.transition = 'transform 0.3s ease';
        
        // Dark mode support
        if (document.body.classList.contains('dark-mode')) {
            modalContent.style.backgroundColor = '#1E1E1E';
            modalContent.style.color = '#E0E0E0';
            modalContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
        }
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.style.display = 'flex';
        modalHeader.style.alignItems = 'center';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.marginBottom = '20px';
        modalHeader.style.borderBottom = '1px solid #E0E0E0';
        modalHeader.style.paddingBottom = '10px';
        
        if (document.body.classList.contains('dark-mode')) {
            modalHeader.style.borderBottomColor = '#333';
        }
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Technical Debt Analysis';
        modalTitle.style.color = '#E91E63'; // Same color as the tech debt metric
        modalTitle.style.margin = '0';
        modalTitle.style.fontSize = '1.5rem';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '1.8rem';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0 10px';
        closeButton.style.color = document.body.classList.contains('dark-mode') ? '#E0E0E0' : '#333';
        closeButton.addEventListener('click', () => {
            // Animate closing
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        // Create modal body
        const modalBody = document.createElement('div');
        
        // Add summary
        const debtSummary = document.createElement('div');
        debtSummary.style.marginBottom = '20px';
        debtSummary.style.padding = '15px';
        debtSummary.style.backgroundColor = 'rgba(233, 30, 99, 0.1)';
        debtSummary.style.borderRadius = '8px';
        debtSummary.style.borderLeft = '4px solid #E91E63';
        
        debtSummary.innerHTML = `
            <p style="margin: 0 0 10px 0; font-weight: bold;">Technical Debt Summary:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 200px;">
                    <div style="font-size: 0.9rem; opacity: 0.7;">Technical Debt Score</div>
                    <div style="font-size: 1.5rem; font-weight: bold;">${techDebtData.debtPoints} story points</div>
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <div style="font-size: 0.9rem; opacity: 0.7;">Estimated Refactoring Time</div>
                    <div style="font-size: 1.5rem; font-weight: bold;">${techDebtData.refactoringHours} hours</div>
                </div>
            </div>
        `;
        
        // Add severity rating
        let severityText, severityColor;
        if (techDebtData.debtPoints < 10) {
            severityText = "Low";
            severityColor = "#4CAF50"; // Green
        } else if (techDebtData.debtPoints < 20) {
            severityText = "Moderate";
            severityColor = "#FF9800"; // Orange
        } else if (techDebtData.debtPoints < 35) {
            severityText = "High";
            severityColor = "#FF5722"; // Deep Orange
        } else {
            severityText = "Critical";
            severityColor = "#F44336"; // Red
        }
        
        const severityRating = document.createElement('div');
        severityRating.style.marginTop = '10px';
        severityRating.style.fontWeight = 'bold';
        severityRating.innerHTML = `Severity: <span style="color: ${severityColor};">${severityText}</span>`;
        debtSummary.appendChild(severityRating);
        
        modalBody.appendChild(debtSummary);
        
        // Add detected issues
        const issuesTitle = document.createElement('h4');
        issuesTitle.textContent = 'Detected Issues:';
        issuesTitle.style.marginBottom = '15px';
        modalBody.appendChild(issuesTitle);
        
        const issuesList = document.createElement('ul');
        issuesList.style.paddingLeft = '20px';
        
        techDebtData.techDebtDescriptions.forEach(issue => {
            const issueItem = document.createElement('li');
            issueItem.textContent = issue;
            issueItem.style.marginBottom = '10px';
            issuesList.appendChild(issueItem);
        });
        
        modalBody.appendChild(issuesList);
        
        // Add a funny quote
        const funnyQuotes = [
            "The code you write today becomes the legacy code of tomorrow. Unless it's pizza code, then it's just delicious.",
            "Technical debt is like pizza debt - you'll have to pay for it eventually, with interest!",
            "Programmers can eat pizza for breakfast, lunch, and dinner, but technical debt can eat your entire project.",
            "For every slice of pizza consumed, approximately 0.7 lines of dubious code are written.",
            "Code quality decreases proportionally to the number of pizza boxes in the recycling bin.",
            "Pizza-driven development: when your code architecture is inspired by how much pizza you've had."
        ];
        
        const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
        
        const quoteSection = document.createElement('div');
        quoteSection.style.marginTop = '30px';
        quoteSection.style.padding = '15px';
        quoteSection.style.backgroundColor = 'rgba(156, 39, 176, 0.1)';
        quoteSection.style.borderRadius = '8px';
        quoteSection.style.fontStyle = 'italic';
        quoteSection.style.textAlign = 'center';
        quoteSection.style.borderLeft = '4px solid #9C27B0';
        quoteSection.textContent = `"${randomQuote}"`;
        
        modalBody.appendChild(quoteSection);
        
        // Add actions
        const actionsSection = document.createElement('div');
        actionsSection.style.marginTop = '30px';
        actionsSection.style.display = 'flex';
        actionsSection.style.justifyContent = 'flex-end';
        actionsSection.style.gap = '15px';
        
        const refactorButton = document.createElement('button');
        refactorButton.textContent = "Order More Pizza & Refactor";
        refactorButton.style.backgroundColor = '#9C27B0';
        refactorButton.style.color = 'white';
        refactorButton.style.border = 'none';
        refactorButton.style.padding = '10px 20px';
        refactorButton.style.borderRadius = '4px';
        refactorButton.style.cursor = 'pointer';
        refactorButton.style.fontWeight = 'bold';
        refactorButton.addEventListener('click', () => {
            showToast("Pizza ordered! Refactoring scheduled for next sprint.", "success");
            
            // Animate closing
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        const ignoreButton = document.createElement('button');
        ignoreButton.textContent = "Ignore (Ship it!)";
        ignoreButton.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#333' : '#E0E0E0';
        ignoreButton.style.color = document.body.classList.contains('dark-mode') ? '#E0E0E0' : '#333';
        ignoreButton.style.border = 'none';
        ignoreButton.style.padding = '10px 20px';
        ignoreButton.style.borderRadius = '4px';
        ignoreButton.style.cursor = 'pointer';
        ignoreButton.addEventListener('click', () => {
            showToast("Technical debt ignored. Future you will be very upset!", "warning");
            
            // Animate closing
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        actionsSection.appendChild(ignoreButton);
        actionsSection.appendChild(refactorButton);
        
        modalBody.appendChild(actionsSection);
        
        // Assemble the modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        
        // Add to document
        document.body.appendChild(modal);
        
        // Add listener to close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                // Animate closing
                modal.style.opacity = '0';
                modalContent.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
        
        // Animate opening
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // New! Chaos Monkey test with wild animations
    function runChaosMonkey() {
        if (!elements.resultDiv) return;
        
        // Add styles for monkey animations if not already added
        if (!document.getElementById('monkey-styles')) {
            const monkeyStyles = document.createElement('style');
            monkeyStyles.id = 'monkey-styles';
            monkeyStyles.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                @keyframes flyingMonkey {
                    0% { transform: translate(calc(-100% - 100px), calc(100vh * var(--y))); opacity: 0; }
                    10% { opacity: 1; }
                    60% { transform: translate(calc(100vw + 100px), calc(100vh * var(--y))); opacity: 1; }
                    100% { transform: translate(calc(100vw + 100px), calc(100vh * var(--y))); opacity: 0; }
                }
                
                @keyframes jumpingMonkey {
                    0% { transform: translate(var(--x), 100vh); }
                    40% { transform: translate(var(--x), calc(100vh - var(--jump-height))); }
                    50% { transform: translate(var(--x), calc(100vh - var(--jump-height))); }
                    100% { transform: translate(var(--x), 100vh); }
                }
                
                @keyframes rotateMonkey {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                
                .flying-monkey {
                    position: fixed;
                    z-index: 9999;
                    font-size: 50px;
                    user-select: none;
                    pointer-events: none;
                    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5));
                }
                
                .jumping-monkey {
                    position: fixed;
                    bottom: 0;
                    z-index: 9998;
                    font-size: 40px;
                    user-select: none;
                    pointer-events: none;
                    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5));
                }
                
                .rotating-monkey {
                    display: inline-block;
                    animation: rotateMonkey 2s infinite linear;
                }
                
                .alert-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(255, 0, 0, 0.2);
                    z-index: 9997;
                    pointer-events: none;
                    animation: blink 0.5s 3;
                }
                
                .danger-text {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 80px;
                    color: red;
                    font-weight: bold;
                    text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
                    z-index: 9998;
                    pointer-events: none;
                    animation: blink 0.3s 5;
                }
                
                .terminal-cursor {
                    display: inline-block;
                    width: 10px;
                    height: 18px;
                    background-color: currentColor;
                    animation: blink 1s infinite;
                }
                
                .warning-banner {
                    background-color: rgba(255, 153, 0, 0.8);
                    color: black;
                    text-align: center;
                    padding: 10px;
                    font-weight: bold;
                    border-radius: 4px;
                    margin-bottom: 15px;
                    font-family: 'JetBrains Mono', 'Courier New', monospace;
                    text-transform: uppercase;
                    border: 2px solid #ff6347;
                }
            `;
            document.head.appendChild(monkeyStyles);
        }
        
        // Create warning banner
        const warningBanner = document.createElement('div');
        warningBanner.className = 'warning-banner';
        warningBanner.innerHTML = '⚠️ CHAOS MODE ACTIVATED ⚠️';
        elements.resultDiv.appendChild(warningBanner);
        
        // Create a container for the chaos monkey report
        const chaosContainer = document.createElement('div');
        chaosContainer.id = 'chaos-container';
        chaosContainer.style.border = '2px dashed #ff6347';
        chaosContainer.style.padding = '20px';
        chaosContainer.style.marginTop = '15px';
        chaosContainer.style.backgroundColor = 'rgba(255, 99, 71, 0.1)';
        chaosContainer.style.position = 'relative';
        chaosContainer.style.borderRadius = '8px';
        chaosContainer.style.overflow = 'hidden';
        
        // Chaos monkey header
        const header = document.createElement('h3');
        header.innerHTML = '🐵 Chaos Monkey Report <span class="rotating-monkey">🐒</span>';
        header.style.color = '#ff6347';
        header.style.marginBottom = '15px';
        
        // Results container
        const results = document.createElement('pre');
        results.style.margin = '0';
        results.style.fontSize = '14px';
        results.style.backgroundColor = '#0D1117';
        results.style.color = '#ff6347';
        results.style.borderRadius = '8px';
        results.style.fontFamily = "'JetBrains Mono', 'Courier New', monospace";
        results.style.lineHeight = '1.5';
        results.style.overflowX = 'auto';
        results.style.whiteSpace = 'pre-wrap'; // Wrap text instead of overflowing
        results.style.wordBreak = 'break-word'; // Break long words if needed
        results.style.maxHeight = '400px'; // Limit height to enable scrolling
        results.style.overflow = 'auto'; // Add scrollbars when needed
        
        // Add a container inside the pre to properly space the content
        const monkeyContentContainer = document.createElement('div');
        monkeyContentContainer.style.padding = '20px';
        monkeyContentContainer.style.paddingTop = '45px'; // Extra padding at top to avoid overlap with header
        results.appendChild(monkeyContentContainer);
        
        // Add everything to the container
        chaosContainer.appendChild(header);
        chaosContainer.appendChild(results);
        
        // Add container to the page
        elements.resultDiv.appendChild(chaosContainer);
        
        // Create alert overlay (will be added later in the sequence)
        const alertOverlay = document.createElement('div');
        alertOverlay.className = 'alert-overlay';
        
        // Create danger text (will be added later in the sequence)
        const dangerText = document.createElement('div');
        dangerText.className = 'danger-text';
        dangerText.textContent = 'CHAOS MODE';
        
        // Initiate the chaos sequence
        initiateScreenShaking();
        showToast("⚠️ WARNING: Chaos Monkey unleashed on your infrastructure!", "warning");
        
        // Display danger mode for 2 seconds
        document.body.appendChild(alertOverlay);
        document.body.appendChild(dangerText);
        
        setTimeout(() => {
            alertOverlay.remove();
            dangerText.remove();
            
            // Release the monkeys!
            releaseMonkeys();
            
            // Start the chaos test after initial animations
            runChaosTests();
        }, 2000);
        
        // Function to initiate screen shaking
        function initiateScreenShaking() {
            // Apply shake animation to the whole page
            document.body.style.animation = 'shake 0.5s linear infinite';
            
            // Stop shaking after 2 seconds
            setTimeout(() => {
                document.body.style.animation = '';
                
                // Add occasional random shakes during the test
                const randomShakes = setInterval(() => {
                    if (Math.random() > 0.7) {
                        document.body.style.animation = 'shake 0.3s linear';
                        setTimeout(() => {
                            document.body.style.animation = '';
                        }, 300);
                    }
                }, 4000);
                
                // Clear interval after chaos test is complete (20 seconds)
                setTimeout(() => {
                    clearInterval(randomShakes);
                }, 20000);
            }, 2000);
        }
        
        // Function to release the flying monkeys
        function releaseMonkeys() {
            // Release 10 flying monkeys
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const monkey = document.createElement('div');
                    monkey.className = 'flying-monkey';
                    monkey.innerHTML = '🐵';
                    monkey.style.setProperty('--y', Math.random().toFixed(2));
                    monkey.style.animation = `flyingMonkey ${2 + Math.random() * 4}s linear forwards`;
                    document.body.appendChild(monkey);
                    
                    // Remove after animation completes
                    setTimeout(() => {
                        monkey.remove();
                    }, 6000);
                }, i * 500);
            }
            
            // Create jumping monkeys from bottom of screen
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const monkey = document.createElement('div');
                    monkey.className = 'jumping-monkey';
                    monkey.innerHTML = '🙈';
                    monkey.style.setProperty('--x', `${Math.random() * 90 + 5}vw`);
                    monkey.style.setProperty('--jump-height', `${100 + Math.random() * 300}px`);
                    monkey.style.animation = `jumpingMonkey ${1 + Math.random() * 2}s ease-in-out`;
                    document.body.appendChild(monkey);
                    
                    // Remove after animation completes
                    setTimeout(() => {
                        monkey.remove();
                    }, 3000);
                }, 2000 + i * 1000);
            }
            
            // Continue releasing random monkeys
            const monkeyInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    const monkey = document.createElement('div');
                    monkey.className = 'flying-monkey';
                    monkey.innerHTML = Math.random() > 0.5 ? '🐒' : '🙊';
                    monkey.style.setProperty('--y', Math.random().toFixed(2));
                    monkey.style.animation = `flyingMonkey ${2 + Math.random() * 3}s linear forwards`;
                    document.body.appendChild(monkey);
                    
                    setTimeout(() => {
                        monkey.remove();
                    }, 5000);
                }
            }, 2000);
            
            // Stop releasing monkeys after 15 seconds
            setTimeout(() => {
                clearInterval(monkeyInterval);
            }, 15000);
        }
        
        // Run the actual chaos tests
        function runChaosTests() {
            const chaosTests = [
                "🔥 Simulating spike of 10,000 hungry developers...",
                "⏱️ Adding 500ms of artificial network latency to pizza delivery...",
                "🔌 Randomly terminating 30% of pizza instances...",
                "🚨 Testing pizza failover mechanisms...",
                "🔨 Breaking dependencies between sauce and cheese services...",
                "📊 Evaluating load balancing between multiple pizzerias...",
                "🍍 Injecting pineapple into random pizza slices...",
                "⚡ Stress testing pizza delivery under high voltage...",
                "🔒 Testing authentication between customer and delivery systems...",
                "💥 Triggering cascading topping failure scenario..."
            ];
            
            let index = 0;
            const typeText = (text, callback) => {
                let i = 0;
                const typing = setInterval(() => {
                    if (i < text.length) {
                        monkeyContentContainer.textContent += text.charAt(i);
                        // Scroll to bottom of results as text is typed
                        results.scrollTop = results.scrollHeight;
                        
                        // Scroll the page to keep the chaos container in view
                        if (i % 20 === 0) { // Only scroll occasionally to avoid jitters
                            chaosContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                        
                        i++;
                    } else {
                        clearInterval(typing);
                        monkeyContentContainer.textContent += '\n';
                        // Add blinking cursor temporarily
                        const cursor = document.createElement('span');
                        cursor.className = 'terminal-cursor';
                        monkeyContentContainer.appendChild(cursor);
                        
                        // Ensure container is in view
                        chaosContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        
                        // Remove cursor after delay
                        setTimeout(() => {
                            if (monkeyContentContainer.contains(cursor)) {
                                monkeyContentContainer.removeChild(cursor);
                            }
                            if (callback) callback();
                        }, 300);
                    }
                }, 20);
            };
            
            function processNextTest() {
                if (index < chaosTests.length) {
                    // Shake the screen occasionally during tests
                    if (Math.random() > 0.6) {
                        document.body.style.animation = 'shake 0.3s ease-in-out';
                        setTimeout(() => {
                            document.body.style.animation = '';
                        }, 300);
                    }
                    
                    typeText(chaosTests[index], () => {
                        // Add random recovery or failure messages
                        setTimeout(() => {
                            // 70% chance of success, 30% chance of failure
                            if (Math.random() > 0.3) {
                                typeText(`  ✅ Recovery successful! Pizza resilience confirmed.`, () => {
                                    index++;
                                    setTimeout(processNextTest, 400);
                                });
                            } else {
                                // Show failure message with red text
                                const failureMsg = `  ❌ FAILURE DETECTED! Initiating pizza recovery procedures...`;
                                typeText(failureMsg, () => {
                                    // Shake screen on failure
                                    document.body.style.animation = 'shake 0.4s ease-in-out';
                                    setTimeout(() => {
                                        document.body.style.animation = '';
                                        typeText(`  ✅ Recovery complete after failure.`, () => {
                                            index++;
                                            setTimeout(processNextTest, 400);
                                        });
                                    }, 400);
                                });
                            }
                        }, 300);
                    });
                } else {
                    setTimeout(() => {
                        monkeyContentContainer.textContent += "\n";
                        
                        // Calculate uptime between 60% and 99%
                        const uptime = Math.floor(Math.random() * 40 + 60);
                        
                        // Final report with dramatic pause
                        typeText(`🐵 Chaos Monkey Summary:\n`, () => {
                            setTimeout(() => {
                                // Apply shaking for dramatic effect
                                document.body.style.animation = 'shake 0.3s ease-in-out';
                                setTimeout(() => {
                                    document.body.style.animation = '';
                                }, 300);
                                
                                typeText(`Your pizza system survived with ${uptime}% uptime!`, () => {
                                    // Add random funny errors
                                    if (Math.random() > 0.5) {
                                        setTimeout(() => {
                                            typeText("\n⚠️ Unexpected Hawaiian pizza in production environment detected.", () => {
                                                setTimeout(() => {
                                                    // Add metrics and finalize
                                                    addMetricsToReport(chaosContainer, uptime);
                                                    
                                                    // Send a relieved toast message
                                                    showToast("Chaos Monkey test complete! Your system survived!", "success");
                                                    
                                                    // Stop any remaining animations
                                                    document.querySelectorAll('.flying-monkey, .jumping-monkey').forEach(el => el.remove());
                                                }, 800);
                                            });
                                        }, 600);
                                    } else {
                                        setTimeout(() => {
                                            // Add metrics and finalize
                                            addMetricsToReport(chaosContainer, uptime);
                                            
                                            // Send a relieved toast message
                                            showToast("Chaos Monkey test complete! Your system survived!", "success");
                                            
                                            // Stop any remaining animations
                                            document.querySelectorAll('.flying-monkey, .jumping-monkey').forEach(el => el.remove());
                                        }, 800);
                                    }
                                });
                            }, 500);
                        });
                    }, 500);
                }
            }
            
            // Start processing tests after a brief delay
            setTimeout(() => {
                processNextTest();
            }, 1000);
        }
        
        function addMetricsToReport(container, uptime) {
            // Add details section with key metrics
            const metricsSection = document.createElement('div');
            metricsSection.style.marginTop = '15px';
            metricsSection.style.display = 'flex';
            metricsSection.style.flexWrap = 'wrap';
            metricsSection.style.gap = '10px';
            
            // Add animated metric boxes
            const createMetricBox = (icon, label, value, color) => {
                const box = document.createElement('div');
                box.style.flex = '1 0 calc(50% - 10px)';
                box.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                box.style.padding = '10px';
                box.style.borderRadius = '4px';
                box.style.display = 'flex';
                box.style.alignItems = 'center';
                box.style.gap = '10px';
                box.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                box.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                
                // Add hover effect
                box.onmouseover = () => {
                    box.style.transform = 'translateY(-5px)';
                    box.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
                };
                box.onmouseout = () => {
                    box.style.transform = '';
                    box.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                };
                
                const iconEl = document.createElement('i');
                iconEl.className = icon;
                iconEl.style.fontSize = '24px';
                iconEl.style.color = color;
                
                const content = document.createElement('div');
                content.innerHTML = `<div style="font-size: 12px; opacity: 0.7;">${label}</div>
                                    <div style="font-weight: bold;">${value}</div>`;
                
                box.appendChild(iconEl);
                box.appendChild(content);
                
                // Animate box entrance
                box.style.opacity = '0';
                box.style.transform = 'translateY(20px)';
                
                return box;
            };
            
            // Create metrics with slightly staggered animations
            const metrics = [
                createMetricBox('fas fa-server', 'System Uptime', `${uptime}%`, '#ff6347'),
                createMetricBox('fas fa-fire-extinguisher', 'Recovery Success', `${Math.floor(Math.random() * 20) + 80}%`, '#FFD700'),
                createMetricBox('fas fa-tachometer-alt', 'Response Time', `${Math.floor(Math.random() * 200) + 100}ms`, '#1E90FF'),
                createMetricBox('fas fa-shield-alt', 'Resilience Score', `${Math.floor(Math.random() * 30) + 70}/100`, '#4CAF50')
            ];
            
            // Add metrics to section
            metrics.forEach(metric => {
                metricsSection.appendChild(metric);
            });
            
            // Add section to container
            container.appendChild(metricsSection);
            
            // Animate metrics in with staggered delay
            metrics.forEach((metric, index) => {
                setTimeout(() => {
                    metric.style.opacity = '1';
                    metric.style.transform = '';
                }, 100 * (index + 1));
            });
        }
    }
})();
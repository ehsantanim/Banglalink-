class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 15;
        this.slides = document.querySelectorAll('.slide');
        this.charts = {};
        
        this.initializeElements();
        this.initializeEventListeners();
        this.createSlideIndicators();
        this.updateUI();
        
        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.initializeSlideCharts();
        }, 500);
    }

    initializeElements() {
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.slideCounter = document.querySelector('.slide-counter');
        this.progressFill = document.querySelector('.progress-fill');
        this.slideIndicators = document.getElementById('slideIndicators');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.presentationContainer = document.querySelector('.presentation-container');
        
        // Debug: Log if elements are found
        console.log('Elements found:', {
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            slideIndicators: !!this.slideIndicators,
            fullscreenBtn: !!this.fullscreenBtn
        });
    }

    initializeEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Previous button clicked');
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked');
                this.nextSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'F11':
                case 'f':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });

        // Fullscreen button
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Fullscreen button clicked');
                this.toggleFullscreen();
            });
        }

        // Handle fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    }

    createSlideIndicators() {
        if (!this.slideIndicators) return;
        
        // Clear existing indicators
        this.slideIndicators.innerHTML = '';
        
        for (let i = 1; i <= this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = `slide-indicator ${i === 1 ? 'active' : ''}`;
            indicator.setAttribute('data-slide', i);
            
            // Add click event listener
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                const slideNum = parseInt(e.target.getAttribute('data-slide'));
                console.log(`Slide indicator ${slideNum} clicked`);
                this.goToSlide(slideNum);
            });
            
            this.slideIndicators.appendChild(indicator);
        }
        
        console.log(`Created ${this.totalSlides} slide indicators`);
    }

    nextSlide() {
        console.log(`Next slide: current=${this.currentSlide}, total=${this.totalSlides}`);
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        console.log(`Previous slide: current=${this.currentSlide}`);
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        console.log(`Going to slide ${slideNumber}`);
        
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            console.log('Invalid slide number');
            return;
        }

        // Remove active class from current slide
        if (this.slides[this.currentSlide - 1]) {
            this.slides[this.currentSlide - 1].classList.remove('active');
            
            // Add prev class for animation
            if (slideNumber < this.currentSlide) {
                this.slides[this.currentSlide - 1].classList.add('prev');
            } else {
                this.slides[this.currentSlide - 1].classList.remove('prev');
            }
        }

        // Update current slide
        this.currentSlide = slideNumber;

        // Add active class to new slide
        if (this.slides[this.currentSlide - 1]) {
            this.slides[this.currentSlide - 1].classList.add('active');
            this.slides[this.currentSlide - 1].classList.remove('prev');
        }

        // Update UI
        this.updateUI();

        // Initialize charts for specific slides
        setTimeout(() => {
            this.initializeSlideCharts();
        }, 300);
    }

    updateUI() {
        // Update slide counter
        if (this.slideCounter) {
            this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
        }

        // Update progress bar
        if (this.progressFill) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            this.progressFill.style.width = `${progress}%`;
        }

        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
            this.prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            this.nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';
        }

        // Update slide indicators
        const indicators = this.slideIndicators?.querySelectorAll('.slide-indicator');
        if (indicators) {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index + 1 === this.currentSlide);
            });
        }

        // Update next button text on last slide
        if (this.nextBtn) {
            if (this.currentSlide === this.totalSlides) {
                this.nextBtn.textContent = 'End';
            } else {
                this.nextBtn.textContent = 'Next →';
            }
        }
    }

    toggleFullscreen() {
        console.log('Toggle fullscreen called');
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && !document.msFullscreenElement) {
            
            // Enter fullscreen
            const elem = this.presentationContainer || document.documentElement;
            
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                document.mozFullScreenElement || document.msFullscreenElement);
        
        console.log('Fullscreen change:', isFullscreen);
        
        if (isFullscreen) {
            this.presentationContainer.classList.add('fullscreen');
            if (this.fullscreenBtn) {
                this.fullscreenBtn.textContent = 'Exit Fullscreen';
            }
        } else {
            this.presentationContainer.classList.remove('fullscreen');
            if (this.fullscreenBtn) {
                this.fullscreenBtn.textContent = 'Fullscreen';
            }
        }
    }

    initializeSlideCharts() {
        // Destroy existing charts first
        this.destroyCurrentSlideChart();
        
        // Only initialize charts for the current slide to improve performance
        switch(this.currentSlide) {
            case 10:
                this.initializeFinancialMetricsChart();
                break;
            case 11:
                this.initializeROIChart();
                this.initializePaybackChart();
                break;
            case 12:
                this.initializeRevenueChart();
                break;
        }
    }

    destroyCurrentSlideChart() {
        // Only destroy charts that might exist for current slide
        const chartsToDestroy = [];
        
        switch(this.currentSlide) {
            case 10:
                chartsToDestroy.push('financialMetrics');
                break;
            case 11:
                chartsToDestroy.push('roi', 'payback');
                break;
            case 12:
                chartsToDestroy.push('revenue');
                break;
        }
        
        chartsToDestroy.forEach(chartName => {
            if (this.charts[chartName]) {
                this.charts[chartName].destroy();
                delete this.charts[chartName];
            }
        });
    }

    initializeFinancialMetricsChart() {
        const canvas = document.getElementById('financialMetricsChart');
        if (!canvas || this.charts.financialMetrics) return;

        const ctx = canvas.getContext('2d');
        this.charts.financialMetrics = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['WellKiosk', 'CartCare', 'RentCity'],
                datasets: [
                    {
                        label: 'CAPEX (Crore Tk)',
                        data: [400, 3525, 40],
                        backgroundColor: '#1FB8CD',
                        borderColor: '#1FB8CD',
                        borderWidth: 1
                    },
                    {
                        label: 'Annual Revenue (Crore Tk)',
                        data: [1240, 20440, 8.5],
                        backgroundColor: '#FFC185',
                        borderColor: '#FFC185',
                        borderWidth: 1
                    },
                    {
                        label: 'Net Profit (Crore Tk)',
                        data: [620, 18915, 8.5],
                        backgroundColor: '#B4413C',
                        borderColor: '#B4413C',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Financial Metrics Comparison',
                        color: '#134252',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(94, 82, 64, 0.1)'
                        },
                        ticks: {
                            color: '#626C71'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(94, 82, 64, 0.1)'
                        },
                        ticks: {
                            color: '#626C71'
                        }
                    }
                }
            }
        });
    }

    initializeROIChart() {
        const canvas = document.getElementById('roiChart');
        if (!canvas || this.charts.roi) return;

        const ctx = canvas.getContext('2d');
        this.charts.roi = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['WellKiosk (155%)', 'CartCare (580%)', 'RentCity (21%)'],
                datasets: [{
                    data: [155, 580, 21],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'ROI Comparison (%)',
                        color: '#134252',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initializePaybackChart() {
        const canvas = document.getElementById('paybackChart');
        if (!canvas || this.charts.payback) return;

        const ctx = canvas.getContext('2d');
        this.charts.payback = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['WellKiosk', 'CartCare', 'RentCity'],
                datasets: [{
                    label: 'Payback Period (Months)',
                    data: [12, 2, 56],
                    backgroundColor: ['#ECEBD5', '#5D878F', '#DB4545'],
                    borderColor: ['#ECEBD5', '#5D878F', '#DB4545'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Payback Period Analysis',
                        color: '#134252',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(94, 82, 64, 0.1)'
                        },
                        ticks: {
                            color: '#626C71'
                        },
                        title: {
                            display: true,
                            text: 'Months',
                            color: '#626C71'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(94, 82, 64, 0.1)'
                        },
                        ticks: {
                            color: '#626C71'
                        }
                    }
                }
            }
        });
    }

    initializeRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas || this.charts.revenue) return;

        const ctx = canvas.getContext('2d');
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                datasets: [
                    {
                        label: 'WellKiosk Revenue',
                        data: [620, 1240, 1860, 2480, 3100],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'CartCare Revenue',
                        data: [10220, 20440, 30660, 40880, 51100],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'RentCity Revenue',
                        data: [4.25, 8.5, 12.75, 17, 21.25],
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Revenue Projections (Crore Tk)',
                        color: '#134252',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(94, 82, 64, 0.1)'
                        },
                        ticks: {
                            color: '#626C71'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(94, 82, 64, 0.1)'
                        },
                        ticks: {
                            color: '#626C71'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    const presentation = new PresentationController();
    
    // Auto-advance functionality (optional)
    let autoAdvanceTimer;
    let isAutoAdvancing = false;

    // Function to start auto-advance
    function startAutoAdvance(intervalMs = 30000) { // 30 seconds per slide
        if (isAutoAdvancing) return;
        
        isAutoAdvancing = true;
        autoAdvanceTimer = setInterval(() => {
            if (presentation.currentSlide < presentation.totalSlides) {
                presentation.nextSlide();
            } else {
                stopAutoAdvance();
            }
        }, intervalMs);
    }

    // Function to stop auto-advance
    function stopAutoAdvance() {
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }
        isAutoAdvancing = false;
    }

    // Stop auto-advance on user interaction
    document.addEventListener('keydown', stopAutoAdvance);
    document.addEventListener('click', stopAutoAdvance);
    document.addEventListener('touchstart', stopAutoAdvance);

    // Optional: Add auto-advance toggle button
    const autoAdvanceBtn = document.createElement('button');
    autoAdvanceBtn.className = 'btn btn--sm';
    autoAdvanceBtn.textContent = 'Auto';
    autoAdvanceBtn.style.marginLeft = '8px';
    autoAdvanceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAutoAdvancing) {
            stopAutoAdvance();
            autoAdvanceBtn.textContent = 'Auto';
        } else {
            startAutoAdvance();
            autoAdvanceBtn.textContent = 'Stop';
        }
    });
    
    // Add the auto-advance button to the controls
    const controls = document.querySelector('.presentation-controls');
    if (controls) {
        controls.appendChild(autoAdvanceBtn);
    }

    // Handle window resize for charts
    window.addEventListener('resize', () => {
        Object.values(presentation.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    });

    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;

        // Ensure horizontal swipe is more prominent than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe left - next slide
                presentation.nextSlide();
            } else {
                // Swipe right - previous slide
                presentation.previousSlide();
            }
        }

        touchStartX = 0;
        touchStartY = 0;
    });

    // Add print functionality
    const printBtn = document.createElement('button');
    printBtn.className = 'btn btn--outline btn--sm';
    printBtn.textContent = 'Print';
    printBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
    });
    
    if (controls) {
        controls.appendChild(printBtn);
    }

    // Add CSS for print media
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .presentation-header,
            .presentation-footer {
                display: none !important;
            }
            
            .slide {
                position: static !important;
                opacity: 1 !important;
                transform: none !important;
                page-break-after: always;
                padding: 1cm !important;
                height: auto !important;
                display: block !important;
            }
            
            .slide:last-child {
                page-break-after: avoid;
            }
            
            .slides-container {
                height: auto !important;
                overflow: visible !important;
            }
            
            .slide-content h1 {
                color: #000 !important;
                font-size: 24pt !important;
            }
            
            .chart-container {
                height: 300px !important;
            }
        }
    `;
    document.head.appendChild(printStyles);

    // Expose presentation instance globally for debugging
    window.presentation = presentation;
});
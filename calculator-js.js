document.addEventListener('DOMContentLoaded', function() {
    // Get all slider elements
    const casesSlider = document.getElementById('casesRange');
    const callsSlider = document.getElementById('callsRange');
    const ahtSlider = document.getElementById('ahtRange');
    const fcrSlider = document.getElementById('fcrRange');
    const trPercentSlider = document.getElementById('trPercentRange');
    const trCostSlider = document.getElementById('trCostRange');
    
    // Get value display elements
    const casesVal = document.getElementById('casesVal');
    const callsVal = document.getElementById('callsVal');
    const ahtVal = document.getElementById('ahtVal');
    const fcrVal = document.getElementById('fcrVal');
    const trPercentVal = document.getElementById('trPercentVal');
    const trCostVal = document.getElementById('trCostVal');
    
    // Get result elements
    const callsDeflections = document.querySelector('#callsDeflections span');
    const ahtImprovement = document.querySelector('#ahtImprovement span');
    const fcrImprovement = document.querySelector('#fcrImprovement span');
    const reducedTR = document.querySelector('#reducedTR span');
    const totalSavings = document.querySelector('#totalSavings span');
    
    // Initialize slider overlays
    updateSliderOverlay(casesSlider);
    updateSliderOverlay(callsSlider);
    updateSliderOverlay(ahtSlider);
    updateSliderOverlay(fcrSlider);
    updateSliderOverlay(trPercentSlider);
    updateSliderOverlay(trCostSlider);
    
    // Add event listeners to sliders
    casesSlider.addEventListener('input', function() {
        updateSliderValue(this, casesVal, true);
        updateSliderOverlay(this);
        calculateSavings();
    });
    
    callsSlider.addEventListener('input', function() {
        updateSliderValue(this, callsVal);
        updateSliderOverlay(this);
        calculateSavings();
    });
    
    ahtSlider.addEventListener('input', function() {
        updateSliderValue(this, ahtVal);
        updateSliderOverlay(this);
        calculateSavings();
    });
    
    fcrSlider.addEventListener('input', function() {
        updateSliderValue(this, fcrVal);
        updateSliderOverlay(this);
        calculateSavings();
    });
    
    trPercentSlider.addEventListener('input', function() {
        updateSliderValue(this, trPercentVal);
        updateSliderOverlay(this);
        calculateSavings();
    });
    
    trCostSlider.addEventListener('input', function() {
        updateSliderValue(this, trCostVal);
        updateSliderOverlay(this);
        calculateSavings();
    });
    
    // Toggle methodology accordion
    const accordionTitle = document.querySelector('.accordion-item-title-wrapper');
    const accordionBody = document.querySelector('.accordion-item-body-inner');
    
    accordionTitle.addEventListener('click', function() {
        this.classList.toggle('active');
        if (accordionBody.style.display === 'block') {
            accordionBody.style.display = 'none';
        } else {
            accordionBody.style.display = 'block';
        }
    });
    
    // Initial calculation
    calculateSavings();
    
    // Functions
    function updateSliderValue(slider, valueElement, formatThousands = false) {
        let value = slider.value;
        
        if (formatThousands) {
            value = Number(value).toLocaleString();
        }
        
        valueElement.textContent = value;
        
        // Update the position of the value label
        const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        const thumbWidth = 16; // Width of the slider thumb
        const valueWidth = valueElement.offsetWidth;
        const offset = (valueWidth / 2) - (thumbWidth / 2);
        
        // Position the value label above the slider thumb
        valueElement.style.left = `calc(${percent}% - ${offset}px)`;
    }
    
    function updateSliderOverlay(slider) {
        const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        const overlay = slider.parentElement.querySelector('.overlay');
        overlay.style.width = `calc(${percent}% + 2px)`;
    }
    
    function calculateSavings() {
        // Get current values
        const cases = parseInt(casesSlider.value);
        const callCost = parseInt(callsSlider.value);
        const aht = parseInt(ahtSlider.value);
        const fcr = parseInt(fcrSlider.value);
        const trPercent = parseInt(trPercentSlider.value);
        const trCost = parseInt(trCostSlider.value);
        
        // Assumptions (based on methodology)
        const selfCareUsage = 0.3; // 30% of cases
        const selfCareResolution = 0.3; // 30% of uses
        const assistedTimeSaved = 5; // 5 minutes per case
        const repeatCallReduction = 0.3; // 30%
        const truckRollsAvoided = 0.15; // 15%
        
        // Calculate call deflections savings
        const deflectedCalls = cases * selfCareUsage * selfCareResolution;
        const callDeflectionsSavings = deflectedCalls * (callCost * (aht / 60));
        
        // Calculate AHT improvement savings
        const nonDeflectedCalls = cases - deflectedCalls;
        const ahtSavings = nonDeflectedCalls * (callCost * (assistedTimeSaved / 60));
        
        // Calculate FCR improvement savings
        const currentRepeatCalls = (cases * (1 - (fcr / 100)));
        const improvedRepeatCalls = currentRepeatCalls * (1 - repeatCallReduction);
        const reducedRepeatCalls = currentRepeatCalls - improvedRepeatCalls;
        const fcrSavings = reducedRepeatCalls * (callCost * (aht / 60));
        
        // Calculate truck roll savings
        const currentTruckRolls = cases * (trPercent / 100);
        const reducedTruckRolls = currentTruckRolls * truckRollsAvoided;
        const trSavings = reducedTruckRolls * trCost;
        
        // Calculate total savings
        const total = callDeflectionsSavings + ahtSavings + fcrSavings + trSavings;
        
        // Update the display
        callsDeflections.textContent = Math.round(callDeflectionsSavings).toLocaleString();
        ahtImprovement.textContent = Math.round(ahtSavings).toLocaleString();
        fcrImprovement.textContent = Math.round(fcrSavings).toLocaleString();
        reducedTR.textContent = Math.round(trSavings).toLocaleString();
        totalSavings.textContent = Math.round(total).toLocaleString();
    }
});

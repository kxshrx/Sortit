document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const parent = document.querySelector(".main");
    const slider = document.getElementById("myRange");
    const output = document.getElementById("slidervalue");
    const randomizeBtn = document.getElementById("randomize");
    const sortBtn = document.getElementById("sorting");
    const learnBtn = document.querySelector(".learn-button");
    const learnModal = document.getElementById("learnModal");
    const closeLearnModal = document.getElementById("closeLearnModal");
    
    let arr = [];
    let isSorting = false;
    let shouldStop = false;
    
    // Initialize
    updateElements();
    
    // Responsive slider
    function updateSliderRange() {
        const containerWidth = document.querySelector('.visualization-container').offsetWidth;
        const minBarWidth = 8;
        const maxBars = Math.floor((containerWidth * 0.95) / (minBarWidth + 1));
        
        slider.max = Math.min(100, maxBars);
        slider.value = Math.min(slider.value, slider.max);
        output.innerHTML = slider.value;
        updateElements();
    }
    
    window.addEventListener('resize', updateSliderRange);
    updateSliderRange();
    
    function calculateHeight(value, totalBars) {
        return (value / totalBars) * 85;
    }
    
    // Update Elements
    function updateElements() {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        
        const sliderValue = parseInt(slider.value);
        arr = Array.from({length: sliderValue}, (_, i) => i + 1);
        
        arr.forEach(value => {
            const element = document.createElement('div');
            element.className = `num ${value}`;
            const heightPercent = calculateHeight(value, sliderValue);
            element.style.height = heightPercent + '%';
            parent.appendChild(element);
        });
        
        output.innerHTML = sliderValue;
    }
    
    // Slider input
    slider.addEventListener("input", updateElements);
    
    // Randomize
    randomizeBtn.addEventListener("click", () => {
        if (isSorting) return;
        
        arr.sort(() => Math.random() - 0.5);
        
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        
        arr.forEach(value => {
            const element = document.createElement('div');
            element.className = `num ${value}`;
            const heightPercent = calculateHeight(value, arr.length);
            element.style.height = heightPercent + '%';
            parent.appendChild(element);
        });
    });
    
    // Learn Modal
    learnBtn.addEventListener("click", () => {
        learnModal.style.display = "block";
        document.body.style.overflow = "hidden";
    });
    
    closeLearnModal.addEventListener("click", () => {
        learnModal.style.display = "none";
        document.body.style.overflow = "";
    });
    
    window.addEventListener("click", (e) => {
        if (e.target === learnModal) {
            learnModal.style.display = "none";
            document.body.style.overflow = "";
        }
    });
    
    // Helper function to swap elements with animation
    async function swap(i, j) {
        if (shouldStop) return;
        const bars = parent.children;
        
        // Swap heights
        const tempHeight = bars[i].style.height;
        bars[i].style.height = bars[j].style.height;
        bars[j].style.height = tempHeight;
        
        // Swap classes
        const tempClass = bars[i].classList[1];
        bars[i].classList.remove(bars[i].classList[1]);
        bars[i].classList.add(bars[j].classList[1]);
        bars[j].classList.remove(bars[j].classList[1]);
        bars[j].classList.add(tempClass);
        
        // Add animation class
        bars[i].classList.add("current");
        bars[j].classList.add("current");
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Remove animation class
        bars[i].classList.remove("current");
        bars[j].classList.remove("current");
    }
    
    // Selection Sort
    async function selectionSort() {
        const bars = parent.children;
        const n = bars.length;
        
        for (let i = 0; i < n - 1 && !shouldStop; i++) {
            let minIdx = i;
            
            for (let j = i + 1; j < n && !shouldStop; j++) {
                // Add animation class for current comparison
                bars[j].classList.add("current");
                bars[minIdx].classList.add("current");
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                const currentValue = parseInt(bars[j].classList[1]);
                const minValue = parseInt(bars[minIdx].classList[1]);
                
                if (currentValue < minValue) {
                    // Remove highlight from old minimum
                    bars[minIdx].classList.remove("current");
                    minIdx = j;
                }
                
                // Remove animation class
                bars[j].classList.remove("current");
            }
            
            if (minIdx !== i) {
                await swap(i, minIdx);
            }
        }
        
        // Reset controls if sort completed
        if (!shouldStop) {
            isSorting = false;
            sortBtn.textContent = "SORT";
            randomizeBtn.disabled = false;
            slider.disabled = false;
        }
    }
    
    // Sort button
    sortBtn.addEventListener("click", () => {
        if (isSorting) {
            // If currently sorting, stop it
            shouldStop = true;
            sortBtn.textContent = "SORT";
            randomizeBtn.disabled = false;
            slider.disabled = false;
            
            // Remove all highlights
            const bars = parent.children;
            for (let bar of bars) {
                bar.classList.remove("current");
            }
        } else {
            // Start sorting
            isSorting = true;
            shouldStop = false;
            sortBtn.textContent = "STOP";
            randomizeBtn.disabled = true;
            slider.disabled = true;
            selectionSort();
        }
    });
});

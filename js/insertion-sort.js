document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const parent = document.querySelector(".main");
    const slider = document.getElementById("myRange");
    const output = document.getElementById("slidervalue");
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const closeMenu = document.getElementById("closeMenu");
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
        // Calculate maximum bars based on container width
        const containerWidth = document.querySelector('.visualization-container').offsetWidth;
        const minBarWidth = 8; // Minimum width in pixels for each bar
        const maxBars = Math.floor((containerWidth * 0.95) / (minBarWidth + 1)); // Account for gap
        
        slider.max = Math.min(100, maxBars);
        slider.value = Math.min(slider.value, slider.max);
        output.innerHTML = slider.value;
        updateElements();
    }
    
    window.addEventListener('resize', updateSliderRange);
    updateSliderRange();
    
    // Sidebar Toggle
    menuBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
    });
    
    closeMenu.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });
    
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
        if (isSorting) return; // Prevent randomizing while sorting
        
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
    
    // Insertion Sort
    async function insertionSort() {
        const children = parent.children;
        const n = children.length;
        
        for (let i = 1; i < n && !shouldStop; i++) {
            let key = parseInt(children[i].classList[1]);
            let keyHeight = children[i].style.height;
            let j = i - 1;
            
            children[i].classList.add("current");
            await new Promise(resolve => setTimeout(resolve, 100));
            
            while (j >= 0 && !shouldStop && parseInt(children[j].classList[1]) > key) {
                children[j].classList.add("current");
                children[j + 1].classList.add("current");
                
                // Swap heights
                children[j + 1].style.height = children[j].style.height;
                
                // Swap classes
                const tempClass = children[j].classList[1];
                children[j + 1].classList.remove(children[j + 1].classList[1]);
                children[j + 1].classList.add(tempClass);
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                children[j].classList.remove("current");
                children[j + 1].classList.remove("current");
                
                j--;
            }
            
            if (shouldStop) {
                children[i].classList.remove("current");
                break;
            }
            
            // Place key in its correct position
            children[j + 1].style.height = keyHeight;
            children[j + 1].classList.remove(children[j + 1].classList[1]);
            children[j + 1].classList.add(key.toString());
            
            children[i].classList.remove("current");
        }
        
        // Reset controls
        isSorting = false;
        shouldStop = false;
        sortBtn.textContent = "SORT";
        randomizeBtn.disabled = false;
        slider.disabled = false;
    }
    
    // Sort button
    sortBtn.addEventListener("click", () => {
        if (isSorting) {
            // If currently sorting, stop it
            shouldStop = true;
            sortBtn.textContent = "SORT";
            randomizeBtn.disabled = false;
            slider.disabled = false;
        } else {
            // Start sorting
            isSorting = true;
            shouldStop = false;
            sortBtn.textContent = "STOP";
            randomizeBtn.disabled = true;
            slider.disabled = true;
            insertionSort();
        }
    });
});

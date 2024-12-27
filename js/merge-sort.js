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
    
    // Helper function to update bar heights and classes
    async function updateBar(index, value, height) {
        if (shouldStop) return;
        const bar = parent.children[index];
        bar.style.height = height;
        bar.classList.remove(bar.classList[1]);
        bar.classList.add(value.toString());
        bar.classList.add("current");
        await new Promise(resolve => setTimeout(resolve, 100));
        bar.classList.remove("current");
    }
    
    // Merge function
    async function merge(left, middle, right) {
        const n1 = middle - left + 1;
        const n2 = right - middle;
        
        // Create temp arrays
        const L = new Array(n1);
        const R = new Array(n2);
        const LHeight = new Array(n1);
        const RHeight = new Array(n2);
        
        // Copy data to temp arrays
        for (let i = 0; i < n1; i++) {
            L[i] = parseInt(parent.children[left + i].classList[1]);
            LHeight[i] = parent.children[left + i].style.height;
        }
        for (let j = 0; j < n2; j++) {
            R[j] = parseInt(parent.children[middle + 1 + j].classList[1]);
            RHeight[j] = parent.children[middle + 1 + j].style.height;
        }
        
        let i = 0, j = 0, k = left;
        
        // Merge temp arrays back
        while (i < n1 && j < n2 && !shouldStop) {
            if (L[i] <= R[j]) {
                await updateBar(k, L[i], LHeight[i]);
                i++;
            } else {
                await updateBar(k, R[j], RHeight[j]);
                j++;
            }
            k++;
        }
        
        // Copy remaining elements
        while (i < n1 && !shouldStop) {
            await updateBar(k, L[i], LHeight[i]);
            i++;
            k++;
        }
        
        while (j < n2 && !shouldStop) {
            await updateBar(k, R[j], RHeight[j]);
            j++;
            k++;
        }
    }
    
    // Merge Sort
    async function mergeSort(left, right) {
        if (left < right && !shouldStop) {
            const middle = Math.floor((left + right) / 2);
            
            await mergeSort(left, middle);
            await mergeSort(middle + 1, right);
            
            await merge(left, middle, right);
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
        } else {
            // Start sorting
            isSorting = true;
            shouldStop = false;
            sortBtn.textContent = "STOP";
            randomizeBtn.disabled = true;
            slider.disabled = true;
            mergeSort(0, parent.children.length - 1).then(() => {
                if (!shouldStop) {
                    // Only reset if we completed the sort
                    isSorting = false;
                    sortBtn.textContent = "SORT";
                    randomizeBtn.disabled = false;
                    slider.disabled = false;
                }
            });
        }
    });
});

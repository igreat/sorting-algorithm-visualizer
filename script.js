const wrapper = document.getElementById("wrapper");
const bars = wrapper.children;
const slider = document.getElementById("slider");
let frames = null;
let bar;
let n, spaces, barWidth;

const pixelsToInteger = str => parseInt(str.substring(0, str.length-2));
let wrapperWidth = 1000;

function updateN(newN) {
    n = newN;
    spaces = 100/n
    barWidth = (wrapperWidth - n*spaces)/n
}
updateN(50);

slider.oninput = () => {
    updateN(parseInt(slider.value))
    resetBars();
};

function randomizeBars() {
    for (let i = 0; i < n; i++) {
        bar = document.createElement("div");
        bar.classList.add("array");
        const h = Math.round(Math.random()*100, 10);
        bar.style.height = `${h}%`;
        bar.style.width = `${barWidth}px`;
        bar.style.margin = `${spaces}px`;
        bar.style.bottom = "0px";
        wrapper.append(bar);
    }
}
randomizeBars();

function resetBars() {
    const originalSize = bars.length;
    for (let i = 0; i < originalSize; i++) {
        wrapper.removeChild(bars[0]);
    }
    randomizeBars();
}

function getHeight(n) {
    return parseInt(n.style.height.substring(0, n.style.height.length-1));
}

function getHeightsList(barList) {
    const heights = [];
    for (const bar of barList) {
        heights.push(getHeight(bar));
    }
    return heights;
}

// THIS NEEDS A REDO TO INCLUDE ALL STEPS!
function selectionSortVisualize(barList) {
    resetBars();
    let i = 0;
    let j = 1;
    let bar1 = barList[i];
    let minBar = bar1;
    let frames = setInterval(() => {
        if (i >= barList.length) {
            clearInterval(frames);
            return;
        }
        const bar2 = barList[j];

        if (j < barList.length) {
            if (getHeight(bar2) < getHeight(minBar)) {
                minBar = bar2;
            }
            barList[j - 1].style.backgroundColor = "#141e27";
            barList[j++].style.backgroundColor = "red";
            return;
        }
        barList[j - 1].style.backgroundColor = "#141e27";
        const temp = bar1.style.height;
        bar1.style.height = minBar.style.height;
        minBar.style.height = temp;
        bar1 = barList[i];
        minBar = bar1;
        i++;
        j = i;

    }, 5);
}

function getAnimationListMergeSort(list) {
    const animationList = [];
    const listCopy = list.slice();
    mergeSort(list, listCopy, 0, list.length, animationList);
    return animationList;
}

function mergeSort(mainList, helperList, start, end, animationList) {
    if (end - start === 1) return;
    const mid = Math.floor((start + end) / 2);

    mergeSort(helperList, mainList, start, mid, animationList);
    mergeSort(helperList, mainList, mid, end, animationList);

    // Merges helperList into mainList
    // With each recursion level, the helperList and mainList are swapped
    merge(mainList, helperList, start, mid, end, animationList);
}

function merge(mainList, helperList, start, mid, end, animationList) {
    let k = i = start;
    let j = mid;

    while (i < mid && j < end) {
        const animation = [];
        animation.push([i, j]);
        if (helperList[i] <= helperList[j]) {
            animation.push([k, helperList[i]]);
            mainList[k++] = helperList[i++];
        } else {
            animation.push([k, helperList[j]]);
            mainList[k++] = helperList[j++];
        }
        animationList.push(animation);
    }

    while (i < mid) {
        const animation = [];
        animation.push([i, i], [k, helperList[i]]);
        mainList[k++] = helperList[i++];
        animationList.push(animation);
    }

    while (j < end) {
        const animation = [];
        animation.push([j, j], [k, helperList[j]]);
        mainList[k++] = helperList[j++];
        animationList.push(animation);
    }
}

function mergeSortVisualize(barList) {
    resetBars();
    const heights = getHeightsList(barList);
    const animationList = getAnimationListMergeSort(heights.slice());
    let i = 0;
    let j = 0;
    let previousTwoBars = [];
    let frames = setInterval(() => {
        if (i >= animationList.length) {
            clearInterval(frames);
            return;
        }
        if (j === 0) {
            const [barOneIndex, barTwoIndex] = animationList[i][j];
            barList[barOneIndex].style.backgroundColor = "red";
            barList[barTwoIndex].style.backgroundColor = "red";
            previousTwoBars = [barList[barOneIndex], barList[barTwoIndex]];
            j++;
        } else {
            previousTwoBars[0].style.backgroundColor = "#141e27";
            previousTwoBars[1].style.backgroundColor = "#141e27";
            const [barIndex, newHeight] = animationList[i][j];
            barList[barIndex].style.height = `${newHeight}%`;
            i++;
            j = 0;
        } 
    }, 5)
}

function quickSortVisualize(barList) {
    resetBars();
    const heights = getHeightsList(barList);
    const animationList = getAnimationsQuickSort(heights);
    let i = 0;
    let j = 0;
    let swap = false;
    const frames = setInterval(() => {
        if (i >= animationList.length) {
            clearInterval(frames);
            return;
        }

        const animation = animationList[i];
        if (j === 0) {
            barIndex = animation[j];
            barList[barIndex].style.backgroundColor = "red";
            j++;
            return;
        } 
        
        if (animation[j]) {
            const [barOneIndex, barTwoIndex] = animation[j];
            if (!swap) {
                barList[barOneIndex].style.backgroundColor = "red";
                barList[barTwoIndex].style.backgroundColor = "red";
                swap = true;
            } else {
                const temp = barList[barOneIndex].style.height ;
                barList[barOneIndex].style.height = barList[barTwoIndex].style.height;
                barList[barTwoIndex].style.height = temp;
                barList[barOneIndex].style.backgroundColor = "#141e27";
                barList[barTwoIndex].style.backgroundColor = "#141e27";
                swap = false;
                j = 0;
                i++;
            }
   
        } else {
            prevAnimation = animationList[i-1];
            barList[barIndex].style.backgroundColor = "#141e27";
            i++;
        }
    }, 5);
}

function getAnimationsQuickSort(list) {
    let animationList = [];
    quickSort(list.slice(), 0, list.length, animationList);
    return animationList;
}

function quickSort(list, left, right, animationList) {
    if (right - left <= 1) return;

    let p = partition(list, left, right, animationList);
    quickSort(list, left, p, animationList);
    quickSort(list, p + 1, right, animationList);
    
}

function partition(list, left, right, animationList) {
    let pivot = list[right - 1];
    let i = left - 1
    for (let j = left; j < right; j++) {
        const animation = [];
        animation.push(j);
        if (list[j] < pivot) {
            i++;
            const temp = list[i];
            list[i] = list[j];
            list[j] = temp;
            animation.push([i, j]);
        }
        animationList.push(animation);
    }
    const animation = [];
    animation.push(right - 1);
    list[right - 1] = list[i + 1];
    list[i + 1] = pivot;
    animation.push([i + 1, right - 1]);
    animationList.push(animation);
    return i + 1;
}



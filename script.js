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


function getAnimationsSelectionSort(list) {
    let animationList = [];
    for (let i = 0; i < list.length - 1; i++) {
        let minIndex = i + 1;
        for (let j = i; j < list.length; j++) {
            if (list[j] < list[minIndex]) {
                minIndex = j;
            }
            animationList.push(["highlight", [j]]);
        }
        const temp = list[minIndex];
        list[minIndex] = list[i];
        list[i] = temp;
        animationList.push(["swap", [i, minIndex]]);
    }
    console.log(list);
    return animationList;
}

function getAnimationsMergeSort(list) {
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
        animationList.push(["highlight", [i, j]]);
        if (helperList[i] <= helperList[j]) {
            animationList.push(["insert", [k, helperList[i]]]);
            mainList[k++] = helperList[i++];
        } else {
            animationList.push(["insert", [k, helperList[j]]]);
            mainList[k++] = helperList[j++];
        }
    }

    while (i < mid) {
        animationList.push(
            ["highlight", [i, i]], ["insert", [k, helperList[i]]]
            );
        mainList[k++] = helperList[i++];
    }

    while (j < end) {
        animationList.push(
            ["highlight", [j, j]], ["insert", [k, helperList[j]]]
            );
        mainList[k++] = helperList[j++];
    }
}

function visualize(getAnimations, barList) {
    resetBars();
    const heights = getHeightsList(barList);
    const animationList = getAnimations(heights);
    let i = 0;
    let mustDehighlight = false;
    let toDehighlight = [];
    const frames = setInterval(() => {
        if (i >= animationList.length) {
            clearInterval(frames);
            return;
        }
        if (mustDehighlight) {
            for (const j of toDehighlight) {
                if ((getHeight(barList[j]) === heights[j])) {
                    barList[j].style.backgroundColor = "green";
                } else {
                    barList[j].style.backgroundColor = "#141e27";
                }
            }
            mustDehighlight = false;
            toDehighlight = [];
        }
        switch (animationList[i][0]) {
            case "highlight":
                for (const j of animationList[i][1]) {
                    barList[j].style.backgroundColor = "red";
                }

                mustDehighlight = true;
                toDehighlight.push(...animationList[i][1]);
                break;
            case "swap":
                const [first, second] = animationList[i][1];
                const temp = barList[first].style.height ;
                barList[first].style.height = barList[second].style.height;
                barList[second].style.height = temp;
                barList[first].style.backgroundColor = "red";
                barList[second].style.backgroundColor = "red";

                mustDehighlight = true;
                toDehighlight.push(...animationList[i][1]);
                break;
            case "insert":
                const [j, newHeight] = animationList[i][1];
                barList[j].style.height = `${newHeight}%`;

                if (getHeight(barList[j]) === heights[j]) {
                    barList[j].style.backgroundColor = "green";
                    break;
                }
                barList[j].style.backgroundColor = "red";
                mustDehighlight = true;
                toDehighlight.push(j);
                break;
            default:
                console.log("INVALID ANIMATION TYPE");
        }
        i++;
    }, 5);
}

function getAnimationsQuickSort(list) {
    let animationList = [];
    quickSort(list, 0, list.length, animationList);
    return animationList;
}

function quickSort(list, left, right, animationList) {
    if (right - left <= 1) return;

    let p = partition(list, left, right, animationList);
    quickSort(list, left, p, animationList);
    quickSort(list, p + 1, right, animationList);
    
}

function partition(list, left, right, animationList) {
    // sorting the three positions (left, mid, right)
    const mid = Math.floor((right + left) / 2);
    const triplet = [left, mid, right - 1];
    for (let i = 0; i < 3; i++) {
        let minIndex = i;
        for (let j = i; j < 3; j++) {
            animationList.push("highlight", [j]);
            if (list[triplet[j] < list[minIndex]]) {
                animationList.push("swap", [i, j])
                const temp = list[minIndex];
                list[minIndex] = list[triplet[j]];
                list[triplet[j]] = temp;
            }
        }
    }
    
    const temp = list[right - 1];
    list[right - 1] = list[mid];
    list[mid] = temp;

    animationList.push(
        ["highlight", [mid]], 
        ["highlight", [mid, right - 1]],
        ["swap", [mid, right - 1]]
        );

    let pivot = list[right - 1];
    let i = left - 1
    for (let j = left; j < right; j++) {
        animationList.push(["highlight", [j]]);
        if (list[j] < pivot) {
            i++;
            const temp = list[i];
            list[i] = list[j];
            list[j] = temp;
            animationList.push(["highlight", [i, j]]);
            animationList.push(["swap", [i, j]]);
        }
    }
    animationList.push(["highlight", [right - 1]]);
    list[right - 1] = list[i + 1];
    list[i + 1] = pivot;
    animationList.push(["highlight", [i + 1, right - 1]]);
    animationList.push(["swap", [i + 1, right - 1]]);
    return i + 1;
}


function heapify(heap, i, heapLength) {
    let left = 2*i;
    let right = 2*i + 1;

    let max = i;
    if (left <= heapLength && heap[left] > heap[i]) {
        max = left;
    }

    if (right <= heapLength && heap[right] > heap[max]) {
        max = right;
    }

    if (max != i) {
        const temp = heap[i];
        heap[i] = heap[max];
        heap[max] = temp;

        heapify(heap, max, heapLength);
    }
}

function buildMaxHeap(list, heapLength) {
    for (let i = Math.floor(heapLength / 2); i >= 0; i--) {
        heapify(list, i, heapLength)
    }
}

function heapSort(list) {
    heapLength = list.length;
    buildMaxHeap(list, heapLength);

    for (let i = heapLength - 1; i >= 0; i--) {
        const temp = list[0];
        list[0] = list[i];
        list[i] = temp;

        heapLength--;
        heapify(list, 0, heapLength);
    }
}
 
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

// make sure a user can't overlap the function unless the sorting is done!
function insertionSortBars(barList) {
    resetBars();
    let i = 0;
    frames = setInterval(() => {
        if (i >= barList.length) {
            clearInterval(frames);
            return;
        }
        let bar1 = barList[i];
        let minBar = bar1;
        for (let j = i; j < barList.length; j++) {
            const bar2 = barList[j];
            if (getHeight(bar2) < getHeight(minBar)) {
                minBar = bar2;
            }
        }
        const temp = bar1.style.height;
        bar1.style.height = minBar.style.height;
        minBar.style.height = temp;
        i++;
    }, 5);
}


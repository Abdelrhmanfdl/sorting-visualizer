const selectedBarClr = "#fbfbfb",
  nextBarClr = "#ff0505",
  barMainClr = "#ffac05",
  finishedBarClr = "#fce2ae";
let bars,
  stopSorting = 0;

buildBars();
document.getElementById("arr-size").oninput = buildBars;

document.getElementById("new-arr-btn").onclick = buildBars;
document.getElementById("descending-arr-btn").onclick = buildBars;

function buildBars() {
  stopSorting = true;
  sortingAbility(1);

  bars = [];
  let isDesc = this == document.getElementById("descending-arr-btn");

  let arrSize = document.getElementById("arr-size").value;
  document.getElementById("current-arr-size-label").innerText =
    "Array Size = " + arrSize;

  let barsDiv = document.getElementById("bars");
  barsDiv.innerHTML = "";

  let arrOfBarSizes = Array.from(
    Array(Number.parseInt(arrSize)).keys(),
    (i) => i + 1
  );

  let R = arrOfBarSizes.length,
    currentIdx,
    newBar;

  if (!isDesc) {
    while (R > 0) {
      currentIdx = Math.floor(Math.random() * R);
      bars.push(arrOfBarSizes[currentIdx]);

      newBar = document.createElement("div");
      newBar.setAttribute("class", "bar");
      newBar.style.height = "" + arrOfBarSizes[currentIdx] + "vh";
      barsDiv.appendChild(newBar);

      [arrOfBarSizes[currentIdx], arrOfBarSizes[R - 1]] = [
        arrOfBarSizes[R - 1],
        arrOfBarSizes[currentIdx],
      ];
      R--;
    }
  } else {
    for (let i = arrOfBarSizes.length - 1; i >= 0; i--) {
      bars.push(arrOfBarSizes[i]);

      newBar = document.createElement("div");
      newBar.setAttribute("class", "bar");
      newBar.style.height = "" + arrOfBarSizes[i] + "vh";

      barsDiv.appendChild(newBar);
    }
  }
}

function pause(micSec) {
  return new Promise(function (resolve, reject) {
    setTimeout((_) => {
      resolve(1);
    }, micSec);
  });
}

function swapTwoChildren(elem1, elem2) {
  let x = elem1.cloneNode(true),
    y = elem2.cloneNode(true);
  elem1.parentNode.replaceChild(y, elem1);
  elem2.parentNode.replaceChild(x, elem2);
}

function sortingAbility(able) {
  for (
    let i = 0;
    i < document.getElementById("sorting-type").childElementCount;
    i++
  ) {
    document.getElementById("sorting-type").children[i].disabled = !able;
  }
}

async function bubbleSort() {
  stopSorting = false;
  sortingAbility(0);
  let swapHappened = false,
    barsChildren = document.getElementById("bars").children;

  for (let R = bars.length - 2; R >= 0; R--) {
    for (let L = 0; L <= R; L++) {
      if (stopSorting) return;

      let bar1 = barsChildren[L],
        bar2 = barsChildren[L + 1];

      bar1.style.backgroundColor = selectedBarClr;
      bar2.style.backgroundColor = nextBarClr;

      await pause(document.getElementById("delay").value);

      if (bars[L] > bars[L + 1]) {
        swapHappened = true;
        if (stopSorting) return;
        [bars[L], bars[L + 1]] = [bars[L + 1], bars[L]];
        swapTwoChildren(bar1, bar2);
      }
      barsChildren[L].style.backgroundColor = barMainClr;
      barsChildren[L + 1].style.backgroundColor = barMainClr;
    }
    if (swapHappened == false) break;
  }
  for (let i = 0; i < bars.length; i++) {
    if (stopSorting) return;
    barsChildren[i].style.backgroundColor = finishedBarClr;
    await pause(document.getElementById("delay").value);
  }
  sortingAbility(1);
}

async function selectionSort() {
  // buggy

  stopSorting = false;
  sortingAbility(0);

  let barsChildren = document.getElementById("bars").children,
    curMinIdx;

  for (let i = 0; i < barsChildren.length; i++) {
    if (stopSorting) return;

    curMinIdx = null;
    barsChildren[i].style.backgroundColor = selectedBarClr;

    for (let j = i; j < bars.length; j++)
      if (curMinIdx === null || bars[curMinIdx] > bars[j]) {
        curMinIdx = j;
      }

    barsChildren[curMinIdx].style.backgroundColor = nextBarClr;
    [bars[curMinIdx], bars[i]] = [bars[i], bars[curMinIdx]];
    if (i != curMinIdx) {
      swapTwoChildren(barsChildren[i], barsChildren[curMinIdx]);
    }

    await pause(document.getElementById("delay").value);
    barsChildren[i].style.backgroundColor = barMainClr;
    barsChildren[curMinIdx].style.backgroundColor = barMainClr;
  }
  for (let i = 0; i < bars.length; i++) {
    if (stopSorting) return;
    barsChildren[i].style.backgroundColor = finishedBarClr;
    await pause(document.getElementById("delay").value);
  }
  sortingAbility(1);
}

async function insertionSort() {
  stopSorting = false;
  sortingAbility(0);

  let barsChildren = document.getElementById("bars").children;
  for (let i = 0; i < barsChildren.length; i++) {
    let j = i - 1;

    while (j >= 0 && bars[j + 1] < bars[j]) {
      if (stopSorting) return;

      barsChildren[j + 1].style.backgroundColor = selectedBarClr;
      barsChildren[j].style.backgroundColor = nextBarClr;

      await pause(document.getElementById("delay").value);
      barsChildren[j + 1].style.backgroundColor = barMainClr;
      barsChildren[j].style.backgroundColor = barMainClr;

      [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
      swapTwoChildren(barsChildren[j], barsChildren[j + 1]);
      j--;
    }
  }
  for (let i = 0; i < bars.length; i++) {
    if (stopSorting) return;
    barsChildren[i].style.backgroundColor = finishedBarClr;
    await pause(document.getElementById("delay").value);
  }
  sortingAbility(1);
}

async function merge(l, mid, r) {
  let l1 = l,
    l2 = mid + 1,
    queue1 = [],
    queue2 = [],
    idx1Shifted = 0,
    barsChildren = document.getElementById("bars").children;

  for (let i = l1; i <= mid; i++) queue1.push(i);
  for (let i = l2; i <= r; i++) queue2.push(i);

  while (queue1.length && queue2.length && !stopSorting) {
    let idx1 = queue1[0] + idx1Shifted,
      idx2 = queue2[0];
    barsChildren[idx1].style.backgroundColor = selectedBarClr;
    barsChildren[idx2].style.backgroundColor = selectedBarClr;

    await pause(document.getElementById("delay").value);
    if (stopSorting) return;

    barsChildren[idx1].style.backgroundColor = barMainClr;
    barsChildren[idx2].style.backgroundColor = barMainClr;

    if (bars[idx1] > bars[idx2]) {
      let x = bars[idx2];
      bars.splice(idx2, 1);
      bars.splice(idx1, 0, x);

      x = barsChildren[idx2];
      document.getElementById("bars").removeChild(x);
      document.getElementById("bars").insertBefore(x, barsChildren[idx1]);
      queue2.shift();
      idx1Shifted++;
    } else {
      queue1.shift();
    }
  }
}

async function mergeSort(l = 0, r = bars.length - 1) {
  if (l == r || stopSorting) return;
  let mid = Math.floor((l + r) / 2);
  await mergeSort(l, mid);
  await mergeSort(mid + 1, r);
  await merge(l, mid, r);
}

async function controlMergeSort() {
  stopSorting = false;
  sortingAbility(0);
  let barsChildren = document.getElementById("bars").children;

  await mergeSort(0, bars.length - 1);

  for (let i = 0; i < bars.length; i++) {
    if (stopSorting) return;
    barsChildren[i].style.backgroundColor = finishedBarClr;
    await pause(document.getElementById("delay").value);
  }
  sortingAbility(1);
}

async function partitioning(l, r) {
  let I = l,
    J = r,
    pivot = bars[l],
    barsChildren = document.getElementById("bars").children;

  barsChildren[l].style.backgroundColor = selectedBarClr;

  while (I <= J && !stopSorting) {
    while (I <= r && bars[I] <= pivot && !stopSorting) I++;
    while (J >= l && bars[J] >= pivot && !stopSorting) J--;
    if (I > J) break;

    barsChildren[I].style.backgroundColor = nextBarClr;
    barsChildren[J].style.backgroundColor = nextBarClr;

    await pause(document.getElementById("delay").value);

    barsChildren[I].style.backgroundColor = barMainClr;
    barsChildren[J].style.backgroundColor = barMainClr;

    [bars[I], bars[J]] = [bars[J], bars[I]];
    swapTwoChildren(barsChildren[I], barsChildren[J]);
  }

  barsChildren[l].style.backgroundColor = barMainClr;

  if (J < l) return l;

  [bars[l], bars[J]] = [bars[J], bars[l]];
  swapTwoChildren(barsChildren[l], barsChildren[J]);
  return J;
}

async function quickSort(l, r) {
  if (l >= r || stopSorting) return;
  let pivotIdx = await partitioning(l, r);
  await quickSort(l, pivotIdx - 1);
  await quickSort(pivotIdx + 1, r);
}

async function controlQuickSort() {
  stopSorting = false;
  sortingAbility(0);
  let barsChildren = document.getElementById("bars").children;

  await quickSort(0, bars.length - 1);

  for (let i = 0; i < bars.length; i++) {
    if (stopSorting) return;
    barsChildren[i].style.backgroundColor = finishedBarClr;
    await pause(document.getElementById("delay").value);
  }
  sortingAbility(1);
}

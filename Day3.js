const fs = require('fs');

var rawDay3Input = fs.readFileSync('./Day3Input.txt');

var day3Input = rawDay3Input.toString().split('\r\n');

function IntersectRect(aRect1, aRect2) {
    let intersectLeft = Math.max(aRect1.left, aRect2.left);
    let intersectTop = Math.max(aRect1.top, aRect2.top);
    let xOverlap = Math.max(0, Math.min(aRect1.right, aRect2.right) - intersectLeft);
    let yOverlap = Math.max(0, Math.min(aRect1.bottom, aRect2.bottom) - intersectTop);
    return { "area": xOverlap * yOverlap, "rect": { "left": intersectLeft, "right": intersectLeft + xOverlap - 1, "top": intersectTop, "bottom": intersectTop + yOverlap - 1 } };
}

function GetRectArea(aRect) {
    return (aRect.right - aRect.left) * (aRect.bottom - aRect.top);
}

function RectsAreEqual(aRect1, aRect2) {
    return ((aRect1.left == aRect2.left) &&
        (aRect1.right == aRect2.right) &&
        (aRect1.top == aRect2.top) &&
        (aRect1.bottom == aRect2.bottom));
}

var parsedInput = [];
for (i = 0; i < day3Input.length; i++) {
    let line = day3Input[i].split(' ');
    let id = line[0];
    let rawLeftTop = line[2].split(',');
    let left = parseInt(rawLeftTop[0]);
    let top = parseInt(rawLeftTop[1].slice(0, rawLeftTop[1].length - 1));
    let rawWidthHeight = line[3].split('x');
    let width = parseInt(rawWidthHeight[0]);
    let height = parseInt(rawWidthHeight[1]);
    let right = left + width - 1;
    let bottom = top + height - 1;

    parsedInput.push({ "id": id, "rect": { "left": left, "right": right, "top": top, "bottom": bottom } });
}

var rectIntersections = [];
for (i = 0; i < parsedInput.length; i++)
    for (j = i + 1; j < parsedInput.length; j++) {
        let intersect = IntersectRect(parsedInput[i].rect, parsedInput[j].rect);
        if (intersect.area > 0)
            rectIntersections.push(intersect.rect);
    }

var squareInchesIntersect = 0;    
for (i = 0; i < rectIntersections.length; i++) {
    squareInchesIntersect += GetRectArea(rectIntersections[i]);
    for (j = i + 1; j < rectIntersections.length; j++) {
        if (rectIntersections[i].p && rectIntersections[j].p) {
            let intersect = IntersectRect(rectIntersections[i], rectIntersections[j]);
            if (intersect.area > 0) {
                squareInchesIntersect -= intersect.area;
            }
        }

    }
}

console.log(squareInchesIntersect);

function PrintFabric(aFabric) {
    for (i = 0; i < aFabric.length; i++)
        console.log(JSON.stringify(aFabric[i]));
}

//console.log(JSON.stringify(rectIntersections));
console.log(squareInchesIntersect);

var fabricLength = 1000;
var fabric = [];

for (i = 0; i < fabricLength; i++) {
    fabric[i] = [];
    for (j = 0; j < fabricLength; j++)
        fabric[i][j] = 0;
}

//PrintFabric(fabric);

for (i = 0; i < parsedInput.length; i++) {
    for (j = parsedInput[i].rect.top; j <= parsedInput[i].rect.bottom; j++)
        for (k = parsedInput[i].rect.left; k <= parsedInput[i].rect.right; k++)
            fabric[j][k]++;
}

console.log("\n");
//PrintFabric(fabric);

var tt = 0;
for (i = 0; i < fabricLength; i++)
    for (j = 0; j < fabricLength; j++)
        if (fabric[i][j] > 1)
            tt++;

console.log(tt);

for (i = 0; i < parsedInput.length; i++) {
    var found = true;
    for (j = parsedInput[i].rect.top; j <= parsedInput[i].rect.bottom; j++)
        for (k = parsedInput[i].rect.left; k <= parsedInput[i].rect.right; k++) {
            if (fabric[j][k] > 1) {
                found = false;
                break;
            }
        }

    if (found) {
        console.log(parsedInput[i].id);
        break;
    }
}
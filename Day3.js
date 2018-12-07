const fs = require('fs');

var rawDay3Input = fs.readFileSync('./Day3TestInput.txt');

var day3Input = rawDay3Input.toString().split('\r\n');

function IntersectRect(aRect1, aRect2) {

    let left = Math.max(aRect1.left, aRect2.left);
    let right = Math.min(aRect1.right, aRect2.right);
    let top = Math.max(aRect1.top, aRect2.top);
    let bottom = Math.min(aRect1.bottom, aRect2.bottom);
    let xOverlap = Math.max(0, right - left);
    let yOverlap = Math.max(0, bottom - top);
    let minLeft = Math.min(aRect1.left, aRect2.left);
    let maxRight = Math.max(aRect1.right, aRect2.right);
    let minTop = Math.min(aRect1.top, aRect2.top);
    let maxBottom = Math.min(aRect1.bottom, aRect2.bottom);

    if (xOverlap * yOverlap > 0) {
        return { "intersect": true, "area": (xOverlap + 1) * (yOverlap + 1), "rect": { "left": left, "right": right, "top": top, "bottom": bottom } };
    }
    else
        return { "intersect": false };
}

function GetRectArea(aRect) {
    return (aRect.right - aRect.left + 1) * (aRect.bottom - aRect.top + 1);
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
var squareInchesIntersect = 0;
for (i = 0; i < parsedInput.length; i++)
    for (j = i + 1; j < parsedInput.length; j++) {
        let intersect = IntersectRect(parsedInput[i].rect, parsedInput[j].rect);
        if (intersect.intersect) {
            squareInchesIntersect += intersect.area;
            let id = parsedInput[i].id + " " + parsedInput[j].id;
            //console.log(id + ": " + intersect.area);
            rectIntersections.push({"id": id,  "rect": intersect.rect});
        }
        //else
        //console.log(parsedInput[i].id + " " + parsedInput[j].id + ": Not intersecting!");
    }

    console.log(squareInchesIntersect);

var foundNew = false;
while(!foundNew) {
let pp = [];
for (i = 0; i < rectIntersections.length; i++) {
    for (j = i + 1; j < rectIntersections.length; j++) {
        let intersect = IntersectRect(rectIntersections[i].rect, rectIntersections[j].rect);
        if (intersect.intersect) { 
            foundNew = true;
            let found = false;
            for (k = 0; k < pp.length; k++)
              if (RectsAreEqual(intersect.rect, pp[k])) 
              {
                found = true;
                break;
              }

            if (!found) 
            {
              pp.push( {"rect": intersect.rect});
            }
            else 
            {
                //console.log(rectIntersections[i].id + " " + rectIntersections[j].id + ": " + intersect.area);
                //squareInchesIntersect -= intersect.area;
            }
        }
        //else
        //console.log(rectIntersections[i].id + " " + rectIntersections[j].id + ": Not intersecting!");

    }
}
  rectIntersections = pp;
}

console.log(rectIntersections);

var oo = 0;
for (i = 0; i < rectIntersections.length; i++)
  oo += GetRectArea(rectIntersections[i].rect);

console.log(oo);

function PrintFabric(aFabric) {
    for (i = 0; i < aFabric.length; i++)
        console.log(JSON.stringify(aFabric[i]));
}

//console.log(JSON.stringify(rectIntersections));
//console.log(squareInchesIntersect);

var fabricLength = 8;
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
PrintFabric(fabric);

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
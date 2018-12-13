const fs = require('fs');

var rawDay13Input = fs.readFileSync('./Day13Input.txt');

var day13Input = rawDay13Input.toString().split('\r\n');

var crop = [];
var carts = [];
var cartSymbols = "<>^v";
for (let i = 0; i < day13Input.length; i++) {
  if (crop[i] === undefined)
    crop[i] = [];

  crop[i] = day13Input[i].split('');

  for (let j = 0; j < crop[i].length; j++) {
    let mapSymbol = crop[i][j];
    if (cartSymbols.indexOf(mapSymbol) != -1) {
      carts.push({ cart: mapSymbol, x: j, y: i, iNext: 0, isRemoved: false });
      if ((mapSymbol == '<') || (mapSymbol == '>'))
        crop[i][j] = '-';
      else
        crop[i][j] = '|';
    }
  }
}

function SortCarts(aCarts) 
{
  aCarts.sort(function(aCart1, aCart2) { 
    if (aCart1.y < aCart2.y)
      return -1;
    else if (aCart1.y > aCart2.y)
      return 1;
    else 
    {
      if (aCart1.x < aCart2.x)
        return -1;
      else if (aCart1.x > aCart2.x)
        return 1;
      else 
        return 0;
    }
  });
}

function PrintCrop(aCrop) {
  for (let x = 0; x < aCrop.length; x++) {
    let line = "";
    for (let y = 0; y < aCrop[x].length; y++)
      line += (aCrop[x][y] == ' ') ? '.' : aCrop[x][y];

    console.log(line);
  }
}

function PrintCartsOnCrop(aCrop, aCarts, aNoRemoved) {
  let rawCrop = JSON.stringify(aCrop);
  let newCrop = JSON.parse(rawCrop);

  for (let i = 0; i < aCarts.length; i++) {

    if (aNoRemoved && aCarts[i].isRemoved)
      continue;

    let x = aCarts[i].x;
    let y = aCarts[i].y;

    if (newCrop[y][x] == undefined)
      throw "Cart " + JSON.stringify(aCarts[i]) + " outside crop!";

    newCrop[y][x] = aCarts[i].cart;
  }

  PrintCrop(newCrop);
}

console.log(carts);

PrintCrop(crop);

function CartsCollided(aCarts) {
  for (let i = 0; i < aCarts.length; i++)
    for (let j = i + 1; j < aCarts.length; j++) {
      if (!aCarts[i].isRemoved && 
          !aCarts[j].isRemoved &&
          (aCarts[i].x == aCarts[j].x) &&
          (aCarts[i].y == aCarts[j].y)) {
        aCarts[i].isRemoved = true;
        aCarts[j].isRemoved = true; 
        return { ret: true, x: aCarts[i].x, y: aCarts[i].y };
      }
    }

  return { ret: false };
}

function RemoveCollided(aCarts) {
  for (let i = 0; i < aCarts.length; i++)
    for (let j = 0; j < aCarts.length; j++) {

      if (i == j)
        continue;

      if (!aCarts[i].isRemoved && 
          !aCarts[j].isRemoved &&
          (aCarts[i].x == aCarts[j].x) &&
          (aCarts[i].y == aCarts[j].y)) {
        aCarts[i].isRemoved = true;
        aCarts[j].isRemoved = true; 

        //console.log("Removed: " + JSON.stringify(aCarts[i]));
      }
    }
}

function IsAtLastCart(aCarts) 
{
  let count = 0;
  for (let i = 0; i < aCarts.length; i++)
    if (!aCarts[i].isRemoved)
      count ++;

  return (count == 1);
}

function GetLastCart(aCarts) 
{
  for (let i = 0; i < aCarts.length; i++)
    if (!aCarts[i].isRemoved)
      return aCarts[i];
  return null;
}

function MoveLeft(aCart) {
  aCart.x -= 1;
}

function MoveRight(aCart) {
  aCart.x += 1;
}

function MoveUp(aCart) {
  aCart.y -= 1;
}

function MoveDown(aCart) {
  aCart.y += 1;
}

function GetCartNext(aCrop, aCart) {
  let x = aCart.x;
  let y = aCart.y;
  if (aCart.cart == '<')
    return aCrop[y][x - 1];
  else if (aCart.cart == '>')
    return aCrop[y][x + 1];
  else if (aCart.cart == '^')
    return aCrop[y - 1][x];
  else if (aCart.cart == 'v')
    return aCrop[y + 1][x];
  else
    return '#';
}

function IncINext(aCart) {
  if (aCart.iNext < 2)
    aCart.iNext++;
  else
    aCart.iNext = 0;
}

function DetectColision(aCrop, aCarts, aStopAtFirst) {

  let collision = { ret: false };

  while (!collision.ret) {

    SortCarts(aCarts);

    for (let i = 0; i < aCarts.length; i++) {

      if (!aStopAtFirst && aCarts[i].isRemoved)
        continue;

      if (aCarts[i].cart == '<') {
        let cropNextPos = GetCartNext(aCrop, aCarts[i]);
        if (cropNextPos == '/') {
          aCarts[i].cart = 'v';
        }
        else if (cropNextPos == '\\') {
          aCarts[i].cart = '^';
        }
        else if (cropNextPos == '+') {
          let iNext = aCarts[i].iNext;
          if (iNext == 0) {
            aCarts[i].cart = 'v';
          }
          else if (iNext == 2) {
            aCarts[i].cart = '^';
          }

          IncINext(aCarts[i]);
        }

        MoveLeft(aCarts[i]);
      }
      else if (aCarts[i].cart == '>') {
        let cropNextPos = GetCartNext(aCrop, aCarts[i]);
        if (cropNextPos == '/') {
          aCarts[i].cart = '^';
        }
        else if (cropNextPos == '\\') {
          aCarts[i].cart = 'v';
        }
        else if (cropNextPos == '+') {
          let iNext = aCarts[i].iNext;
          if (iNext == 0) {
            aCarts[i].cart = '^';
          }
          else if (iNext == 2) {
            aCarts[i].cart = 'v';
          }

          IncINext(aCarts[i]);
        }

        MoveRight(aCarts[i]);
      }
      else if (aCarts[i].cart == '^') {
        let cropNextPos = GetCartNext(aCrop, aCarts[i]);
        if (cropNextPos == '\\') {
          aCarts[i].cart = '<';
        }
        else if (cropNextPos == '/') {
          aCarts[i].cart = '>';
        }
        else if (cropNextPos == '+') {
          let iNext = aCarts[i].iNext;
          if (iNext == 0) {
            aCarts[i].cart = '<';
          }
          else if (iNext == 2) {
            aCarts[i].cart = '>';
          }
          IncINext(aCarts[i]);
        }

        MoveUp(aCarts[i]);
      }
      else if (aCarts[i].cart == 'v') {
        let cropNextPos = GetCartNext(aCrop, aCarts[i]);
        if (cropNextPos == '\\') {
          aCarts[i].cart = '>';
        }
        else if (cropNextPos == '/') {
          aCarts[i].cart = '<';
        }
        else if (cropNextPos == '+') {
          let iNext = aCarts[i].iNext;
          if (iNext == 0) {
            aCarts[i].cart = '>';
          }
          else if (iNext == 2) {
            aCarts[i].cart = '<';
          }

          IncINext(aCarts[i]);
        }

        MoveDown(aCarts[i]);
      }

      if (aStopAtFirst) 
      {
        collision = CartsCollided(aCarts);
        if (collision.ret)
          return collision;
      }
      else
        RemoveCollided(aCarts);
    }

    //PrintCartsOnCrop(aCrop, aCarts, true);

    if (!aStopAtFirst && IsAtLastCart(aCarts))
    {
      //PrintCartsOnCrop(aCrop, aCarts, true);
      break;
    }

  }

  return collision;
}

let rawCarts = JSON.stringify(carts);
let inputCarts = JSON.parse(rawCarts);
let collision = DetectColision(crop, carts, true);

console.log("First collision: " + collision.x + "," + collision.y);

DetectColision(crop, inputCarts, false);

let lastCart = GetLastCart(inputCarts);

if (lastCart)
  console.log("Last cart position: " + lastCart.x + "," + lastCart.y);
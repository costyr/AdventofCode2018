

var recipesBoard = [ 3, 7 ];

var elfsCurrent = [ 0, 1 ];

function GetReceipeDigits(aScore) 
{
  if (aScore < 10)
    return [ aScore ];

  let newReceipes = []
  let score = aScore;
  while (score > 0) 
  {
    newReceipes.push(score % 10)
    score = Math.floor(score / 10);
  }

  return newReceipes.reverse();
}

function PrintReceipeBoard(aRecipesBoard, aElfsCurrent) 
{
  let line = "";
  for (let i = 0; i < aRecipesBoard.length; i++)
  {
    if (i == aElfsCurrent[0])
       line += "(" + aRecipesBoard[i] + ") ";
    else if (i == aElfsCurrent[1])
       line += "[" + aRecipesBoard[i] + "] ";
    else 
       line += " " + aRecipesBoard[i] + "  ";
  }

  console.log(line);
}

function ReceipeBoardToString(aRecipesBoard, aStartPos) 
{
  let line = "";
  for (let i = aStartPos; i < aRecipesBoard.length; i++)
    line += aRecipesBoard[i];
  return line;
}

function ComputeElfNewIndex(aElfIndex, aElfScore, aRecipesBoard) 
{
  let elfIndex = aElfIndex + 1 + aElfScore;
  if (elfIndex >= aRecipesBoard.length)
    elfIndex = elfIndex % aRecipesBoard.length;
    
  return elfIndex;
}

let targetReceipeNumber = 209231;
let targetChunk = 10;
let totalReceipeNumber = targetReceipeNumber + targetChunk + 1;
let receipesLeftCount = -1;
let stringToMatch = targetReceipeNumber.toString();
let foundFirstTen = false;
let boardAtTargetReceipe = [];

while (receipesLeftCount == -1)
{
  let elf1Index = elfsCurrent[0];
  let elf2Index = elfsCurrent[1];

  let elf1Score = recipesBoard[elf1Index];
  let elf2Score = recipesBoard[elf2Index];

  let newRecipeScore = elf1Score + elf2Score;
  
  let newReceipes = GetReceipeDigits(newRecipeScore);

  for (let j = 0; j < newReceipes.length; j++)
    recipesBoard.push(newReceipes[j]);

  elfsCurrent[0] = ComputeElfNewIndex(elf1Index, elf1Score, recipesBoard);
  elfsCurrent[1] = ComputeElfNewIndex(elf2Index, elf2Score, recipesBoard);

  //PrintReceipeBoard(recipesBoard, elfsCurrent);
  //console.log(recipesBoard.length);

  if (!foundFirstTen && (recipesBoard.length >= totalReceipeNumber))
  {
    boardAtTargetReceipe = JSON.parse(JSON.stringify(recipesBoard));

    foundFirstTen = true;
  }

  if (receipesLeftCount == -1) 
  {
    let searchStartPos = recipesBoard.length - stringToMatch.length * 4;
    if (searchStartPos < 0)
      searchStartPos = 0;
    let lastRecipesStr = ReceipeBoardToString(recipesBoard, searchStartPos);
    //console.log(lastRecipesStr);
    if (lastRecipesStr.includes(stringToMatch)) 
    {
      let recipesBoardStr = ReceipeBoardToString(recipesBoard, 0);
      for (let k = 0; k < recipesBoardStr.length; k++) 
        if (recipesBoardStr.startsWith(stringToMatch, k)) 
        {
          receipesLeftCount = k;
          //console.log(recipesBoardStr);
          break;
        }
    }
  }
}

let lastTen = boardAtTargetReceipe.splice(targetReceipeNumber, targetChunk);

console.log("The ten recipes after " + targetReceipeNumber.toString() + " receipes are: " + JSON.stringify(lastTen));

console.log("Target receipes number appears after " + receipesLeftCount + " receipes");

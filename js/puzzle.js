var puzzle;
var menu;
var select;
var puzzleImages;
var blankPiece;
var allPuzzlePieces;
var won;

/***
	This function is responsible for hiding the won message
	after it has appeared. When closed, it activates the menu.
***/
function hideWonMessage(e)
{
	// Hide the won message
	won.style.bottom = "";
	remEvent(won, "click", hideWonMessage, false);
	activateMenu();
}

/***
	This function determines if the the user has won,
	by succesfully solving the puzzle.
***/
function hasWon()
{
	for (var i = 0; i < allPuzzlePieces.length - 1; i++)
	{
		if (allPuzzlePieces[i].id != i)
			return false;
	}

	return true;
}

/***
	This function switches the selected puzzle piece
	with the blank piece.
***/
function movePieces(aPiece)
{
	var blankPieceTop = blankPiece.style.top;
	var blankPieceLeft = blankPiece.style.left;

	blankPiece.style.top = aPiece.style.top;
	blankPiece.style.left = aPiece.style.left;

	aPiece.style.top = blankPieceTop;
	aPiece.style.left = blankPieceLeft;

	// Update position piece position in array
	var temp = allPuzzlePieces.indexOf(aPiece);
	allPuzzlePieces[allPuzzlePieces.indexOf(blankPiece)] = aPiece;
	allPuzzlePieces[temp] = blankPiece;
}

/***
	This function is responsible for validating the
	puzzle piece selected by the user. It checks if
	the piece is next to the blank piece.
***/
function isValid(aPiece)
{
	var top = parseInt(aPiece.style.top, 10);
	var left = parseInt(aPiece.style.left, 10);

	var blankTop = parseInt(blankPiece.style.top, 10);
	var blankLeft = parseInt(blankPiece.style.left, 10);

	var diffTop = Math.abs(blankTop - top);
	var diffLeft = Math.abs(blankLeft - left);
	if ((diffTop === 0 && diffLeft === 135) || (diffTop === 135 && diffLeft === 0))	
		return true;
	
	return false;
}

/***
	This function handles the click event on
	the puzzle. Any piece that is clicked is
	sent to this function which determines
	what to do next.
***/
function clickPiece(e)
{
	var evt = e || window.event;
	var obj = evt.target || evt.srcElement;

	if (isValid(obj))
	{
		movePieces(obj);
		if (hasWon())
		{
			won = document.getElementById("won");
			won.style.bottom = '50%';
			var aah = document.getElementById("audioWon");
			aah.volume = 0.2;
			aah.play();
			//Disable puzzle pieces
			remEvent(puzzle, "click", clickPiece, false);
			// Add event to won message (so that it can hide when clicked)	
			addEvent(won, "click", hideWonMessage, false);
		}
	}
}

/***
	This function randomizes an array. It will
	be used to randomize the puzzle pieces array.
***/
function randomize(array)
{
	for(var j, x, i = array.length - 1; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
		return array;	
}

/***
	This function is responsible for creating
	and setting all the puzzle pieces in place.
***/
function createPuzzle(img)
{
	// Set preview info & image	
	var preview = document.getElementById("preview");
	preview.style.background = "white";
	preview.innerHTML = "<h2>Puzzle Preview:</h2><img src='" + img + "'>";
	preview.innerHTML += "<div id='rules'><p>How To Play:</p><ol><li>Click on a puzzle piece next to the blank piece to make it slide.</li><li>Arrange the pieces so the puzzle matches the preview on the left.</li><li>Press escape on your keyboard to choose another puzzle.</li></ol></div>";

	// Clear puzzle
	puzzle.innerHTML = "";

	var counter = 0;
	allPuzzlePieces = [];

	// Create 16 puzzle pieces
	for (var i = 0; i < 4; i++)
	{
		for (var j = 0; j < 4; j++)
		{
			var puzzlePiece = document.createElement("div");

			// Set top, left coordinates
			var top = 135 * i;
			var left = 135 * j;

			puzzlePiece.style.top = top + "px";
			puzzlePiece.style.left = left + "px";

			// Set classname			
			puzzlePiece.className = "puzzlePiece";

			if (counter != 15)
			{
				// Set id (used to determine win)
				puzzlePiece.id = counter;

				// Set background image and background image's position x, y coordinates
				var posY = -top;
				var posX = -left;

				puzzlePiece.style.backgroundImage = "url('" + img + "')";			
				puzzlePiece.style.backgroundPosition = posX + "px " + posY + "px";
			}
			else
			{
				// This is the last puzzle piece with blank
				blankPiece = puzzlePiece;
				blankPiece.className += " blankPiece";
			}

			// Add piece's id to array of all puzzle pieces
			allPuzzlePieces[counter++] = puzzlePiece;

			// Add it to the puzzle
			puzzle.appendChild(puzzlePiece);
		}
	}

	// Randomize the allPuzzlePieces array
	var randomizedArray = randomize(allPuzzlePieces);
	counter = 0;
	for (var i = 0; i < 4; i++)
	{
		for (var j = 0; j < 4; j++)
		{
			var puzzlePiece = randomizedArray[counter++];
			
			// Set top, left coordinates
			var top = 135 * i;
			var left = 135 * j;

			puzzlePiece.style.top = top + "px";
			puzzlePiece.style.left = left + "px";	
		}
	}

	// Add event to the puzzle (enabling the clicking of puzzle pieces)
	addEvent(puzzle, "click", clickPiece, false);
}

/***
	This function is responsible for both buttons
	in the menu. It allows the user to see next or
	previous puzzle images.
***/
function otherPuzzleChoices(e)
{
	var evt = e || window.event;
	var obj = evt.currentTarget || evt.srcElement;

	if (obj.id == "btnNext")
	{
		select.scrollLeft += 400;
	}
	else
	{
		select.scrollLeft -= 400;
	}
}

/***
	This function activates or deactivates the menu.
***/
function activateMenu()
{
	// If won message was not clicked, it will be hidden.
	if (won != null)
		won.style.bottom = "";

	if (menu.style.display === "none")
	{
		menu.style.display = "block";
	}
	else
	{
		menu.style.display = "none";
	}
}

/***
	This function is responsible for listening to the
	user's keyboard. It only checks for the escape key
	used to display or hide the menu.
***/
function keyPressed(e)
{
	var evt = e || window.event;
	var keyPressed = (window.event) ? evt.keyCode : evt.which;

	// Check for escape key
	if (keyPressed === 27)
	{
		activateMenu();
	}
}

/***
	This function creates the puzzle that the user
	selected in the menu.
***/
function choosePuzzle(e)
{
	var evt = e || window.event;
	var obj = evt.currentTarget || evt.srcElement;

	// Add event for keyboard click
	addEvent(document, "keydown", keyPressed, false);
	// Hide menu and create puzzle.
	activateMenu();
	createPuzzle(obj.src);
}

/***
	This helper function adds events and
	assures their working condition by adapting
	to the W3C conventions and the Microsoft IE way.
***/
function addEvent(obj, type, fn, cap)
{
	if (obj.attachEvent)
		obj.attachEvent("on" + type, fn);
	else
		obj.addEventListener(type, fn, cap);		
}

/***
	This helper function removes events and
	assures a proper removal by using the appropriate
	methods, following W3C conventions and Microsoft IE
	way when needed.
***/
function remEvent(obj, type, fn, cap)
{
	if (obj.detachEvent)
		obj.detachEvent("on" + type, fn);
	else
		obj.removeEventListener(type, fn, cap);
}

/***
	This function is responsible for preloading all images
	in the sent array.
***/
function preloadImgs(imgs)
{
	var img = new Image();
	for (var i = 0; i < img.length; i++)
	{
		img.src = imgs[i];
	}
}

function init()
{
	// Preload all images
	preloadImgs(["images/puzzle/1.jpg", "images/puzzle/2.jpg", "images/puzzle/3.jpg", "images/puzzle/4.jpg", "images/clapping.gif", "images/logo.jpg"]);

	// Slide animation
	var sliding = document.getElementsByTagName("span");
	setTimeout(function() {
		for (var i = 0; i < sliding.length; i++)
		{
			sliding[0].style.fontStyle = "italic";
			sliding[i].style.left = '0';
		}
	}, 500);

	// Cache puzzle, menu and select object references
	puzzle = document.getElementById("puzzle");
	menu = document.getElementById("menu");
	select = document.getElementById("select");

	// Add events for all puzzle choices
	var puzzleChoice = document.getElementsByClassName("puzzleChoice");
	for (var i = 0; i < puzzleChoice.length; i++)
		addEvent(puzzleChoice[i], "click", choosePuzzle, false);

	// Add events for both buttons (btnPrev and btnNext)
	addEvent(document.getElementById("btnPrev"), "click", otherPuzzleChoices, false);
	addEvent(document.getElementById("btnNext"), "click", otherPuzzleChoices, false);
}

window.onload = init;
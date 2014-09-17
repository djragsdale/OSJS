var main = function (parameters) {
    var terminalLines = [];

    var exit = function () {
        interrupt = null;
        cursorRow = -1;
        cursorColumn = -1;
        while (lines.length > 0) {
            lines.pop();
        }
        while (terminalLines.length > 0) {
            lines.push(terminalLines.pop());
        }
        programControl = false;
        if (DEBUG) {
            addLine("Thank you for using EDIT.");
        }
    };

    //for (var i = 0; i < parameters.length; i++) {
    //	addLine(parameters[i]);
    //}	
    console.log("Taking over program control.");
    programControl = true;
    if ((parameters.length > 0) && (parameters[0] == "EDIT") && (testExtension(parameters[1], "TXT"))) {
        //var terminalLines = [];
        // when interrupt == 27 then I should exit program

        console.log("Saving terminal lines.");
        //terminalLines = lines;
        while (lines.length > 0) {
            terminalLines.push(lines.pop());
        }
        console.log("terminalLines has " + terminalLines.length + " lines.");
        console.log("lines has " + lines.length + " lines.");

        // Need to load the file first!
        //loadScript(parameters[1]);
        /*var fileName = parameters[1];
        if (testExtension(fileName, "TXT")) {
        if (DEBUG) { addLine("LOADING " + fileName + "."); }
		
        currentScript = [];

        if (fileName.substring(0, fileName.length - 4) == "") {
        addLine("An error occurred while loading file: invalid file name.");
        } else {
        if (DEBUG) { addLine("Querying filesystem for " + fileName + "..."); }
        }

        if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
        } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET", "getScript.php?q=" + fileName.substring(0, fileName.length - 4), false);
        xmlhttp.send();

        var results = JSON.parse(xmlhttp.responseText);

        for (var i = 0; i < results.length; i++) {
        currentScript.push(results[i]);
        }

        if (results.length > 0) {
        if (DEBUG) { addLine("..." + fileName + " loaded."); }
        } else {
        addLine("File loading error occurred: file does not exist.");
        }
        }
        else {
        addLine("INVALID FILE EXTENSION.");
        }*/

        interrupt = null;

        console.log("Establishing file string.");
        var fileString = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sagittis, lectus sit amet faucibus sodales, arcu lectus ornare massa, eget consequat justo tellus vitae elit. Nullam blandit elementum nisl, sit amet pellentesque neque condimentum at. Sed sapien massa, sagittis non accumsan in, efficitur sed enim. In at purus pretium, tincidunt massa non, egestas est. Nulla condimentum nisi ac nunc rhoncus ultrices. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla felis elit, commodo ac eros eget, sollicitudin eleifend mauris.";
        var programLines = [];
        var initialProgramLines = 2;

        var displayText = function () {
            // First, do the stuff I wanna do
            programLines = [];
            programLines.push("Welcome to EDIT!");
            programLines.push("");
            // Initialize array with number of needed rows
            for (var i = 0; i < (Math.floor(fileString.length / 76) + 1); i++) {
                programLines.push("");
            }
            // Do word wrap and put in array
            // Does not handle new lines yet.
            var lineNum = initialProgramLines; // So the Welcome to EDIT! line and blank line are ignored
            for (var i = 0; i < fileString.length; i++) {
                // Is this a new line character? If so, move to the next line.
                // If it's too many characters move to the next line.
                //if (fileString[i] == 'new line') {
                //	lineNum++;
                //}
                if (programLines[lineNum].length >= 76) {
                    lineNum++;
                }

                programLines[lineNum] += fileString[i];
            }

            //lines = [];
            //lines.length = 0;
            // lines = [] doesn't work, and while loop with lines.pop is the next performant method
            while (lines.length > 0) {
                lines.pop();
            }

            for (var i = 0; i < maxLines && i < programLines.length; i++) {
                lines.push(programLines[i]);
            }
        };

        displayText();
        cursorRow = 0;
        cursorColumn = 0;

        var wkrTimer = new Worker('runProgram.js');

        wkrTimer.onmessage = function (event) {

            var logCursor = function () {
                console.log('Cursor row is ' + cursorRow + ' out of ' + programLines.length);
                console.log('Cursor column is ' + cursorColumn + ' out of ' + programLines[cursorRow].length);
                console.log('"' + programLines[cursorRow] + '".');
            };

            if (DEBUG && interrupt != null) {
                console.log("Interrupt is " + interrupt + " which translates as " + String.fromCharCode(interrupt) + ".");
            }

            //pgmStatus = event.data.line;
            //Do operations here first

            // Check for Save key combo first
            // If save, post fileString, filename, extension, and user to setFile.php

            // Test for backspace key
            // If 8, remove letter PRECEDING cursor (cursor bar technically at front of cursor)
            if (interrupt != null && interrupt == 8) {
                interrupt = null;
                // Remove the character
                var charIndex = cursorColumn;
                for (var i = initialProgramLines; i < programLines.length && i < cursorRow; i++) {
                    charIndex += programLines[i].length;
                }
                fileString = fileString.substring(0, charIndex - 1) + fileString.substring(charIndex, fileString.length);

                // Move the cursor
                interrupt = 37; // Spoof the left arrow key here
            }

            // Test for period key
            //if (interrupt != null && interrupt == 46) {
            //    if (DEBUG) {
            //        console.log("Interrupt is " + interrupt + " which translates as " + String.fromCharCode(interrupt) + ".");
            //    }
            //    interrupt = null;
            //
            //}

            // Test for delete key
            // If 15, remove letter under cursor
            if (interrupt != null && interrupt == 15) {
                interrupt = null;
                // Remove the character
                var charIndex = cursorColumn;
                for (var i = initialProgramLines; i < programLines.length && i < cursorRow; i++) {
                    charIndex += programLines[i].length;
                }
                fileString = fileString.substring(0, charIndex) + fileString.substring(charIndex + 1, fileString.length);
            }

            // Test for enter key
            // If 13, add a new line
            if (interrupt != null && interrupt == 13) {
                interrupt = null;
            }

            // Test for letters being pressed
            // If letter/character, add character before cursor
            if (interrupt != null && interrupt != 13 && interrupt != 27 && interrupt != 37 && interrupt != 38 && interrupt != 39 && interrupt != 40 && interrupt != 8 && interrupt != 15) {
                interrupt == null;
                // Is it a valid letter/character? Maybe test with a regex.
                // For now, I'll just add it.

                // Find the cursor
                var charIndex = cursorColumn;
                for (var i = initialProgramLines; i < programLines.length && i < cursorRow; i++) {
                    charIndex += programLines[i].length;
                }
                // Add the character
                fileString = fileString.substring(0, charIndex) + String.fromCharCode(interrupt) + fileString.substring(charIndex, fileString.length);

                // Move the cursor
                interrupt = 39; // Spoof the right arrow key here
            }

            // Test for arrow keys next
            if (interrupt != null && interrupt == 37) {
                interrupt = null;
                // TODO: Let cursor wrap from end of one line to start of next
                // move cursor left
                if (cursorColumn > 0) {
                    cursorColumn--;
                }
                else if (cursorRow > initialProgramLines) {
                    cursorRow--;
                    cursorColumn = programLines[cursorRow].length - 1;
                }
                logCursor();
            }
            if (interrupt != null && interrupt == 38) {
                interrupt = null;
                // move cursor up
                if (cursorRow > initialProgramLines) {
                    cursorRow--;
                }
                if (cursorColumn > programLines[cursorRow].length - 1) {
                    if (programLines[cursorRow].length == 0) { cursorColumn = 0; }
                    else {
                        cursorColumn = programLines[cursorRow].length - 1;
                    }
                }
                logCursor();
            }
            if (interrupt != null && interrupt == 39) {
                interrupt = null;
                // TODO: Let cursor wrap from end of one line to start of next
                // move cursor right
                if (cursorColumn < programLines[cursorRow].length - 1) {
                    cursorColumn++;
                }
                logCursor();
            }
            if (interrupt != null && interrupt == 40) {
                interrupt = null;
                // move cursor down
                if (cursorRow < programLines.length - 1) {
                    cursorRow++;
                }
                if (cursorColumn > programLines[cursorRow].length - 1) {
                    if (programLines[cursorRow].length == 0) { cursorColumn = 0; }
                    else {
                        cursorColumn = programLines[cursorRow].length - 1;
                    }
                }
                logCursor();
            }

            displayText();

            // Exit the program if ESC is pressed
            if (interrupt != null && interrupt == 27) {
                interrupt = null;
                //fgColor = "#00FF00";
                wkrTimer.terminate();
                wkrTimer = undefined;

                exit();
            }
        };

        wkrTimer.postMessage({ time: 10 });
    }
    else {
        exit();

        addLine("SYNTAX ERROR.");
    }

}

var main = function(parameters) {
	if ((parameters.length > 0) && (parameters[0] == "BATCH") && (testExtension(parameters[1], "BAT"))) {
		// Need to load the script first!
		//loadScript(parameters[1]);
		var fileName = parameters[1];
		if (testExtension(fileName, "BAT")) {
			addLine("LOADING " + fileName + ".");

			currentScript = [];

			if (fileName.substring(0, fileName.length - 4) == "") {
				addLine("An error occurred while loading script: invalid file name.");
			} else {
				addLine("Querying filesystem for " + fileName + "...");
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
				addLine("..." + fileName + " loaded.");
			} else {
				addLine("...file loading error occurred: file does not exist.");
			}
		}
		else {
			addLine("INVALID FILE EXTENSION.");
		}

		var scriptTitle = "";
		var tokenList = [];

		var began = false;
		for (var i = 0; i < currentScript.length; i++) {
			// Parse the line
			var strLine = currentScript[i];
			var line = lexLine(strLine);

			// Preprocessing to replace parameter AND VARIABLE references
			// line[j] is the word in the line
			for (var j = 0; j < line.length; j++) {
				for (var k = 0; k < line[j].length; k++) {
					if (line[j][k] == '#') {
						var paramNum = parseInt(line[j][k + 1]);
						if ((paramNum > 9) || (paramNum < 1)) {
							addLine("ERROR PARSING PARAMETER ON LINE " + (i + 1) + ".");
							i = currentScript.length;
						}
						else if (k == 0) {
							var newString = parseInt(parameters[paramNum + 1]) + line[j].substring(2, line[j].length);
							line[j] = newString;
						}
						else if (line[j][k - 1] != '\\') {
							// addLine("FIRST PART:" + line[j].substring(0, k) + " SECOND PART:" + parseInt(parameters[paramNum + 1]) + " THIRD PART:" + line[j].substring((k + 2), line[j].length) + ".");
							var newString = line[j].substring(0, k) + parseInt(parameters[paramNum + 1]) + line[j].substring((k + 2), line[j].length);
							line[j] = newString;
						}
					}
				}

				// Check for variables
				if (line[j][0] == '$') {
					if ((line[0] == 'ECHO') || (line[0] == 'IF')) {
						//addLine("Searching for variable...");
						var tokenIndex;
						var varName = line[j].substring(1, line[j].length);

						for (var k = 0; k < tokenList.length; k++) {
							if (tokenList[k].key == varName) {
								line[j] = tokenList[k].value;
								//addLine("VARIABLE $" + line[j] + " BEING REPLACED.");
								k = tokenList.length;
							}
						}
					}
				}
			}

			if ((i == 0) && (line[0] == "BEGIN")) {
				began = true;
				scriptTitle = line[1];
				addLine("BEGINNING " + scriptTitle + " SCRIPT.");
			}
			else if (i == 0) {
				// BEGIN has to be on the first line or entire thing fails.
				addLine("BEGIN COMMAND MISSING ON FIRST LINE.");
				i = currentScript.length;
			}
			else if (line[0] == "EXIT") {
				addLine("EXITING " + scriptTitle + " SCRIPT.");
				i = currentScript.length;
			}
			else if (line[0] == "PAUSE") {
				pause(3);
			}
			else if (line[0] == "ECHO") {
				addLine(line[1]);
			}
			else if (line[0] == "REM") {

			}
			else if (line[0] == "GOTO") {
				// Subtract 1 so that user can start counting at line 1 instead of line 0.
				// Subtract 1 again so that when i++ runs it goes to correct line :).
				i = line[1] - 2;
			}
			else if (line[0] == "IF") {
				var ifExpression = "";
				for (var j = 1; j < line.length; j++) {
					ifExpression += line[j];
				}

				var ifResult = evaluateExpression(ifExpression);

				if (ifResult == true) {
					// Nothing happens because I'm going to run my next line
				} else {
					// i is incremented to get to the ELSE line
					i++;
				}
			}
			else if (line[0] == "VAR") {
				// Make sure variable name doesn't already exist
				//  - If it doesn't, pop it to the token list
				//  - If it does, add error and end script

				var varName = line[1].substring(1, line[1].length);
				var exists = false;
				for (var j = 0; j < tokenList.length; j++) {
					if (tokenList[j].key == varName) { exists = true; }
				}

				//addLine("VARIABLE EXISTS: " + exists);

				if (!exists) {
					tokenList.push({
						key: varName,
						value: ""
					});
				} else {
					i = currentScript.length;
				}
			}
			else if (line[0] == "LET") {
				if (line[2] == '=') {
					var varName0Exists = false;
					var varName0 = line[1].substring(1, line[1].length);
					var varName0Index;

					// Make sure variable name exists
					for (var j = 0; j < tokenList.length; j++) {
						if (tokenList[j].key == varName0) {
							varName0Exists = true;
							varName0Index = j;
						}
					}

					if (varName0Exists) {
						var tempExp = "";
						for (var j = 3; j < line.length; j++) {
							tempExp += line[j];
						}
						tokenList[varName0Index].value = evaluateExpression(tempExp, tokenList);
					}
					else {
						addLine("VARIABLE1 NAME '$" + varName0 + "' ON LINE " + (i + 1) + " DOES NOT EXIST.");
						i = currentScript.length;
					}
				} else {
					addLine("INVALID OPERATOR ON LINE " + (i + 1) + ".");
					i = currentScript.length;
				}
			}
			else {
				addLine("AN ERROR OCCURRED ON LINE " + (i + 1) + " OF " + parameters[1] + ".");
				i = currentScript.length;
			}
		}

		tokenList = [];
	}
	else {
		addLine("SYNTAX ERROR.");
	}

}

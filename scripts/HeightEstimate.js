// The CameraVideoPageController is a class that controls the camera 
// video page.  This class provides a some useful methods you will
// need to call:
//     cameraVideoPage.displayMessage(message, timeout):
//         Causes a short message string to be displayed on the
//         page for a brief period.  Useful for showing quick
//         notifications to the user.  message is a plain string.
//         timeout is option and denotes the length of time in msec
//         to show the message for.
//     cameraVideoPage.setHeadsUpDisplayHTML(html):
//         This will set or update the heads-up-display with the
//         text given in the html argument.  Usually this should 
//         just be a string with text and line breaks (<br />).

// Initialise the camera video page and callback to our 
// cameraVideoPageInitialised() function when ready.
var cameraVideoPage = new CameraVideoPageController(
    cameraVideoPageInitialised);

// Internally accessed global variables
var internalVar = {
    baseLength: 0,
    bCounter: 0,
    medianArray: Array.apply(null, Array(9)).map(Number.prototype.valueOf, 0),
}

// Display variables
var userHeight, displayHeight, apexAngle, baseAngle, betaAngle;

// This function will be called when the camera video page
// is intialised and ready to be used.
function cameraVideoPageInitialised() {
    // Step 1: Check for and intialise deviceMotion
    if (window.DeviceMotionEvent) {
        window.addEventListener('deviceorientation', deviceMotion);
    }
}

// Function to handle device beta angles
function deviceMotion(event) {
    var smooth = function(beta, bCounter) { // Adds value into array
        internalVar.medianArray[bCounter - 1] = beta;
    }
    var beta = event.beta;
    if (internalVar.bCounter < internalVar.medianArray.length) {
        //Index changer for global array (to fill the array)
        internalVar.bCounter += 1;
    } else {
        // Find median of full array
        internalVar.medianArray.sort();
        betaAngle = internalVar.medianArray[4].toFixed(0);
        headsUpDisplay();
        internalVar.bCounter = 0;
    }
    // Captures a single beta to add to the global array
    smooth(beta, internalVar.bCounter);
}

// This function is called by a button to set the height of phone from the
// ground, in metres.
function setCameraHeightValue() {
    var inputHeight
        // Step 3: Set camera height
    inputHeight = Number(window.prompt("Please enter the height of the camera from the ground (meters): "));
    // check if input is a number and is positive
    if (isNaN(inputHeight) == false && inputHeight > 0) {
        // display on screen using the displayMessage method
        userHeight = inputHeight;
    } else {
        cameraVideoPage.displayMessage("Input is invalid, please try again.", 2000);
    }

}

// This function is called by a button to set the angle to the base of
// the object being measured.  It uses the current smoothed tilt angle.
function setBaseTiltAngle() {
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
    // betaAngle needs to be evaluted as a number to ensure proper error checking
    if (Number(betaAngle) > apexAngle) {
        cameraVideoPage.displayMessage("The Base Angle must be less than the Apex Angle. Try Again", 2500);
    } else {

        baseAngle = betaAngle;
    }
}

// This function is called by a button to set the angle to the apex of
// the object being measured.  It uses the current smoothed tilt angle.
function setApexTiltAngle() {
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
    // Makes sure apex is greater than base angle
    // betaAngle needs to be evaluted as a number to ensure proper error checking
    if (Number(betaAngle) < baseAngle) {
        cameraVideoPage.displayMessage("The Apex Angle must be greater than the Base Angle. Try Again", 2500);
    } else {
        apexAngle = betaAngle;
    }
}

// This function calculates the baseLength using the base angle (in angles).
function lengthCalc() {
    // Converts from degrees to radian
    var bAngleInRadians = baseAngle * Math.PI / 180;
    internalVar.baseLength = userHeight * Math.tan(bAngleInRadians);
}

function heightCalc() { // Function to calculate building height
    var angleToTop, angleInRadians, calcHeight, totalHeight;
    angleToTop = apexAngle - 90;
    // Coverting Degrees to Radians
    angleInRadians = (angleToTop * Math.PI) / 180;
    calcHeight = internalVar.baseLength * Math.tan(angleInRadians);
    totalHeight = calcHeight + userHeight;
    displayHeight = totalHeight.toFixed(2); //only want to display to 2 decimal places

}

function headsUpDisplay() { //refreshes HUD depending on what values have been inputted/changed
    var stringDisplay = {
        angle: "Angle: " + betaAngle + "&deg;<br>",
        userH: "Camera Height: " + userHeight + "m<br/>",
        base: "Base Angle: " + baseAngle + "&deg;<br>",
        apex: "Apex Angle: " + apexAngle + "&deg;<br>",
        dispH: "Object Height: " + displayHeight + "m",
    }
    if (isNaN(userHeight) == false) {
        if (isNaN(baseAngle) == false) {
            //There is all values
            if (isNaN(apexAngle) == false) {
                // Calculate the length from the user
                lengthCalc();
                // Calculate building height
                heightCalc();
                //Display String
                cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.userH + stringDisplay.base + stringDisplay.apex + stringDisplay.dispH);
            }
            // There is base angle and user height
            else {
                cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.userH + stringDisplay.base);
            }
        }
        // There is apex angle and user height 
        else if (isNaN(apexAngle) == false) {
            cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.userH + stringDisplay.apex);
        }
        // There is only user height
        else {
            cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.userH);
        }
    } else if (isNaN(baseAngle) == false) {
        //There is base angle and apex angle
        if (isNaN(apexAngle) == false) {
            cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.base + stringDisplay.apex);
        }
        // There is only base angle
        else {
            cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.base);
        }
    }
    // There is only apex angle
    else if (isNaN(apexAngle) == false) {
        cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.apex);
    }
    // There is no values
    else {
        cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle);
    }
}
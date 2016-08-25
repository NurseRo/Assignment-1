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

// Global variables to be used
var userHeight, displayHeight, apexAngle, baseAngle, baseLength, betaAngle, bCounter, medianArray;
bCounter = 0;
medianArray = Array.apply(null, Array(9)).map(Number.prototype.valueOf, 0);

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
    var beta = event.beta;
    if (bCounter < medianArray.length) {
        //Index changer for global array (to fill the array)
        bCounter += 1;
    } else {
        // Find median of full array
        medianArray.sort();
        betaAngle = medianArray[4].toFixed(0);
        headsUpDisplay();
        bCounter = 0;
    }
    // Captures a single beta to add to the global array
    smoothValues(beta, bCounter);
}

function smoothValues(beta, bCounter) { // Adds value into array
    medianArray[bCounter - 1] = beta;
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
        userHeight = inputHeight
        headsUpDisplay();
    } else {
        cameraVideoPage.displayMessage("Input is invalid, please try again.", 2000);
    }

}

// This function is called by a button to set the angle to the base of
// the object being measured.  It uses the current smoothed tilt angle.
function setBaseTiltAngle() {
    var tempBase
        // Step 4: Record tilt angle 
        // display on screen using the displayMessage method
    tempBase = betaAngle.toFixed(0);

    if (tempBase >= 0 && tempBase <= 90) { //test to make sure input is valid
        baseAngle = tempBase
            //displayMessage of base angle --- AMITHA
    } else {} //displayMessage of invalid input --- AMITHA
    headsUpDisplay();
}



// This function is called by a button to set the angle to the apex of
// the object being measured.  It uses the current smoothed tilt angle.
function setApexTiltAngle() {
    var tempApex
        // Step 4: Record tilt angle 
        // display on screen using the displayMessage method
    tempApex = betaAngle.toFixed(0);
    if (tempApex >= 0 && tempApex <= 180) { //test to make sure input is valid
        apexAngle = tempApex
            //displayMessage of apex angle --- AMITHA
    } else {} //displayMessage of invalid input --- AMITHA
    headsUpDisplay();
}

function heightCalc() { // Function to calculate building height
    var angleToTop, angleInRadians, calcHeight, totalHeight;
    // Complex calculations
    angleToTop = apexAngle - 90;
    // Coverting Degrees to Radians
    angleInRadians = (angleToTop * Math.PI) / 180;
    calcHeight = baseLength * Math.tan(angleInRadians);
    totalHeight = calcHeight + userHeight;
    displayHeight = totalHeight.toFixed(2); //only want to display to 2 decimal places

}

function headsUpDisplay() { //refreshes HUD depending on what values have been inputted
    var stringDisplay = {
        angle: "Angle: " + betaAngle + "&deg;<br>",
        userH: "Height of camera: " + userHeight + "m<br/>",
        base: "Angle from ground to Base: " + baseAngle + "&deg;<br>",
        apex: "Angle from ground to Apex: " + apexAngle + "&deg;<br>",
        dispH: "Height of building: " + displayHeight + "m",
    }
    if (isNaN(userHeight) == false) {
        if (isNaN(baseAngle) == false) {
            //There is all values
            if (isNaN(apexAngle) == false) {
                cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.userH + stringDisplay.base + stringDisplay.apex + stringDisplay.dispH);
                // Calculate building height
                heightCalc();
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
}
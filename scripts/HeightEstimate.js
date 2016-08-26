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

var vGlobal = {// Global Object to store global variable to save namespace
    // Variables not displayed
    bCounter: 0, // Counts index for beta value to replace previous value in Array below.
    // Array of size N with every index filled with 0. ARRAY LENGTH MUST BE ODD.
    // N=3 was chosen as it allows most outliers to be discounted, and provides quick feedback to the user.
    medianArray: Array.apply(null, Array(3)).map(Number.prototype.valueOf, 0),
    // Variables that are displayed
    userHeight: undefined,
    displayHeight: undefined,
    baseLength: undefined,
    displayLength: undefined,
    apexAngle: undefined,
    baseAngle: undefined,
    betaAngle: undefined,
    halfArray: undefined,
}
// This function will be called when the camera video page
// is intialised and ready to be used.
function cameraVideoPageInitialised() {
    // Initialise median index of array
    vGlobal.halfArray = vGlobal.medianArray.length / 2 - 0.5;
    // Check for and intialise deviceMotion
    if (window.DeviceMotionEvent) {
        window.addEventListener('deviceorientation', deviceMotion);
    }
}

function deviceMotion(event) { // Function to handle device beta angles
    var smooth = function(beta, bCounter) { // Adds value into array
        vGlobal.medianArray[bCounter - 1] = beta;
    }
    var beta, 
    beta = event.beta;
    if (vGlobal.bCounter < vGlobal.medianArray.length) {
        //Index changer for global array (to fill the array)
        vGlobal.bCounter += 1;
    } else {
        vGlobal.medianArray.sort();
        // Find median of sorted full array
        vGlobal.betaAngle = vGlobal.medianArray[vGlobal.halfArray].toFixed(0);
        headsUpDisplay();
        // Reset to index to create new array
        vGlobal.bCounter = 0;
    }
    // Captures a single beta to add to the global array
    smooth(beta, vGlobal.bCounter);
}

// This function is called by a button to set the height of phone from the
// ground, in metres.
function setCameraHeightValue() {
    var inputHeight;
    inputHeight = Number(window.prompt("Please enter the height of the camera from the ground (meters): "));
    // check if input is a number and is positive
    if (isNaN(inputHeight) == false && inputHeight > 0) {
        // display on screen using the displayMessage method
        vGlobal.userHeight = inputHeight;
        cameraVideoPage.displayMessage("Camera Height: " + vGlobal.userHeight + "m", 2000)
    } else {
        cameraVideoPage.displayMessage("Height must be a number greater than 0. Try Again", 2500);
    }

}

// This function is called by a button to set the angle to the base of
// the object being measured.  It uses the current smoothed tilt angle.
function setBaseTiltAngle() { 
    // Makes sure base is less than apex angle and 90, and greater than 0
    if (Number(vGlobal.betaAngle) > vGlobal.apexAngle) {
        cameraVideoPage.displayMessage("The Base Angle must be less than the Apex Angle. Try Again", 2500);
    } else if ((Number(vGlobal.betaAngle) < 0) || (Number(vGlobal.betaAngle) > 90)) {
        cameraVideoPage.displayMessage("The Base Angle must be between 0 and 90 degrees. Try Again", 2500);
    } else {
        vGlobal.baseAngle = vGlobal.betaAngle;
        cameraVideoPage.displayMessage("Base Angle: " + vGlobal.baseAngle + " degrees", 2000);
    }
}

// This function is called by a button to set the angle to the apex of
// the object being measured.  It uses the current smoothed tilt angle.
function setApexTiltAngle() {
    // Makes sure apex is greater than base angle and 0
    if (Number(vGlobal.betaAngle) < vGlobal.baseAngle) {
        cameraVideoPage.displayMessage("The Apex Angle must be greater than the Base Angle. Try Again", 2500);
    } else if ((Number(vGlobal.betaAngle) < 0)) {
        cameraVideoPage.displayMessage("The Apex Angle must greater than 0 degrees. Try Again", 2500);
    } else {
        vGlobal.apexAngle = vGlobal.betaAngle;
        cameraVideoPage.displayMessage("Apex Angle: " + vGlobal.apexAngle + " degrees", 2000);
    }
}

function distanceCalc() { // Function to calculate distance to object
    var angleInRadians;
    angleInRadians = (vGlobal.baseAngle * Math.PI) / 180;  // Coverting Degrees to Radians
    vGlobal.baseLength = vGlobal.userHeight * Math.tan(angleInRadians);
    vGlobal.displayLength = vGlobal.baseLength.toFixed(2) // Display to 2 decimal places
}

function heightCalc() { // Function to calculate object height
    var angleToTop, angleInRadians2, calcHeight, totalHeight;
    angleToTop = vGlobal.apexAngle - 90; //True apex angle
    angleInRadians2 = (angleToTop * Math.PI) / 180;  // Coverting Degrees to Radians
    calcHeight = vGlobal.baseLength * Math.tan(angleInRadians);
    totalHeight = calcHeight + vGlobal.userHeight;
    vGlobal.displayHeight = totalHeight.toFixed(2); // Display to 2 decimal places
    
}

function headsUpDisplay() { // Refreshes HUD depending on what values have been inputted/changed
    var stringDisplay = {
        angle: "Angle: " + vGlobal.betaAngle + "&deg;<br>",
        userH: "Camera Height: " + vGlobal.userHeight + "m<br>",
        base: "Base Angle: " + vGlobal.baseAngle + "&deg;<br>",
        apex: "Apex Angle: " + vGlobal.apexAngle + "&deg;<br>",
        baseL: "Object Distance: " + vGlobal.displayLength + "m<br>",
        dispH: "Object Height: " + vGlobal.displayHeight + "m",
    }
    if (isNaN(vGlobal.userHeight) == false) {
        if (isNaN(vGlobal.baseAngle) == false) {
            //There is all values
            if (isNaN(vGlobal.apexAngle) == false) {
                // Calculate object height
                distanceCalc();
                heightCalc();
                //Display String
                cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.userH + stringDisplay.base + stringDisplay.apex + stringDisplay.baseL + stringDisplay.dispH);
            }
            // There is base angle and user height
            else {
                distanceCalc();
                cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.userH + stringDisplay.base + stringDisplay.baseL);
            }
        }
        // There is apex angle and user height 
        else if (isNaN(vGlobal.apexAngle) == false) {
            cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.userH + stringDisplay.apex);
        }
        // There is only user height
        else {
            cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.userH);
        }
    } else if (isNaN(vGlobal.baseAngle) == false) {
        //There is base angle and apex angle
        if (isNaN(vGlobal.apexAngle) == false) {
            cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.base + stringDisplay.apex);
        }
        // There is only base angle
        else {
            cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.base);
        }
    }
    // There is only apex angle
    else if (isNaN(vGlobal.apexAngle) == false) {
        cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle + stringDisplay.apex);
    }
    // There are no values
    else {
        cameraVideoPage.setHeadsUpDisplayHTML(stringDisplay.angle);
    }
}
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
var userHeight, displayHeight, apexAngle, baseAngle, baseLength, tempApexAngle, tempBaseAngle, bCounter, medianArray;
bCounter = 0;
medianArray = [0,0,0,0,0,0,0,0,0,0,0];
apexAngle = 160;
baseAngle = 60;
baseLength = 40;

// function to error check refreshed values (refreshes the calculated height)
function isRefreshed() {
    if (isNaN(userHeight) == false || isNaN(apexAngle) == false || isNaN(baseAngle) == false) {
        heightCalc();

    }
}
// You may need to create variables to store state.

// This function will be called when the camera video page
// is intialised and ready to be used.
function cameraVideoPageInitialised() {
    // Step 1: Check for and intialise deviceMotion
    if (window.DeviceMotionEvent) {
        window.addEventListener('deviceorientation', deviceMotion);
    }
}

function deviceMotion(event) {
    var beta = event.beta;
    //Smooth out values
    if (bCounter < 11) {
        bCounter += 1;
    } else {
        medianArray.sort();
        medianArray[5];
        bCounter = 0;
    }
    smoothValues(beta, bCounter);
}

function smoothValues(beta, bCounter) {
    medianArray[bCounter] = beta;
}
// This function is called by a button to set the height of phone from the
// ground, in metres.
function setCameraHeightValue() {
    var inputHeight
        // Step 3: Set camera height
    userHeight = Number(window.prompt("Please enter the height of the camera from the ground (meters):"));
    // check if input is a number and is positive
    if (isNaN(userHeight) == false && userHeight > 0) {
        // display on screen using the displayMessage method
        isRefreshed();
        headsUpDisplay();

    } else {
        cameraVideoPage.displayMessage("Input is invalid, please try again.", 2000);
    }

}

// This function is called by a button to set the angle to the base of
// the object being measured.  It uses the current smoothed tilt angle.
function setBaseTiltAngle() {
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
    baseAngle = tempBaseAngle;
    isRefreshed();
    headsUpDisplay();

}



// This function is called by a button to set the angle to the apex of
// the object being measured.  It uses the current smoothed tilt angle.
function setApexTiltAngle() {
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
    apexAngle = tempApexAngle;
    isRefreshed();
    headsUpDisplay();

}


// You may need to write several other functions.
function heightCalc() {

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

    if (isNaN(userHeight) == false) {
        if (isNaN(baseAngle) == false) {
            if (isNaN(apexAngle) == false) {
                cameraVideoPage.setHeadsUpDisplayHTML("Height of camera: " + userHeight + "m<br/>Angle from ground to Base: " + baseAngle + " degrees<br/>Angle from ground to Apex: " + apexAngle + " degrees<br/>" + "Height of building: " + displayHeight + "m");
            } else {
                cameraVideoPage.setHeadsUpDisplayHTML("Height of camera: " + userHeight + "m<br/>Angle from ground to Base: " + baseAngle + " degrees");
            }
        } else if (isNaN(apexAngle) == false) {
            cameraVideoPage.setHeadsUpDisplayHTML("Height of camera: " + userHeight + "m<br/>Angle from ground to Apex: " + apexAngle + " degrees");
        } else {
            cameraVideoPage.setHeadsUpDisplayHTML("Height of camera: " + userHeight + "m");
        }
    } else if (isNaN(baseAngle) == false) {
        if (isNaN(apexAngle) == false) {
            cameraVideoPage.setHeadsUpDisplayHTML("Angle from ground to Base: " + baseAngle + " degrees<br/>Angle from ground to Apex: " + apexAngle + "degrees<br/>");
        } else {
            cameraVideoPage.setHeadsUpDisplayHTML("Angle from ground to Base: " + baseAngle + " degrees");
        }
    } else if (isNaN(apexAngle) == false) {
        cameraVideoPage.setHeadsUpDisplayHTML("Angle from ground to Apex: " + apexAngle + " degrees");
    }
}
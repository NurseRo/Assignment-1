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
var userHeight, apexAngle = 160,
    baseAngle = 40,
    baseLength = 40;

// function to error check refreshed values
function IsRefreshed() {
    if (userHeight.isNumber = true) {
        if (apexAngle.isNumber = true) {
            if (baseAngle.isNumber = true) {
                HeightCalc();
            }
        }

    }
}
// You may need to create variables to store state.

// This function will be called when the camera video page
// is intialised and ready to be used.
function cameraVideoPageInitialised() {
    // Step 1: Check for and intialise deviceMotion
    //Initiates device motion
}

function motionhandler() {}
// This function is called by a button to set the height of phone from the
// ground, in metres.
function setCameraHeightValue() {

    // Step 3: Set camera height
    userHeight = window.prompt("Please enter the height of the camera from the ground (meters):");
    // check if input is a number and is positive
    if (isNaN(userHeight) && userHeight > 0) {
        // display on screen using the displayMessage method
        cameraVideoPage.displayMessage("Height of camera: " + userHeight + "m", 2000)
        cameraVideoPage.setHeadsUpDisplayHTML("Height of camera: " + userHeight + "m")
    } else {
        cameraVideoPage.displayMessage("Input is invalid, please try again.", 2000)
    }
    IsRefreshed();
}

// This function is called by a button to set the angle to the base of
// the object being measured.  It uses the current smoothed tilt angle.
function setBaseTiltAngle() {
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
}

// This function is called by a button to set the angle to the apex of
// the object being measured.  It uses the current smoothed tilt angle.
function setApexTiltAngle() {
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
}

// You may need to write several other functions.
function HeightCalc() {
    var angleToTop, angleInRadians, calcHeight, totalHeight;
    // Complex calculations
    angleToTop = apexAngle - 90;
    // Coverting Degrees to Radians
    angleInRadians = (angleToTop * Math.PI) / 180;
    calcHeight = baseLength * Math.tan(angleInRadians);
    totalHeight = calcHeight + userHeight;

    cameraVideoPage.setHeadsUpDisplayHTML("Height of building: " + totalHeight + "m")
}
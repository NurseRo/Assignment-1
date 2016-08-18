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

// You may need to create variables to store state.
    
// This function will be called when the camera video page
// is intialised and ready to be used.
function cameraVideoPageInitialised()
{
    // Step 1: Check for and intialise deviceMotion
    //Initiates device motion
    window.addEventListener("devicemotion", motionhandler, true);
}
function motionhandler(){
}
// This function is called by a button to set the height of phone from the
// ground, in metres.
function setCameraHeightValue()
{
   
	// Step 3: Set camera height
	heightval=window.prompt("Please enter the height of the camera from the ground (meters):")
	// check if input is a number and is positive
	if (heightval.isnumber=true & heightval>=0)
	{
        // display on screen using the displayMessage method
		cameraVideoPage.displayMessage("Height of camera: " + heightval + "m",3000)
		cameraVideoPage.setHeadsUpDisplayHTML("Height of camera: " + heightval + "m")
	}
	
	else {cameraVideoPage.displayMessage("Input is invalid, please try again",3000)}
	
}
    
// This function is called by a button to set the angle to the base of
// the object being measured.  It uses the current smoothed tilt angle.
function setBaseTiltAngle()
{
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
}

// This function is called by a button to set the angle to the apex of
// the object being measured.  It uses the current smoothed tilt angle.
function setApexTiltAngle()
{
    // Step 4: Record tilt angle 
    // display on screen using the displayMessage method
}

// You may need to write several other functions.
function HeightCalc()
{
    var meters, angleToTop, angleInRadians, calcHeight, totalHeight
	metres = cameraVideoPage.setHeadsUpDisplayHTML
	
    cameraVideoPage.displayMessage(meters + "I love Rohit",3000)
	
    angleToTop=apexAngle-90
	angleInRadians=(angleToTop*Math.PI)/180
	calcHeight=baseLength*Math.tan(angleInRadians)	
	totalHeight=calcHeight+userHeight
	
    cameraVideoPage.setHeadsUpDisplayHTML("Height of building: " + totalHeight + "m")
}

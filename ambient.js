var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

var light_trigger_level = 0.04;
var sound_trigger_level = 0.05;

var ambient = ambientlib.use(tessel.port['A']);
ambient.on('ready', function () {
 // Get points of light and sound data.
  setInterval( function () {
    ambient.getLightLevel( function(err, ldata) {
      if (err) throw err;
      ambient.getSoundLevel( function(err, sdata) {
        if (err) throw err;
        console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
      });
    })
  }, 500); // The readings will happen every .5 seconds unless the trigger is hit

  ambient.setLightTrigger(light_trigger_level);

  // Set a light level trigger
  // The trigger is a float between 0 and 1
  ambient.on('light-trigger', function(data) {
    console.log("Our light trigger was hit:", data);

    // Clear the trigger so it stops firing
    ambient.clearLightTrigger();
    //After 1.5 seconds reset light trigger
    setTimeout(function () {

        ambient.setLightTrigger(light_trigger_level);

    }, 1500);
  });

  // Set a sound level trigger
  // The trigger is a float between 0 and 1
  ambient.setSoundTrigger(sound_trigger_level);

  ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);

    // Clear it
    ambient.clearSoundTrigger();

    //After 1.5 seconds reset sound trigger
    setTimeout(function () {

        ambient.setSoundTrigger(sound_trigger_level);

    }, 1500);

  });
});

ambient.on('error', function (err) {
  console.log(err)
});

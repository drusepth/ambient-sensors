var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

// Config
var light_trigger_level = 0.06;
var sound_trigger_level = 0.05;
var poll_time = 500; // ms
var led_light_time = 500; // ms

// LED references
var leds = [
  tessel.led[0].output(0),
  tessel.led[1].output(0)
];
var light_led = leds[0],
    sound_led = leds[1];

var ambient = ambientlib.use(tessel.port['A']);
ambient.on('ready', function () {
  // Display current of light and sound data
  setInterval(function () { display_current_levels() }, poll_time);

  ambient.setLightTrigger(light_trigger_level);
  ambient.setSoundTrigger(sound_trigger_level);

  ambient.on('light-trigger', function(data) {
    // Toggle the LED on
    light_led.toggle();

    // Clear the trigger so it stops firing
    ambient.clearLightTrigger();

    // Turn the LED back off after some duration and re-set the trigger
    setTimeout(function () {
      light_led.toggle();
      ambient.setLightTrigger(light_trigger_level);
    }, led_light_time);
  });

  ambient.on('sound-trigger', function(data) {
    // Toggle the LED on
    sound_led.toggle();

    // Clear the trigger so it stops firing
    ambient.clearSoundTrigger();

    // Turn the LED back off after some duration and re-set the trigger
    setTimeout(function () {
      sound_led.toggle();
      ambient.setSoundTrigger(sound_trigger_level);
    }, led_light_time);

  });
});

ambient.on('error', function (err) {
  console.log(err)
});

function display_current_levels() {
  ambient.getLightLevel(function(err, light_data) {
    if (err) throw err;

    ambient.getSoundLevel(function(err, sound_data) {
      if (err) throw err;
      console.log("Light level:", light_data.toFixed(8), " ", "Sound Level:", sound_data.toFixed(8));
    });
  })
}

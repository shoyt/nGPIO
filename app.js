// example of implementation
// note: caller specifies physical pins (phys), nGPIO translates to bcm

const sleep = require("system-sleep");
const nGPIO = require("./nGPIO");
const io    = new nGPIO();

console.log(io.model);

let pin = 7; // turn on Waveshare GPS/GNSS/GSM module
console.log("pin " + pin + " is " +  io.get(pin));
io.set(pin, GPIO.LOW);
sleep(2000);
io.set(pin, GPIO.HIGH);
console.log("pin " + pin + " is " +  io.get(pin));


for (let pin in io.ioTypes["GPIO"])
{
  try
  {
    console.log("pin " + pin + ":");
    io.set(pin, GPIO.LOW);
    sleep(1000);
    console.log("pin " + pin + " is " +  io.get(pin));
    io.set(pin, GPIO.HIGH);
    sleep(1000);
    console.log("pin " + pin + " is " +  io.get(pin));
    io.set(pin, GPIO.LOW);
    sleep(1000);
  } catch (e) {
    console.log("pin " + pin, e);
  }
}

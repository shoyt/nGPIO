const execSync  = require("child_process").execSync;
const fs        = require("fs");

class nGPIO
{

  library   = "/sys/class/gpio/";
  HIGH      = 1   ;
  LOW       = 0   ;
  ioTypes   = []  ;
  map       = []  ;
  model     = ""  ;

  constructor()
  {
    this.model = execSync("cat /sys/firmware/devicetree/base/model").toString();
    this.map[ 1] = { name : "3.3v"    , type : "VOLTAGE"  , phys:  1, bcm : null };
    this.map[ 2] = { name : "5v"      , type : "VOLTAGE"  , phys:  2, bcm : null };
    this.map[ 3] = { name : "SDA.1"   , type : "SDA"      , phys:  3, bcm :    2 };
    this.map[ 4] = { name : "5v"      , type : "VOLTAGE"  , phys:  4, bcm : null };
    this.map[ 5] = { name : "SCL.1"   , type : "SCL"      , phys:  5, bcm :    3 };
    this.map[ 6] = { name : "0v"      , type : "VOLTAGE"  , phys:  6, bcm : null };
    this.map[ 7] = { name : "GPIO.7"  , type : "GPIO"     , phys:  7, bcm :    4 };
    this.map[ 8] = { name : "TxD"     , type : "TXD"      , phys:  8, bcm :   14 };
    this.map[ 9] = { name : "0v"      , type : "VOLTAGE"  , phys:  9, bcm : null };
    this.map[10] = { name : "RxD"     , type : "RXD"      , phys: 10, bcm :   15 };
    this.map[11] = { name : "GPIO.0"  , type : "GPIO"     , phys: 11, bcm :   17 };
    this.map[12] = { name : "GPIO.1"  , type : "GPIO"     , phys: 12, bcm :   18 };
    this.map[13] = { name : "GPIO.2"  , type : "GPIO"     , phys: 13, bcm :   27 };
    this.map[14] = { name : "0v"      , type : "VOLTAGE"  , phys: 14, bcm : null };
    this.map[15] = { name : "GPIO.3"  , type : "GPIO"     , phys: 15, bcm :   22 };
    this.map[16] = { name : "GPIO.4"  , type : "GPIO"     , phys: 16, bcm :   23 };
    this.map[17] = { name : "3.3v"    , type : "VOLTAGE"  , phys: 17, bcm : null };
    this.map[18] = { name : "GPIO.5"  , type : "GPIO"     , phys: 18, bcm :   24 };
    this.map[19] = { name : "MOSI"    , type : "MOSI"     , phys: 19, bcm :   10 };
    this.map[20] = { name : "0v"      , type : "VOLTAGE"  , phys: 20, bcm : null };
    this.map[21] = { name : "MISO"    , type : "MISO"     , phys: 21, bcm :    9 };
    this.map[22] = { name : "GPIO.6"  , type : "GPIO"     , phys: 22, bcm :   25 };
    this.map[23] = { name : "SCLK"    , type : "SCLK"     , phys: 23, bcm :   11 };
    this.map[24] = { name : "CE0"     , type : "CE"       , phys: 24, bcm :    8 };
    this.map[25] = { name : "0v"      , type : "VOLTAGE"  , phys: 25, bcm : null };
    this.map[26] = { name : "CE1"     , type : "CE"       , phys: 26, bcm :    7 };
    this.map[27] = { name : "SDA.0"   , type : "SDA"      , phys: 27, bcm :    0 };
    this.map[28] = { name : "SCL.0"   , type : "SCL"      , phys: 28, bcm :    1 };
    this.map[29] = { name : "GPIO.21" , type : "GPIO"     , phys: 29, bcm :    5 };
    this.map[30] = { name : "0v"      , type : "VOLTAGE"  , phys: 30, bcm : null };
    this.map[31] = { name : "GPIO.22" , type : "GPIO"     , phys: 31, bcm :    6 };
    this.map[32] = { name : "GPIO.26" , type : "GPIO"     , phys: 32, bcm :   12 };
    this.map[33] = { name : "GPIO.23" , type : "GPIO"     , phys: 33, bcm :   13 };
    this.map[34] = { name : "0v"      , type : "VOLTAGE"  , phys: 34, bcm : null };
    this.map[35] = { name : "GPIO.24" , type : "GPIO"     , phys: 35, bcm :   19 };
    this.map[36] = { name : "GPIO.27" , type : "GPIO"     , phys: 36, bcm :   16 };
    this.map[37] = { name : "GPIO.25" , type : "GPIO"     , phys: 37, bcm :   26 };
    this.map[38] = { name : "GPIO.28" , type : "GPIO"     , phys: 38, bcm :   20 };
    this.map[39] = { name : "0v"      , type : "VOLTAGE"  , phys: 39, bcm : null };
    this.map[40] = { name : "GPIO.29" , type : "GPIO"     , phys: 40, bcm :   21 };
    for (let pin in this.map)
    {
      let type  = this.map[pin].type;
      if (this.ioTypes[type] === undefined){ this.ioTypes[type] = []; }
      this.ioTypes[type][pin] = this.map[pin];
    }
  };

  get = function(pin){
    if (this.map[pin] === undefined){ throw new Error("INVALID PIN SPECIFIED"); }
    pin = this.map[pin].bcm;
    fs.writeFileSync(this.library + "export", pin);
    fs.writeFileSync(this.library + "gpio" + pin + "/direction", "in");
    let state = fs.readFileSync(this.library + "gpio" + pin + "/value") ? this.HIGH : this.LOW;
    fs.writeFileSync(this.library + "unexport", pin);
    return state;
  };

  set = function(pin, state = this.LOW){
    if (this.map[pin] === undefined){ throw new Error("INVALID PIN SPECIFIED"); }
    if (!(state == this.LOW || state == this.HIGH)){ throw new Error("INVALID STATE SPECIFIED" ); }
    pin = this.map[pin].bcm;
    fs.writeFileSync(this.library + "export", pin);
    fs.writeFileSync(this.library + "gpio" + pin + "/direction" , "out" );
    fs.writeFileSync(this.library + "gpio" + pin + "/value"     , state );
    fs.writeFileSync(this.library + "unexport", pin);
  };

}

module.exports = nGPIO;

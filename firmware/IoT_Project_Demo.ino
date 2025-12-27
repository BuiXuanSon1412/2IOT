#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFiManager.h> 
#include <BH1750.h>
#include <DHT.h>
#include <vector>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C
#define LED_PIN 23
#define DHTPIN 15
#define DHTTYPE DHT22
#define MOTOR_IN1 18 // PWM
#define MOTOR_IN2 19

const char* HOME_ID = "IoT_20251_House";
const char* BRIGHTNESS_SENSOR_NAME = "BH1750_Light_Sensor";
const char* TEMP_SENSOR_NAME = "DHT22_Sensor";
const char* HUMID_SENSOR_NAME = "DHT22_Sensor";
const char* LED_DEVICE_NAME = "LED1";
const char* FAN_DEVICE_NAME = "FAN1";

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
BH1750 lightMeter;
DHT dht(DHTPIN, DHTTYPE);

const int freq = 5000;
const int ledChannel = 0;
const int resolution = 8;
const int fanChannel = 1;
bool autoLedMode = false;
std::vector<int> led_config_cond;
std::vector<int> led_config_act;
bool autoFanMode = false;
std::vector<int> fan_config_cond;
std::vector<int> fan_config_act;

const char* mqtt_server = "test.mosquitto.org"; 
const int mqtt_port = 1883;
const char* mqtt_topic_pub = "iot/project/status";
const char* mqtt_topic_sub = "iot/project/control";

WiFiClient espClient;
PubSubClient client(espClient);
WiFiManager wm;

unsigned long lastLightRequest = 0;
const long lightInterval = 200;
unsigned long lastTempRequest = 0;
const long tempInterval = 2000;
// const long tempInterval = 3000;
const int delayInMillis = 750;
bool tempRequested = false;
int led_level = 0;
int fan_speed = 0;
int tempC = 0;
int humid = 0;
int brightness = 0;

void callback(char* topic, byte* payload, unsigned int length);
void reconnect();
void updateDisplay(); 
void configModeCallback(WiFiManager *myWiFiManager);

void setup() {
  Serial.begin(115200);

  Wire.begin();

  client.setBufferSize(2048);

  if (lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
    Serial.println(F("BH1750 init success!"));
  } else {
    Serial.println(F("BH1750 init failed!"));
  }

  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("Loi OLED"));
    for(;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  ledcSetup(ledChannel, freq, resolution);
  ledcAttachPin(LED_PIN, ledChannel);
  ledcWrite(ledChannel, led_level);

  pinMode(MOTOR_IN2, OUTPUT); 
  digitalWrite(MOTOR_IN2, LOW);
  
  ledcSetup(fanChannel, freq, resolution);
  ledcAttachPin(MOTOR_IN1, fanChannel);
  ledcWrite(fanChannel, fan_speed);

  Serial.println("Khoi dong DHT22...");
  dht.begin();

  pinMode(0, INPUT_PULLUP);

  wm.setAPCallback(configModeCallback);

  if (!wm.autoConnect("ESP32_SETUP")) {
    Serial.println("Loi ket noi, dang reset...");
    delay(3000);
    ESP.restart();
  }

  Serial.println("\nWiFi Connected!");
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("WiFi Connected!");
  display.print("IP: "); display.println(WiFi.localIP());
  display.display();
  delay(1000);
  
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  updateDisplay();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (digitalRead(0) == LOW) {
    Serial.println("Dang xoa Wifi cu...");
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Dang xoa Wifi cu...");
    display.display();
    wm.resetSettings();
    delay(1000);
    ESP.restart();
  }

  if (WiFi.status() != WL_CONNECTED){
    for(int i=0; i<20; i++){
      delay(1000);
      display.clearDisplay();
      display.setCursor(0,0);
      display.println("WiFi disconnected. Waiting for 20s before restarting");
      display.setCursor(0,30);
      display.setTextSize(2);
      display.print(i);
      display.setTextSize(1);
      display.print("s");
      display.display();
      if (WiFi.status() == WL_CONNECTED){
        break;
      }
    }
    if (WiFi.status() != WL_CONNECTED){
      ESP.restart();
    }
  }

  unsigned long now = millis();

  if(now - lastLightRequest > lightInterval){
    lastLightRequest = now;
    brightness = lightMeter.readLightLevel();
    if (autoLedMode) {
      autoLed();
    }
    updateDisplay();
  }

  if (now - lastTempRequest > tempInterval) {
    lastTempRequest = now;

    float newT = dht.readTemperature();
    float newH = dht.readHumidity();

    if (isnan(newT) || isnan(newH)) {
      Serial.println("Loi doc DHT22!");
    } else {
      tempC = newT;
      humid = newH;

      if (autoFanMode) {
        autoFan();
      }

      JsonDocument doc;

      JsonObject tempObj = doc.add<JsonObject>();
      tempObj["homeId"] = HOME_ID;
      tempObj["name"]   = TEMP_SENSOR_NAME;
      tempObj["measure"] = "temperature";
      tempObj["value"]  = tempC;

      JsonObject humObj = doc.add<JsonObject>();
      humObj["homeId"] = HOME_ID;
      humObj["name"]   = HUMID_SENSOR_NAME;
      humObj["measure"] = "humidity";
      humObj["value"]  = humid;

      JsonObject luxObj = doc.add<JsonObject>();
      luxObj["homeId"] = HOME_ID;
      luxObj["name"]   = BRIGHTNESS_SENSOR_NAME;
      luxObj["measure"] = "brightness";
      luxObj["value"]  = brightness;

      // JsonObject ledObj = doc.add<JsonObject>();
      // ledObj["homeId"] = HOME_ID;
      // ledObj["name"]   = LED_DEVICE_NAME;
      // ledObj["measure"] = "led_level";
      // ledObj["value"]  = led_level;

      // JsonObject fanObj = doc.add<JsonObject>();
      // fanObj["homeId"] = HOME_ID;
      // fanObj["name"]   = FAN_DEVICE_NAME;
      // fanObj["measure"] = "fan_speed";
      // fanObj["value"]  = fan_speed;

      char buffer[1024];
      serializeJson(doc, buffer);
      
      if(client.publish(mqtt_topic_pub, buffer)) {
         Serial.printf("Temp: %d C - Humid: %d %% - Brightness: %d\n", tempC, humid, brightness);
      }
      
      updateDisplay();
    }
  }
}

void configModeCallback(WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("NO WIFI FOUND!");
  
  display.setCursor(0, 15);
  display.println("Connect to WiFi:");
  display.setTextSize(1);
  display.println("ESP32_SETUP");
  
  display.setTextSize(1);
  display.setCursor(0, 45);
  display.println("Then go to:");
  display.println("192.168.4.1");
  
  display.display();
}

void updateDisplay() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("WiFi: ");
  if(WiFi.status() == WL_CONNECTED) {
      display.println(WiFi.SSID().substring(0, 13));
  } else {
      display.println("No WiFi");
  }

  display.setCursor(0, 15);
  display.print("T: ");
  display.setTextSize(1); 
  display.print(tempC);
  display.cp437(true);
  display.write(248);
  display.print("C ");
  
  display.print("H: ");
  display.print(humid);
  display.println("%");

  display.setCursor(0, 30); 
  display.print("Light: ");
  display.print(brightness);
  display.println(" lux");

  display.setTextSize(1);
  display.setCursor(0, 45);
  display.print("LED: ");
  display.print(led_level);

  display.setCursor(64, 45);
  display.print("FAN: ");
  display.print(fan_speed);
  
  if (tempC >= 30) {
     display.setCursor(0, 56);
     display.print("HOT!");
  }

  if (brightness < 10) {
     display.setCursor(64, 56); 
     display.print("DARK!");
  }
  display.display();
}

void autoLed(){
  if (led_config_cond.size() == 0 || led_config_act.size() == 0 || led_config_cond.size() != led_config_act.size()) {
    return;
  }

  int n = led_config_cond.size();
  int target_led_level = -1;

  for(int i=0; i<n; i++){
    if(brightness < led_config_cond[0]){
      target_led_level = led_config_act[0];
        if(target_led_level != led_level){
          led_level = target_led_level;
          ledcWrite(ledChannel, led_level);
          Serial.printf("=> [AUTO] Brightness: %d -> Set LED: %d\n", brightness, led_level);
        }
        break;
    }
    if(i < n-1){
      if(brightness >= led_config_cond[i] && brightness < led_config_cond[i+1]){
        target_led_level = led_config_act[i];
        if(target_led_level != led_level){
          led_level = target_led_level;
          ledcWrite(ledChannel, led_level);
          Serial.printf("=> [AUTO] Brightness: %d -> Set LED: %d\n", brightness, led_level);
        }
        break;
      }
    }else{
      if(brightness >= led_config_cond[i]){
        target_led_level = led_config_act[i];
        if(target_led_level != led_level){
          led_level = target_led_level;
          ledcWrite(ledChannel, led_level);
          Serial.printf("=> [AUTO] Brightness: %d -> Set LED: %d\n", brightness, led_level);
        }
      }
    }
  }
}

void autoFan(){
  if (fan_config_cond.size() == 0 || fan_config_act.size() == 0 || fan_config_cond.size() != fan_config_act.size()) {
    return;
  }

  int n = fan_config_cond.size();
  int target_fan_speed = -1;

  for(int i=0; i<n; i++){
    if(tempC < fan_config_cond[0]){
      target_fan_speed = fan_config_act[0];
        if(target_fan_speed != fan_speed){
          fan_speed = target_fan_speed;
          ledcWrite(fanChannel, fan_speed);
          Serial.printf("=> [AUTO] Temperature: %d -> Set FAN: %d\n", tempC, fan_speed);
        }
        break;
    }
    if(i < n-1){
      if(tempC >= fan_config_cond[i] && tempC < fan_config_cond[i+1]){
        target_fan_speed = fan_config_act[i];
        if(target_fan_speed != fan_speed){
          fan_speed = target_fan_speed;
          ledcWrite(fanChannel, fan_speed);
          Serial.printf("=> [AUTO] Temperature: %d -> Set FAN: %d\n", tempC, fan_speed);
        }
        break;
      }
    }else{
      if(tempC >= fan_config_cond[i]){
        target_fan_speed = fan_config_act[i];
        if(target_fan_speed != fan_speed){
          fan_speed = target_fan_speed;
          ledcWrite(fanChannel, fan_speed);
          Serial.printf("=> [AUTO] Temperature: %d -> Set FAN: %d\n", tempC, fan_speed);
        }
      }
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String messageTemp;
  for (int i = 0; i < length; i++) {
    messageTemp += (char)payload[i];
  }
  Serial.print("Nhan lenh: "); Serial.println(messageTemp);

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, messageTemp);

  if(!error){
    if (!doc.containsKey("name") || !doc.containsKey("action")) {
      Serial.println("=> LOI: Thieu truong 'name' hoac 'action'. Bo qua!");
      return;
    }
    if(doc.containsKey("condition")){ //Feature still in Development
      JsonArray arr_cond = doc["condition"];
      JsonArray arr_act = doc["action"];
      const char* deviceName = doc["name"];
      if (strcmp(deviceName, "LED1") == 0){
        Serial.printf("Chuyen sang Auto Mode.\n");
        led_config_cond.clear();
        led_config_act.clear();
        for (int val : arr_cond) led_config_cond.push_back(val);
        for (int val : arr_act) led_config_act.push_back(val);
        autoLedMode = true;
        autoLed();
      }
      if (strcmp(deviceName, "FAN1") == 0){
        Serial.printf("Chuyen sang Auto Mode.\n");
        fan_config_cond.clear();
        fan_config_act.clear();
        for (int val : arr_cond) fan_config_cond.push_back(val);
        for (int val : arr_act) fan_config_act.push_back(val);
        autoFanMode = true;
        // autoFan();
      }
      updateDisplay();
      return;
    }

    if (doc.containsKey("name") && doc.containsKey("action")) {
      const char* deviceName = doc["name"];
      int actionValue = doc["action"]; 

      if (strcmp(deviceName, "LED1") == 0) {
        autoLedMode = false;
        led_level = actionValue;
        if (led_level > 255) led_level = 255;
        if (led_level < 0) led_level = 0;
        
        ledcWrite(ledChannel, led_level);
        Serial.printf("-> Da chinh LED: %d\n", led_level);
      }
      else if (strcmp(deviceName, "FAN1") == 0) {
        autoFanMode = false;
        fan_speed = actionValue;
        if (fan_speed > 255) fan_speed = 255;
        if (fan_speed < 80)
          fan_speed = 0;

        if (fan_speed < 100 && fan_speed >= 80){
          ledcWrite(fanChannel, 100);
          delay(200);
        }
        
        ledcWrite(fanChannel, fan_speed);
        Serial.printf("-> Da chinh FAN: %d\n", fan_speed);
      }
      updateDisplay();
    }
  }
}
// void callback(char* topic, uint8_t* payload, unsigned int length) {
//   String messageTemp;
//   for (int i = 0; i < length; i++) {
//     messageTemp += (char)payload[i];
//   }
//   Serial.println("-------------------------");
//   Serial.print("RAW Message: "); Serial.println(messageTemp);

//   JsonDocument doc;
//   DeserializationError error = deserializeJson(doc, messageTemp);

//   if (!error) {
//     const char* deviceName = doc["name"];
//     int actionValue = doc["action"]; 

//     Serial.print("-> Ten thiet bi hieu duoc: ["); 
//     Serial.print(deviceName); 
//     Serial.println("]");
    
//     Serial.print("-> Gia tri hieu duoc: "); 
//     Serial.println(actionValue);

//     if (strcmp(deviceName, "LED") == 0) {
//       Serial.println("=> Phat hien lenh cho LED!");
//       led_level = actionValue;
//       led_level = constrain(led_level, 0, 255);
//       ledcWrite(ledChannel, led_level);
//       updateDisplay();
//     }
//     else if (strcmp(deviceName, "FAN") == 0) {
//       Serial.println("=> Phat hien lenh cho FAN!");
//       fan_speed = actionValue;
//       fan_speed = constrain(fan_speed, 0, 255);
//       ledcWrite(fanChannel, fan_speed);
//       updateDisplay();
//     } 
//     else {
//       Serial.println("=> LOI: Ten thiet bi khong khop voi 'LED' hoac 'FAN'");
//     }

//   } else {
//     Serial.print("=> LOI JSON: ");
//     Serial.println(error.c_str());
//   }
//   Serial.println("-------------------------");
// }

void reconnect() {
  if (!client.connected()) {
    Serial.print("Mat ket noi MQTT...");
    display.fillRect(0, 0, 128, 10, SSD1306_BLACK);
    display.setCursor(0,0);
    display.print("MQTT Connecting...");
    display.display();

    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("Da ket noi lai");
      client.subscribe(mqtt_topic_sub);
      updateDisplay();
    } else {
      Serial.print("Loi: ");
      Serial.println(client.state());
      delay(5000); 
    }
  }
}

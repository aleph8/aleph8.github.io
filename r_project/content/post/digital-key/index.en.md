--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Cybersecurity 
date: "2022-11-20" 
description: 
image: 
series: 
tags: 
- hacking-tools 
title: Digital Key 
--- 

When you have many complex passwords, it is sometimes difficult to remember them all; current browsers usually offer secure passwords that are automatically generated and stored in the browser itself, as a "virtual keychain".

As we have seen in [the Bad Usb part](/en/p/2022/bad-usb) with a simple device that resembles a USB, we can simulate a keyboard, but not everything is bad; it occurred to me to use its operation and that of similar devices to create a portable "virtual keychain" or "Digital Key" using the HID functions of the microprocessors that we find already integrated in various development boards.

The idea is to have a device that is, on the one hand, able to generate secure passwords and store them in our EEPROM memory (types of memories in microcontrollers) and, on the other hand, that is able to dump them at runtime, writing them as if it were a keyboard.

For this, the only thing that was needed was to use the "Digispark" development board, which has an integrated USB 2.0 interface, in addition to its small size and price. To add an authentication factor, so that in the case of losing the device the password is not written directly, I have used a binary encoding similar to Morse code. 

The final device, therefore, has the development board and a button. When the device is switched on, it does nothing, it only writes that it is connected. Once this is displayed, the user must properly press the combination in binary; in case of success, the stored password will be written or created in case there is none stored. In case of error, nothing will happen. The device has two more functionalities, depending on the time of pressing: password generation mode but without storing it and reset mode to "delete" the password stored in EEPROM:


```c++
#include "DigiKeyboard.h"
#include <EEPROM.h>

/* 
   Aleph8 Digital Key
   Code: 5970 Bytes
   EEPROM used: 61 bits
   Binary encode: 1 - long , 0 - short
   
*/

const int PASS_SIZE = 30;
const int random1 = 1000;
const int n_components = 36;
const int combination[4] = {1,0,1,1};
float initTime = millis();
int components[n_components] = {KEY_A,KEY_B,KEY_C,KEY_D,KEY_E,KEY_F,KEY_G,KEY_H,KEY_I,KEY_J,KEY_K,KEY_L,KEY_M,KEY_N,KEY_O,KEY_P,KEY_Q,KEY_R,KEY_S,KEY_T,KEY_U,KEY_V,KEY_W,KEY_X,KEY_Y,KEY_Z,KEY_1,KEY_2,KEY_3,KEY_4,KEY_5,KEY_6,KEY_7,KEY_8,KEY_9,KEY_0};
int first_time,second_time,sentinel,digit;
bool t;


void setup() {for (int i = random(1,4) ; i < 5 ; i++){randomOrder(components);}pinMode(2,INPUT);DigiKeyboard.sendKeyStroke(0);DigiKeyboard.println("Waiting...");sentinel = 0;EEPROM.get(0,t);}

void loop() {
  DigiKeyboard.delay(500);
  //DigiKeyboard.println(t);
  first_time = millis();
  if (digitalRead(2) == 0){
    while(digitalRead(2)==0){}
    second_time = millis()-first_time;
    //DigiKeyboard.println(second_time);
    if(second_time < 1000){validation(0);}else if(second_time < 4000){validation(1);}else if(second_time < 9000){password(false);}else{DigiKeyboard.println("Reset...");t = true;EEPROM.put( 0, t );}
  }
}

void validation(int n){
  digit = n;
  if( digit == combination[sentinel]){
    sentinel++;
    if(sentinel == 4){password(true);sentinel = 0;}
  }else{sentinel = 0;}  
}

void password(bool b){
      digitalWrite(1,HIGH);
      DigiKeyboard.delay(1000*random(0,3));
      DigiKeyboard.sendKeyStroke(0);
      int a[PASS_SIZE];
      if( (t || t == 255) && b ){
        genPass(a);
        t = false;
        EEPROM.put( 0, t );
        EEPROM.put( 9, a );
      }else if( !t && b ){
        EEPROM.get( 9, a );
        translatePass(a);
      }else{genPass(a);translatePass(a);}
      digitalWrite(1,LOW);
}

void randomOrder(int pass[PASS_SIZE]){
  int tmp,rdm;
  randomSeed(analogRead(PB1)+(millis()-initTime));
  for(int i = 0 ; i < PASS_SIZE ; i ++){
    rdm = random(0,n_components);
    tmp = pass[i];
    pass[i] = pass[rdm];
    pass[rdm] = tmp; 
  }
}

void translatePass(int pass[PASS_SIZE]){
  for(int i = 0; i < PASS_SIZE;i++){
    DigiKeyboard.sendKeyStroke(pass[i]);
  }
  DigiKeyboard.sendKeyStroke(KEY_ENTER);
}

void genPass(int pass[PASS_SIZE]){
  randomSeed(random(analogRead(PB1),random1)/millis()-initTime);
  for(int i = 0; i < PASS_SIZE ; i++){
    pass[i] = components[random(0,(n_components-1))];
    DigiKeyboard.delay(500);
  }
}

```

Finally, [I designed and printed a small case](https://github.com/aleph8/aleph_1/tree/main/digital_key) to mount it all in; it should be soldered, but in case you can't solder it, I have done it without soldering by gluing the plastic part of the pins to the case and making sure it makes contact.

<div style="text-align: center;"><img src="digital1.jpg" alt="Image" width="500"></div> 

(This version of the code has a security loophole. And it is that to see the stored password, the only thing that would have to be done is to load in the development board a small script to go through the EEPROM. To solve this, there are several alternatives; one of them is to remove the Arduino bootloader and send the script using a programmer with the corresponding protocol; we can also store the password in the flash memory of the device, so that if the current program is overwritten, it will be deleted directly).


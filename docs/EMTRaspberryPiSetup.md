# Raspberry Pi EMT Setup
Steps for anyone to set up the Educational Missions Tool touchscreen kiosk on a Raspberry Pi.  
If you have any questions or concerns, please feel free to contact Jake O'Donnell.  
Text or email Jake at 781-521-3314 or jakeod99@gmail.com, respectively.  
God bless!  

## Required Parts
In this Required Parts section, **Bold is necessary**, and *Italics is \*highly\* recommended*.  
The installation steps assume you are using everything that is highly recommended.  
	
* **Raspberry Pi** *3 Model B+ 512MB & 8GB NOOBS Edition
* *Touchscreen* **monitor**
	* **Monitor must have HDMI Port** *and Touch Input port (Probably USB-B)*
	* **Male to Male HDMI cable**
	* *Male to Male Cable for Touch Input (probably USB-A to USB-B)*
* **5.1V/2.5A Micro USB Switching AC Power Supply**
* **Speakers (w/ Male Aux cable)**
* **Ethernet cable**
* *A Keyboard (For setup, not for kiosk)*
	
## Installation Steps
If these steps are unclear, refer to the next section *Verbose Installation Steps* for detailed clarification.
1. Open the Raspberry Pi NOOBS Edition box
    1. It should have inside a Raspberry Pi and an SD Adapter with a MicroSD Card inside
    2. Separate the MicroSD Card from its SD Adapter
2. Put the MicroSD Card into the Raspberry Pi
3. Plug the Raspberry Pi into the touchscreen monitor
    1. The HDMI for display output to the monitor
    2. The cable for touch input (probably USB-A to USB-B) to the Pi
4. Plug your monitor into its power source 
5. Plug the Pi into its power source
6. Make sure your monitor is displaying the output from the Pi
7. There should be a window with multiple operating system options, choose *Raspbian*
8. 

## Verbose Installation Steps (TODO: FLESH OUT)  
If you've already set up the Raspberry Pi using the previous set of steps, skip this section.
1. Open the Raspberry Pi NOOBS Edition box
	1. Inside should be a static shielding bag for the Pi's protection
	2. Remove the Pi and the Micro SD in the SD Adapter
		1. This looks like an SD card with a Raspberry logo on it
		2. It is actually 2 parts
			1. The outer adapter
			2. The inner Micro SD card
		3. Remove the Micro SD from the adapter
			1. Below the Raspberry logo, there is a slot
			2. Carefully slide the Micro SD out of the slot
	3. Be sure not to lose the SD Adapter as we use the Micro SD shortly
	4. You should have 3 things from the box listed below.
		1. The Raspberry Pi
		2. The SD Adapter
		3. The Micro SD Card with 8GB of storage and NOOBS pre-installed	
2. Put the Micro SD Card into the Pi
	1. Look to the leftmost part of the Pi
	2. Beneath the board, there is a Micro SD slot
	3. Make sure side of the Micro SD card with the metal is facing up
	4. Slide the Micro SD into the slot
3. Plug the Raspberry Pi into your touchscreen display monitor
	1. Look to the middle/bottom of the Raspberry Pi
	2. There is a port about a half-inch wide with HDMI written above it
	3. Slide one end of the HDMI cable into that port
	4. Take the other end and plug it into an HDMI port on your monitor
	5. As for how to get touch input from the monitor to the Pi, it depends
		1. Many touch screens do this step differently
		2. Look at the specifications for the monitor
			1. If anything says what port is 
4. Plug Raspberry Pi into Power Source
	1. Plug Power Supply brick into wall outlet
	2. Look to the bottom left corner of the Pi
	3. There, next to the mounting hole, is a Micro USB port
	4. Slide the Micro USB male end from the Power Supply into the port
	5. A red light should come on, don't be alarmed. That is a good light.
5. Your monitor
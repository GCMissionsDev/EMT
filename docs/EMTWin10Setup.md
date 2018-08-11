# Windows 10 EMT Setup
Steps for anyone to set up the Educational Missions Tool touchscreen kiosk on a Windows 10 computer.  
If you have any questions or concerns, please feel free to contact Jake O'Donnell.  
Text or email Jake at 781-521-3314 or jakeod99@gmail.com, respectively.  
God bless!  
## Setting up the computer to make a secure Kiosk
1. Connect computer to wifi
2. If you don't already have it, download Google Chrome [here](https://www.google.com/chrome/)
3. Follow Chrome's set up steps
4. Using Chrome, go to https://github.com/GCMissionsDev/EMT/blob/master/docs/Disable_Screen_Edge_Swipe.reg
5. Download Disable_Screen_Edge_Swipe.reg and save it to the desktop
6. Double click the file from the desktop to merge it
7. When prompted, click on **Run**, **Yes (UAC)**, **Yes**, and **OK** to approve the merge.
8. Restart the computer  
## Setting up the computer to remain on as a kiosk
1. Go to *Settings* (Windows Key + U)
2. Type `Change when the PC Sleeps` in the search bar and select the option that says the same
3. Under *Screen*, change the drop down menus to read
	1. On battery power, turn off after **1 Hour**
	2. When plugged in, turn off after **1 Hour**
4. Under *Screen*, change the drop down menus to read
	1. On battery power, PC goes to sleep after **Never**
	2. When plugged in, PC goes to sleep after **Never**
5. Exit *Settings*  
## Getting EMT to run upon starting the computer
1. Open File Explorer (Windows Key + E)
2. Find chrome.exe (probably C:\Program Files (x86)\Google\Chrome\Application\chrome.exe)  
**Remember the chrome.exe file location for future steps**
3. Open chrome.exe right-click options (Single click to highlight, then right click for dropdown options)
4. Select *Create a shortcut*
    1. If a window pops up offering to put the shortcut on the desktop, say yes
    2. If it creates the shortcut in the directory you're currently in, move it to the desktop
5. Go to your desktop and right click on the shortcut you just created
6. Select *Rename*
7. Type in `EMT Kiosk` and press Enter
8. Right click the shortcut (now named `EMT Kiosk`) again
9. Select *Properties*
10. Now we replace what's currently in the Target box with a very important set of commands
    1. Input the below commands with a space between each (all repetition is necessary) 
        1. The directory you remembered from step 5, inside double quotes. Example below:  
        `"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"`
        2. `--kiosk`
        3. `--kiosk`
        4. `--kiosk-printing`
        5. `https://www.gcemt.org` **(TODO: Replace this with actual domain everywhere it shows up)**
        6. `--disable-pinch`
    2. Depending on your chrome.exe location, the target box should end up something like:  
    `"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk --kiosk --kiosk-printing https://www.gcemt.org --disable-pinch`
11. Select *Apply* then *OK*
12. Right click `EMT Kiosk` for a third time
13. Select *Copy*
14. Now open the Windows Run Dialog (Windows Key + R)
15. Type `shell:startup`
16. A File Explorer Window in the Startup directory should pop up; right click inside the body of the File Explorer
17. Select *Paste*
@echo off
set BROWSER_PROFILE_NAME=tc-radiateDevelopment
echo This will create a separate user profile %BROWSER_PROFILE_NAME% for development, launchable through this command. On the first run, you'll need to go to http://stackoverflow.com/a/29096229/4356868 and follow instructions to disable Cross Domain security. On subsequent runs, you'll need to toggle the security off.
rem (Sadly, no commandline switch like in Chrome - https://bugzilla.mozilla.org/show_bug.cgi?id=1039678 )
pause
echo After Firefox opens a window, DON'T USE THAT WINDOW FOR ANYTHING ELSE THAN WORKING ON THE FILE! Do your browsing only in the window opened from your normal browser shortcut. Unless you want to turn you into a hobo in a split second! Any website you visit can take all the money from your bank account and send your emails to yor boss!
pause
echo on
start "" firefox.exe -profile %APPDATA%\Mozilla\Firefox\Profiles\%BROWSER_PROFILE_NAME% --no-remote %~dp0index.html
@echo off
pause

@ECHO OFF
IF NOT "%~f0" == "~f0" GOTO :WinNT
ECHO.This version of Ruby has not been built with support for Windows 95/98/Me.
GOTO :EOF
:WinNT
REM set path=%path%;%cd%\Ruby200\bin
REM @"%~dp0ruby.exe" "%~dpn0" %*
REM pushd %cd%\Ruby\
REM gem install nokogiri
ruby.exe "%~dpn0" %*
REM popd
pause

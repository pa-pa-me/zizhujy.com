@echo off
:Start
GOTO LIVE

:LIVE
ECHO generating package for Live...
call rake publish clean_artifacts=1

ECHO done! package generated in artifacts folder...
GOTO End

:End
@pause
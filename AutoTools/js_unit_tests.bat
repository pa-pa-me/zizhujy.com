echo off
echo "============================================================="
echo "Running javascript tests ..."
set scriptPath=%~d0%~p0
echo Script path is %scriptPath%
echo "Current directory is " + %cd%
set currentDir=%scriptPath%
cd %currentDir%
pushd ..
set $ROOT=%cd%
popd
echo "Root directory is " + "%$ROOT%"
set testsFiles=%$ROOT%\Source\ZiZhuJY.Web.UI.Scripts.Test\spec\*\*.html
echo %testsFiles%
set testAssemblyFolder=%$ROOT%\Source\ZiZhuJY.Web.UI.Scripts.Test\spec\
echo testAssemblyFolder is %testAssemblyFolder%
set phantomJs=%currentDir%\phantomjs.exe
echo %phantomJs%
set runJasmineJs=%currentDir%\Scripts\run-jasmine.js
echo %runJasmineJs%

setlocal EnableDelayedExpansion

::pushd %testAssemblyFolder%
echo Start Loop...
set testAssemblies=
for /r %testAssemblyFolder% %%f in (*.html) do (
    REM set B=%%~pf
    REM echo !B!
    REM ::take substring of the path
    REM set B=!B:~0,-6!
    REM echo Full : %%f
    REM echo Partial: !B!
    REM echo .
    
    set abs=%%f
    REM echo !abs!
    set rel=..!abs:%$ROOT%=!
    REM echo !rel!
    
    REM set testAssemblies=!testAssemblies!%%f;
    set testAssemblies=!testAssemblies!!rel!;
)
echo %testAssemblies%
echo End Loop.
::popd

for %%i in (%testAssemblies%) do (
    REM set command=%phantomJs% %runJasmineJs% %%i
    echo %%i
    call %phantomJs% %runJasmineJs% %%i
    if !errorlevel! neq 0 (
        echo Testing failed!
        echo phantomJs exited with error level = !errorlevel!
        exit /b !errorlevel!
    )
)

echo js tests pass
echo =====================================================

setLocal DisableDelayedExpansion
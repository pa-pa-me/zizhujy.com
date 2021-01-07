to build with build.bat:

1, install "~\Tools\rubyinstaller-2.0.0-p451.exe"
2, install bundler gems by executing "gem install bundler", then run "bundle" to install required gem.
3, install SpecFlow at \Tools\TechTalk.SpecFlow.Vs2013Integration.vsix

to publish, 

1, run publish.bat.
2, they will generate 7z files in artifacts/ subfolder which contains a xcopy batch file.
3, copy the 7z file to one of the server and unzip it. 
4, run the batch file (as administrator) to deploy.
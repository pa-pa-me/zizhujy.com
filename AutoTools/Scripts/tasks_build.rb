#for build
JUST_BUILD = ENV['rebuild'].nil? #by default, it's build
CONFIG = ENV['config'].nil? ? "debug" : ENV['config']

require 'nokogiri'

namespace :build do  
  task :CheckinBuild => [:js_unit_test, :restore_nuget, :compile_ZiZhuJY, :unit_tests, :nunit_tests]
  task :Regression => [:CheckinBuild, :integration_test]
  
  #restore nuget packages
  task :restore_nuget do    
        sh '"' + Tools::Nuget + '"' + ' restore "' + ProjectDir::ZiZhuJYWeb_SLN + '"'   
  end
  
  task :js_unit_test do
    require 'pathname'
    puts "============================================================="
    puts "Running javascript tests ..."
    
    testsFiles = File.join($ROOT, 'Source/ZiZhuJY.Web.UI.Scripts.Test/spec/*/*.html')
    
    puts ''
    puts "Test file pattern: " + testsFiles
    puts ''
	
	Dir.chdir(File.join($ROOT, 'AutoTools'))
    
    i = 0	
    Dir.glob(testsFiles) do |item|
        next if item == '.' or item == '..'
        
        i = i+1
        
        command = '"' + File.join($ROOT, 'AutoTools/phantomjs.exe') + '" "' + File.join($ROOT, 'AutoTools/Scripts/run-jasmine.js') + '" "' +
        ((Pathname.new item).relative_path_from (Pathname.new File.join($ROOT, 'AutoTools'))).to_s + '"'
        
        puts ''
        puts '----------------------------------------------------------'
        puts '    Running test file ' + i.to_s + '...'
        puts '        ' + command + ''
        
        
        system command
        
        puts $?
        
        if !($? == nil) && $?.pid == 0 then
            raise 'Failed to start ' + command
        end
        
        if !($? == nil) && $?.exitstatus != 0 then
            raise 'JavaScript tests failed!'
        end
        puts '-----------------------------------------------------------'
        puts ''
    end
    
    if(i == 0) then
        raise 'No js test files are found!'
    end
    
    puts "JavaScript tests passed. :)    total test files: " + i.to_s
    puts "============================================================="
  end


  msbuild :compile_ZiZhuJY do |msb|  	
    puts 'Compiling ZiZhuJY solution...'
	msb.use :net40	
    msb.properties :configuration => CONFIG, :OutDir => WorkingDir::BUILD_OUTPUT
	msb.targets JUST_BUILD ? [:Build] : [:Clean, :ReBuild]
    puts 'solution = ' + ProjectDir::ZiZhuJYWeb_SLN
	msb.solution = ProjectDir::ZiZhuJYWeb_SLN 
	msb.verbosity = "minimal" #"Quiet" #"minimal"
  end 
  
    #desc "Run unit tests ..."
  mstest :unit_tests do |mstest|
    puts 'Running unit tests...'
	mstest.working_directory = WorkingDir::TESTS_OUTPUT
    
    puts 'test working dir = ' + mstest.working_directory
    
  	mstest.command = Tools::MsTest
    
    puts 'test command = ' + mstest.command 
    
  	mstest.assemblies   File.join(WorkingDir::BUILD_OUTPUT, "ZiZhuJY.Common.Tests.dll"),
                        File.join(WorkingDir::BUILD_OUTPUT, "ZiZhuJY.Helpers.Tests.dll"),
                        File.join(WorkingDir::BUILD_OUTPUT, "ZiZhuJY.Core.Tests.dll"),
                        File.join(WorkingDir::BUILD_OUTPUT, "ZiZhuJY.Web.UI.UnitTest.dll")
  end
  
  nunit :nunit_tests do |nunit|
    puts 'Running nunit tests...'
    nunit.working_directory = WorkingDir::TESTS_OUTPUT
    puts 'test working dir = ' + nunit.working_directory
    nunit.command = File.join($ROOT, 'Tools/NUnit-2.6.3/bin/nunit-console.exe')
    nunit.assemblies    File.join(WorkingDir::BUILD_OUTPUT, "ZiZhuJY.Helpers.Tests.dll"),
                        File.join(WorkingDir::BUILD_OUTPUT, "ZiZhuJY.Core.Tests.dll"),
                        File.join(WorkingDir::BUILD_OUTPUT, "ZiZhuJY.Web.UI.UnitTest.dll")
  end
  
  mstest :integration_test do |mstest|
  	mstest.command = Tools::MsTest
  	mstest.assemblies WorkingDir::BUILD_OUTPUT + "ZiZhuJY.PhantomJsWrapper.Tests.dll"
  end 
  
end
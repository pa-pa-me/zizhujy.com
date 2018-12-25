#for publish
PUBLISH_CONFIG = ENV['Release'].nil? ? "Debug" : "Release"
KEEP_ARTIFACTS = ENV['clean_artifacts'].nil?

namespace :publish do  	
  task :default => [:pre_clean, :publish_and_zip_all_projects, :clean]  
  
  #empty publish & artifacts folder
  task :pre_clean do	
	FileUtils.rm_rf(WorkingDir::PUBLISH_ROOT)	
	FileUtils.rm_rf(WorkingDir::ARTIFACTS_ROOT)	unless KEEP_ARTIFACTS
  end
  
  #empty publish folder
  task :clean do	
	FileUtils.rm_rf(WorkingDir::PUBLISH_ROOT)
  end
  
  #task with arguments to publish project under certain config
  msbuild :do_publish, :config_name, :proj do |msb, args|	
    publish_folder = args[:proj].publish_folder(args[:config_name])
	puts "Start building #{File.basename(publish_folder)}..."
	msb.use :net40
    msb.properties =  args[:proj].is_web ? 
						{ :configuration => args[:config_name], :usewpp_copywebapplication => true, :pipelinedependsonbuild => false, 
						  :webprojectoutputdir => "#{publish_folder}/", :outdir => "#{publish_folder}/bin/", :VisualStudioVersion => "12.0"
						} : 
						{:configuration => args[:config_name], :outdir => publish_folder }  
	msb.targets [:clean, :rebuild]
	msb.solution = args[:proj].project_file
	msb.verbosity = "quiet"
  end 
  
  #task with argumetns to zip the publish_folder, including a bat file to deploy
  exec :do_zip, :config_name, :proj do |cmd, args|
    publish_folder = args[:proj].publish_folder(args[:config_name])
    artifacts_folder = args[:proj].artifacts_folder(args[:config_name])	
	deploy_folders = args[:proj].deploy_folders(args[:config_name])
	
    deployScriptName = "#{publish_folder}.bat"
    output = File.open(deployScriptName, "w")
	output << "@echo off\n"
	output << "pushd %~dp0\n"
	
	output << args[:proj].before_deploy(args[:config_name]) + "\n"
	deploy_folders.each do |df|
		output << %q'xcopy %s "%s" /e /Y' % [File.basename(publish_folder), df]
		output << "\n"
	end
	output << args[:proj].after_deploy(args[:config_name]) + "\n"
	
	output << "popd\n"
	output << "@pause\n"
	output.close
	
	cmd.command = Tools::SevenZ
	cmd.parameters = "a %s.7z %s -i!%s" % [artifacts_folder, publish_folder, deployScriptName]	
  end 
  
  def do_publish_and_zip(config_name, proj)
    #see: http://stackoverflow.com/a/1290119/615883
	Rake::Task['publish:do_publish'].reenable
	Rake::Task['publish:do_zip'].reenable
	Rake::Task['publish:do_publish'].invoke(config_name, proj)
	Rake::Task['publish:do_zip'].invoke(config_name, proj)
  end    

  task :publish_and_zip_all_projects do
	PROJECTS.each { |proj| 
		next unless PUBLISH_PROJ_IDS.include? proj.id
		do_publish_and_zip(PUBLISH_CONFIG, proj) 
	}	
  end 
end
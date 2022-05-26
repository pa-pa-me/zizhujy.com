module WorkingDir			
	PUBLISH_ROOT = File.join($ROOT, "Publish") #do publish here
	ARTIFACTS_ROOT = File.join($ROOT, "artifacts") #put publish artifacts here		
	BUILD_OUTPUT = File.join($ROOT, "bin/")	#do CI build here
	TESTS_OUTPUT = File.join($ROOT, "")
end

module ConfigName
	Debug = $config["config_name"]["debug"]
	Release = $config["config_name"]["release"]
end

module ProjectName
	ZiZhuJYWeb = $config["project_name"]["ZiZhuJYWeb"]
end

module ProjectDir
	ZiZhuJYWeb_SLN = File.join($ROOT, $config["project_dir"]["ZiZhuJYWeb_SLN"])
end

module Tools
    #MsTest = $VS2013 ? File.join($ROOT, "Tools/MsTest/MSTest.exe") : File.join($ROOT, "Tools/MsTest/VS11/MSTest.exe")
    #MsTest = File.join($ROOT, "Tools/MsTest/VS11/MSTest.exe")
	MsTest = File.join($ROOT, "Tools/MsTest/MSTest.exe")
	SevenZ = File.join($ROOT, "Tools/7za920/7za.exe")
	Nuget = File.join($ROOT, "Tools/nuget.exe")
	MsDeploy = File.join($ROOT, "Tools/MsDeploy/MsDeploy.exe")
end

module PublishConfig
    ZiZhuJYWeb_DEPLOY_ENV = 
		{
			ConfigName::Release => 
				{ProjectName::ZiZhuJYWeb => [%q"\\\CT-E1APP1\D$\web\OdinPlus", %q"\\\CT-E1APP2\D$\web\OdinPlus", %q"\\\CT-E1APP3\D$\web\OdinPlus", %q"\\\CT-E1APP4\D$\web\OdinPlus"],
				},
		}
	PUBLISH_CONFIG_DIR_MAP =
		{ConfigName::Release => "Release"}	
	
	def PublishConfig.deploy_folders(configName, projName)
		ZiZhuJYWeb_DEPLOY_ENV[configName][projName]
	end
	
	def PublishConfig.publish_folder(configName, projName)		
		File.join(WorkingDir::PUBLISH_ROOT, PUBLISH_CONFIG_DIR_MAP[configName], projName)
	end
	
	def PublishConfig.artifacts_folder(configName, projName)		
		File.join(WorkingDir::ARTIFACTS_ROOT, PUBLISH_CONFIG_DIR_MAP[configName], projName)
	end
end

class Proj
	attr_reader :name, :is_web, :id	
	
	def initialize(id, name, projFile, is_web)
		@id, @projFile, @name, @is_web = id, projFile, name, is_web
	end
	
	def project_file		
		File.join($ROOT, @projFile)
	end
	
	def publish_folder(config_name)
		PublishConfig.publish_folder(config_name, @name)	
	end
	
	def artifacts_folder(config_name)
		PublishConfig.artifacts_folder(config_name, @name)	
	end
	
	def deploy_folders(config_name)
		PublishConfig.deploy_folders(config_name, @name)
	end
	
	def before_deploy(config_name)
	end
	
	def after_deploy(config_name)
	end
end

PROJECTS = [
    Proj.new(1, ProjectName::ZiZhuJYWeb, "Source/ZiZhuJY.Web.UI/ZiZhuJY.WebUI.csproj", true)
]	
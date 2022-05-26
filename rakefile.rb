gem 'albacore', '=0.2.6'
require 'albacore'
require 'rake'
require 'yaml'

$ROOT = File.expand_path(Dir.pwd)

puts 'Root path is ' + $ROOT

$config = YAML.load_file(File.join($ROOT, 'AutoTools/Scripts/configs.yml'))
$VS2013 = File.directory?('C:\Program Files (x86)\Microsoft Visual Studio 12.0')

require_relative 'AutoTools/Scripts/configs'
require_relative 'AutoTools/Scripts/tasks_publish'
require_relative 'AutoTools/Scripts/tasks_build'
#Dir["#{$ROOT}/Scripts/*.rb"].each {|f| require f}

task :default => ["build:CheckinBuild"]
task :regression => ["build:Regression"]
task :publish => ["publish:default"]
Feature: ResourceHelper

Scenario Outline: Should escape all the unescaped 'c's in the input string
	Given a input string <input>
	And a target character <c> to escape
	When I call the method EscapeTheUnescapedChar(input, c) to escape c in the input string
	Then the <output> should escaped all the unescaped 'c's
	Examples: 
	| input           | c | output            |
	| test no c       | ' | test no c         |
	| test unsafe '   | ' | test unsafe \'    |
	| test safe \'    | ' | test safe \'      |
	# Spec flow bug: test unsafe \\' --> test unsafe \\\', should pass test unsafe \\\\\'
	# Use normal unit test (mstest) to test this feature
	#| test unsafe \\' | ' | test unsafe \\\' |

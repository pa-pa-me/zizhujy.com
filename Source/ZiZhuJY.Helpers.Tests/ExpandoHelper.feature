Feature: ExpandoHelper
	In order to easily generate html from expando objects
	As a developer
	I want to have a helper for me to do that

Scenario: ToHtmlUnorderedList
	Given an expando object
	| Key  | Value  |
	| Key1 | Value1 |
	| Key2 | Value2 |
	When I generate html for it
	Then the result should be "<div>System.Dynamic.ExpandoObject</div><ul><li><strong>Key1</strong> = Value1</li><li><strong>Key2</strong> = Value2</li></ul>"
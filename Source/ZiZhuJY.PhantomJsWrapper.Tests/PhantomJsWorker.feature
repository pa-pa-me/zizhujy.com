Feature: PhantomJSWorker

Scenario: Grab web page to pdf
	Given the web page url is "http://zizhujy.com"
	When I grab it
	Then there I will get informed with the pdf path

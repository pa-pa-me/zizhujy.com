Feature: ZodiacYears

Scenario Outline: Get Zodiac by date
	Given the date is <Date>
	Then the Zodiac is <Zodiac>
	Examples: 
	| Date        | Zodiac  |
	| "2014-5-19" | "Horse" |

Scenario Outline: Get Zodiac by lunar year
    Given the Lunar Year is <Year>
    Then the Zodiac is <Zodiac>
    Examples: 
    | Year | Zodiac  |
    | 2014 | "Horse" |
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TechTalk.SpecFlow;
using ZiZhuJY.Helpers;

namespace ZiZhuJY.Core.Tests
{
    [Binding]
    public class ZodiacYearsSteps
    {
        private DateTime datetime;
        private ZodiacYears actualZodiacGot;

        [Given(@"the date is ""(.*)""")]
        public void GivenTheDateIs(string dateString)
        {
            datetime = DateTime.Parse(dateString);
            actualZodiacGot = ZodiacYear.GetZodiac(datetime);
        }

        [Then(@"the Zodiac is ""(.*)""")]
        public void ThenTheZodiacIs(string expectedZodiac)
        {
            Assert.AreEqual(EnumHelper.ParseEnum<ZodiacYears>(expectedZodiac), actualZodiacGot);
        }

        [Given(@"the Lunar Year is (.*)")]
        public void GivenTheLunarYearIs(int lunarYear)
        {
            actualZodiacGot = ZodiacYear.GetZodiac(lunarYear);
        }

    }
}

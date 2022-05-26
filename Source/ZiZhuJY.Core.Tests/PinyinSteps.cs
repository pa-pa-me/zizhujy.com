using ImpromptuInterface.Dynamic;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;
using ZiZhuJY.Core;
using System.Linq;

namespace ZiZhuJY.Core.Tests
{
    [Binding]
    public class PinyinSteps
    {
        private string input;
        private List<string[]> pinyins;

        [Given(@"input = ""(.*)""")]
        public void GivenInput(string inputString)
        {
            input = inputString;
        }

        [Then(@"its pin yin is")]
        public void ThenItsPinYinIs(Table table)
        {
            pinyins = PinYin.GetPinYin(input);
            Assert.IsTrue(table.CompareToOrderedSet(pinyins));
        }
    }

    public static class TableExtensions
    {
        public static bool CompareToOrderedSet<TInstance>(this Table table, List<TInstance> set)
        {
            if (table.RowCount != set.Count)
            {
                return false;
            }

            if (typeof(TInstance) == typeof(string))
            {
                return table.CompareToStringListRowByRow(set as List<string>);
            }

            if (typeof (TInstance) == typeof (string[]))
            {
                return table.CompareToListOfStringArrayRowByRow(set as List<string[]>);
            }

            return false;
        }

        private static bool CompareToStringListRowByRow(this Table table, List<string> set)
        {
            for (var i = 0; i < set.Count; i++)
            {
                var actual = set[i];
                var expected = table.Rows[i];

                if (expected.Values.Count != 1)
                {
                    return false;
                }

                if (!actual.Equals(expected[0]))
                {
                    return false;
                }
            }

            return true;
        }

        private static bool CompareToListOfStringArrayRowByRow(this Table table, List<string[]> set)
        {
            for (var i = 0; i < set.Count; i++)
            {
                var actual = set[i];
                var expected = table.Rows[i];

                if (expected.Count < actual.Length)
                {
                    return false;
                }

                for (var j = 0; j < actual.Length; j++)
                {
                    if (!actual[j].Equals(expected[j]))
                    {
                        return false;
                    }
                }

                for (var k = actual.Length; k < expected.Count; k++)
                {
                    if (!string.IsNullOrWhiteSpace(expected[k]))
                    {
                        return false;
                    }
                }
            }

            return true;
        }
    }
}

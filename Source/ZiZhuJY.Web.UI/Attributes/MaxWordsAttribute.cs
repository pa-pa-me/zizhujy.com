using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace ZiZhuJY.Web.UI.Attributes
{
    public class MaxWordsAttribute : ValidationAttribute, IClientValidatable
    {
        public MaxWordsAttribute(int maxWords): base("{0} has too many words.")
        {
            this.MaxWords = maxWords;
        }

        public int MaxWords { get; set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value != null)
            {
                var valueAsString = value.ToString();
                int wordCount = ZiZhuJY.Helpers.TextHelper.CalculateWordCount(valueAsString);
                if (wordCount > this.MaxWords)
                {
                    var errorMessage = FormatErrorMessage(validationContext.DisplayName);

                    return new ValidationResult(errorMessage);
                }
            }

            return ValidationResult.Success;
        }

        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
        {
            var rule = new ModelClientValidationRule();
            rule.ErrorMessage = FormatErrorMessage(metadata.GetDisplayName());
            rule.ValidationParameters.Add("wordcount", this.MaxWords);
            rule.ValidationType = "maxwords";
            yield return rule;
        }
    }
}
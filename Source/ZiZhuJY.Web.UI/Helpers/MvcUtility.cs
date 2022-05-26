using System;
using System.Web.Mvc;

namespace ZiZhuJY.Web.UI.Utility
{
    public class MvcUtility
    {
        public static void ProcessInvalidModelState(ModelStateDictionary modelState)
        {
            foreach (ModelState ms in modelState.Values)
            {
                foreach (ModelError err in ms.Errors)
                {
                    if (err.Exception != null)
                    {
                        throw err.Exception;
                    }
                    else
                    {
                        throw new Exception(err.ErrorMessage);
                    }
                }
            }
        }
    }
}
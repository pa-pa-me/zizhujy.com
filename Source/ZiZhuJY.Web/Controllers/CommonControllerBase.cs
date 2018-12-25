using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;

namespace ZiZhuJY.Web.Controllers
{
    /// <summary>
    /// Contains common controller helper methods, and cannot be defined as extension methods.
    /// </summary>
    public abstract class CommonControllerBase : Controller
    {
        protected ActionResult UnderConstruction()
        {
            return View("UnderConstruction");
        }

        protected ActionResult Error(string message, object model)
        {
            if (!String.IsNullOrEmpty(message))
            {
                ViewBag.Message = message;
            }

            if (!Request.IsAjaxRequest())
            {
                return View("Error", model);
            }
            else
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                if (ModelState.IsValid)
                {
                    // add a mock error in order to display other error messages with ValidationSummary
                    ModelState.AddModelError(string.Empty, string.Empty);
                }

                // merge the message with validation errors
                return PartialView("_ErrorSummary", ViewBag.Message);
            }
        }

        protected ActionResult Error(string message)
        {
            return Error(message, null);
        }

        protected ActionResult Error()
        {
            return Error(null, null);
        }
    }
}

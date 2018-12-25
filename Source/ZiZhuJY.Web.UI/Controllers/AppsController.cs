using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Web.Mvc;
using ZiZhuJY.Helpers;
using ZiZhuJY.Web.UI.Attributes;
using ZiZhuJY.Web.UI.Models;
using ZiZhuJY.Web.UI.Utility;

namespace ZiZhuJY.Web.UI.Controllers
{
    [Localization]
    [CompressContent(Order = 9999)]
    [RemoveWhitespaces(Order = -1)]
    public class AppsController : Controller
    {
        //
        // GET: /Apps/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Ploter()
        {
            return View();
        }

        public ActionResult FunGrapher()
        {
            return View();
        }

        public ActionResult Matrix()
        {
            return View();
        }

        public ActionResult IcoMaker()
        {
            return View();
        }

        [HttpPost]
        public Stream IcoMaker(IcoModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.Image != null)
                {
                    string fileName = model.File != null ? Path.GetFileNameWithoutExtension(model.File.FileName) : "zizhujy";
                    string extension = "ico";
                    Response.AddHeader("Content-Disposition", string.Format("attachment;filename={0}.{1}", fileName, extension));
                    MemoryStream mem = new MemoryStream();
                    Icon icon = ImageHandler.IcoMaker.IcoMaker.FromImage(model.Image, 32, 32);
                    icon.Save(mem);
                    icon.Dispose();
                    mem.WriteTo(Response.OutputStream);
                    mem.Dispose();
                    return Response.OutputStream;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        public ActionResult Decompressor()
        {
            return View();
        }

        [HttpPost]
        public FileResult Decompressor(DecompressorModel model)
        {
            const int BUFFER_SIZE = 4096;

            if (ModelState.IsValid)
            {
                if (model.File != null)
                {
                    switch (model.Action)
                    {
                        case CompressorActions.Compress:
                            break;
                        case CompressorActions.Decompress:
                            string fileName = Path.GetFileNameWithoutExtension(model.File.FileName);

                            /*
                            using (MemoryStream ms = new MemoryStream())
                            {
                                using (GZipStream input = new GZipStream(model.File.InputStream, CompressionMode.Decompress, false))
                                {
                                    byte[] buffer = new byte[BUFFER_SIZE];
                                    int n;
                                    while ((n = input.Read(buffer, 0, buffer.Length)) > 0)
                                        ms.Write(buffer, 0, n);

                                    input.Close();
                                }
                                ms.Close();

                                return File(ms, "application/octet-stream", fileName);
                            }*/
                            break;
                        default:
                            throw new NotImplementedException(string.Format(Resources.Controllers.Apps.Decompressor.NotImplementedAction.ToString(), model.Action.ToString()));
                    }
                    return File("", "application/octet-stream", "Output.xml");
                }
                else
                {
                    string message = Resources.Controllers.Apps.Decompressor.FileUploadedIsInvalid.ToString();
                    throw new Exception(message);
                }
            }
            else
            {
                MvcUtility.ProcessInvalidModelState(ModelState);
                return null;
            }
        }

        [Authorize(Roles="Administrators")]
        public ActionResult WhereAreYouNow()
        {
            try
            {
                ZiZhuJYLocationService.LocationServiceClient client = new ZiZhuJYLocationService.LocationServiceClient();
                client.ClientCredentials.UserName.UserName = "Jeff";
                client.ClientCredentials.UserName.Password = "1050709";

                Dictionary<ZiZhuJYLocationService.IdentifiedDevice, ZiZhuJYLocationService.GeoCoordinate>
                    allGeoCoordinates = client.GetLatestGeoCoordinates();

                client.Close();

                ViewBag.AllGeoCoordinates = allGeoCoordinates;
            }
            catch (Exception ex)
            {
                ViewBag.Console = ExceptionHelper.CentralProcess(ex);
            }

            return View();
        }

        public ActionResult ImageExplorer()
        {
            return View();
        }
    }
}

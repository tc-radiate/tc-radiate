<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.IO;
using System.Net;
using System.Web;

public class Handler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "application/json";
        var url = context.Request.QueryString["url"];
        var request = (HttpWebRequest)WebRequest.Create(url);
        request.Accept = "application/json";
        request.Headers.Add("ts", DateTime.Now.ToFileTime().ToString());
        
        var response = request.GetResponse().GetResponseStream();
        if (response == null)
            return;
        
        var reader = new StreamReader(response);
        context.Response.Write(reader.ReadToEnd());
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}
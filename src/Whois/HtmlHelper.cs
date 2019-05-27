using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Whois
{
    public static class HtmlHelper
    {
        public static IHtmlContent BootstrapCheckbox(this IHtmlHelper html, string id, string content, bool isChecked = false, string css = "",  string note = "",
            string noteClass = "")
        {
            return new HtmlString($"<div class=\"control custom-control custom-checkbox {css}\"><input id=\"{id}\" type=\"checkbox\" class=\"custom-control-input\" " +
                                  (isChecked ? "checked" : "") + ">" +
                                  $"<label class=\"custom-control-label\" for=\"{id}\"><span class=\"checkbox-text\"><span class=\"checkbox-content\">{content}</span>" +
                                  (string.IsNullOrEmpty(note) ? "": $"<span class=\"checkbox-note {noteClass}\">(" + note + ")</span>") +
                                  "</span></label></div>");
        }
    }
}

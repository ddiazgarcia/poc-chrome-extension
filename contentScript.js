// $(document).ajaxSuccess(() => {
//   console.log("Ajax call done!");
// });

class ProtocolType {
  static HTTP = "HTTP";
  static HTTPS = "HTTPS";
  static BOTH = "BOTH";
}

const getProtocols = protocolType => {
  switch (protocolType) {
    case ProtocolType.HTTP:
      return ["http"];
    case ProtocolType.HTTPS:
      return ["https"];
    case ProtocolType.BOTH:
      return ["http", "https"];
    default:
      return [];
  }
};

const getUrls = siteList => {
  const finalRoutes = [];
  for (const site of siteList) {
    for (const route of site.routes) {
      const urlSite = route.routeUrl.toLowerCase();
      //const aElement = $(`<a href='${url}'></a>`).get();
      const index = urlSite.indexOf("://");
      const urlWithoutProtocol = urlSite.substring(index < 0 ? 0 : index + 3);
      const protocols = getProtocols(route.protocolType);
      for (const protocol of protocols) {
        finalRoutes.push(`${protocol}://${urlWithoutProtocol}`);
        if (!!route.includeWWW && !urlWithoutProtocol.startsWith("www")) {
          finalRoutes.push(`${protocol}://www.${urlWithoutProtocol}`);
        }
      }
    }
  }
  return finalRoutes;
};

$(document).ready(() => {
  const documentUrl = document.location.href;
  console.log(`I am at ${documentUrl}`);

  $.getJSON("http://localhost:8080/sites", siteList => {
    console.log(siteList);
    const urls = getUrls(siteList);
    if (urls.some(url => documentUrl.startsWith(url))) {
      console.log(`Site ${documentUrl} matched!!!`);
      changePDFLinks();
      hideLinks();
    } else {
      console.log(`Site ${documentUrl} not matched`);
    }
  });

  const changePDFLinks = () => {
    $('a[href$="pdf"]').each((idx, elem) => {
      const href = $(elem).attr("href");
      console.log(`Link to PDF ${href} visited.`);
      const filename = href.substring(href.lastIndexOf("/") + 1);
      $(elem)
        .attr("download", filename)
        .removeAttr("target");
    });
  };

  const hideLinks = () => {
    // Hide link "Plomberie of section categories"
    const liElements = $("section.section-categories li");
    if (liElements.length >= 2) {
      $(liElements[2]).hide();
    }
  };
});

const ajaxCall = function() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/sites", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // innerText does not let the attacker inject HTML elements.
      console.log(xhr);
    }
  };
  xhr.send();
};

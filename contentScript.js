// $(document).ajaxSuccess(() => {
//   console.log("Ajax call done!");
// });

$(document).ready(() => {
  const url = document.location.href;
  console.log(`I am at ${url}`);

  $.getJSON("http://localhost:8080/sites", siteList => {
    console.log(siteList);
    let matched = false;
    for (const site of siteList) {
      if (url.startsWith(site.siteUrl)) {
        console.log(`Site ${url} matched!!!`);
        matched = true;
        changePDFLinks();
        hideLinks();
      }
    }
    if (!matched) {
      console.log(`Site ${url} not matched`);
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

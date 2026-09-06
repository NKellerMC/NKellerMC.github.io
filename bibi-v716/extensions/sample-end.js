/* THERAN sample-end bridge: Bibi -> parent page */
Bibi.x({
  id: "TheranSampleEnd",
  description: "Notifies the THERAN sample page when the reader reaches the end.",
  author: "THERAN",
  version: "1.0.0"
})(function () {
  "use strict";
  var sent = false;
  function post(type) {
    try {
      window.parent.postMessage({ type: type }, window.location.origin);
    } catch (error) {
      window.parent.postMessage({ type: type }, "*");
    }
  }
  E.bind("bibi:opened", function () {
    post("theran:reader-ready");
  });
  E.bind("bibi:got-to-the-end", function () {
    if (sent) return;
    sent = true;
    post("theran:sample-end");
  });
});

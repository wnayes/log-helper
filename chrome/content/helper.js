Components.utils.import("resource://gre/modules/NetUtil.jsm");

var eLogHelper = {
  openCurrentLogFolder: function() {
    let listbox = document.getElementById("logList");
    if (!listbox.selectedItem)
      return;

    let log = listbox.selectedItem.log;
    let file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(log.path);

    // Folder opening code taken from /instantbird/content/preferences/privacy.js
    try {
      file.reveal();
    } catch (e) {
      let parent = file.parent.QueryInterface(Components.interfaces.nsILocalFile);
      if (!parent)
        return;
 
      try {
        parent.launch();
      } catch (e) {
        let uri = Services.io.newFileURI(parent);
        let protocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
                                    .getService(Ci.nsIExternalProtocolService);
        protocolSvc.loadUrl(uri);
      }
    }
  },

  showJSON: function() {
    let listbox = document.getElementById("logList");
    if (!listbox.selectedItem)
      return;

    let log = listbox.selectedItem.log;
    let file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(log.path);

    try {
      file.launch();
    } catch (e) {
      let uri = Services.io.newFileURI(file);
      let protocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
                                  .getService(Ci.nsIExternalProtocolService);
      protocolSvc.loadUrl(uri);
    }

    /*
    var logData;
    NetUtil.asyncFetch(file, function(inputStream, status) {
      if (!Components.isSuccessCode(status))
        return;

      logData = NetUtil.readInputStreamToString(inputStream, inputStream.available());
    });

    let prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                            .getService(Components.interfaces.nsIPromptService);
    prompts.alert(window, listbox.selectedItem.label, logData);
    */
  },

  deleteLog: function() {
    let listbox = document.getElementById("logList");
    if (!listbox.selectedItem)
      return;

    let prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                            .getService(Components.interfaces.nsIPromptService);
    let logStrings = document.getElementById("eLogHelper-bundle");
    if (!(prompts.confirm(window, 
                          logStrings.getString("deleteLogPromptTitle"), 
                          logStrings.getString("deleteLogPromptMessage")))) {
      return;
    }

    let log = listbox.selectedItem.log;
    let file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(log.path);
    if (file.exists())
      file.remove(false);

    let selectedIdx = listbox.selectedIndex;
    if (selectedIdx > 0) {
      listbox.selectedIndex--;
      listbox.removeItemAt(selectedIdx);
    } 
    else {
      listbox.removeItemAt(selectedIdx);
      if (listbox.itemCount > 1)
        listbox.selectedIndex = 0;
    }
  }
}

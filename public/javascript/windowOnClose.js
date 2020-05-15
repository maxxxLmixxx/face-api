window.addEventListener("beforeunload", e => {
    if(!globalVariables.addUserWindow.length) return;
    globalVariables.addUserWindow.pop().close();
 }, false);
export default function jsonPrettify(data = { error: { 
  code: `Client error`, message: `Probably wrong image: face cannot be found.\n`} }, 
  containerSelector = '.information-menu') {

    const dataString = JSON.stringify(data, undefined, 4);
    output( syntaxHighlight(dataString) );

    // const jsonPretty = JSON.stringify(data, null, 2);  
    // document.querySelector('#information-menu').innerHTML = jsonPretty;
    // document.querySelector('.information-menu').style.cssText = "overflow: scroll";
    
    function output(inp) {
      document.querySelector(containerSelector)
      .appendChild(document.createElement('pre')).innerHTML = inp;
    }

    function syntaxHighlight(json) {
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
          var cls = 'number';
          if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                  cls = 'key';
              } else {
                  cls = 'string';
              }
          } else if (/true|false/.test(match)) {
              cls = 'boolean';
          } else if (/null/.test(match)) {
              cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
      });
    }

}

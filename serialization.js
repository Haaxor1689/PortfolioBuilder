
function appendElement(xmlDoc, parent, name, isOptional) {
  var text = $('[name=' + name + ']').val();
  if (text == null || text.trim() == '') {
    if (!isOptional) {
      alert('You haven\'t filled out required field ' + name);
      return false;
    }
    return true;
  }

  var newel = xmlDoc.createElement(name);
  var newtext = xmlDoc.createTextNode(text);
  newel.appendChild(newtext);
  parent.appendChild(newel);
  return true;
}

function appendLocalizedElement(xmlDoc, parent, name, isOptional) {
  var text = $('[name=' + name + ']').val();
  if (text == null || text.trim() == '') {
    if (!isOptional) {
      alert('You haven\'t filled out required field ' + name);
      return false;
    }
    return true;
  }

  var newel = xmlDoc.createElement(name);
  var langel = xmlDoc.createElement('text');
  langel.setAttribute('lang', 'en');
  var newtext = xmlDoc.createTextNode(text);
  langel.appendChild(newtext);
  newel.appendChild(langel);
  parent.appendChild(newel);
  return true;
}

function getElement(xmlDoc, name, isOptional) {
  var elem = xmlDoc.getElementsByTagName(name)[0];
  if (elem == null && isOptional) {
    return;
  }
  $('[name=' + name + ']').val(elem.childNodes[0].nodeValue);
}

function getLocalizedElement(xmlDoc, name, isOptional) {
  var elem = xmlDoc.getElementsByTagName(name)[0];
  if (elem == null && isOptional) {
    return;
  }
  $('[name=' + name + ']')
      .val(elem.getElementsByTagName('text')[0].childNodes[0].nodeValue);
}

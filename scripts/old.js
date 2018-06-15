function getElementsByXpath(xmlDoc, path) {
    return xmlDoc.evaluate(path, xmlDoc, null, XPathResult.ANY_TYPE, null);
}

var counter = 0;
function moreFields() {
    counter++;
    var newFields = document.getElementById("readroot").cloneNode(true);
    newFields.id = '';
    newFields.style.display = "block";
    var newField = newFields.childNodes;
    for (var i = 0; i < newField.length; i++) {
        var theName = newField[i].name
        if (theName) newField[i].name = theName + counter;
    }
    var insertHere = document.getElementById("writeroot");
    insertHere.parentNode.insertBefore(newFields, insertHere);
}

var socialNames = ["linkedin", "facebook", "instagram", "youtube", "twitch", "twitter", "stackoverflow", "github", "pinterest"];

$('form').submit(function (ev) {
    ev.preventDefault(); //I keep form from submitting
    var xmlDoc = document.implementation.createDocument(null, "portfolio");

    var portfolio = xmlDoc.getElementsByTagName("portfolio")[0];
    if (!appendElement(xmlDoc, portfolio, "name", false)) return;
    if (!appendElement(xmlDoc, portfolio, "email", false)) return;
    if (!appendLocalizedElement(xmlDoc, portfolio, "headline", true)) return;
    if (!appendLocalizedElement(xmlDoc, portfolio, "summary", false)) return;

    var social = xmlDoc.createElement("social");
    portfolio.appendChild(social);
    socialNames.forEach(function (item) {
        if (!appendElement(xmlDoc, social, item, true)) return;
    })

    var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(xmlDoc);
    saveFile("tst.xml", xmlString)
});

function saveFile(filename, filedata) {
    var blob = new Blob([filedata], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
}

var socialOtherCount = 0;
$('#social-other-add').click(addSocialOther);
function addSocialOther() {
    ++socialOtherCount;
    var newForm = document.createElement('tr');

    var labelElem = document.createElement('td');
    var labelText = document.createTextNode('Other:');
    labelElem.appendChild(labelText);

    var formElem = document.createElement('td');
    var inputElem = document.createElement('input');
    inputElem.setAttribute('type', 'text');
    inputElem.setAttribute('name', 'link' + socialOtherCount);
    inputElem.setAttribute('maxlength', '20');
    var cancelElem = document.createElement('input');
    cancelElem.setAttribute('type', 'button');
    cancelElem.setAttribute('value', 'x');
    cancelElem.setAttribute('onclick', 'this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);');
    cancelElem.setAttribute('class', 'btn');
    formElem.appendChild(inputElem);
    formElem.appendChild(cancelElem);

    newForm.appendChild(labelElem);
    newForm.appendChild(formElem);

    insert = document.getElementById("social-other-insert");
    insert.parentNode.insertBefore(newForm, insert);
}

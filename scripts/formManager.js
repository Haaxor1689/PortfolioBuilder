define(["require", "exports", "text!../portfolioSchema.xsd", "text!../transformations/formTransform.xsl", "typings/he"], function (require, exports, schema, formTransform, he) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormManager = /** @class */ (function () {
        function FormManager() {
            var _this = this;
            $("#file-input").on('change', function (e) { return _this.LoadXML(e); });
            $('#load-xml').click(function () { return _this.FillForm(); });
            this.GenerateForm();
        }
        FormManager.prototype.LoadXML = function (event) {
            var _this = this;
            event.preventDefault();
            $("#xml-load-error").addClass("hidden");
            var file = event.currentTarget.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.xmlDocument = new DOMParser().parseFromString(event.target.result, "text/xml");
                _this.xmlName = file.name;
                if (!_this.HasLoadedXML) {
                    _this.xmlDocument = null;
                    _this.xmlName = null;
                }
            };
            reader.readAsText(file);
        };
        FormManager.prototype.ValidateXML = function () {
            var encodedXML = he.encode(this.xmlDocument.documentElement.outerHTML, {
                allowUnsafeSymbols: true
            });
            //create an object
            var Module = {
                xml: encodedXML,
                schema: schema,
                arguments: ["--noout", "--schema", 'portfolioSchema.xsd', this.xmlName]
            };
            //and call function
            var result = validateXML(Module);
            console.log(result);
            if (!result.match(this.xmlName + ' validates')) {
                $("#xml-load-error").removeClass("hidden");
                $("#xml-load-error").text("Provided XML doesn't conform to required schema. Errors:\n" + result);
                return false;
            }
            return true;
        };
        FormManager.prototype.ValidateForm = function () {
            var _this = this;
            this.ClearFormErrors();
            var isValid = true;
            var formElements = $("#form");
            $("#form").find("label").each(function (_, elem) {
                if (elem.classList.contains("template") || elem.parentElement.classList.contains("template")) {
                    return;
                }
                var input = $(elem).children("textarea, input[name]")[0];
                if (!_this.IsEmptyInput(input) && input.dataset.pattern && input.value.match(input.dataset.pattern) === null) {
                    input.classList.add("invalid");
                    isValid = false;
                }
                if (elem.dataset.required === "true" && _this.IsEmptyInput(input)) {
                    input.classList.add("invalid");
                    isValid = false;
                }
            });
            return isValid;
        };
        FormManager.prototype.FillForm = function () {
            if (!this.xmlDocument) {
                $("#xml-load-error").removeClass("hidden");
                $("#xml-load-error").text("Provided file isn't a well formed xml.");
                return;
            }
            if (!this.ValidateXML()) {
                return;
            }
            this.GenerateForm();
            this.ImportChildNodes(this.xmlDocument.documentElement, $("#form")[0]);
        };
        FormManager.prototype.ClearFormErrors = function () {
            $("#form").find("textarea, input[name]").each(function (_, elem) {
                elem.classList.remove("invalid");
            });
        };
        FormManager.prototype.ImportChildNodes = function (xmlElement, formElement) {
            var xmlList = xmlElement.children;
            var formList = formElement.children;
            if (xmlList.length === 0 || xmlElement.children[0].nodeName === "text") {
                var input = $(formElement).children("textarea, input[name]")[0];
                input.value = xmlList.length === 0 ? xmlElement.textContent : xmlElement.children[0].textContent;
                // Fill attribute fields
                var nextAttr = $(input).next("label")[0];
                while (nextAttr !== undefined) {
                    var attr = $(nextAttr).children("textarea, input[name]")[0];
                    if (xmlElement.hasAttribute(attr.name)) {
                        attr.value = xmlElement.getAttribute(attr.name);
                    }
                    nextAttr = $(nextAttr).next("label")[0];
                }
                return;
            }
            // Skip form headers
            var offset = formList[0].nodeName === "H4" ? 1 : 0;
            for (var i = 0; i < xmlList.length; ++i) {
                var a = xmlList[i].outerHTML;
                var b = formList[i + offset].outerHTML;
                var formElem = formList[i + offset];
                // Skip form button elements
                // Skip unused optional elements
                while ((formElem.dataset.required === "false" && xmlList[i].nodeName !== this.GetFieldName(formElem)) || formElem.classList.contains("appendButton") || formElem.classList.contains("removeButton")) {
                    ++offset;
                    formElem = formList[i + offset];
                    b = formList[i + offset].outerHTML;
                }
                // Add repeating elements
                if (formElem.classList.contains("template")) {
                    this.AddElement(formElem);
                    // Move behind template after last element
                    if (i + 1 < xmlList.length && xmlList[i].nodeName !== xmlList[i + 1].nodeName) {
                        ++offset;
                    }
                    formElem = formList[i + offset];
                    b = formList[i + offset].outerHTML;
                }
                this.ImportChildNodes(xmlList[i], formElem);
            }
        };
        FormManager.prototype.SaveForm = function () {
            if (!this.ValidateForm()) {
                return;
            }
            // Create new XML document
            this.xmlDocument = new DOMParser().parseFromString("<portfolio></portfolio>", "text/xml");
            this.ExportChildNodes(this.xmlDocument.documentElement, $("#form")[0]);
            // Serialize to string
            var stringRepresentation = new XMLSerializer().serializeToString(this.xmlDocument);
            // Add missing XML declaration
            if (stringRepresentation.match("\<\?xml version") === null) {
                stringRepresentation = '<?xml version="1.0" encoding="UTF-8"?>\n' + stringRepresentation;
            }
            // Save
            var blob = new File([stringRepresentation], "portfolio.xml", { type: "text/xml" });
            saveAs(blob);
        };
        FormManager.prototype.ExportChildNodes = function (xmlElement, formElement) {
            var _this = this;
            $(formElement).children("div, label").each(function (_, element) {
                if (element.classList.contains("template")) {
                    return;
                }
                var nodeName;
                if (element.nodeName === "DIV") {
                    nodeName = $(element).children("h4")[0].textContent;
                }
                else {
                    nodeName = $(element).children("textarea, input[name]")[0].getAttribute("name");
                }
                var input = $(element).children("textarea, input[name]")[0];
                // Attribute
                if (element.parentElement.nodeName === "LABEL" && !_this.IsEmptyInput(input)) {
                    xmlElement.setAttribute(nodeName, input.value);
                    return;
                }
                var newNode = _this.xmlDocument.createElement(nodeName);
                newNode.textContent = input ? input.value : undefined;
                xmlElement.appendChild(newNode);
                _this.ExportChildNodes(newNode, element);
                if (newNode.children.length === 0 && newNode.attributes.length === 0 && newNode.textContent === "") {
                    newNode.remove();
                }
            });
        };
        FormManager.prototype.GetFieldName = function (formElement) {
            if (formElement.nodeName === "DIV") {
                return $(formElement).children("H4")[0].innerText;
            }
            else {
                return $(formElement).children("textarea, input[name]")[0].getAttribute("name");
            }
        };
        Object.defineProperty(FormManager.prototype, "HasLoadedXML", {
            get: function () {
                return this.xmlDocument &&
                    !(this.xmlDocument.firstChild &&
                        this.xmlDocument.firstChild.firstChild
                        && this.xmlDocument.firstChild.firstChild.firstChild &&
                        this.xmlDocument.firstChild.firstChild.firstChild.localName == "parsererror" ||
                        false);
            },
            enumerable: true,
            configurable: true
        });
        FormManager.prototype.GenerateForm = function () {
            var _this = this;
            var oldForm = $('#form')[0];
            if (oldForm !== undefined) {
                oldForm.remove();
            }
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(this.NodeFromString(formTransform));
            var resultDocument = xsltProcessor.transformToDocument(this.NodeFromString(schema));
            $("#form-position").html(resultDocument.documentElement.outerHTML);
            $('#form').submit(function (e) { return _this.DownloadXML(e); });
            $('#form input.appendButton').unbind().on('click', function (e) { return _this.AddElement(e.toElement.previousElementSibling); });
            $('#form input.removeButton').unbind().on('click', function (e) { return _this.RemoveElement(e); });
        };
        FormManager.prototype.AddElement = function (template) {
            var _this = this;
            var newNode = template.cloneNode(true);
            newNode.classList.remove("template");
            template.parentElement.insertBefore(newNode, template);
            $(newNode).children(".removeButton").first().unbind().on('click', function (e) { return _this.RemoveElement(e); });
        };
        FormManager.prototype.RemoveElement = function (event) {
            event.toElement.parentElement.remove();
        };
        FormManager.prototype.NodeFromString = function (xmlString) {
            var doc = new DOMParser().parseFromString(xmlString, "text/xml");
            return doc.documentElement;
        };
        FormManager.prototype.IsEmptyInput = function (element) {
            return element.value === null || element.value === "";
        };
        FormManager.prototype.DownloadXML = function (event) {
            event.preventDefault();
            this.SaveForm();
        };
        return FormManager;
    }());
    exports.FormManager = FormManager;
});
//# sourceMappingURL=formManager.js.map
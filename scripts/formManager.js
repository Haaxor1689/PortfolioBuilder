define(["require", "exports", "text!../portfolioSchema.xsd", "text!../transformations/formTransform.xsl", "text!../transformations/mdTransform.xsl", "text!../transformations/webTransform.xsl", "typings/he"], function (require, exports, schema, formTransform, mdTransform, webTransform, he) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormManager = /** @class */ (function () {
        function FormManager() {
            var _this = this;
            $("#file-input").unbind().on('change', function (e) { return _this.LoadXML(e); });
            $('#upload-xml').unbind().on("click", function () { return _this.FillForm(); });
            $('#download-xml').unbind().on("click", function () { return _this.DownloadXML(); });
            $('#export-html').unbind().on("click", function () { return _this.ExportHTML(webTransform, "portfolio.html"); });
            $('#export-md').unbind().on("click", function () { return _this.ExportText(mdTransform, "portfolio.md"); });
            this.GenerateForm();
            // Custom schema buttons
            $('#download-schema').unbind().on("click", function () {
                saveAs(new File([schema], "portfolioSchema.xsd", { type: "text/xml" }));
            });
            $("#schema-input").unbind().on('change', function (e) { return _this.LoadCustomSchema(e); });
            $('#upload-schema').unbind().on("click", function () { return _this.GenerateForm(); });
            // Custom transform buttons
            $('#download-transform').unbind().on("click", function () {
                saveAs(new File([webTransform], "portfolioTransform.xsl", { type: "text/xml" }));
            });
            $("#custom-transform-input").unbind().on('change', function (e) { return _this.LoadCustomTransform(e); });
            $('#export-custom-transform').unbind().on("click", function () {
                if (_this.customTransform === undefined || _this.customTransform === "") {
                    $("#custom-transform-upload-error").removeClass("hidden");
                    $("#custom-transform-upload-error").text("Please select a non empty file.");
                    return;
                }
                _this.ExportHTML(_this.customTransform, "customPortfolio.html");
            });
        }
        Object.defineProperty(FormManager.prototype, "currentSchema", {
            get: function () {
                return this.customSchema === undefined ? schema : this.customSchema;
            },
            enumerable: true,
            configurable: true
        });
        FormManager.prototype.LoadXML = function (event) {
            var _this = this;
            event.preventDefault();
            $("#upload-error").addClass("hidden");
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
        FormManager.prototype.LoadCustomSchema = function (event) {
            var _this = this;
            event.preventDefault();
            $("#schema-upload-error").addClass("hidden");
            var file = event.currentTarget.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function (event) { return _this.customSchema = event.target.result; };
            reader.readAsText(file);
        };
        FormManager.prototype.LoadCustomTransform = function (event) {
            var _this = this;
            event.preventDefault();
            $("#custom-transform-upload-error").addClass("hidden");
            var file = event.currentTarget.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function (event) { return _this.customTransform = event.target.result; };
            reader.readAsText(file);
        };
        FormManager.prototype.ValidateXML = function () {
            var encodedXML = he.encode(this.xmlDocument.documentElement.outerHTML, {
                allowUnsafeSymbols: true
            });
            var Module = {
                xml: encodedXML,
                schema: this.currentSchema,
                arguments: ["--noout", "--schema", 'portfolioSchema.xsd', this.xmlName]
            };
            var result = validateXML(Module);
            if (!result.match(this.xmlName + ' validates')) {
                $("#upload-error").removeClass("hidden");
                $("#upload-error").text("Provided XML doesn't conform to required schema. Errors:\n" + result);
                return false;
            }
            return true;
        };
        FormManager.prototype.ValidateForm = function () {
            var _this = this;
            this.ClearFormErrors();
            var invalid = [];
            var formElements = $("#form");
            $("#form").find("label").each(function (_, elem) {
                if (elem.classList.contains("template") || elem.parentElement.classList.contains("template")) {
                    return;
                }
                var input = $(elem).children("textarea, input[name]")[0];
                if (!_this.IsEmptyInput(input) && input.dataset.pattern && input.value.match(input.dataset.pattern) === null) {
                    input.classList.add("invalid");
                    invalid.push(input.name);
                }
                if (elem.dataset.required === "true" && _this.IsEmptyInput(input)) {
                    input.classList.add("invalid");
                    invalid.push(input.name);
                }
            });
            return invalid;
        };
        FormManager.prototype.FillForm = function () {
            if (!this.xmlDocument) {
                $("#upload-error").removeClass("hidden");
                $("#upload-error").text("Provided file isn't a well formed xml.");
                return;
            }
            if (!this.ValidateXML()) {
                return;
            }
            this.GenerateForm();
            this.ImportChildNodes(this.xmlDocument.documentElement, $("#form")[0]);
        };
        FormManager.prototype.ImportChildNodes = function (xmlElement, formElement) {
            var xmlList = xmlElement.children;
            var formList = formElement.children;
            // Assign value
            if (xmlList.length === 0 && !formElement.classList.contains("button")) {
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
            var offset = 0;
            for (var i = 0; i < xmlList.length; ++i) {
                var formElem = formList[i + offset];
                // Skip unused optional elements
                // Skip form button elements
                // Skip form headers
                while ((formElem.dataset.required === "false" && xmlList[i].nodeName !== this.GetFieldName(formElem)) || formElem.classList.contains("button") || formElem.nodeName == "SPAN") {
                    ++offset;
                    formElem = formList[i + offset];
                }
                // Add repeating elements
                if (formElem.classList.contains("template")) {
                    this.AddElement(formElem);
                    // Move behind template after last element
                    if (i + 1 < xmlList.length && xmlList[i].nodeName !== xmlList[i + 1].nodeName) {
                        ++offset;
                    }
                    formElem = formList[i + offset];
                }
                this.ImportChildNodes(xmlList[i], formElem);
            }
        };
        FormManager.prototype.SaveForm = function () {
            var invalid = this.ValidateForm();
            if (invalid.length !== 0) {
                $("#export-error").removeClass("hidden");
                var errorMessage = "Fill out all required fields before exporting. Invalid fields:";
                for (var i = 0; i < invalid.length; ++i) {
                    errorMessage += "\n   - " + invalid[i];
                }
                $("#export-error").text(errorMessage);
                return false;
            }
            $("#export-error").addClass("hidden");
            // Create new XML document
            this.xmlDocument = new DOMParser().parseFromString("<portfolio></portfolio>", "text/xml");
            this.ExportChildNodes(this.xmlDocument.documentElement, $("#form")[0]);
            return true;
        };
        FormManager.prototype.ExportChildNodes = function (xmlElement, formElement) {
            var _this = this;
            $(formElement).children("div, label").each(function (_, element) {
                if (element.classList.contains("template")) {
                    return;
                }
                var nodeName;
                if (element.nodeName === "DIV") {
                    nodeName = $(element).children("span")[0].textContent;
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
        FormManager.prototype.GenerateForm = function () {
            var _this = this;
            var oldForm = $('#form')[0];
            if (oldForm !== undefined) {
                oldForm.remove();
            }
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(this.NodeFromString(formTransform));
            var resultDocument = xsltProcessor.transformToDocument(this.NodeFromString(this.currentSchema));
            $("#form-position").html(resultDocument.documentElement.outerHTML);
            $('#form input.appendButton').unbind().on('click', function (e) { return _this.AddElement(e.toElement.previousElementSibling); });
            $('#form input.removeButton').unbind().on('click', function (e) { return _this.RemoveElement(e.toElement); });
            $('#form input.collapseButton').unbind().on('click', function (e) { return _this.CollapseElement(e.toElement); });
        };
        FormManager.prototype.DownloadXML = function () {
            if (!this.SaveForm()) {
                return;
            }
            // Serialize to string
            var stringRepresentation = new XMLSerializer().serializeToString(this.xmlDocument);
            // Add missing XML declaration
            if (stringRepresentation.match("\<\?xml version") === null) {
                stringRepresentation = '<?xml version="1.0" encoding="UTF-8"?>\n' + stringRepresentation;
            }
            // Save
            saveAs(new File([stringRepresentation], "portfolio.xml", { type: "text/xml" }));
        };
        FormManager.prototype.ExportHTML = function (transform, filename) {
            if (!this.SaveForm()) {
                return;
            }
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(this.NodeFromString(transform));
            var resultDocument = xsltProcessor.transformToDocument(this.xmlDocument);
            // Serialize to string
            var stringRepresentation = new XMLSerializer().serializeToString(resultDocument);
            // Save
            saveAs(new File([stringRepresentation], filename, { type: "text/html" }));
        };
        FormManager.prototype.ExportText = function (transform, filename) {
            if (!this.SaveForm()) {
                return;
            }
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(this.NodeFromString(transform));
            var resultDocument = xsltProcessor.transformToDocument(this.xmlDocument);
            // Serialize to string
            var stringRepresentation = resultDocument.documentElement.innerText.trim();
            // Save
            saveAs(new File([stringRepresentation], filename, { type: "text" }));
        };
        // Form button actions
        FormManager.prototype.AddElement = function (template) {
            var _this = this;
            var newNode = template.cloneNode(true);
            newNode.classList.remove("template");
            template.parentElement.insertBefore(newNode, template);
            $(newNode).find(".appendButton").unbind().on('click', function (e) { return _this.AddElement(e.toElement.previousElementSibling); });
            $(newNode).find(".removeButton").unbind().on('click', function (e) { return _this.RemoveElement(e.toElement); });
            $(newNode).find(".collapseButton").unbind().on('click', function (e) { return _this.CollapseElement(e.toElement); });
        };
        FormManager.prototype.RemoveElement = function (element) {
            element.parentElement.remove();
        };
        FormManager.prototype.CollapseElement = function (element) {
            if (element.value === "Collapse") {
                $(element).siblings().not("span").each(function (_, element) {
                    element.classList.add("hidden");
                });
                element.value = "Expand";
            }
            else {
                $(element).siblings().not("span").each(function (_, element) {
                    element.classList.remove("hidden");
                });
                element.value = "Collapse";
            }
        };
        // Helper functions
        FormManager.prototype.NodeFromString = function (xmlString) {
            var doc = new DOMParser().parseFromString(xmlString, "text/xml");
            return doc.documentElement;
        };
        FormManager.prototype.IsEmptyInput = function (element) {
            return element.value === null || element.value === "";
        };
        FormManager.prototype.GetFieldName = function (formElement) {
            if (formElement.nodeName === "DIV") {
                return $(formElement).children("span")[0].innerText;
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
        FormManager.prototype.ClearFormErrors = function () {
            $("#form").find("textarea, input[name]").each(function (_, elem) {
                elem.classList.remove("invalid");
            });
        };
        return FormManager;
    }());
    exports.FormManager = FormManager;
});
//# sourceMappingURL=formManager.js.map
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
        FormManager.prototype.FillForm = function () {
            if (!this.xmlDocument) {
                $("#xml-load-error").removeClass("hidden");
                $("#xml-load-error").text("Provided file isn't a well formed xml.");
                return;
            }
            if (!this.ValidateXML()) {
                return;
            }
            var nodes = this.xmlDocument.children;
            for (var i = 0; i < nodes.length; ++i) {
                console.log(nodes[i]);
            }
            // getElement(xmlDoc, 'name', false);
            // getElement(xmlDoc, 'email', false);
            // getLocalizedElement(xmlDoc, 'headline', true);
            // getLocalizedElement(xmlDoc, 'summary', false);
            // socialNames.forEach(function (item) {
            //     if (!getElement(xmlDoc, item, true)) return;
            // })
            // var otherSocial = getElementsByXpath(xmlDoc, '//social/link');
            // var iter = otherSocial.iterateNext();
            // while (iter) {
            //     addSocialOther();
            //     $('[name=link' + socialOtherCount + ']').val(iter.getAttribute('url'));
            //     iter = otherSocial.iterateNext();
            // }
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
                $("#xml-load-error").text("Provided XML doesn't conform to equired schema. Errors:" + result);
                return false;
            }
            return true;
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
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(this.NodeFromString(formTransform));
            var resultDocument = xsltProcessor.transformToDocument(this.NodeFromString(schema));
            $("#form-position").html(resultDocument.documentElement.outerHTML);
            $('#form').submit(function (e) { return _this.DownloadXML(e); });
            $('#form input.appendButton').on('click', function (e) { return _this.AddElement(e); });
            $('#form input.removeButton').on('click', function (e) { return _this.RemoveElement(e); });
        };
        FormManager.prototype.AddElement = function (event) {
            var _this = this;
            var template = event.toElement.previousElementSibling;
            var newNode = template.cloneNode(true);
            newNode.classList.remove("template");
            template.parentElement.insertBefore(newNode, template);
            $('#form input.removeButton').on('click', function (e) { return _this.RemoveElement(e); });
        };
        FormManager.prototype.RemoveElement = function (event) {
            event.toElement.parentElement.remove();
        };
        FormManager.prototype.NodeFromString = function (xmlString) {
            var doc = new DOMParser().parseFromString(xmlString, "text/xml");
            return doc.documentElement;
        };
        FormManager.prototype.DownloadXML = function (event) {
            event.preventDefault();
        };
        return FormManager;
    }());
    exports.FormManager = FormManager;
});
//# sourceMappingURL=formManager.js.map
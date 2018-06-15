define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormManager = /** @class */ (function () {
        function FormManager() {
            var _this = this;
            $("#file-input").on('change', function (e) { return _this.LoadXML(e); });
            $('#load-xml').click(function () { return _this.FillForm(); });
        }
        FormManager.prototype.HasLoadedXML = function () {
            return this.xmlDocument &&
                !(this.xmlDocument.firstChild &&
                    this.xmlDocument.firstChild.firstChild
                    && this.xmlDocument.firstChild.firstChild.firstChild &&
                    this.xmlDocument.firstChild.firstChild.firstChild.localName == "parsererror" ||
                    false);
        };
        FormManager.prototype.LoadXML = function (event) {
            var _this = this;
            event.preventDefault();
            var file = event.currentTarget.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.xmlDocument = new DOMParser().parseFromString(event.target.result, "text/xml");
                if (!_this.HasLoadedXML()) {
                    _this.xmlDocument = null;
                }
            };
            reader.readAsText(file);
        };
        FormManager.prototype.FillForm = function () {
            if (!this.xmlDocument) {
                return;
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
        return FormManager;
    }());
    exports.FormManager = FormManager;
});
//# sourceMappingURL=formManager.js.map
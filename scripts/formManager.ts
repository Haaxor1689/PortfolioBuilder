export class FormManager {
    private xmlDocument: XMLDocument;

    constructor() {
        $("#file-input").on('change', (e) => this.LoadXML(e));
        $('#load-xml').click(() => this.FillForm());
    }

    public HasLoadedXML() : Boolean {
        return this.xmlDocument &&
            !(this.xmlDocument.firstChild &&
                this.xmlDocument.firstChild.firstChild
                && this.xmlDocument.firstChild.firstChild.firstChild &&
                this.xmlDocument.firstChild.firstChild.firstChild.localName == "parsererror" ||
                false);
    }

    private LoadXML(event: JQuery.Event) {
        event.preventDefault();
        var file = (<HTMLInputElement>event.currentTarget).files[0];
        if (!file) {
            return;
        }

        var reader = new FileReader();
        reader.onload = (event) => {
            this.xmlDocument = new DOMParser().parseFromString(event.target.result, "text/xml");
            if (!this.HasLoadedXML()) {
                this.xmlDocument = null;
            }
        };
        reader.readAsText(file);
    }

    private FillForm() {
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
    }
}
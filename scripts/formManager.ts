import * as schema from "text!../portfolioSchema.xsd";
import * as formTransform from "text!../transformations/formTransform.xsl";
declare let validateXML: any;
import he = require('typings/he');

export class FormManager {
    private xmlDocument: XMLDocument;
    private xmlName: string;

    constructor() {
        $("#file-input").on('change', (e) => this.LoadXML(e));
        $('#load-xml').click(() => this.FillForm());
        this.GenerateForm();
    }

    private LoadXML(event: JQuery.Event) {
        event.preventDefault();
        $("#xml-load-error").addClass("hidden");
        var file = (<HTMLInputElement>event.currentTarget).files[0];
        if (!file) {
            return;
        }

        var reader = new FileReader();
        reader.onload = (event) => {
            this.xmlDocument = new DOMParser().parseFromString(event.target.result, "text/xml");
            this.xmlName = file.name;
            if (!this.HasLoadedXML) {
                this.xmlDocument = null;
                this.xmlName = null;
            }
        };
        reader.readAsText(file);
    }

    private FillForm() {
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
    }

    private ValidateXML(): boolean {
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
        var result: string = validateXML(Module);
        console.log(result);
        if (!result.match(this.xmlName + ' validates')) {
            $("#xml-load-error").removeClass("hidden");
            $("#xml-load-error").text("Provided XML doesn't conform to equired schema. Errors:" + result);
            return false;
        }
        return true;
    }

    private get HasLoadedXML(): Boolean {
        return this.xmlDocument &&
            !(this.xmlDocument.firstChild &&
                this.xmlDocument.firstChild.firstChild
                && this.xmlDocument.firstChild.firstChild.firstChild &&
                this.xmlDocument.firstChild.firstChild.firstChild.localName == "parsererror" ||
                false);
    }

    private GenerateForm() {
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(this.NodeFromString(formTransform));
        var resultDocument = xsltProcessor.transformToDocument(this.NodeFromString(schema));
        $("#form-position").html(resultDocument.documentElement.outerHTML);
        $('#form').submit((e) => this.DownloadXML(e));
        $('#form input.appendButton').on('click', (e) => this.AddElement(e));
        $('#form input.removeButton').on('click', (e) => this.RemoveElement(e));
    }

    private AddElement(event: JQuery.Event) {
        var template = event.toElement.previousElementSibling;
        var newNode = template.cloneNode(true);
        (<HTMLElement>newNode).classList.remove("template");
        template.parentElement.insertBefore(newNode, template);
        $('#form input.removeButton').on('click', (e) => this.RemoveElement(e));
    }

    private RemoveElement(event: JQuery.Event) {
        event.toElement.parentElement.remove();
    }

    private NodeFromString(xmlString: string): Node {
        var doc = new DOMParser().parseFromString(xmlString, "text/xml");
        return doc.documentElement;
    }

    private DownloadXML(event: JQuery.Event) {
        event.preventDefault();
    }
}
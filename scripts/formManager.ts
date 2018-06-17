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

        this.IterateChildNodes(this.xmlDocument.documentElement, <HTMLElement>$("#form")[0]);
    }

    private IterateChildNodes(xmlElement: Element, formElement: HTMLElement) {
        var xmlList = xmlElement.children;
        var formList = formElement.children;

        if (xmlList.length === 0) {
            var input = <HTMLInputElement>$(formElement).children("textarea, input[name]")[0];
            input.value = xmlElement.textContent;
            return;
        } else if (xmlElement.children[0].nodeName === "text") {
            var input = <HTMLInputElement>$(formElement).children("textarea, input")[0];
            input.value = xmlElement.children[0].textContent;
            return;
        }

        // Skip form headers
        var offset = formList[0].nodeName === "H4" ? 1 : 0;

        for (var i = 0; i < xmlList.length; ++i) {
            var a = xmlList[i].outerHTML;
            var b = formList[i + offset].outerHTML;
            var formElem = <HTMLElement>formList[i + offset];
            // Skip form button elements
            // Skip unused optional elements
            while ((formElem.dataset.required === "false" && xmlList[i].nodeName !== this.GetFieldName(formElem)) || formElem.classList.contains("appendButton") || formElem.classList.contains("removeButton")) {
                ++offset;
                formElem = <HTMLElement>formList[i + offset];
                b = formList[i + offset].outerHTML;
            }

            // Add repeating elements
            if (formElem.classList.contains("template")) {
                this.AddElement(formElem);
                // Move behind template after last element
                if (i + 1 < xmlList.length && xmlList[i].nodeName !== xmlList[i + 1].nodeName) {
                    ++offset;
                }
                formElem = <HTMLElement>formList[i + offset];
                b = formList[i + offset].outerHTML;
            }

            this.IterateChildNodes(xmlList[i], formElem);
        }
    }

    private GetFieldName(formElement: HTMLElement): string {
        if (formElement.nodeName === "DIV") {
            return $(formElement).children("H4")[0].innerText;
        } else {
            return formElement.innerText;
        }
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
        $('#form input.appendButton').on('click', (e) => this.AddElement(e.toElement.previousElementSibling));
        $('#form input.removeButton').on('click', (e) => this.RemoveElement(e));
    }

    private AddElement(template: Element) {
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
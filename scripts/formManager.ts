import * as schema from "text!../portfolioSchema.xsd";
import * as formTransform from "text!../transformations/formTransform.xsl";
import * as webTransform from "text!../transformations/webTransform.xsl";

// xmllint
declare let validateXML: any;

// html entity encode
import he = require('typings/he');

export class FormManager {
    private xmlDocument: XMLDocument;
    private xmlName: string;

    constructor() {
        $("#file-input").unbind().on('change', (e) => this.LoadXML(e));
        $('#upload-xml').unbind().on("click",() => this.FillForm());
        $('#download-xml').unbind().on("click", () => this.DownloadXML());
        $('#export-html').unbind().on("click", () => this.ExportHTML());
        this.GenerateForm();
    }

    private LoadXML(event: JQuery.Event): void {
        event.preventDefault();
        $("#upload-error").addClass("hidden");
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

    private ValidateXML(): boolean {
        var encodedXML = he.encode(this.xmlDocument.documentElement.outerHTML, {
            allowUnsafeSymbols: true
        });

        var Module = {
            xml: encodedXML,
            schema: schema,
            arguments: ["--noout", "--schema", 'portfolioSchema.xsd', this.xmlName]
        };

        var result: string = validateXML(Module);
        if (!result.match(this.xmlName + ' validates')) {
            $("#upload-error").removeClass("hidden");
            $("#upload-error").text("Provided XML doesn't conform to required schema. Errors:\n" + result);
            return false;
        }
        return true;
    }

    private ValidateForm(): boolean {
        this.ClearFormErrors();

        var isValid = true;
        var formElements = $("#form");
        $("#form").find("label").each((_, elem: HTMLElement) => {
            if (elem.classList.contains("template") || elem.parentElement.classList.contains("template")) {
                return;
            }

            var input = <HTMLInputElement>$(elem).children("textarea, input[name]")[0];
            if (!this.IsEmptyInput(input) && input.dataset.pattern && input.value.match(input.dataset.pattern) === null) {
                input.classList.add("invalid");
                isValid = false;
            }
            if (elem.dataset.required === "true" && this.IsEmptyInput(input)) {
                input.classList.add("invalid");
                isValid = false;
            }
        });
        return isValid;
    }

    private FillForm(): void {
        if (!this.xmlDocument) {
            $("#upload-error").removeClass("hidden");
            $("#upload-error").text("Provided file isn't a well formed xml.");
            return;
        }

        if (!this.ValidateXML()) {
            return;
        }

        this.GenerateForm();
        this.ImportChildNodes(this.xmlDocument.documentElement, <HTMLElement>$("#form")[0]);
    }

    private ImportChildNodes(xmlElement: Element, formElement: HTMLElement): void {
        var xmlList = xmlElement.children;
        var formList = formElement.children;

        if (xmlList.length === 0 || xmlElement.children[0].nodeName === "text") {
            var input = <HTMLInputElement>$(formElement).children("textarea, input[name]")[0];
            input.value = xmlList.length === 0 ? xmlElement.textContent : xmlElement.children[0].textContent;
            // Fill attribute fields
            var nextAttr = <HTMLInputElement>$(input).next("label")[0];
            while (nextAttr !== undefined) {
                var attr = <HTMLInputElement>$(nextAttr).children("textarea, input[name]")[0];
                if (xmlElement.hasAttribute(attr.name)) {
                    attr.value = xmlElement.getAttribute(attr.name);
                }
                nextAttr = <HTMLInputElement>$(nextAttr).next("label")[0];
            }
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

            this.ImportChildNodes(xmlList[i], formElem);
        }
    }

    private SaveForm(): boolean {
        if (!this.ValidateForm()) {
            $("#export-error").removeClass("hidden");
            $("#export-error").text("Fill out all required fields before exporting.");
            return false;
        }
        $("#export-error").addClass("hidden");

        // Create new XML document
        this.xmlDocument = new DOMParser().parseFromString("<portfolio></portfolio>", "text/xml");
        this.ExportChildNodes(this.xmlDocument.documentElement, <HTMLElement>$("#form")[0]);
        return true;
    }

    private ExportChildNodes(xmlElement: Element, formElement: HTMLElement): void {
        $(formElement).children("div, label").each((_, element: HTMLElement) => {
            if (element.classList.contains("template")) {
                return;
            }

            var nodeName: string;
            if (element.nodeName === "DIV") {
                nodeName = $(element).children("h4")[0].textContent;
            } else {
                nodeName = $(element).children("textarea, input[name]")[0].getAttribute("name");
            }

            var input = <HTMLInputElement>$(element).children("textarea, input[name]")[0];

            // Attribute
            if (element.parentElement.nodeName === "LABEL" && !this.IsEmptyInput(input)) {
                xmlElement.setAttribute(nodeName, input.value);
                return;
            }

            var newNode = this.xmlDocument.createElement(nodeName);

            newNode.textContent = input ? input.value : undefined;
            xmlElement.appendChild(newNode);
            this.ExportChildNodes(newNode, element);
            if (newNode.children.length === 0 && newNode.attributes.length === 0 && newNode.textContent === "") {
                newNode.remove();
            }
        })
    }

    private GenerateForm(): void {
        var oldForm = $('#form')[0];
        if (oldForm !== undefined) {
            oldForm.remove();
        }

        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(this.NodeFromString(formTransform));
        var resultDocument = xsltProcessor.transformToDocument(this.NodeFromString(schema));
        $("#form-position").html(resultDocument.documentElement.outerHTML);
        $('#form input.appendButton').unbind().on('click', (e) => this.AddElement(e.toElement.previousElementSibling));
        $('#form input.removeButton').unbind().on('click', (e) => this.RemoveElement(e));
    }

    private DownloadXML(): void {
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
        var blob = new File([stringRepresentation], "portfolio.xml", {type: "text/xml"});
        saveAs(blob);
    }

    private ExportHTML(): void {
        if (!this.SaveForm()) {
            return;
        }
        
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(this.NodeFromString(webTransform));
        var resultDocument = xsltProcessor.transformToDocument(this.xmlDocument);

        // Serialize to string
        var stringRepresentation = new XMLSerializer().serializeToString(resultDocument);
        // Save
        var blob = new File([stringRepresentation], "portfolio.html", {type: "text/html"});
        saveAs(blob);
    }

    // Add/remove button actions
    private AddElement(template: Element): void {
        var newNode = template.cloneNode(true);
        (<HTMLElement>newNode).classList.remove("template");
        template.parentElement.insertBefore(newNode, template);
        $(newNode).children(".removeButton").first().unbind().on('click', (e) => this.RemoveElement(e));
        
    }

    private RemoveElement(event: JQuery.Event): void {
        event.toElement.parentElement.remove();
    }

    // Helper functions
    private NodeFromString(xmlString: string): Node {
        var doc = new DOMParser().parseFromString(xmlString, "text/xml");
        return doc.documentElement;
    }

    private IsEmptyInput(element: HTMLInputElement): boolean {
        return element.value === null || element.value === "";
    }

    private GetFieldName(formElement: HTMLElement): string {
        if (formElement.nodeName === "DIV") {
            return $(formElement).children("H4")[0].innerText;
        } else {
            return $(formElement).children("textarea, input[name]")[0].getAttribute("name");
        }
    }

    private get HasLoadedXML(): Boolean {
        return this.xmlDocument &&
            !(this.xmlDocument.firstChild &&
                this.xmlDocument.firstChild.firstChild
                && this.xmlDocument.firstChild.firstChild.firstChild &&
                this.xmlDocument.firstChild.firstChild.firstChild.localName == "parsererror" ||
                false);
    }
    
    private ClearFormErrors() {
        $("#form").find("textarea, input[name]").each((_, elem: HTMLElement) => {
            elem.classList.remove("invalid");
        });
    }
}
<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:functx="http://www.functx.com" exclude-result-prefixes="xs functx">
    <xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="yes" />

    <!-- Root node -->
    <xsl:template match="/xs:schema">
        <form id="form">
            <xsl:apply-templates select="xs:element[@name='portfolio']/xs:complexType/xs:sequence/*" />
            <input type="submit" value="Download XML" class="submitButton" />
        </form>
    </xsl:template>

    <xsl:template match="xs:element[@ref]">
        <xsl:choose>
            <xsl:when test="@maxOccurs">
                <div class="template" data-required="{not(@minOccurs) or @minOccurs!=0}">
                    <xsl:call-template name="ref-body" />
                </div>
                <input type="button" class="appendButton" value="Add {@ref}"/>
            </xsl:when>
            <xsl:otherwise>
                <div data-required="{not(@minOccurs) or @minOccurs!=0}">
                    <xsl:call-template name="ref-body" />
                </div>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="ref-body">
        <h4>
            <xsl:value-of select="@ref" />
        </h4>
        <xsl:choose>
            <xsl:when test="@maxOccurs">
                <input type="button" class="removeButton" value="Remove {@ref}"/>
            </xsl:when>
        </xsl:choose>
        <xsl:apply-templates select="/xs:schema/*[@name=current()/@ref]" />
    </xsl:template>
    
    <xsl:template match="xs:element[@name and not(@type)]">
        <xsl:apply-templates select="xs:complexType/xs:sequence/*" />
    </xsl:template>

    <xsl:template match="xs:element[@name and @type]">
        <xsl:choose>
            <xsl:when test="@maxOccurs">
                <label class="template" data-required="{not(@minOccurs) or @minOccurs!=0}">
                    <xsl:call-template name="element-body" />
                </label>
                <input type="button" class="appendButton" value="Add {@name}"/>
            </xsl:when>
            <xsl:otherwise>
                <label data-required="{not(@minOccurs) or @minOccurs!=0}">
                    <xsl:call-template name="element-body" />
                </label>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="element-body">
        <xsl:value-of select="@name" />
        <xsl:choose>
            <xsl:when test="not(@minOccurs=0)">
                <span>*</span>
            </xsl:when>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="@maxOccurs">
                <input type="button" class="removeButton" value="Remove {@name}"/>
            </xsl:when>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="@type='email-address-type'">
                <input type="email" name="{@name}"/>
            </xsl:when>
            <xsl:when test="@type='xs:gYear'"><input type="text" name="{@name}" data-pattern="^\d{{4}}$" placeholder="yyyy" />
            </xsl:when>
            <xsl:when test="@type='xs:gYearMonth'">
                <input type="text" name="{@name}" data-pattern="^\d{{4}}-\d{{2}}$" placeholder="yyyy-dd"/>
            </xsl:when>
            <xsl:when test="@type='xs:string' or @type='localized-string-type'">
                <textarea name="{@name}" rows="3"/>
            </xsl:when>
            <xsl:otherwise>
                <input type="text" name="{@name}" />
            </xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates select="/xs:schema/xs:complexType[@name=current()/@type]//xs:attribute" />
    </xsl:template>

    <xsl:template match="//xs:attribute">
        <label data-required="{@use='required'}">
            <xsl:value-of select="@name" />
            <xsl:choose>
                <xsl:when test="@use='required'">
                    <span>*</span>
                </xsl:when>
            </xsl:choose>
            <input type="text" name="{@name}" />
        </label>
    </xsl:template>

</xsl:transform>
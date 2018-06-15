<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-public="-//W3C//DTD HTML 4.01//EN" doctype-system="http://www.w3.org/TR/html4/strict.dtd"/>
    <!-- Root node -->
    <xsl:template match="/xs:schema">
        <xsl:apply-templates select="xs:element[@name='portfolio']"/>
    </xsl:template>

    <xsl:template match="/xs:schema/xs:element[@name='portfolio']">
        <form id="form">
            <xsl:apply-templates select="xs:complexType/xs:sequence/*" />
            <input type="submit" value="Download XML" />
        </form>
    </xsl:template>

    <xsl:template match="xs:group[@ref]">
        <h3>
            <xsl:value-of select="@ref"/>
        </h3>
        <xsl:apply-templates select="/xs:schema/xs:group[@name=current()/@ref]" />
    </xsl:template>

    <xsl:template match="xs:group[@name]">
        <xsl:apply-templates select="xs:sequence/*" />
    </xsl:template>

    <xsl:template match="xs:element[@ref]">
        <h3>
            <xsl:value-of select="@ref"/>
        </h3>
        <xsl:apply-templates select="/xs:schema/xs:element[@name=current()/@ref]" />
    </xsl:template>

    <xsl:template match="xs:element[@name and @type]">
        <xsl:choose>
            <xsl:when test="/xs:schema/xs:complexType[@name=current()/@type]">
                <xsl:apply-templates select="/xs:schema/xs:complexType[@name=current()/@type]" />
            </xsl:when>
        </xsl:choose>

        <label>
            <xsl:value-of select="@name" />
            <xsl:choose>
                <xsl:when test="not(@minOccurs=0)">
                    <span>(required)</span>
                </xsl:when>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="@type='email-address-type'">
                    <input type="email" name="{@name}" required="{not(@minOccurs) or @minOccurs!=0}" />
                </xsl:when>
                <xsl:when test="@type='link-type'">
                    <xsl:text>(link)</xsl:text>
                    <input type="text" name="{@name}" required="{not(@minOccurs) or @minOccurs!=0}" />
                </xsl:when>
                <xsl:when test="@type='localized-string-type'">
                    <xsl:text>(loc)</xsl:text>
                    <input type="text" name="{@name}" required="{not(@minOccurs) or @minOccurs!=0}" />
                </xsl:when>
                <xsl:when test="@type='localized-with-url-type'">
                    <xsl:text>(loc|link)</xsl:text>
                    <input type="text" name="{@name}" required="{not(@minOccurs) or @minOccurs!=0}" />
                </xsl:when>
                <xsl:when test="@type='company-type'">
                    <xsl:text>(company)</xsl:text>
                    <input type="text" name="{@name}" required="{not(@minOccurs) or @minOccurs!=0}" />
                </xsl:when>
                <xsl:otherwise>
                    <input type="text" name="{@name}" required="{not(@minOccurs) or @minOccurs!=0}" />
                </xsl:otherwise>
            </xsl:choose>
        </label>
    </xsl:template>

</xsl:transform>
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

    <xsl:template match="xs:group[@ref] | xs:element[@ref]">
        <div>
            <h4>
                <xsl:value-of select="@ref" />
            </h4>
             <xsl:apply-templates select="/xs:schema/*[@name=current()/@ref]" /> 
        </div>
    </xsl:template>

    <xsl:template match="xs:group[@name]">
        <xsl:apply-templates select="xs:sequence/*" />
    </xsl:template>
    
    <xsl:template match="xs:element[@name and not(@type)]">
        <xsl:apply-templates select="xs:complexType/xs:sequence/*" />
    </xsl:template>

    <xsl:template match="xs:element[@name and @type]">
        <label>
            <xsl:value-of select="@name" />
            <xsl:choose>
                <xsl:when test="not(@minOccurs=0)">
                    <span>(required)</span>
                </xsl:when>
            </xsl:choose>
            <xsl:choose>
                <xsl:when test="@type='email-address-type'">
                    <xsl:choose>
                        <xsl:when test="not(@minOccurs) or @minOccurs!=0">
                            <input type="email" name="{@name}" required="true"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <input type="email" name="{@name}" />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:when>
                <xsl:when test="@type='xs:gYear'">
                    <xsl:choose>
                        <xsl:when test="not(@minOccurs) or @minOccurs!=0">
                            <input type="text" name="{@name}" required="true" pattern="\d{4}" placeholder="yyyy" />
                        </xsl:when>
                        <xsl:otherwise>
                            <input type="text" name="{@name}" pattern="\d{4}" placeholder="yyyy" />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:when>
                <xsl:when test="@type='xs:gYearMonth'">
                    <xsl:choose>
                        <xsl:when test="not(@minOccurs) or @minOccurs!=0">
                            <input type="text" name="{@name}" required="true" pattern="\d{4}-\d{2}" placeholder="yyyy-dd"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <input type="text" name="{@name}" pattern="\d{4}-\d{2}" placeholder="yyyy-dd"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:choose>
                        <xsl:when test="not(@minOccurs) or @minOccurs!=0">
                            <input type="text" name="{@name}" required="true" />
                        </xsl:when>
                        <xsl:otherwise>
                            <input type="text" name="{@name}" />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:apply-templates select="/xs:schema/xs:complexType[@name=current()/@type]//xs:attribute" />
        </label>
        <xsl:apply-templates select="xs:complexType/xs:attribute" />
    </xsl:template>

    <xsl:template match="//xs:attribute">
        <input type="text" name="{@name}" required="{@use='required'}" placeholder="@{@name}"/>
    </xsl:template>

</xsl:transform>
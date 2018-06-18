<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">
    <xsl:output method="text"/>
    <xsl:template match="/portfolio">
        <!-- Title -->
        <xsl:text># Portfolio&#xa;&#xa;</xsl:text>
        <xsl:text>## </xsl:text>
        <xsl:value-of select="GeneralInfo/Name"/>
        <xsl:text>&#xa;&#xa;*</xsl:text>
        <xsl:apply-templates select="GeneralInfo/Headline"/>
        <xsl:text>*&#xa;&#xa;</xsl:text>
        <!-- About Section -->
        <xsl:text>## Summary</xsl:text>
        <xsl:text>&#xa;&#xa;</xsl:text>
        <xsl:apply-templates select="GeneralInfo/Summary"/>
        <xsl:text>&#xa;&#xa;</xsl:text>
        <!-- Sections -->
        <xsl:for-each select="./*[name(.)!='GeneralInfo' and name(.)!='Social']">
            <xsl:text>## </xsl:text>
            <xsl:value-of select="name(.)"/>
            <xsl:text>&#xa;&#xa;</xsl:text>
            <xsl:apply-templates select="*"/>
        </xsl:for-each>
    </xsl:template>
    <!-- Experience -->
    <xsl:template match="Position">
        <xsl:text>### </xsl:text>
        <xsl:apply-templates select="Title"/>
        <xsl:if test="not(End)">
            <xsl:text> *(current)*</xsl:text>
        </xsl:if>
        <xsl:text>&#xa;&#xa;</xsl:text>
        <xsl:text>**</xsl:text>
        <xsl:apply-templates select="Company"/>
        <xsl:text>**&#xa;&#xa;</xsl:text>
        <xsl:value-of select="Start"/>
        <xsl:text> - </xsl:text>
        <xsl:choose>
            <xsl:when test="End">
                <xsl:value-of select="End"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>Present</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>, in </xsl:text>
        <xsl:apply-templates select="Location"/>
        <xsl:text>&#xa;&#xa;</xsl:text>
        <xsl:text>- </xsl:text>
        <xsl:apply-templates select="Description"/>
        <xsl:text>&#xa;&#xa;</xsl:text>
    </xsl:template>
    <!-- Education -->
    <xsl:template match="Study">
        <xsl:text>### </xsl:text>
        <xsl:if test="Degree">
            <xsl:text>*</xsl:text>
            <xsl:value-of select="Degree"/>
            <xsl:text>*&#160;</xsl:text>
        </xsl:if>
        <xsl:apply-templates select="Field"/>
        <xsl:if test="not(End)">
            <xsl:text> *(current)*</xsl:text>
        </xsl:if>
        <xsl:text>&#xa;&#xa;**</xsl:text>
        <xsl:apply-templates select="School"/>
        <xsl:text>**&#xa;&#xa;</xsl:text>
        <xsl:value-of select="Start"/>
        <xsl:text> - </xsl:text>
        <xsl:choose>
            <xsl:when test="End">
                <xsl:value-of select="End"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>Present</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>&#xa;&#xa;</xsl:text>
    </xsl:template>
    <!-- Skills -->
    <xsl:template match="Skill">
        <xsl:text>### </xsl:text>
        <xsl:apply-templates select="Field"/>
        <xsl:text>&#xa;&#xa;- </xsl:text>
        <xsl:apply-templates select="Description"/>
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>
    <!-- Projects -->
    <xsl:template match="Project">
        <xsl:text>### </xsl:text>
        <xsl:apply-templates select="Name"/>
        <xsl:if test="Type">
            <xsl:text> *(</xsl:text>
            <xsl:value-of select="Type"/>
            <xsl:text>)*</xsl:text>
        </xsl:if>
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>&#xa;</xsl:text>
        <xsl:value-of select="Start"/>
        <xsl:text> - </xsl:text>
        <xsl:choose>
            <xsl:when test="End">
                <xsl:value-of select="End"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>Present</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>&#xa;&#xa;</xsl:text>
        <xsl:text>**Role**: </xsl:text>
        <xsl:apply-templates select="Role"/>
        <xsl:text>&#xa;&#xa;</xsl:text>
        <xsl:value-of select="Description"/>
        <xsl:text>&#xa;</xsl:text>
        <xsl:choose>
            <xsl:when test="Link">
                <xsl:text>&#xa;**Additional links:**&#xa;&#xa;</xsl:text>
                <xsl:for-each select="Link">
                    <xsl:text>- </xsl:text>
                    <xsl:apply-templates select="." />
                    <xsl:text>&#xa;</xsl:text>
                </xsl:for-each>
            </xsl:when>
        </xsl:choose>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>
    <!-- Link -->
    <xsl:template match="*[@Url]">
        <xsl:text>[</xsl:text>
        <xsl:value-of select="."/>
        <xsl:text>](</xsl:text>
        <xsl:value-of select="@Url"/>
        <xsl:text>)</xsl:text>
    </xsl:template>
  
</xsl:stylesheet>
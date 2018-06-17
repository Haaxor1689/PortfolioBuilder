<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-public="-//W3C//DTD HTML 4.01//EN" doctype-system="http://www.w3.org/TR/html4/strict.dtd"/>
    <!-- Root node -->
    <xsl:template match="/portfolio">
        <html>
            <title>
                <xsl:value-of select="GeneralInfo/Name"/>
                <xsl:text>'s Portfolio</xsl:text>
            </title>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
            <link rel="stylesheet" href="stylesheets/webStyle.css"/>
            <body class="w3-black">
                <!-- Icon Bar (Sidebar - hidden on small screens) -->
                <nav class="w3-sidebar w3-bar-block w3-hide-small grey-background">
                    <a href="#" class="w3-bar-item w3-button">Home</a>
                    <a href="#about" class="w3-bar-item w3-button">About</a>
                    <xsl:for-each select="./*[name(.)!='GeneralInfo' and name(.)!='Social']">
                        <a href="#{name(.)}" class="w3-bar-item w3-button">
                            <xsl:value-of select="name(.)"/>
                        </a>
                    </xsl:for-each>
                </nav>
                <!-- Hide right-floated links on small screens and replace them with a menu icon -->
                <div class="w3-top w3-hide-large w3-hide-medium" id="myNavbar">
                    <a href="javascript:void(0)" class="w3-bar-item w3-button w3-left w3-hide-large w3-hide-medium grey-background" onclick="w3_open()">
                        <i class="fa fa-bars"/>
                    </a>
                </div>
                <!-- Sidebar on small screens when clicking the menu icon -->
                <nav class="w3-sidebar w3-bar-block w3-card w3-animate-left w3-hide-medium w3-hide-large grey-background" style="display:none" id="mySidebar">
                    <a href="javascript:void(0)" onclick="w3_close()" class="w3-bar-item w3-button w3-large w3-padding-16">Close ×</a>
                    <a href="#about" onclick="w3_close()" class="w3-bar-item w3-button">About</a>
                    <xsl:for-each select="./*[name(.)!='GeneralInfo' and name(.)!='Social']">
                        <a href="#{name(.)}" onclick="w3_close()" class="w3-bar-item w3-button">
                            <xsl:value-of select="name(.)"/>
                        </a>
                    </xsl:for-each>
                </nav>
                <!-- Page Content -->
                <div class="w3-padding-large" id="main">
                    <!-- Header/Home -->
                    <header class="w3-container w3-padding-32 w3-center w3-black" id="home">
                        <h1 class="w3-jumbo">
                            <xsl:value-of select="GeneralInfo/Name"/>
                        </h1>
                        <p>
                            <xsl:apply-templates select="GeneralInfo/Headline"/>
                        </p>
                    </header>
                    <!-- About Section -->
                    <div class="w3-content w3-justify w3-text-grey w3-padding-64" id="about">
                        <h2 class="w3-text-light-grey">Summary</h2>
                        <hr style="width:200px" class="w3-opacity"/>
                        <p>
                            <xsl:apply-templates select="GeneralInfo/Summary"/>
                        </p>
                    </div>
                    <!-- Sections -->
                    <xsl:for-each select="./*[name(.)!='GeneralInfo' and name(.)!='Social']">
                        <div class="w3-padding-64 w3-content w3-text-grey" id="{name(.)}">
                            <h2 class="w3-text-light-grey">
                                <xsl:value-of select="name(.)"/>
                            </h2>
                            <hr style="width:200px" class="w3-opacity"/>
                            <xsl:apply-templates select="*"/>
                        </div>
                    </xsl:for-each>
                    <!-- Footer -->
                    <footer class="w3-content w3-padding-64 w3-text-grey w3-xlarge">
                        <xsl:if test="Social/Linkedin">
                            <a target="_blank" href="https://www.linkedin.com/in/{Social/Linkedin}">
                                <i title="LinkedIn" class="fa fa-linkedin w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:if>
                        <xsl:if test="Social/Facebook">
                            <a target="_blank" href="https://www.facebook.com/{Social/Facebook}">
                                <i title="Facebook" class="fa fa-facebook w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:if>
                        <xsl:if test="Social/Instagram">
                            <a target="_blank" href="https://www.instagram.com/{Social/Instagram}">
                                <i title="Instagram" class="fa fa-instagram w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:if>
                        <xsl:if test="Social/Youtube">
                            <a target="_blank" href="https://www.youtube.com/channel/{Social/Youtube}">
                                <i title="Youtube" class="fa fa-youtube w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:if>
                        <xsl:if test="Social/Twitch">
                            <a target="_blank" href="https://www.twitch.tv/{Social/Twitch}">
                                <i title="Twitch" class="fa fa-twitch w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:if>
                        <xsl:if test="Social/Twitter">
                            <a target="_blank" href="https://twitter.com/{Social/Twitter}">
                                <i title="Twitter" class="fa fa-twitter w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:if>
                        <xsl:if test="Social/Stackoverflow">
                            <a target="_blank" href="https://stackoverflow.com/users/{Social/Stackoverflow}">
                                <i title="Stack Overflow" class="fa fa-stack-overflow w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:if>
                        <xsl:if test="Social/Github">
                            <a target="_blank" href="https://github.com/{Social/Github}">
                                <i title="GitHub" class="fa fa-github w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:if>
                        <xsl:if test="Social/Pinterest">
                            <a target="_blank" href="https://pinterest.com/{Social/Pinterest}/">
                                <i title="Pinteres" class="fa fa-pinterest w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:if>
                        <xsl:for-each select="Social/Link">
                            <a target="_blank" href="{@Url}">
                                <i title="{.}" class="fa fa-link w3-hover-opacity right-margin"/>
                            </a>
                        </xsl:for-each>
                        <p class="w3-medium">
                            <xsl:text>Powered by </xsl:text>
                            <a href="https://www.w3schools.com/w3css/default.asp" target="_blank" class="w3-hover-text-green">w3.css</a>
                        </p>
                        <!-- End footer -->
                    </footer>
                    <!-- END PAGE CONTENT -->
                </div>
            </body>
        </html>
    </xsl:template>
    <!-- Experience -->
    <xsl:template match="Position">
        <div class="w3-padding-16">
            <h3 class="w3-text-light-grey inline">
                <xsl:apply-templates select="Title"/>
            </h3>
            <xsl:if test="not(End)">
                <xsl:text> (current)</xsl:text>
            </xsl:if>
            <h5 class="w3-text-light-grey">
                <xsl:apply-templates select="Company"/>
            </h5>
            <p>
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
            </p>
            <ul>
                <li>
                    <xsl:apply-templates select="Description"/>
                </li>
            </ul>
        </div>
    </xsl:template>
    <!-- Education -->
    <xsl:template match="Study">
        <div class="w3-padding-16">
            <xsl:if test="Degree">
                <xsl:value-of select="Degree"/>
                <xsl:text>&#160;</xsl:text>
            </xsl:if>
            <h3 class="w3-text-light-grey inline">
                <xsl:apply-templates select="Field"/>
            </h3>
            <xsl:if test="not(End)">
                <xsl:text> (current)</xsl:text>
            </xsl:if>
            <p class="w3-text-light-grey">
                <xsl:apply-templates select="School"/>
            </p>
            <p>
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
            </p>
        </div>
    </xsl:template>
    <!-- Skills -->
    <xsl:template match="Skill">
        <div class="w3-padding-16 indented">
            <span class="w3-text-light-grey">
                <xsl:apply-templates select="Field"/>
            </span>
            <xsl:text>&#160;</xsl:text>
            <xsl:apply-templates select="Description"/>
        </div>
    </xsl:template>
    <!-- Projects -->
    <xsl:template match="Project">
        <div class="w3-padding-16">
            <h3 class="w3-text-light-grey inline">
                <xsl:value-of select="Name"/>
            </h3>
            <xsl:if test="Type">
                <xsl:text>&#160;</xsl:text>
                <xsl:value-of select="Type"/>
            </xsl:if>
            <p>
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
            </p>
            <h5 class="w3-text-light-grey inline">Role: </h5>
            <xsl:apply-templates select="Role"/>
            <p>
                <xsl:value-of select="Description"/>
            </p>
            <p>
                <h5>Additional links:</h5>
                <ul>
                    <xsl:for-each select="Link">
                        <li><xsl:apply-templates select="." /></li>
                    </xsl:for-each>
                </ul>
            </p>
        </div>
    </xsl:template>
    <!-- Link -->
    <xsl:template match="*[@Url]">
        <xsl:value-of select="."/>
        <a target="_blank" href="{@Url}">
            <i class="fa fa-link w3-hover-opacity w3-text-grey left-margin smaller"/>
        </a>
    </xsl:template>
</xsl:transform>
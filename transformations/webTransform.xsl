<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-public="-//W3C//DTD HTML 4.01//EN" doctype-system="http://www.w3.org/TR/html4/strict.dtd"/>
    <!-- Root node -->
    <xsl:template match="/portfolio">
        <html>
            <head>
                <title>
                    <xsl:value-of select="GeneralInfo/Name"/>
                    <xsl:text>'s Portfolio</xsl:text>
                </title>
                <meta charset="UTF-8"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat"/>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                <link rel="stylesheet" href="https://haaxor1689.github.io/PortfolioBuilder/stylesheets/webStyle.css"/>
            </head>
            <body>
                <nav>
                    <a href="#">Home</a>
                    <a href="#about">About</a>
                    <xsl:for-each select="./*[name(.)!='GeneralInfo' and name(.)!='Social']">
                        <a href="#{name(.)}">
                            <xsl:value-of select="name(.)"/>
                        </a>
                    </xsl:for-each>
                </nav>
                <!-- Header -->
                <header id="home">
                    <h1>
                        <xsl:value-of select="GeneralInfo/Name"/>
                    </h1>
                    <p>
                        <xsl:apply-templates select="GeneralInfo/Headline"/>
                    </p>
                </header>
                <!-- Page Content -->
                <div class="content">
                    <!-- About Section -->
                    <h2>Summary</h2>
                    <div id="about" class="portfolio-item">
                        <p class="summary-text">
                            <xsl:apply-templates select="GeneralInfo/Summary"/>
                        </p>
                    </div>
                    <!-- Sections -->
                    <xsl:for-each select="./*[name(.)!='GeneralInfo' and name(.)!='Social']">
                        <div id="{name(.)}">
                            <h2>
                                <xsl:value-of select="name(.)"/>
                            </h2>
                            <xsl:apply-templates select="*"/>
                        </div>
                    </xsl:for-each>
                    <!-- END PAGE CONTENT -->
                </div>
                <!-- Footer -->
                <footer>
                    <xsl:if test="Social/Linkedin">
                        <a target="_blank" href="https://www.linkedin.com/in/{Social/Linkedin}">
                            <i title="LinkedIn" class="fa fa-linkedin"/>
                        </a>
                    </xsl:if>
                    <xsl:if test="Social/Facebook">
                        <a target="_blank" href="https://www.facebook.com/{Social/Facebook}">
                            <i title="Facebook" class="fa fa-facebook"/>
                        </a>
                    </xsl:if>
                    <xsl:if test="Social/Instagram">
                        <a target="_blank" href="https://www.instagram.com/{Social/Instagram}">
                            <i title="Instagram" class="fa fa-instagram"/>
                        </a>
                    </xsl:if>
                    <xsl:if test="Social/Youtube">
                        <a target="_blank" href="https://www.youtube.com/channel/{Social/Youtube}">
                            <i title="Youtube" class="fa fa-youtube"/>
                        </a>
                    </xsl:if>
                    <xsl:if test="Social/Twitch">
                        <a target="_blank" href="https://www.twitch.tv/{Social/Twitch}">
                            <i title="Twitch" class="fa fa-twitch"/>
                        </a>
                    </xsl:if>
                    <xsl:if test="Social/Twitter">
                        <a target="_blank" href="https://twitter.com/{Social/Twitter}">
                            <i title="Twitter" class="fa fa-twitter"/>
                        </a>
                    </xsl:if>
                    <xsl:if test="Social/Stackoverflow">
                        <a target="_blank" href="https://stackoverflow.com/users/{Social/Stackoverflow}">
                            <i title="Stack Overflow" class="fa fa-stack-overflow"/>
                        </a>
                    </xsl:if>
                    <xsl:if test="Social/Github">
                        <a target="_blank" href="https://github.com/{Social/Github}">
                            <i title="GitHub" class="fa fa-github"/>
                        </a>
                    </xsl:if>
                    <xsl:if test="Social/Pinterest">
                        <a target="_blank" href="https://pinterest.com/{Social/Pinterest}/">
                            <i title="Pinteres" class="fa fa-pinterest"/>
                        </a>
                    </xsl:if>
                    <xsl:for-each select="Social/Link">
                        <a target="_blank" href="{@Url}">
                            <i title="{.}" class="fa fa-link"/>
                        </a>
                    </xsl:for-each>
                    <!-- End footer -->
                </footer>
            </body>
        </html>
    </xsl:template>
    <!-- Experience -->
    <xsl:template match="Position">
        <div class="portfolio-item">
            <h3>
                <xsl:apply-templates select="Title"/>
            </h3>
            <xsl:if test="not(End)">
                <span class="postfix">
                    <xsl:text>(current)</xsl:text>
                </span>
            </xsl:if>
            <h5>
                <xsl:apply-templates select="Company"/>
            </h5>
            <h4>
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
            </h4>
            <p>
                <xsl:apply-templates select="Description"/>
            </p>
        </div>
    </xsl:template>
    <!-- Education -->
    <xsl:template match="Study">
        <div class="portfolio-item">
            <xsl:if test="Degree">
                <span class="prefix">
                    <xsl:value-of select="Degree"/>
                </span>
            </xsl:if>
            <h3>
                <xsl:apply-templates select="Field"/>
            </h3>
            <xsl:if test="not(End)">
                <span class="postfix">
                    <xsl:text>(current)</xsl:text>
                </span>
            </xsl:if>
            <h5>
                <xsl:apply-templates select="School"/>
            </h5>
            <h4>
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
            </h4>
        </div>
    </xsl:template>
    <!-- Skills -->
    <xsl:template match="Skill">
        <div class="portfolio-item">
            <span>
                <h3 class="skill-title">
                    <xsl:apply-templates select="Field"/>
                </h3>
                <xsl:apply-templates select="Description"/>
            </span>
        </div>
    </xsl:template>
    <!-- Projects -->
    <xsl:template match="Project">
        <div class="portfolio-item">
            <h3>
                <xsl:value-of select="Name"/>
            </h3>
            <xsl:if test="Type">
                <span class="postfix">
                    <xsl:value-of select="Type"/>
                </span>
            </xsl:if>
            <h4>
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
            </h4>
            <h6>Role: </h6>
            <span>
                <xsl:apply-templates select="Role"/>
            </span>
            <p>
                <xsl:value-of select="Description"/>
            </p>
            <xsl:choose>
                <xsl:when test="Link">
                    <h6>Additional links:</h6>
                    <ul>
                        <xsl:for-each select="Link">
                            <li><xsl:apply-templates select="." /></li>
                        </xsl:for-each>
                    </ul>
                </xsl:when>
            </xsl:choose>
            
        </div>
    </xsl:template>
    <!-- Link -->
    <xsl:template match="*[@Url]">
        <span>
            <xsl:value-of select="."/>
        </span>
        <a target="_blank" href="{@Url}">
            <i class="postfix fa fa-link"/>
        </a>
    </xsl:template>
</xsl:transform>
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema 
    xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="portfolio">
        <xs:complexType>
            <xs:sequence>
                <xs:group ref="basic-info-group"/>
                <xs:element ref="social"/>
                <xs:element ref="experience-list" minOccurs="0"/>
                <xs:element ref="education-list" minOccurs="0"/>
                <xs:element ref="skill-list" minOccurs="0"/>
                <xs:element ref="project-list" minOccurs="0"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
    <!-- Section lists -->
    <xs:element name="experience-list">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="experience" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
    <xs:element name="education-list">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="education" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
    <xs:element name="skill-list">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="skill" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
    <xs:element name="project-list">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="project" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
    <!-- Section types -->
    <xs:element name="experience">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="title" type="localized-string-type"/>
            <xs:element name="company" type="company-type"/>
            <xs:element name="location" type="localized-string-type"/>
            <xs:element name="start" type="xs:gYearMonth"/>
            <xs:element name="end" type="xs:gYearMonth" minOccurs="0"/>
            <xs:element name="description" type="localized-string-type" minOccurs="0"/>
        </xs:sequence>
        <xs:attribute name="name" type="xs:string" use="required"/>
    </xs:complexType>
    </xs:element>
    <!---->
    <xs:element name="education">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="school" type="company-type"/>
            <xs:element name="degree" type="xs:string" minOccurs="0"/>
            <xs:element name="field" type="localized-with-url-type"/>
            <xs:element name="start" type="xs:gYear"/>
            <xs:element name="end" type="xs:gYear" minOccurs="0"/>
            <xs:element name="degree" type="xs:string" minOccurs="0"/>
            <xs:element name="description" type="localized-string-type" minOccurs="0"/>
        </xs:sequence>
        <xs:attribute name="name" type="xs:string" use="required"/>
    </xs:complexType>
    </xs:element>
    <!---->
    <xs:element name="skill">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="field" type="localized-string-type"/>
            <xs:element name="description" type="localized-string-type"/>
        </xs:sequence>
        <xs:attribute name="name" type="xs:string" use="required"/>
    </xs:complexType>
    </xs:element>
    <!---->
    <xs:element name="project">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="name" type="xs:string"/>
            <xs:element name="type" type="xs:string" minOccurs="0"/>
            <xs:element name="start" type="xs:gYearMonth"/>
            <xs:element name="end" type="xs:gYearMonth" minOccurs="0"/>
            <xs:element name="role" type="localized-string-type"/>
            <xs:element name="description" type="localized-string-type"/>
            <xs:element name="link" type="link-type" minOccurs="0" maxOccurs="unbounded"/>
        </xs:sequence>
        <xs:attribute name="name" type="xs:string" use="required"/>
    </xs:complexType>
    </xs:element>
    <!-- Other helper types -->
    <xs:complexType name="company-type">
        <xs:complexContent>
            <xs:extension base="localized-string-type">
                <xs:attribute name="logo" type="xs:string"/>
                <xs:attribute name="url" type="xs:string"/>
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>
    <xs:complexType name="localized-with-url-type">
        <xs:complexContent>
            <xs:extension base="localized-string-type">
                <xs:attribute name="url" type="xs:string"/>
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>
    <!---->
    <xs:element name="social">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="linkedin" type="xs:string" minOccurs="0"/>
            <xs:element name="facebook" type="xs:string" minOccurs="0"/>
            <xs:element name="instagram" type="xs:string" minOccurs="0"/>
            <xs:element name="youtube" type="xs:string" minOccurs="0"/>
            <xs:element name="twitch" type="xs:string" minOccurs="0"/>
            <xs:element name="twitter" type="xs:string" minOccurs="0"/>
            <xs:element name="stackoverflow" type="xs:string" minOccurs="0"/>
            <xs:element name="github" type="xs:string" minOccurs="0"/>
            <xs:element name="pinterest" type="xs:string" minOccurs="0"/>
            <xs:element name="link" type="link-type" minOccurs="0" maxOccurs="unbounded"/>
        </xs:sequence>
    </xs:complexType>
    </xs:element>
    <!---->
    <xs:complexType name="link-type">
        <xs:simpleContent>
            <xs:extension base="xs:string">
                <xs:attribute name="url" type="xs:string" use="required"/>
            </xs:extension>
        </xs:simpleContent>
    </xs:complexType>
    <!---->
    <xs:complexType name="localized-string-type">
        <xs:sequence>
            <xs:element name="text" type="text-type" maxOccurs="unbounded"/>
        </xs:sequence>
    </xs:complexType>
    <!---->
    <xs:complexType name="text-type">
        <xs:simpleContent>
            <xs:extension base="xs:string">
                <xs:attribute name="lang" type="language-type"/>
            </xs:extension>
        </xs:simpleContent>
    </xs:complexType>
    <!---->
    <xs:simpleType name="language-type">
        <xs:restriction base="xs:string">
            <xs:enumeration value="en"/>
            <xs:enumeration value="sk"/>
        </xs:restriction>
    </xs:simpleType>
    <!-- Custom groups -->
    <xs:group name="basic-info-group">
        <xs:sequence>
            <xs:element name="name" type="xs:string"/>
            <xs:element name="email" type="email-address-type"/>
            <xs:element name="headline" type="localized-string-type" minOccurs="0"/>
            <xs:element name="summary" type="localized-string-type"/>
        </xs:sequence>
    </xs:group>
    <!-- String regexes -->
    <xs:simpleType name="email-address-type">
        <xs:restriction base="xs:string">
            <xs:pattern value="[^@]+@[^\.]+\.\w+"/>
        </xs:restriction>
    </xs:simpleType>
</xs:schema>
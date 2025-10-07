export interface ColorSection {
    title: 
    | 'Primary Colours'
    | 'Secondary Colours'
    | 'UI Component Colours'
    | 'Utility Colours'
    | 'Status & Feedback Colours'
    swatches: ColorSwatch[];
}

export interface ColorSwatch {
    name: string;
    hexColor: string;
    description?: string;
}

export interface TypographyStyle {
    name: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing?: string;
    description?: string;
}

export interface TypographySection {
    title: string;
    styles: TypographyStyle[];
}

export interface StyleGuide {
    theme: string;
    description: string;
    colorSections: [
        ColorSection, ColorSection, ColorSection, ColorSection, ColorSection
    ]
    typographySections: [TypographySection, TypographySection, TypographySection, TypographySection]
}
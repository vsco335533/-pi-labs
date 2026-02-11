import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'te';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
    en: {
        imageGallery: 'Photo Gallery',
        galleryDesc: 'Explore visual documentation from field studies, workshops, and research missions.',
        uploadImage: 'Upload New Gallery Image',
        imageUpload: 'Upload Image',
        imageName: 'Image Name',
        createImageCategory: 'Create New Category (Optional)',
        selectImageCategory: 'Select Category',
        selectCategory: 'Select a category...',
        imageDescription: 'Description',
        uploading: 'Uploading...',
        addImage: 'Add Image',
        cancel: 'Cancel',
        items: 'items',
        noImagesInCategory: 'No images in this category',
        approve: 'Approve',
        addNew: 'Add New',
        uncategorized: 'Uncategorized',
        delete: 'Delete'
    },
    hi: {
        imageGallery: 'फोटो गैलरी',
        galleryDesc: 'क्षेत्र अध्ययन, कार्यशालाओं और अनुसंधान अभियानों से दृश्य प्रलेखन का अन्वेषण करें।',
        uploadImage: 'नई छवि अपलोड करें',
        imageUpload: 'छवि अपलोड',
        imageName: 'छवि का नाम',
        createImageCategory: 'नई श्रेणी बनाएँ (वैकल्पिक)',
        selectImageCategory: 'श्रेणी चुनें',
        selectCategory: 'एक श्रेणी चुनें...',
        imageDescription: 'विवरण',
        uploading: 'अपलोड हो रहा है...',
        addImage: 'छवि जोड़ें',
        cancel: 'रद्द करें',
        items: 'आइटम',
        noImagesInCategory: 'इस श्रेणी में कोई चित्र नहीं हैं',
        approve: 'मंजूर करें',
        addNew: 'नया जोड़ें',
        uncategorized: 'श्रेणी रहित',
        delete: 'हटाएं'
    },
    te: {
        imageGallery: 'ఫోటో గ్యాలరీ',
        galleryDesc: 'క్షేత్ర అధ్యయనాలు, వర్క్‌షాప్‌లు మరియు పరిశోధన మిషన్ల నుండి దృశ్య పత్రాలను అన్వేషించండి.',
        uploadImage: 'కొత్త చిత్రాన్ని అప్‌లోడ్ చేయండి',
        imageUpload: 'చిత్రం అప్‌లోడ్',
        imageName: 'చిత్రం పేరు',
        createImageCategory: 'కొత్త వర్గాన్ని సృష్టించండి (ఐచ్ఛికం)',
        selectImageCategory: 'వర్గాన్ని ఎంచుకోండి',
        selectCategory: 'ఒక వర్గాన్ని ఎంచుకోండి...',
        imageDescription: 'వివరణ',
        uploading: 'అప్‌లోడ్ అవుతోంది...',
        addImage: 'చిత్రాన్ని జోడించు',
        cancel: 'రద్దు చేయి',
        items: 'అంశాలు',
        noImagesInCategory: 'ఈ వర్గంలో చిత్రాలు లేవు',
        approve: 'ఆమోదించు',
        addNew: 'కొత్తది జోడించు',
        uncategorized: 'వర్గీకరించబడలేదు',
        delete: 'తొలగించు'
    }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        return translations[language][key as keyof typeof translations['en']] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

import { CMSData, Product } from "./types";

export const PRODUCTS: Product[] = [
    { 
        id: 1, 
        name: "Klawiatura Custom 60%", 
        price: 899.99, 
        description: "Kompaktowy design, hot-swap, aluminiowa obudowa.", 
        category: "Klawiatury", 
        icon: "⌨️", 
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop' 
    },
    { 
        id: 2, 
        name: "Myszka E-Sports Pro V2", 
        price: 349.00, 
        description: "Ultralekka (55g), sensor PAW3395, 4000Hz Polling Rate.", 
        category: "Myszki", 
        icon: "🖱️", 
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800&auto=format&fit=crop' 
    },
    { 
        id: 3, 
        name: "Gateron Yellow Switches (x90)", 
        price: 129.50, 
        description: "Liniowe, 50g siły nacisku, fabrycznie lubrykowane.", 
        category: "Switche", 
        icon: "⚙️", 
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop' 
    },
    { 
        id: 4, 
        name: "Keycapy PBT Doubleshot 'Aqua'", 
        price: 199.90, 
        description: "Profil Cherry, PBT, trwałe nadruki w kolorze Soft Cyan.", 
        category: "Keycapy", 
        icon: "🧢", 
        image: 'https://images.unsplash.com/photo-1626218174358-77b7f9a46058?q=80&w=800&auto=format&fit=crop' 
    },
    { 
        id: 5, 
        name: "Podkładka Control XL", 
        price: 159.99, 
        description: "Tekstura control, rozmiar 900x400mm, antypoślizgowa podstawa.", 
        category: "Akcesoria", 
        icon: "📐", 
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop' 
    },
    { 
        id: 6, 
        name: "Kabel Coiled Aviator V2", 
        price: 149.00, 
        description: "Podwójny oplot, złącze typu Aviator, kolor Electric Pink.", 
        category: "Akcesoria", 
        icon: "🔌", 
        image: 'https://images.unsplash.com/photo-1563191911-e65f8655ebf9?q=80&w=800&auto=format&fit=crop' 
    },
];

export const DEFAULT_CMS_DATA: CMSData = {
    heroTitle: "PRECYZJA W KAŻDYM KLIKU",
    heroSubtitle: "TWÓJ EKWIPUNEK, TWOJE ZASADY.",
    heroDescription: "Odkryj sprzęt klasy turniejowej i ekosystem części do pełnej personalizacji. Myszki, Klawiatury, Switche, Keycapy – wyselekcjonowane przez profesjonalistów.",
    heroBgUrl: 'https://img.freepik.com/free-vector/abstract-realistic-technology-particle-background_52683-33064.jpg?semt=ais_hybrid&w=740&q=80',
    productsTitle: "🔥 SELEKCJA CLICK HOUSE: READY TO SHIP",
    customTitle: "⚙️ MODYFIKUJ BEZ OGRANICZEŃ",
    customBgUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop',
    aboutTitle: "NIE JESTEŚMY KOLEJNYM MARKETEM. JESTEŚMY EKSPERTAMI.",
    aboutBgUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    contactTitle: "📞 WESPRZYJ SIĘ WIEDZĄ EKSPERTA",
    contactBgUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'
};

export const ADMIN_EMAIL = "admin@demo.com";
export const ADMIN_PASSWORD = "admin";
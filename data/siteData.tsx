import React from "react";
import { Flame, Shield, Globe, Users, BookOpen, Heart } from "lucide-react";

export interface NavLink {
    label: string;
    id: string;
}

export interface Pillar {
    icon: React.ReactNode;
    title: string;
    devanagari: string;
    desc: string;
}

export interface Quote {
    text: string;
    author: string;
}

export interface Program {
    img: string;
    title: string;
    tag: string;
    desc: string;
}

export interface IdeologyValue {
    en: string;
    hi: string;
    desc: string;
}

export const navLinks: NavLink[] = [
    { label: "Home", id: "home" },
    { label: "Mission", id: "mission" },
    { label: "Ideology", id: "ideology" },
    { label: "Heritage", id: "heritage" },
    { label: "Programs", id: "programs" },
    { label: "Join Us", id: "join" },
];

export const pillars: Pillar[] = [
    {
        icon: <Flame className="w-7 h-7" />,
        title: "Dharma",
        devanagari: "धर्म",
        desc: "The eternal cosmic order sustaining all creation. We uphold the righteous path of Sanatan Dharma as the foundation of all civilized society - guiding humanity toward truth, compassion, and liberation.",
    },
    {
        icon: <Shield className="w-7 h-7" />,
        title: "Raksha",
        devanagari: "रक्षा",
        desc: "Protection of Bharatiya civilization, its ancient temples, sacred texts, and living traditions. We stand as guardians of a 5,000-year heritage that has illuminated the world with wisdom.",
    },
    {
        icon: <Globe className="w-7 h-7" />,
        title: "Rashtra",
        devanagari: "राष्ट्र",
        desc: "The sacred nation of Bharat - not merely a political entity, but a civilizational state rooted in spiritual identity. Every river and mountain of this land is consecrated by millennia of devotion.",
    },
    {
        icon: <Users className="w-7 h-7" />,
        title: "Sangha",
        devanagari: "संघ",
        desc: "Unity of the Hindu community transcending caste, region, and language. We champion Vasudhaiva Kutumbakam - the world is one family - while proudly preserving the identity of Bharat.",
    },
    {
        icon: <BookOpen className="w-7 h-7" />,
        title: "Gyan",
        devanagari: "ज्ञान",
        desc: "Pursuit of ancient wisdom through the Vedas, Upanishads, and Bhagavad Gita - and the vast Bharatiya knowledge systems from Ayurveda to astronomy, from mathematics to metallurgy.",
    },
    {
        icon: <Heart className="w-7 h-7" />,
        title: "Seva",
        devanagari: "सेवा",
        desc: "Selfless service as a spiritual act. Committed to uplifting every section of Hindu society, eliminating social inequities, and serving Bharat Mata through education and community building.",
    },
];

export const quotes: Quote[] = [
    {
        text: "Arise, awake, and stop not until the goal is reached.",
        author: "Swami Vivekananda",
    },
    {
        text: "Strength is Life, Weakness is Death. Expansion is Life, Contraction is Death. Love is Life, Hatred is Death.",
        author: "Swami Vivekananda",
    },
    {
        text: "Swaraj is my birthright and I shall have it.",
        author: "Bal Gangadhar Tilak",
    },
];

export const programs: Program[] = [
    {
        img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&h=450&fit=crop&auto=format",
        title: "Vedic Education Program",
        tag: "Education",
        desc: "Establishing Gurukuls and Sanskrit pathshalas across rural Bharat to revive holistic education rooted in Dharmic values and ancient knowledge systems.",
    },
    {
        img: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=700&h=450&fit=crop&auto=format",
        title: "Temple Restoration Project",
        tag: "Heritage",
        desc: "Documenting, restoring, and protecting thousands of ancient Hindu temples - architectural and spiritual masterpieces of our unbroken civilization.",
    },
    {
        img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&h=450&fit=crop&auto=format",
        title: "Gram Seva Mission",
        tag: "Seva",
        desc: "Rural upliftment through Dharmic service - providing healthcare, clean water, agricultural support, and skills training across villages of India.",
    },
    {
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&h=450&fit=crop&auto=format",
        title: "Hindu Unity Yatra",
        tag: "Unity",
        desc: "Annual pilgrimage marches connecting Hindus across linguistic and regional boundaries, celebrating the shared sacred geography of Bharat Mata.",
    },
];

export const ideologyValues: IdeologyValue[] = [
    { en: "Satya", hi: "सत्य", desc: "Truth as the foundation of all thought and action" },
    { en: "Ahimsa", hi: "अहिंसा", desc: "Non-violence toward all living beings" },
    { en: "Tapas", hi: "तपस्", desc: "Discipline and austerity in pursuit of higher goals" },
    { en: "Seva", hi: "सेवा", desc: "Selfless service as the highest form of worship" },
    { en: "Moksha", hi: "मोक्ष", desc: "Liberation as the ultimate goal of human existence" },
    { en: "Karma", hi: "कर्म", desc: "Righteous action as the path to cosmic justice" },
];
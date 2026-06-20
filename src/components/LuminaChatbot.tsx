import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, RefreshCw, Moon, Star } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  category?: string;
}

const SUGGESTION_TYPES = {
  MOON: {
    color: "from-blue-950/40 to-indigo-950/40 hover:from-blue-900/50 hover:to-indigo-900/50",
    border: "border-blue-500/20 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    icon: <Moon className="w-3.5 h-3.5 text-blue-400" />,
    label: { en: "Moon (Design)", fr: "Moon (Design)" },
    tagColor: "text-blue-400"
  },
  LIGHT: {
    color: "from-amber-950/40 to-yellow-950/40 hover:from-amber-900/50 hover:to-yellow-900/50",
    border: "border-amber-500/20 hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
    label: { en: "Light (Growth)", fr: "Light (Croissance)" },
    tagColor: "text-amber-400"
  },
  FORGE: {
    color: "from-orange-950/40 to-red-950/40 hover:from-orange-900/50 hover:to-red-900/50",
    border: "border-orange-500/20 hover:border-orange-400/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]",
    icon: <RefreshCw className="w-3.5 h-3.5 text-orange-400" />,
    label: { en: "Forge (Structure)", fr: "Forge (Structure)" },
    tagColor: "text-orange-400"
  },
  CONTACT: {
    color: "from-emerald-950/40 to-teal-950/40 hover:from-emerald-900/50 hover:to-teal-900/50",
    border: "border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    icon: <Send className="w-3.5 h-3.5 text-emerald-400" />,
    label: { en: "Contact", fr: "Contact" },
    tagColor: "text-emerald-400"
  }
};

const AURA_THEMES = {
  default: {
    bg: "from-[#D4AF37]/4 to-purple-950/20",
    glow: "bg-[#D4AF37]/5",
    border: "border-amber-500/15"
  },
  moon: {
    bg: "from-blue-950/30 via-slate-950/40 to-indigo-950/25",
    glow: "bg-blue-500/12",
    border: "border-blue-500/25"
  },
  light: {
    bg: "from-amber-950/25 via-[#D4AF37]/5 to-yellow-950/20",
    glow: "bg-amber-500/12",
    border: "border-amber-500/25"
  },
  forge: {
    bg: "from-orange-950/25 via-red-950/25 to-zinc-950/40",
    glow: "bg-orange-500/12",
    border: "border-orange-500/25"
  },
  securite: {
    bg: "from-emerald-950/25 to-zinc-950/45",
    glow: "bg-emerald-500/10",
    border: "border-emerald-500/25"
  },
  contact: {
    bg: "from-teal-950/25 to-zinc-950/45",
    glow: "bg-teal-500/10",
    border: "border-teal-500/25"
  }
};

const getAuraTheme = (category: string | null) => {
  if (!category) return AURA_THEMES.default;
  if (category === 'moon' || category === 'moonlight') return AURA_THEMES.moon;
  if (category === 'light') return AURA_THEMES.light;
  if (category === 'forge') return AURA_THEMES.forge;
  if (category === 'securite') return AURA_THEMES.securite;
  if (category === 'contact' || category === 'tarifs') return AURA_THEMES.contact;
  return AURA_THEMES.default;
};

interface LanguagePack {
  keywords: string[];
  regex: RegExp;
  response: string | ((lastCat: string | null) => string);
}

interface DualLanguageIntent {
  category: string;
  en: LanguagePack;
  fr: LanguagePack;
}

const INTENTS: DualLanguageIntent[] = [
  {
    category: 'identity_claim',
    en: {
      keywords: ['my name is', 'i am', 'call me', "i'm"],
      regex: /\b(my name is|i am|call me|i'm)\b/i,
      response: () => {
        const stored = localStorage.getItem('venture_atelier_user_name') || 'Star-traveler';
        return `It is an absolute honor to meet you, ${stored}! 🌙 Safe travels through our creative galaxies. I have inscribed your name in the stars of our atelier! What beautiful venture can we forge together? ✨`;
      }
    },
    fr: {
      keywords: ['je m\'appelle', 'je suis', 'appelle-moi', "moi c'est"],
      regex: /\b(je m'appelle|je suis|appelle-moi|moi c'est)\b/i,
      response: () => {
        const stored = localStorage.getItem('venture_atelier_user_name') || 'Etoile';
        return `C'est un véritable honneur de faire votre connaissance, ${stored} ! 🌙 Merveilleux voyage à travers nos galaxies créatives. J'ai gravé votre prénom dans les étoiles de l'Atelier ! Quel magnifique projet allons-nous forger ensemble ? ✨`;
      }
    }
  },
  {
    category: 'moonlight',
    en: {
      keywords: ['moonlight', 'relation with moonlight', 'why this name', 'why name', 'name moonlight', 'alliance', 'fusion', 'combination'],
      regex: /\b(moonlight|why this name|name explanation)\b/i,
      response: "Moonlight is the perfect alliance of creativity and clarity! 🌙✨ It is the fusion of our two major pillars: the 'Moon' branch to design your ultimate brand universe, and the 'Light' branch to expand your digital visibility and growth across the web!"
    },
    fr: {
      keywords: ['moonlight', 'relation avec moonlight', 'pourquoi ce nom', 'pourquoi nom', 'nom moonlight', 'lien', 'fusion', 'alliance'],
      regex: /\b(moonlight|pourquoi ce nom|explication nom)\b/i,
      response: "Moonlight, c'est l'alliance parfaite de la créativité et de la clarté ! 🌙✨ C'est la fusion de nos deux piliers majeurs : la branche 'Moon' pour concevoir votre univers de marque, et la branche 'Light' pour faire briller votre visibilité sur le web !"
    }
  },
  {
    category: 'moon',
    en: {
      keywords: ['moon', 'logo', 'logos', 'visual identity', 'artistic direction', 'style guide', 'branding', 'make a logo', 'create a logo', 'graphic design', 'draw', 'design'],
      regex: /\b(moon|logo|branding|identity|style guide|visual identity|graphic|design)\b/i,
      response: "This is the creative world of our **Moon** branch! 🌙 It is fully dedicated to imagination and design. We assist you with custom logo creation, complete brand style guides, and comprehensive artistic direction to build an unforgettable, high-impact brand. ✨"
    },
    fr: {
      keywords: ['moon', 'logo', 'logos', 'identite visuelle', 'direction artistique', 'charte graphique', 'visuels', 'graphisme', 'design pour ma marque', 'faire un logo', 'creer un logo', 'identite graphique', 'maquette', 'dessiner', 'branding'],
      regex: /\b(moon|logo|charte|visuel|graphi|identite|branding|creation logo)\b/i,
      response: "C'est l'univers de notre branche **Moon** ! 🌙 Elle est dédiée à l'imagination et à la création. On vous accompagne sur la création de logo, l'identité graphique complète et la direction artistique globale pour vous bâtir une marque forte et mémorable. ✨"
    }
  },
  {
    category: 'light',
    en: {
      keywords: ['light', 'client', 'clients', 'visibility', 'marketing', 'growth', 'scale', 'audience', 'traffic', 'ad', 'ads', 'social media', 'reach', 'find clients', 'leads'],
      regex: /\b(light|client|visibilit|market|growth|scale|audience|ads|traffic|social)\b/i,
      response: "Step into the brightness with our **Light** branch! 💡 We focus on magnifying your digital presence: custom growth strategy, digital marketing, social media optimization, and laser-targeted audience building. Our goal: make you visible from light-years away! 🚀"
    },
    fr: {
      keywords: ['light', 'client', 'clients', 'visibilite', 'marketing', 'growth', 'scale', 'audience', 'trafic', 'pub', 'publicite', 'reseaux sociaux', 'gerer mes reseaux', 'trouver des clients', 'ads', 'instagram', 'linkedin', 'croissance'],
      regex: /\b(light|client|visibili|market|growth|scale|audience|pub|reseau|ads|trafic|propulser)\b/i,
      response: "Place à la lumière avec notre branche **Light** ! 💡 On s'occupe de propulser votre présence digitale : stratégies de croissance, marketing digital, optimisation de vos réseaux sociaux et développement d'audience. Objectif : vous rendre visible de très loin ! 🚀"
    }
  },
  {
    category: 'forge',
    en: {
      keywords: ['forge', 'idea', 'ideas', 'launch my project', 'structure my project', 'structuring', 'structure', 'business model', 'strategy', 'support', 'concept', 'just an idea', 'iron', 'cadrage'],
      regex: /\b(forge|idea|ideas|structur|business|strat|concept|support|iron|launch|atelier)\b/i,
      response: "Welcome to the **Forge**! 🛠️ This is where we strike the iron to transform raw ideas into highly structured, solid companies. We provide end-to-end strategic support, precise market positioning, and early-stage business development."
    },
    fr: {
      keywords: ['forge', 'idee', 'idees', 'lancer mon projet', 'structurer mon projet', 'structurer', 'structure', 'business model', 'strategie', 'accompagner', 'concept', 'juste une idee', 'fer', 'accompagnement', 'cadrage', 'piliers'],
      regex: /\b(forge|idee|idées|structur|business|strat|concept|accompagn|fer|lance|atelier)\b/i,
      response: "On passe à la **Forge** ! 🛠️ C'est la branche où on frappe le fer pour transformer une simple idée en une structure d'entreprise solide. Nous vous aidons sur l'accompagnement stratégique, le positionnement sur le marché et le développement initial de votre business."
    }
  },
  {
    category: 'presentation',
    en: {
      keywords: ['venture atelier', 'what is venture atelier', 'what do you do', 'who are you', 'introduction', 'presentation', 'creation', 'services'],
      regex: /(venture atelier|who are you|what do you do|presentation|what's|what is)/i,
      response: "Venture Atelier is a high-end digital venture creation studio! 🌙 Here, we transcend simple outsourcing: we transform your ambitious ideas into actual, structured, and highly credible companies. We blend the craftsmanship of a design studio with the analytical strength of an innovation lab! ✨"
    },
    fr: {
      keywords: ['c\'est quoi venture atelier', 'c est quoi venture atelier', 'venture atelier', 'vous faites quoi', 'qui etes vous', 'qui êtes-vous', 'presentation', 'vous faites', 'faites-vous', 'faites vous', 'atelier', 'creation dev', 'qui est'],
      regex: /(venture atelier|qui (etes|êtes) vous|vous faites quoi|presentation|c'est quoi|c est quoi)/i,
      response: "Venture Atelier est un studio digital de création de ventures ! 🌙 Ici, on ne fait pas de la simple sous-traitance : on transforme vos idées ambitieuses en entreprises réelles, structurées et crédibles. Nous combinons l'esprit d'un atelier de design et la force d'un laboratoire d'innovation ! ✨"
    }
  },
  {
    category: 'guidage',
    en: {
      keywords: ['start', 'start off', 'begin', 'where to start', 'dont know', 'guide', 'choose', 'need', 'which branch', 'what studio', 'guidance', 'help'],
      regex: /(start|begin|dont know|don't know|guide|choose|branch|studio|help|direction)/i,
      response: "No worries, I am here to guide you across the cosmos! 🌙 Tell me: **What are you aspiring to build today?** What is the current stage of your venture and what is your absolute biggest challenge right now? ✨"
    },
    fr: {
      keywords: ['commence', 'commencer', 'par quoi', 'sais pas', 'guide', 'choisir', 'manque', 'besoin', 'quelle branche', 'quel studio', 'orientation', 'aidez-moi', 'aide'],
      regex: /(commence|par quoi|ne sais pas|guide|choisir|branche|studio|aide|orientation)/i,
      response: "Pas de panique, je suis là pour vous guider ! 🌙 Dites-moi : **Que souhaitez-vous construire aujourd’hui ?** Quel est le stade actuel de votre projet et votre plus grand défi du moment ? ✨"
    }
  },
  {
    category: 'tarifs',
    en: {
      keywords: ['price', 'cost', 'pricing', 'rates', 'quote', 'estimate', 'expensive', 'money', 'how much', 'budget', 'valuation', 'free'],
      regex: /(price|cost|quote|how much|budget|pay|estimate|fee|rate)/i,
      response: (lastCat) => {
        let contextIntro = "";
        if (lastCat === 'moon') contextIntro = "Regarding design services for the **Moon** branch 🌙, ";
        else if (lastCat === 'light') contextIntro = "To fuel your growth under the **Light** branch 💡, ";
        else if (lastCat === 'forge') contextIntro = "To structure your brand at the **Forge** 🛠️, ";
        
        return `${contextIntro}Every project is as unique as a star in the night sky! 🌌 Our support services are custom-tailored to your goals (Moon, Light, or Forge). To request a precise estimate and diagnostic from our atelier, I invite you to share your contact info or complete our interactive project assessment form! 📝`;
      }
    },
    fr: {
      keywords: ['prix', 'cout', 'tarif', 'tarifs', 'devis', 'cher', 'argent', 'combien', 'payer', 'facturation', 'estimation', 'budget', 'gratuit', 'paye', 'cb'],
      regex: /(prix|cout|coût|tarif|devis|combien|budget|payer|paye|cb)/i,
      response: (lastCat) => {
        let contextIntro = "";
        if (lastCat === 'moon') contextIntro = "Pour les services de design de la branche **Moon** 🌙, ";
        else if (lastCat === 'light') contextIntro = "Pour propulser votre croissance avec la branche **Light** 💡, ";
        else if (lastCat === 'forge') contextIntro = "Pour structurer votre projet à la **Forge** 🛠️, ";
        
        return `${contextIntro}Chaque projet est unique comme une étoile dans le ciel ! 🌌 Nos accompagnements sont faits sur-mesure selon vos besoins (Moon, Light ou Forge). Pour obtenir une estimation précise et un diagnostic de notre atelier, je vous invite à laisser vos coordonnées ou à remplir notre formulaire de contact ! 📝`;
      }
    }
  },
  {
    category: 'duree',
    en: {
      keywords: ['duration', 'time', 'weeks', 'months', 'speed', 'timeline', 'ready', 'when', 'schedule', 'pre'],
      regex: /(time|duration|weeks|months|timeline|when|fast|ready|schedule)/i,
      response: "It entirely depends on the scale of the venture we are building together! 🛠️ A beautiful brand identity (Moon) may take a few weeks, while a full strategic roadmap stretches over several months. Let's discuss your timeline targets during our first call! ⚡"
    },
    fr: {
      keywords: ['temps', 'duree', 'semaine', 'mois', 'rapide', 'delai', 'pret', 'prêt', 'quand', 'calendrier', 'planning'],
      regex: /(temps|duree|durée|semaine|mois|delai|délai|quand|rapide)/i,
      response: "Tout dépend de la taille de l'entreprise qu'on bâtit ensemble ! 🛠️ Une identité de marque (Moon) peut prendre quelques semaines, tandis qu'un déploiement stratégique complet s'inscrit sur la durée. Discutons de vos impératifs de temps lors de notre premier échange ! ⚡"
    }
  },
  {
    category: 'weekend',
    en: {
      keywords: ['saturday', 'sunday', 'weekend', 'active', 'hours', 'open', 'days', 'schedule', 'closed', 'sat', 'sun'],
      regex: /(weekend|saturday|sunday|open|hours|active|schedule|closed)/i,
      response: "Of course! 📅 I am available **24/7**, including Saturdays and Sundays! \n\nThe partners at Venture Atelier know that exceptional founders' inspiration never stops, not even on weekends. That's why we stay active through the weekend to monitor your project diagnostics, receive submissions, and guide you toward your highest ambitions! 🌙✨"
    },
    fr: {
      keywords: ['dispo', 'quand', 'weekend', 'week-end', 'samedi', 'dimanche', 'ouvert', 'horaire', 'horaires', 'jours', 'heure', 'heures', 'sam', 'dim', 'ferme'],
      regex: /(week[- ]end|samedi|dimanche|dispo|ouvert|horaire|ferme)/i,
      response: "Mais oui ! 📅 Je suis disponible **24h/24, 7j/7**, même le samedi et le dimanche ! \n\nLes associés de Venture Atelier savent que l'inspiration des fondateurs d'exception ne s'arrête jamais, pas même en fin de semaine. C'est pourquoi nous sommes sur le pont le week-end pour veiller sur vos soumissions et vous accompagner dans vos plus belles ambitions ! 🌙✨"
    }
  },
  {
    category: 'securite',
    en: {
      keywords: ['security', 'privacy', 'data', 'gdpr', 'storage', 'store', 'keep', 'delete', 'deletion', 'protection', 'encrypt', 'secured'],
      regex: /(securit|gdpr|data|privacy|stor|keep|delet|protect|encrypt)/i,
      response: "Securing your vision and data is our absolute highest priority under the stars! 🛡️ Here is our framework:\n\n🔒 **Complete Encryption:** All metrics and entries submitted through your diagnostic assessment are cryptographically secured.\n\n⏳ **Limited Retention:** Your valuable insights are stored **only for the explicit duration needed for administrative evaluation, methodical scoping, and strategic planning** of your project by a Venture Atelier associate.\n\n♻️ **Right to Deletion:** Upon evaluation completion, all your records can be permanently deleted from our leads register upon simple request to our partners! Straightforward and secure! 🌙💫"
    },
    fr: {
      keywords: ['securite', 'privee', 'donnee', 'donnees', 'rgpd', 'stockage', 'stocker', 'garder', 'conserve', 'conserves', 'retrait', 'supprime', 'suppression', 'confidentialite', 'proteger', 'crypte', 'securise'],
      regex: /(securit|rgpd|donnee|privee|privée|stock|conserv|supprim|confidenti|protect)/i,
      response: "La sécurité de vos idées est notre priorité absolue sous l'égide de la lune ! 🛡️ Voici comment ça marche :\n\n🔒 **Chiffrement complet :** Toutes les données de votre diagnostic sont stockées de façon cryptée et sécurisée.\n\n⏳ **Rétention Limitée :** Vos précieuses informations sont stockées **uniquement pendant toute la durée nécessaire au traitement administratif, à l'évaluation méthodique et au scoping stratégique initial de votre projet** par un associé.\n\n♻️ **Droit de retrait :** À la fin de votre évaluation, vos données sont entièrement supprimées de notre registre de leads sur simple demande de votre part à nos administrateurs généraux ! Sans blabla ! 🌙💫"
    }
  },
  {
    category: 'contact',
    en: {
      keywords: ['contact', 'email', 'mail', 'partner', 'partners', 'address', 'write', 'phone', 'call', 'reach'],
      regex: /(contact|email|mail|partner|write|address|phone|call|reach)/i,
      response: "Looking to reach us directly? 📞 You can email our general partners and administrative office directly at:\n\n📩 **ventureatelier@gmail.com**\n\nWe strive to get back to you with guidance and care in **under 12 hours**! ✨"
    },
    fr: {
      keywords: ['contact', 'contacter', 'email', 'mail', 'associe', 'associes', 'adresse', 'adresse mail', 'joindre', 'ecrire', 'telephone', 'rdv'],
      regex: /(contact|email|mail|associe|associé|joindre|ecrire|écrire|adresse)/i,
      response: "Besoin d'un contact céleste ? 📞 Vous pouvez atteindre directement nos associés généraux et notre administration par courrier électronique officiel : \n\n📩 **ventureatelier@gmail.com**\n\nNous nous mobilisons pour vous répondre avec la plus grande bienveillance en **moins de 12 heures** ! ✨"
    }
  },
  {
    category: 'machine',
    en: {
      keywords: ['robot', 'human', 'chatgpt', 'ai', 'bot', 'gpt', 'gemini', 'intelligent', 'assistant', 'who are you', 'your name', 'avatar', 'lumina'],
      regex: /(robot|ai\b|bot|gpt|gemini|who are you|your name|lumina|assistant)/i,
      response: "Me, a metallic robot? Let's say I am Lumina, the tiny magic moon sparkle who watches over this creative atelier! 🌙 My quest is to guide your venture to the stars, not to recite boring server logs! ✨"
    },
    fr: {
      keywords: ['robot', 'humain', 'chatgpt', 'ia', 'gpt', 'gemini', 'intelligent', 'intelligence', 'assistant', 'qui es-tu', 'qui es tu', 'tu es qui', 'ton nom', 'createur', 'lumina'],
      regex: /(robot|ia\b|gpt|gemini|qui es[- ]tu|ton nom|lumina|assistant)/i,
      response: "Moi, un robot métallique ? Disons plutôt que je suis Lumina, le petit éclat de lune magique qui veille sur cet atelier ! 🌙 Ma mission est de guider votre projet vers les étoiles, pas de réciter des lignes de code ennuyeuses ! ✨"
    }
  },
  {
    category: 'greetings',
    en: {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'yo'],
      regex: /\b(hello|hi|hey|greetings|good morning|yo)\b/i,
      response: "Hello to you! ✨ What a magical pleasure to see you shine in my galaxy today! 🌙 I am Lumina, your loyal little star. Ready for takeoff? Ask me any questions! 🚀"
    },
    fr: {
      keywords: ['bonjour', 'salut', 'coucou', 'hello', 'hey', 'bonsoir', 'wesh', 'yo'],
      regex: /\b(bonjour|salut|coucou|hello|hey|bonsoir|yo)\b/i,
      response: "Coucou à toi ! ✨ Quel bonheur de te voir briller dans ma galaxie aujourd'hui ! 🌙 Je suis Lumina, ta fidèle petite étoile. Prêt(e) à l'action ? Pose-moi tes questions ! 🚀"
    }
  }
];

const welcomeMessageEN = "Venture Atelier is a high-end digital venture creation studio! 🌙 Here, we don't just outsource: we transform your ambitious ideas into actual, structured, and highly credible companies. We blend the craftsmanship of a design studio with the analytical strength of an innovation lab! ✨";
const welcomeMessageFR = "Venture Atelier est un studio digital de création de ventures ! 🌙 Ici, on ne fait pas de la simple sous-traitance : on transforme vos idées ambitieuses en entreprises réelles, structurées et crédibles. Nous combinons l'esprit d'un atelier de design et la force d'un laboratoire d'innovation ! ✨";

const clean = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ')
    .trim();
};

const getLuminaIntelligentResponse = (userInput: string, lastCategory: string | null, language: 'en' | 'fr'): { text: string; category: string } => {
  const query = clean(userInput);

  let bestMatch = { category: 'fallback', score: 0, responseEN: '', responseFR: '' };

  INTENTS.forEach(intent => {
    let score = 0;

    const primaryPack = language === 'en' ? intent.en : intent.fr;
    const secondaryPack = language === 'en' ? intent.fr : intent.en;

    if (primaryPack.regex.test(userInput)) {
      score += 4.5;
    } else if (secondaryPack.regex.test(userInput)) {
      score += 3.5;
    }

    primaryPack.keywords.forEach(keyword => {
      const cleanKw = clean(keyword);
      if (cleanKw.length <= 3) {
        const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
        if (regex.test(query)) score += 2.0;
      } else {
        if (query.includes(cleanKw)) score += 1.5;
      }
    });

    secondaryPack.keywords.forEach(keyword => {
      const cleanKw = clean(keyword);
      if (cleanKw.length <= 3) {
        const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
        if (regex.test(query)) score += 1.0;
      } else {
        if (query.includes(cleanKw)) score += 0.8;
      }
    });

    if (lastCategory && intent.category === lastCategory) {
      score += 1.25;
    }

    if (score > bestMatch.score) {
      const respEN = typeof intent.en.response === 'function' ? intent.en.response(lastCategory) : intent.en.response;
      const respFR = typeof intent.fr.response === 'function' ? intent.fr.response(lastCategory) : intent.fr.response;

      bestMatch = {
        category: intent.category,
        score,
        responseEN: respEN,
        responseFR: respFR
      };
    }
  });

  if (bestMatch.score < 1.4) {
    const fallbackEN = "My starry sensors are swirling! 🌙 In this atelier, we design companies and forge brands, we don't perform unrelated magic! ✨ Let's steer back to the stars: what exceptional venture do you want us to create today? 🚀";
    const fallbackFR = "Mes capteurs lunaires s'embrouillent ! 🌙 Dans notre atelier, on forge des entreprises et on façonne des marques, on ne fait pas de magie hors-sujet ! ✨ Revenons à nos étoiles : quel projet incroyable voulez-vous qu'on construise aujourd'hui ? 🚀";
    return {
      text: language === 'en' ? fallbackEN : fallbackFR,
      category: 'fallback'
    };
  }

  return {
    text: language === 'en' ? bestMatch.responseEN : bestMatch.responseFR,
    category: bestMatch.category
  };
};

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let currentIndex = 0;
    const intervalTime = text.length > 200 ? 6 : 12;
    
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex <= text.length) {
        setDisplayed(text.slice(0, currentIndex));
      } else {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [text]);

  return <span className="whitespace-pre-wrap">{displayed}</span>;
};

// Next-Gen Interactive Mini-Portfolio & Data Cards
const MoonStudioCard: React.FC<{ language: 'en' | 'fr' }> = ({ language }) => {
  return (
    <div className="mt-3 p-3 bg-zinc-950/90 rounded-2xl border border-blue-500/20 shadow-[0_4px_20px_rgba(59,130,246,0.1)] flex flex-col gap-2 font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
        <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
          {language === 'en' ? '🎨 Identity Draft Matrix' : '🎨 Identité Graphique'}
        </span>
        <span className="text-[9px] font-mono text-blue-400 font-bold">MOON STUDIO</span>
      </div>
      <div className="flex gap-2 items-center py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-[10px] text-zinc-400">
          {language === 'en' ? 'Active Cosmic Palette:' : 'Charte Chromatique Activée :'}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] border border-amber-400/40 shadow-sm" />
          <span className="text-[8px] font-mono text-zinc-500">Gold</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/40 shadow-sm" />
          <span className="text-[8px] font-mono text-zinc-500">Obsidian</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/40 shadow-sm" />
          <span className="text-[8px] font-mono text-zinc-500">Lunar</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 border border-indigo-400/40 shadow-sm" />
          <span className="text-[8px] font-mono text-zinc-500">Indigo</span>
        </div>
      </div>
    </div>
  );
};

const LightStudioCard: React.FC<{ language: 'en' | 'fr' }> = ({ language }) => {
  return (
    <div className="mt-3 p-3 bg-zinc-950/90 rounded-2xl border border-amber-500/20 shadow-[0_4px_20px_rgba(245,158,11,0.1)] flex flex-col gap-2 font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
        <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
          {language === 'en' ? '📈 Live Traffic Growth' : "📈 Croissance d'Audience"}
        </span>
        <span className="text-[9px] font-mono text-amber-400 font-bold">LIGHT STUDIO</span>
      </div>
      <div className="flex justify-between items-center bg-zinc-900/50 p-2 rounded-lg border border-white/5">
        <div className="flex flex-col">
          <span className="text-[8px] text-zinc-500 uppercase font-mono">{language === 'en' ? 'ORGANIC TRAFFIC' : 'TRAFIC ORGANIQUE'}</span>
          <span className="text-sm font-semibold tracking-wide text-zinc-100 font-serif">+480%</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[8px] text-zinc-500 uppercase font-mono">{language === 'en' ? 'CONVERSION RATE' : 'TAUX DE CONV.'}</span>
          <span className="text-sm font-semibold tracking-wide text-emerald-400 font-mono">14.8% 🚀</span>
        </div>
      </div>
      <div className="h-10 flex items-end gap-1.5 pt-2 pb-0.5 px-1 bg-zinc-950 rounded-lg">
        <div className="flex-1 bg-zinc-900 h-1/4 rounded-sm" />
        <div className="flex-1 bg-zinc-900/80 h-2/5 rounded-sm" />
        <div className="flex-1 bg-[#D4AF37]/30 h-1/2 rounded-sm" />
        <div className="flex-1 bg-amber-500/40 h-3/5 rounded-sm animate-pulse" />
        <div className="flex-1 bg-gradient-to-t from-amber-600 to-amber-300 h-[90%] rounded-sm shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
      </div>
    </div>
  );
};

const ForgeStudioCard: React.FC<{ language: 'en' | 'fr' }> = ({ language }) => {
  return (
    <div className="mt-3 p-3 bg-zinc-950/90 rounded-2xl border border-orange-500/20 shadow-[0_4px_20px_rgba(249,115,22,0.1)] flex flex-col gap-2.5 font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
        <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
          {language === 'en' ? '🛠️ Venture Framing Map' : '🛠️ Feuille de Route Venture'}
        </span>
        <span className="text-[9px] font-mono text-orange-400 font-bold">FORGE STUDIO</span>
      </div>
      <div className="space-y-1.5 text-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-[7px] text-orange-400 font-bold">✓</div>
          <span className="text-zinc-300 line-through decoration-zinc-700">{language === 'en' ? 'Scoping Diagnostic' : 'Diagnostic Initial'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-orange-500/30 border border-orange-400 flex items-center justify-center text-[7px] text-orange-300 animate-pulse">⚙</div>
          <span className="text-orange-300 font-medium">{language === 'en' ? 'Business Structuring' : 'Cadrage Stratégique'}</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 flex items-center justify-center text-[7px] text-zinc-500">🔒</div>
          <span className="text-zinc-500">{language === 'en' ? 'Capital Validation' : 'Validation de Capital'}</span>
        </div>
      </div>
    </div>
  );
};

const ProactiveCTAQueryCard: React.FC<{ language: 'en' | 'fr'; onActivate: () => void }> = ({ language, onActivate }) => {
  return (
    <div className="mt-3 p-3.5 bg-gradient-to-br from-[#D4AF37]/15 to-transparent rounded-2xl border border-[#D4AF37]/45 shadow-[0_8px_30px_rgba(212,175,55,0.12)] flex flex-col gap-2 font-sans">
      <p className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#D4AF37] animate-pulse">
        {language === 'en' ? '⚡ Priority Unlock' : '⚡ Accès Prioritaire Débloqué'}
      </p>
      <p className="text-[11px] text-zinc-200 leading-normal font-sans">
        {language === 'en' 
          ? "We detected high intent. Complete our interactive diagnostic mapping now to schedule a 1-on-1 strategic interview with our lead architecht!"
          : "Nous détectons un vif intérêt. Remplissez notre diagnostic de cadrage interactif pour planifier un entretien stratégique avec nos associés !"}
      </p>
      <button
        onClick={onActivate}
        className="w-full mt-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-[#D4AF37] to-amber-600 text-zinc-950 font-mono text-[9px] tracking-widest uppercase font-black hover:brightness-110 active:scale-97 transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center gap-1.5"
      >
        <span>{language === 'en' ? 'LAUNCH ASSESSMENT ⚡' : 'LANCER LE DIAGNOSTIC ⚡'}</span>
      </button>
    </div>
  );
};

const STAR_COUNT = 22;
const starryPositions = Array.from({ length: STAR_COUNT }).map((_, i) => ({
  id: i,
  top: `${Math.floor(Math.random() * 95)}%`,
  left: `${Math.floor(Math.random() * 95)}%`,
  size: Math.random() > 0.6 ? 'w-1 h-1' : 'w-0.5 h-0.5',
  delay: `${(Math.random() * 4).toFixed(1)}s`,
  duration: `${(3 + Math.random() * 5).toFixed(1)}s`,
}));

export default function LuminaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [lastCategory, setLastCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  // Listen to external window triggers to open or toggle
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    const handleToggleChat = () => setIsOpen(prev => !prev);
    
    window.addEventListener('open-chatbot', handleOpenChat);
    window.addEventListener('toggle-chatbot', handleToggleChat);
    
    return () => {
      window.removeEventListener('open-chatbot', handleOpenChat);
      window.removeEventListener('toggle-chatbot', handleToggleChat);
    };
  }, []);
  
  // Cosmic Memory: read standard username from localStorage
  const [userName, setUserName] = useState<string | null>(() => {
    try {
      return localStorage.getItem('venture_atelier_user_name');
    } catch (e) {
      return null;
    }
  });

  const [history, setHistory] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: welcomeMessageEN
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scout: triggers welcome greeting update when language or username shifts
  useEffect(() => {
    if (history.length === 1 && history[0].role === 'model') {
      let greetText = "";
      if (language === 'en') {
        greetText = userName 
          ? `Welcome back, ${userName}! ✨ It is a pleasure to guide you again. Are we continuing to forge your brand today, or are we exploring new light? 🌙`
          : welcomeMessageEN;
      } else {
        greetText = userName
          ? `Ravi(e) de vous revoir, ${userName} ! ✨ Quel plaisir de vous guider à nouveau. Continuons-nous à forger votre marque aujourd'hui, ou explorons-nous de nouvelles lumières ? 🌙`
          : welcomeMessageFR;
      }
      setHistory([{ role: 'model', text: greetText }]);
    }
  }, [language, userName]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isLoading]);

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || message.trim();
    if (!messageText || isLoading) return;

    if (!textToSend) {
      setMessage('');
    }

    const newUserMessage: ChatMessage = { role: 'user', text: messageText };
    setHistory(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    // In-context name identifier AI proxy agent
    const enNameMatch = messageText.match(/\b(?:my name is|i am|call me|i'm)\s+([A-Za-zÀ-ÖØ-öø-ÿ]{2,15})\b/i);
    const frNameMatch = messageText.match(/\b(?:je m'appelle|je suis|appelle-moi|moi c'est)\s+([A-Za-zÀ-ÖØ-öø-ÿ]{2,15})\b/i);
    let detectedName = '';
    
    if (enNameMatch && enNameMatch[1]) {
      detectedName = enNameMatch[1];
    } else if (frNameMatch && frNameMatch[1]) {
      detectedName = frNameMatch[1];
    }

    if (detectedName && !['lumina', 'robot', 'human', 'chatgpt', 'gemini'].includes(detectedName.toLowerCase())) {
      try {
        localStorage.setItem('venture_atelier_user_name', detectedName);
        setUserName(detectedName);
      } catch (e) {}
    }

    setTimeout(() => {
      const resultObj = getLuminaIntelligentResponse(messageText, lastCategory, language);
      
      if (resultObj.category !== 'fallback' && resultObj.category !== 'greetings') {
        setLastCategory(resultObj.category);
      }

      setHistory(prev => [...prev, { role: 'model', text: resultObj.text, category: resultObj.category }]);
      setIsLoading(false);
    }, 1100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'fr' : 'en';
    setLanguage(nextLang);
  };

  const suggestionsEN = [
    { label: "Design my Logo", query: "I need a brand visual identity", type: "MOON" },
    { label: "Gain Visibility", query: "How do I build digital audience and traffic?", type: "LIGHT" },
    { label: "Structure my Idea", query: "C'est quoi la Forge ? I need strategic support to launch.", type: "FORGE" },
    { label: "Talk to a Partner", query: "How do I contact Venture Atelier general partners?", type: "CONTACT" },
  ];

  const suggestionsFR = [
    { label: "Créer mon logo", query: "Besoin d'une identité visuelle", type: "MOON" },
    { label: "Gagner en visibilité", query: "Comment booster ma croissance ?", type: "LIGHT" },
    { label: "Structurer mon idée", query: "Besoin d'aide pour structurer mon projet à la Forge", type: "FORGE" },
    { label: "Parler à un humain", query: "Comment puis-je contacter l'administration ou les associés ?", type: "CONTACT" },
  ];

  const suggestions = language === 'en' ? suggestionsEN : suggestionsFR;

  const resetChat = () => {
    setLastCategory(null);
    setHistory([
      {
        role: 'model',
        text: language === 'en' 
          ? "Cosmic reset successful! 💫 Hello again! What amazing project are we launching in the Atelier today? 🚀✨"
          : "Réinitialisation cosmique réussie ! 💫 Coucou à nouveau ! Quel projet incroyable allons-nous propulser aujourd'hui dans l'Atelier ? 🚀✨"
      }
    ]);
  };

  const dispatchOpenWizard = () => {
    window.dispatchEvent(new CustomEvent('open-wizard'));
    setIsOpen(false);
  };

  // Determine active aura styling
  const currentAura = getAuraTheme(lastCategory);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans" id="lumina-chatbot-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed inset-0 sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 w-full sm:w-[420px] max-w-full sm:max-w-[420px] h-full sm:h-[585px] max-h-full sm:max-h-[calc(100vh-6.5rem)] rounded-none sm:rounded-[32px] bg-zinc-950 sm:bg-zinc-950/95 backdrop-blur-xl border-t sm:border border-amber-500/15 shadow-[0_0_50px_rgba(212,175,55,0.08)] flex flex-col overflow-hidden luxury-card transition-all duration-750"
            style={{
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9), 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.05)',
            }}
          >
            {/* Adaptive Aura & Starry Overlay Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 transition-all duration-1000">
              {/* Top main glowing shifting sphere */}
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-[60px] transition-all duration-1000 ${currentAura.glow} opacity-60`} />
              
              <div className="absolute bottom-12 left-0 w-48 h-48 bg-purple-950/15 rounded-full filter blur-[50px] opacity-40" />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-dashed border-[#D4AF37]/3 opacity-15 animate-reverse-spin" style={{ animationDuration: '65s' }} />

              {starryPositions.map(star => (
                <span
                  key={star.id}
                  className={`absolute ${star.size} rounded-full bg-amber-100 animate-pulse`}
                  style={{
                    top: star.top,
                    left: star.left,
                    animationDelay: star.delay,
                    animationDuration: star.duration,
                    boxShadow: '0 0 6px rgba(255,224,130,0.7)',
                  }}
                />
              ))}
            </div>

            {/* Header section (Cosmic UI) */}
            <div className="relative p-5 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {/* Radiant celestial image avatar */}
                <div className="relative flex items-center justify-center animate-pulse-subtle">
                  <div className="absolute w-12 h-12 rounded-full border border-dashed border-[#D4AF37]/35 animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="absolute w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-[#D4AF37] opacity-45 blur-md" />
                  
                  <div className="relative w-9 h-9 rounded-full border border-[#D4AF37]/45 overflow-hidden shadow-lg bg-zinc-950 flex items-center justify-center">
                    <img 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjuZJZ0LWUaVeXjV2PXnB96eMZkBYHHCoDcA&s" 
                      alt="Lumina" 
                      className="w-full h-full object-cover scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center shadow-lg">
                    <span className="w-1 h-1 rounded-full bg-zinc-950" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold tracking-wide text-zinc-100 font-serif">Lumina</h3>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37]">
                      {language === 'en' ? 'Mascot • 100% Autonomous ⚡' : 'Mascotte • 100% Autonome ⚡'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-1.5">
                {/* Premium Language Converter Trigger */}
                <button
                  onClick={toggleLanguage}
                  title={language === 'en' ? "Passer en Français" : "Switch to English"}
                  className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-mono tracking-wider font-extrabold transition-all duration-300 bg-zinc-900/90 border border-amber-500/20 text-[#D4AF37] hover:border-amber-400/60 hover:bg-zinc-900 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] cursor-pointer"
                >
                  <span>{language === 'en' ? '🇫🇷 EN → FR' : '🇬🇧 FR → EN'}</span>
                </button>

                <button
                  onClick={resetChat}
                  title={language === 'en' ? "Reset conversation" : "Réinitialiser la conversation"}
                  className="p-2 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-900/50 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-900/50 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat message content box */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-trigger z-10 relative">
              <AnimatePresence initial={false}>
                {history.map((msg, index) => {
                  const isLastMessage = index === history.length - 1;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 18, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Model Avatar */}
                      {msg.role === 'model' && (
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-[#D4AF37]/30 shadow-md flex-shrink-0 mt-0.5 bg-zinc-950 flex items-center justify-center">
                          <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjuZJZ0LWUaVeXjV2PXnB96eMZkBYHHCoDcA&s" 
                            alt="Lumina" 
                            className="w-full h-full object-cover scale-110"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Speech bubble */}
                      <div className="max-w-[80%] flex flex-col gap-1">
                        <div
                          className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-l from-[#D4AF37]/15 to-transparent border border-[#D4AF37]/35 text-zinc-100 rounded-tr-none shadow-[0_4px_16px_rgba(212,175,55,0.04)] font-sans'
                              : 'bg-zinc-950/80 backdrop-blur-sm border border-zinc-900 text-zinc-200 rounded-tl-none whitespace-pre-wrap leading-relaxed shadow-[0_4px_24px_rgba(0,0,0,0.4)] font-sans'
                          }`}
                        >
                          {msg.role === 'model' && isLastMessage ? (
                            <TypewriterText text={msg.text} />
                          ) : (
                            <span>{msg.text}</span>
                          )}
                        </div>

                        {/* Renders custom interactive inline micro-portfolio snippets & proactivity wizard card */}
                        {msg.role === 'model' && msg.category === 'moon' && (
                          <MoonStudioCard language={language} />
                        )}
                        {msg.role === 'model' && msg.category === 'light' && (
                          <LightStudioCard language={language} />
                        )}
                        {msg.role === 'model' && msg.category === 'forge' && (
                          <ForgeStudioCard language={language} />
                        )}
                        {msg.role === 'model' && (msg.category === 'contact' || msg.category === 'tarifs') && (
                          <ProactiveCTAQueryCard language={language} onActivate={dispatchOpenWizard} />
                        )}
                      </div>

                      {/* User Avatar */}
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-zinc-900 to-zinc-800 flex items-center justify-center border border-zinc-800 shadow-md flex-shrink-0 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Magical typing simulation */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#D4AF37]/30 shadow-md flex-shrink-0 mt-0.5 bg-zinc-950 flex items-center justify-center">
                    <img 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjuZJZ0LWUaVeXjV2PXnB96eMZkBYHHCoDcA&s" 
                      alt="Lumina" 
                      className="w-full h-full object-cover scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl rounded-tl-none px-4 py-3.5 flex items-center gap-2">
                    <div className="flex gap-1.5 items-center py-1 px-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider text-[#D4AF37] uppercase animate-pulse">
                      {language === 'en' ? 'Lumina is active... 🌙' : "Lumina s'active... 🌙"}
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Cosmic Action Cards Grid with adaptive highlights */}
            <div className="p-4 bg-zinc-950/50 border-t border-zinc-900 grid grid-cols-2 gap-2.5 z-10 relative">
              {suggestions.map((sug, i) => {
                const style = SUGGESTION_TYPES[sug.type as keyof typeof SUGGESTION_TYPES];
                const displayLabel = language === 'en' ? style.label.en : style.label.fr;
                
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(sug.query)}
                    disabled={isLoading}
                    className={`
                      group relative flex flex-col items-start p-3 rounded-2xl 
                      bg-gradient-to-br ${style.color} 
                      border ${style.border}
                      transition-all duration-300 text-left cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-center gap-1.5 mb-1 bg-zinc-950/65 py-0.5 px-2 rounded-full border border-white/5">
                      {style.icon}
                      <span className={`text-[8px] uppercase tracking-wider font-extrabold ${style.tagColor}`}>
                        {displayLabel}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-100 font-medium leading-tight group-hover:text-amber-400 transition-colors">
                      {sug.label}
                    </span>
                    
                    <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.button>
                );
              })}
            </div>

            {/* Capsule dashboard input form controls */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex gap-2 items-center z-10 relative">
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={language === 'en' ? "Ask me a question... ✨" : "Écris-moi une question... ✨"}
                  className="w-full bg-zinc-900/60 text-xs text-white border border-zinc-850 focus:border-[#D4AF37]/50 focus:bg-zinc-900 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all rounded-full pl-5 pr-10 py-3.5 outline-none font-sans"
                  style={{
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
                  }}
                />
                <Sparkles className="absolute right-4 w-4 h-4 text-[#D4AF37]/40 pointer-events-none" />
              </div>

              <button
                onClick={() => handleSend()}
                disabled={isLoading || !message.trim()}
                className="p-3.5 rounded-full bg-gradient-to-r from-amber-500 via-[#D4AF37] to-amber-600 text-zinc-950 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center animate-pulse"
              >
                <Send className="w-4 h-4 fill-zinc-950" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outer Rotating Floating Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-[#D4AF37] to-yellow-500 text-zinc-950 flex items-center justify-center shadow-[0_4px_30px_rgba(212,175,55,0.25)] cursor-pointer relative z-50 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <X className="w-6 h-6 text-zinc-950" key="close-icon" />
          ) : (
            <div className="relative flex items-center justify-center w-full h-full" key="moon-icon">
              <div className="absolute w-12 h-12 rounded-full border border-zinc-950/30 border-dashed animate-spin" style={{ animationDuration: '5s' }} />
              <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-950/20 bg-zinc-900 shadow-md flex items-center justify-center">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjuZJZ0LWUaVeXjV2PXnB96eMZkBYHHCoDcA&s" 
                  alt="Lumina Launcher" 
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <Sparkles className="w-3.5 h-3.5 absolute top-1 right-1 text-amber-950 animate-pulse pointer-events-none" />
            </div>
          )}
        </AnimatePresence>
        
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-yellow-300 to-transparent opacity-20 blur-md pointer-events-none animate-pulse" />
      </motion.button>
    </div>
  );
}

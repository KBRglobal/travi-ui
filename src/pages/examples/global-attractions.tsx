import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { 
  MapPin, Star, ChevronRight, Sparkles, Ticket, TrendingUp, Globe, Award,
  ArrowRight, Search, Clock, Users, Camera, Landmark, Shield, Zap,
  Calendar, Heart, CheckCircle2
} from "lucide-react";
import SubtleSkyBackground from "@/components/ui/subtle-sky-background";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { cn } from "@/lib/utils";

// ============================================
// ANIMATION STYLES (matching Destinations page)
// ============================================
const heroAnimationStyles = `
  @keyframes gradient-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animated-gradient-text {
    background: linear-gradient(
      135deg,
      #6443F4 0%,
      #8B5CF6 20%,
      #A78BFA 40%,
      #F24294 60%,
      #8B5CF6 80%,
      #6443F4 100%
    );
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-flow 6s ease infinite;
    display: inline-block;
    padding-top: 0.1em;
    padding-bottom: 0.05em;
  }
`;

// ============================================
// CONSTANTS
// ============================================
const LOCKED_AFFILIATE_LINK = "https://tiqets.tpo.lu/k16k6RXU";

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'he', label: 'עברית' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
  { code: 'th', label: 'ไทย' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'vi', label: 'Tiếng Việt' },
];

// ============================================
// DATA
// ============================================
const ATTRACTION_DESTINATIONS = [
  { 
    slug: "dubai", 
    name: "Dubai", 
    country: "UAE",
    region: "Middle East",
    attractionCount: 85,
    topAttraction: "Burj Khalifa",
    image: "/cards/dubai.webp",
    imageAlt: "Dubai attractions and landmarks",
    featured: true
  },
  { 
    slug: "abu-dhabi", 
    name: "Abu Dhabi", 
    country: "UAE",
    region: "Middle East",
    attractionCount: 45,
    topAttraction: "Louvre Abu Dhabi",
    image: "/cards/abu-dhabi.webp",
    imageAlt: "Abu Dhabi attractions",
    featured: true
  },
  { 
    slug: "london", 
    name: "London", 
    country: "UK",
    region: "Europe",
    attractionCount: 120,
    topAttraction: "Tower of London",
    image: "/cards/london.webp",
    imageAlt: "London attractions",
    featured: true
  },
  { 
    slug: "paris", 
    name: "Paris", 
    country: "France",
    region: "Europe",
    attractionCount: 150,
    topAttraction: "Eiffel Tower",
    image: "/cards/paris.webp",
    imageAlt: "Paris attractions",
    featured: true
  },
  { 
    slug: "new-york", 
    name: "New York", 
    country: "USA",
    region: "Americas",
    attractionCount: 180,
    topAttraction: "Empire State Building",
    image: "/cards/new-york.webp",
    imageAlt: "New York City attractions",
    featured: true
  },
  { 
    slug: "tokyo", 
    name: "Tokyo", 
    country: "Japan",
    region: "Asia",
    attractionCount: 95,
    topAttraction: "Tokyo Skytree",
    image: "/cards/tokyo.webp",
    imageAlt: "Tokyo attractions",
    featured: true
  },
  { 
    slug: "singapore", 
    name: "Singapore", 
    country: "Singapore",
    region: "Asia",
    attractionCount: 65,
    topAttraction: "Gardens by the Bay",
    image: "/cards/singapore.webp",
    imageAlt: "Singapore attractions",
    featured: false
  },
  { 
    slug: "bangkok", 
    name: "Bangkok", 
    country: "Thailand",
    region: "Asia",
    attractionCount: 70,
    topAttraction: "Grand Palace",
    image: "/cards/bangkok.webp",
    imageAlt: "Bangkok attractions",
    featured: false
  },
  { 
    slug: "barcelona", 
    name: "Barcelona", 
    country: "Spain",
    region: "Europe",
    attractionCount: 80,
    topAttraction: "Sagrada Familia",
    image: "/cards/barcelona.webp",
    imageAlt: "Barcelona attractions",
    featured: false
  },
  { 
    slug: "rome", 
    name: "Rome", 
    country: "Italy",
    region: "Europe",
    attractionCount: 110,
    topAttraction: "Colosseum",
    image: "/cards/rome.webp",
    imageAlt: "Rome attractions",
    featured: false
  },
  { 
    slug: "amsterdam", 
    name: "Amsterdam", 
    country: "Netherlands",
    region: "Europe",
    attractionCount: 55,
    topAttraction: "Van Gogh Museum",
    image: "/cards/amsterdam.webp",
    imageAlt: "Amsterdam attractions",
    featured: false
  },
  { 
    slug: "hong-kong", 
    name: "Hong Kong", 
    country: "China",
    region: "Asia",
    attractionCount: 50,
    topAttraction: "Victoria Peak",
    image: "/cards/hong-kong.webp",
    imageAlt: "Hong Kong attractions",
    featured: false
  },
  { 
    slug: "istanbul", 
    name: "Istanbul", 
    country: "Turkey",
    region: "Europe",
    attractionCount: 75,
    topAttraction: "Hagia Sophia",
    image: "/cards/istanbul.webp",
    imageAlt: "Istanbul attractions",
    featured: false
  },
  { 
    slug: "las-vegas", 
    name: "Las Vegas", 
    country: "USA",
    region: "Americas",
    attractionCount: 60,
    topAttraction: "High Roller",
    image: "/cards/las-vegas.webp",
    imageAlt: "Las Vegas attractions",
    featured: false
  },
  { 
    slug: "los-angeles", 
    name: "Los Angeles", 
    country: "USA",
    region: "Americas",
    attractionCount: 70,
    topAttraction: "Universal Studios",
    image: "/cards/los-angeles.webp",
    imageAlt: "Los Angeles attractions",
    featured: false
  },
  { 
    slug: "miami", 
    name: "Miami", 
    country: "USA",
    region: "Americas",
    attractionCount: 45,
    topAttraction: "Everglades",
    image: "/cards/miami.webp",
    imageAlt: "Miami attractions",
    featured: false
  },
];

const REGIONS = [
  { id: "middle-east", name: "Middle East", icon: "🕌" },
  { id: "europe", name: "Europe", icon: "🏰" },
  { id: "asia", name: "Asia", icon: "🏯" },
  { id: "americas", name: "Americas", icon: "🗽" },
];

const TICKET_BENEFITS = [
  { 
    icon: Zap, 
    label: "Skip the Line",
    description: "Priority access",
    gradient: "from-amber-500 to-orange-400"
  },
  { 
    icon: CheckCircle2, 
    label: "Instant Confirmation",
    description: "Tickets sent immediately",
    gradient: "from-emerald-500 to-teal-400"
  },
  { 
    icon: Calendar, 
    label: "Flexible Booking",
    description: "Free cancellation",
    gradient: "from-blue-500 to-cyan-400"
  },
  { 
    icon: Shield, 
    label: "Best Price Guarantee",
    description: "Price match promise",
    gradient: "from-violet-500 to-purple-400"
  },
  { 
    icon: Users, 
    label: "Millions of Reviews",
    description: "Trusted by travelers",
    gradient: "from-pink-500 to-rose-400"
  },
  { 
    icon: Heart, 
    label: "Curated Experiences",
    description: "Hand-picked selection",
    gradient: "from-red-500 to-orange-400"
  },
];

const ATTRACTION_CATEGORIES = [
  {
    title: "Landmarks & Monuments",
    subtitle: "Iconic Sights",
    description: "Visit world-famous landmarks including the Eiffel Tower, Colosseum, Burj Khalifa, and more.",
    icon: Landmark,
    count: "500+",
    gradient: "from-amber-500 to-yellow-400"
  },
  {
    title: "Museums & Culture",
    subtitle: "Art & History",
    description: "Explore renowned museums like the Louvre, Van Gogh Museum, and Metropolitan Museum of Art.",
    icon: Camera,
    count: "300+",
    gradient: "from-violet-500 to-purple-400"
  },
  {
    title: "Theme Parks",
    subtitle: "Family Fun",
    description: "Experience thrilling theme parks including Universal Studios, Disneyland, and more.",
    icon: Star,
    count: "150+",
    gradient: "from-pink-500 to-rose-400"
  },
  {
    title: "Tours & Experiences",
    subtitle: "Local Adventures",
    description: "Discover guided tours, food experiences, and unique local activities worldwide.",
    icon: Globe,
    count: "400+",
    gradient: "from-emerald-500 to-teal-400"
  }
];

// FAQ for AEO
const ATTRACTIONS_FAQ = [
  {
    q: "How do I book attraction tickets on TRAVI?",
    a: "TRAVI partners with Tiqets to provide seamless ticket booking. Simply browse attractions by destination, select your preferred date and time, and receive instant confirmation with mobile tickets delivered directly to your email."
  },
  {
    q: "What are the benefits of skip-the-line tickets?",
    a: "Skip-the-line tickets let you bypass long queues at popular attractions, saving hours of waiting time. Priority access means more time enjoying the attraction and less time standing in line, especially valuable at busy landmarks like the Eiffel Tower or Colosseum."
  },
  {
    q: "Can I cancel or modify my attraction booking?",
    a: "Most attractions offer flexible booking with free cancellation up to 24 hours before your visit. Specific cancellation policies vary by attraction and are clearly displayed during booking. Mobile tickets can be easily rescheduled through your confirmation email."
  },
  {
    q: "Which destinations have the most attractions on TRAVI?",
    a: "New York leads with 180+ attractions, followed by Paris (150+), London (120+), and Rome (110+). Dubai offers 85+ attractions including the Burj Khalifa, while Asian destinations like Tokyo and Bangkok feature unique cultural experiences."
  }
];

// ============================================
// INTERFACES
// ============================================
interface Destination {
  slug: string;
  name: string;
  country: string;
  attractionCount: number;
}

interface DestinationsResponse {
  destinations: Destination[];
  affiliateLink: string;
}

// ============================================
// COMPONENTS
// ============================================

function AttractionDestinationCard({ destination, index }: { destination: typeof ATTRACTION_DESTINATIONS[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group h-full"
      data-testid={`attraction-card-${destination.slug}`}
    >
      <Link href={`/attractions/list/${destination.slug}`}>
        <Card className="h-full overflow-hidden border-0 bg-white dark:bg-slate-800/60 shadow-md hover:shadow-xl dark:shadow-slate-900/40 transition-all duration-400 group-hover:-translate-y-1">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={destination.image}
              alt={`${destination.name} attractions - ${destination.imageAlt}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              width={400}
              height={300}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <Badge className="bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-white backdrop-blur-sm border-0 text-xs px-2.5 py-1 shadow-sm font-medium">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#6443F4]/10 mr-1.5">
                  <Ticket className="w-2.5 h-2.5 text-[#6443F4]" aria-hidden="true" />
                </span>
                {destination.attractionCount} Attractions
              </Badge>
              {destination.featured && (
                <Badge className="bg-gradient-to-r from-[#6443F4]/95 to-[#8B5CF6]/95 text-white backdrop-blur-sm border-0 text-xs px-2.5 py-1 shadow-sm font-medium">
                  <Star className="w-3 h-3 mr-1 fill-current" aria-hidden="true" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Destination Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-1.5 text-white/85 text-xs mb-1.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                </span>
                <span>{destination.country}</span>
              </div>
              <h3 
                className="text-xl sm:text-2xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Chillax', var(--font-sans)" }}
              >
                {destination.name}
              </h3>
            </div>
          </div>

          <CardContent className="p-4 bg-white dark:bg-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {destination.region}
              </span>
              <span className="text-xs font-semibold text-[#6443F4]">
                Top: {destination.topAttraction}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Zap className="w-3 h-3 text-amber-500" aria-hidden="true" />
                <span>Skip-the-line available</span>
              </div>
              <span className="flex items-center text-[#6443F4] font-medium text-sm transition-all duration-300 group-hover:gap-1.5">
                Book Now
                <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform duration-300" aria-hidden="true" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.article>
  );
}

function RegionSection({ region, destinations }: { region: string; destinations: typeof ATTRACTION_DESTINATIONS }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const regionData = REGIONS.find(r => r.name === region);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-14"
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6443F4] to-[#8B5CF6] flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20"
          aria-hidden="true"
        >
          {regionData?.icon}
        </div>
        <div>
          <h3 
            className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight"
            style={{ fontFamily: "'Chillax', var(--font-sans)" }}
          >
            {region}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {destinations.map((dest, idx) => (
          <AttractionDestinationCard key={dest.slug} destination={dest} index={idx} />
        ))}
      </div>
    </motion.div>
  );
}

function AttractionsFAQ() {
  return (
    <section 
      className="py-14 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/70" 
      data-testid="faq-section"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3"
            style={{ fontFamily: "'Chillax', var(--font-sans)" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need to know about booking attractions
          </p>
        </motion.div>

        <div className="space-y-3">
          {ATTRACTIONS_FAQ.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-slate-800/80 rounded-xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/50"
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GlobalAttractions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const totalAttractions = ATTRACTION_DESTINATIONS.reduce((sum, d) => sum + d.attractionCount, 0);

  const filteredDestinations = ATTRACTION_DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.topAttraction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = !selectedRegion || dest.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const groupedDestinations = REGIONS.map(region => ({
    region: region.name,
    destinations: filteredDestinations.filter(d => d.region === region.name)
  })).filter(group => group.destinations.length > 0);

  return (
    <>
      <style>{heroAnimationStyles}</style>

      <Helmet>
        <title>Book Attractions Worldwide - Skip-the-Line Tickets in 16 Destinations | TRAVI</title>
        <meta name="description" content="Book tickets to 1,300+ attractions across 16 destinations. Skip-the-line access to Eiffel Tower, Colosseum, Burj Khalifa, Empire State Building and more with instant confirmation." />
        <meta name="keywords" content="attraction tickets, skip the line, Eiffel Tower tickets, Colosseum tickets, Burj Khalifa tickets, theme park tickets, museum tickets" />
        <meta name="robots" content="index, follow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book Attractions Worldwide | TRAVI" />
        <meta name="twitter:description" content="Skip-the-line tickets to 1,300+ attractions in 16 destinations." />
        <link rel="canonical" href="https://travi.world/attractions" />

        {/* Preload critical images */}
        <link rel="preload" as="image" href="/cards/dubai.webp" fetchPriority="high" />

        {/* hreflang tags */}
        <link rel="alternate" hrefLang="x-default" href="https://travi.world/attractions" />
        {SUPPORTED_LANGUAGES.map(lang => (
          <link key={lang.code} rel="alternate" hrefLang={lang.code} href={`https://travi.world/${lang.code}/attractions`} />
        ))}

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "TRAVI",
            "url": "https://travi.world",
            "logo": "https://travi.world/logo.png"
          })}
        </script>

        {/* ItemList Schema - Enhanced */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Attraction Destinations",
            "description": `Book tickets to ${totalAttractions}+ attractions across 16 destinations worldwide`,
            "numberOfItems": ATTRACTION_DESTINATIONS.length,
            "itemListElement": ATTRACTION_DESTINATIONS.map((dest, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "TouristDestination",
                "@id": `https://travi.world/attractions/${dest.slug}`,
                "name": `${dest.name} Attractions`,
                "description": `${dest.attractionCount} attractions in ${dest.name}, ${dest.country}. Top attraction: ${dest.topAttraction}`,
                "url": `https://travi.world/attractions/${dest.slug}`,
                "image": `https://travi.world${dest.image}`,
                "touristType": ["Family", "Culture", "Adventure", "Sightseeing"]
              }
            }))
          })}
        </script>

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://travi.world" },
              { "@type": "ListItem", "position": 2, "name": "Attractions", "item": "https://travi.world/attractions" }
            ]
          })}
        </script>

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": ATTRACTIONS_FAQ.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a }
            }))
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-slate-950 relative">
        <SubtleSkyBackground />
        <PublicNav variant="default" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section 
            ref={heroRef}
            className="pt-28 pb-12 px-4 sm:px-6 relative overflow-hidden"
            data-testid="attractions-hero"
            aria-label="Attractions overview"
          >
            {/* Animated decorative blobs */}
            <motion.div 
              className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-300/20 via-purple-200/10 to-transparent rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-violet-200/30 via-blue-100/20 to-transparent rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.35, 0.25] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              aria-hidden="true"
            />

            <div className="max-w-6xl mx-auto relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-center mb-10"
              >
                {/* Eyebrow Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full mb-6 border border-purple-100/50 dark:border-purple-800/30"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-[#6443F4] uppercase">
                    Skip-the-Line Tickets
                  </span>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6443F4] to-[#8B5CF6] flex items-center justify-center">
                    <Ticket className="w-3 h-3 text-white" aria-hidden="true" />
                  </div>
                </motion.div>

                {/* Main Heading with Animated Gradient */}
                <h1 className="mb-5" data-testid="attractions-page-h1">
                  <span 
                    className="block text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-[1.15] tracking-tight"
                    style={{ fontFamily: "'Chillax', var(--font-sans)" }}
                  >
                    Book Attractions
                  </span>
                  <span 
                    className="block text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.2] tracking-tight animated-gradient-text py-1"
                    style={{ fontFamily: "'Chillax', var(--font-sans)" }}
                  >
                    Worldwide
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
                  Discover and book tickets to the world's best attractions. 
                  Skip the queues with instant confirmation.
                </p>

                {/* Stats Row */}
                <motion.dl
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-8"
                >
                  {[
                    { value: `${totalAttractions}+`, label: "ATTRACTIONS", icon: Ticket, gradient: "from-pink-500 to-rose-400" },
                    { value: "16", label: "DESTINATIONS", icon: Globe, gradient: "from-blue-500 to-cyan-400" },
                    { value: "4.8", label: "AVG RATING", icon: Star, gradient: "from-amber-500 to-yellow-400" },
                    { value: "17", label: "LANGUAGES", icon: Sparkles, gradient: "from-violet-500 to-purple-400" },
                  ].map((stat, idx) => (
                    <div key={stat.label} className="flex items-center gap-4 sm:gap-6 md:gap-8">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.4 + idx * 0.08 }}
                        className="flex flex-col items-center"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-lg",
                          `bg-gradient-to-br ${stat.gradient}`
                        )}>
                          <stat.icon className="w-5 h-5 text-white" aria-hidden="true" />
                        </div>
                        <dt className="sr-only">{stat.label}</dt>
                        <dd 
                          className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white"
                          style={{ fontFamily: "'Chillax', var(--font-sans)" }}
                        >
                          {stat.value}
                        </dd>
                        <div className="text-[10px] text-slate-400 tracking-wider mt-0.5" aria-hidden="true">
                          {stat.label}
                        </div>
                      </motion.div>
                      {idx < 3 && (
                        <div 
                          className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700 to-transparent" 
                          aria-hidden="true" 
                        />
                      )}
                    </div>
                  ))}
                </motion.dl>

                {/* Answer Capsule for AEO */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="max-w-2xl mx-auto mb-8 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-700/50 text-left shadow-sm"
                >
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                    Why book attractions through TRAVI?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    TRAVI partners with Tiqets to offer skip-the-line tickets to {totalAttractions}+ attractions 
                    across 16 destinations. Enjoy instant confirmation, mobile tickets, free cancellation on 
                    most bookings, and best price guarantee. From the Eiffel Tower to the Burj Khalifa, 
                    experience world-famous landmarks without the wait.
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-3 mb-8"
                >
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-[#6443F4] to-[#8B5CF6] hover:from-[#5539d4] hover:to-[#7c4ee6] text-white font-semibold px-7 shadow-lg shadow-purple-500/25 h-12"
                    onClick={() => window.open(LOCKED_AFFILIATE_LINK, "_blank", "noopener,noreferrer")}
                  >
                    <Ticket className="w-4 h-4 mr-2" aria-hidden="true" />
                    Browse All Attractions
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </motion.div>

                {/* Search Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="max-w-md mx-auto mb-6"
                >
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gradient-to-br from-[#6443F4] to-[#8B5CF6] flex items-center justify-center shadow-md shadow-purple-500/20">
                      <Search className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search destinations or attractions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search attractions"
                      className="w-full pl-14 pr-4 py-3 h-14 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40 focus:ring-2 focus:ring-[#6443F4] focus:border-transparent placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </motion.div>

                {/* Region Filters */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  role="group"
                  aria-label="Filter attractions by region"
                  className="flex flex-wrap justify-center gap-2"
                >
                  <Button
                    variant={selectedRegion === null ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-full text-sm h-10 px-5 font-medium transition-all duration-300",
                      selectedRegion === null 
                        ? "bg-gradient-to-r from-[#6443F4] to-[#8B5CF6] hover:from-[#5539d4] hover:to-[#7c4ee6] text-white shadow-lg shadow-purple-500/20" 
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#6443F4]/50"
                    )}
                    onClick={() => setSelectedRegion(null)}
                  >
                    All Regions
                  </Button>
                  {REGIONS.map((region) => (
                    <Button
                      key={region.id}
                      variant={selectedRegion === region.name ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "rounded-full text-sm h-10 px-5 font-medium transition-all duration-300",
                        selectedRegion === region.name 
                          ? "bg-gradient-to-r from-[#6443F4] to-[#8B5CF6] hover:from-[#5539d4] hover:to-[#7c4ee6] text-white shadow-lg shadow-purple-500/20" 
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-[#6443F4]/50"
                      )}
                      onClick={() => setSelectedRegion(region.name)}
                    >
                      <span className="mr-2 text-base" aria-hidden="true">{region.icon}</span>
                      {region.name}
                    </Button>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Ticket Benefits Section */}
          <section className="py-12 px-4 sm:px-6 bg-white dark:bg-slate-950" data-testid="benefits-section">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 
                  className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3"
                  style={{ fontFamily: "'Chillax', var(--font-sans)" }}
                >
                  Why Book With Us
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
                  Enjoy these benefits on every attraction booking
                </p>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {TICKET_BENEFITS.map((benefit, idx) => (
                  <motion.div
                    key={benefit.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-md",
                      `bg-gradient-to-br ${benefit.gradient}`
                    )}>
                      <benefit.icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white text-center">
                      {benefit.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
                      {benefit.description}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Attraction Categories Section */}
          <section className="py-12 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-900/50" data-testid="categories-section">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 
                  className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3"
                  style={{ fontFamily: "'Chillax', var(--font-sans)" }}
                >
                  Attraction Categories
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
                  Explore attractions by category across all destinations
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {ATTRACTION_CATEGORIES.map((category, idx) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-5 h-full bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col h-full">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg mb-4",
                          `bg-gradient-to-br ${category.gradient}`
                        )}>
                          <category.icon className="w-6 h-6 text-white" aria-hidden="true" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 
                            className="text-lg font-bold text-slate-900 dark:text-white"
                            style={{ fontFamily: "'Chillax', var(--font-sans)" }}
                          >
                            {category.title}
                          </h3>
                          <Badge className="bg-[#6443F4]/10 text-[#6443F4] border-0 text-xs">
                            {category.count}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#6443F4] font-medium mb-2">{category.subtitle}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                          {category.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Attractions by Region */}
          <section 
            className="py-12 px-4 sm:px-6 bg-white dark:bg-slate-950" 
            data-testid="attractions-by-region"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 text-center"
              >
                <h2 
                  className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3"
                  style={{ fontFamily: "'Chillax', var(--font-sans)" }}
                >
                  Browse by Destination
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
                  Find attractions in your favorite travel destinations
                </p>
              </motion.div>

              {groupedDestinations.length > 0 ? (
                groupedDestinations.map((group) => (
                  <RegionSection 
                    key={group.region} 
                    region={group.region} 
                    destinations={group.destinations} 
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-14"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-8 h-8 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2" style={{ fontFamily: "'Chillax', var(--font-sans)" }}>
                    No destinations found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    className="rounded-full bg-gradient-to-r from-[#6443F4] to-[#8B5CF6] hover:from-[#5539d4] hover:to-[#7c4ee6] text-white text-sm px-5 shadow-lg shadow-purple-500/20"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedRegion(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </section>

          {/* FAQ Section */}
          <AttractionsFAQ />

          {/* CTA Section */}
          <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" data-testid="cta-section">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6443F4] to-[#8B5CF6]" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMzBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTYgNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-15" aria-hidden="true" />

            <div className="max-w-3xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: "'Chillax', var(--font-sans)" }}
                >
                  Ready to Explore?
                </h2>
                <p className="text-white/85 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                  Book tickets to the world's best attractions. Skip the queues 
                  and get instant confirmation.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button 
                    size="lg" 
                    className="rounded-full bg-white text-[#6443F4] hover:bg-white/95 px-7 font-semibold shadow-lg shadow-black/15 h-11"
                    onClick={() => window.open(LOCKED_AFFILIATE_LINK, "_blank", "noopener,noreferrer")}
                  >
                    <Ticket className="w-4 h-4 mr-2" aria-hidden="true" />
                    Browse All Attractions
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                  <Link href="/destinations">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="rounded-full border-2 border-white/80 text-white bg-transparent hover:bg-white/10 px-7 font-semibold h-11"
                    >
                      View Destinations
                    </Button>
                  </Link>
                </div>
                <p className="text-white/60 text-xs mt-6">
                  Powered by Tiqets • Trusted by millions of travelers
                </p>
              </motion.div>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>

      {/* Hidden SEO Navigation */}
      <nav className="sr-only" aria-label="Complete attraction destinations navigation">
        <h2>All Attraction Destinations by Region</h2>
        {REGIONS.map(region => (
          <section key={region.id}>
            <h3>{region.name} Attractions</h3>
            <ul>
              {ATTRACTION_DESTINATIONS
                .filter(d => d.region === region.name)
                .map(dest => (
                  <li key={dest.slug}>
                    <a href={`/attractions/${dest.slug}`}>
                      {dest.name} Attractions - {dest.attractionCount} things to do | 
                      Top attraction: {dest.topAttraction} in {dest.country}
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </nav>
    </>
  );
}
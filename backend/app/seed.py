import json
from sqlalchemy.orm import Session
from app.models.models import Profile, ClothingItem, Product
from app.core.security import get_password_hash
from app.core.database import SessionLocal

def seed_database(db: Session):
    # 1. Create Demo User
    demo_user = db.query(Profile).filter(Profile.email == "demo@stylesense.ai").first()
    if not demo_user:
        demo_user = Profile(
            id="demo-user-uuid-1",
            full_name="Tanshul Sharma",
            email="demo@stylesense.ai",
            hashed_password=get_password_hash("StyleSense2026!"),
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
            style_preferences=json.dumps(["Elegant", "Minimalist", "Formal", "Streetwear"]),
            favorite_colors=json.dumps(["Black", "Ivory", "Emerald", "Beige"]),
            fashion_goals=json.dumps(["Elevate daily style", "Curate capsule wardrobe", "Travel smarter"])
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    # Ensure schema is up to date
    try:
        from sqlalchemy import text
        from app.core.database import engine
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE products ADD COLUMN accessories_json TEXT DEFAULT '[]'"))
            conn.commit()
    except Exception:
        pass

    # 2. Clear and Seed Luxury Catalog
    db.query(Product).delete()
    db.commit()

    luxury_products = [
        # --- WOMEN'S WESTERN & COUTURE ---
        {
            "id": "prod-w-1",
            "name": "Italian Silk Slip Dress in Champagne",
            "description": "Cut on the bias from heavy 22mm Mulberry silk charmeuse with delicate French darting and adjustable whisper-thin straps. Studio-draped for an effortless liquid silhouette.",
            "price": 495.00,
            "category": "Dress",
            "audience": "Women",
            "gender": "women",
            "style": "Evening Minimalist",
            "color": "Champagne Gold",
            "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&auto=format&fit=crop&q=80",
            "brand": "Atelier Sense Couture",
            "rating": 4.95,
            "accessories": [
                {
                    "title": "Gianvito Rossi Ribbon Ankle-Tie Stilettos",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
                    "price": 895,
                    "reason": "Delicate metallic straps elongate the leg and complement the liquid champagne silk drape."
                },
                {
                    "title": "Bottega Veneta Mini Jodie Intrecciato Clutch",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
                    "price": 2650,
                    "reason": "Textured woven lambskin introduces tactile contrast against the ultra-smooth satin sheen."
                },
                {
                    "title": "Cartier Trinity 18K Cascading Drop Earrings",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
                    "price": 3400,
                    "reason": "Three-gold intertwining bands frame the neckline with subtle, luminous warmth."
                },
                {
                    "title": "Maison Francis Kurkdjian Baccarat Rouge 540",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
                    "price": 325,
                    "reason": "Amber floral sillage with cedar and saffron notes that mirrors evening gala opulence."
                }
            ]
        },
        {
            "id": "prod-w-2",
            "name": "Oversized Double-Breasted Wool Blazer in Charcoal",
            "description": "Precision-tailored from Super 130s English worsted wool. Features dramatic peaked lapels, sculpted roped shoulders, and custom horn buttons with interior silk lining.",
            "price": 850.00,
            "category": "Blazer",
            "audience": "Women",
            "gender": "women",
            "style": "Modern Tailoring",
            "color": "Charcoal Grey",
            "image_url": "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=900&auto=format&fit=crop&q=80",
            "brand": "The Row Editorial",
            "rating": 4.92,
            "accessories": [
                {
                    "title": "Saint Laurent Pointed-Toe Patent Leather Pumps",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
                    "price": 995,
                    "reason": "Architectural sharp toe anchors the broad masculine shoulder line with feminine precision."
                },
                {
                    "title": "The Row Margaux 15 Leather Top-Handle Bag",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
                    "price": 4390,
                    "reason": "Understated quiet luxury tote balance for power suiting and gallery openings."
                },
                {
                    "title": "Tiffany & Co. Schlumberger Diamond Clip Brooch",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
                    "price": 6200,
                    "reason": "Placed on the peak lapel to add high-jewelry light refraction to deep charcoal wool."
                },
                {
                    "title": "Byredo Gypsy Water Eau de Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
                    "price": 290,
                    "reason": "Crisp pine needle, sandalwood, and fresh lemon for refined daytime boardroom focus."
                }
            ]
        },
        {
            "id": "prod-w-3",
            "name": "Asymmetric Draped Crepe Cocktail Gown in Emerald",
            "description": "Sculptural asymmetric neckline cascading into a fluid side slit. Spun from heavy Italian silk crepe that sculpts the waist with architectural precision.",
            "price": 1150.00,
            "category": "Dress",
            "audience": "Women",
            "gender": "women",
            "style": "Haute Couture",
            "color": "Emerald Green",
            "image_url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&auto=format&fit=crop&q=80",
            "brand": "Atelier Sense Couture",
            "rating": 4.98,
            "accessories": [
                {
                    "title": "Aquazzura Crystal Bow Satin Sandals",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
                    "price": 1195,
                    "reason": "Pavé crystal bows catch flash photography and contrast deeply with emerald silk."
                },
                {
                    "title": "Judith Leiber Couture Crystal Faceted Minaudière",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
                    "price": 3995,
                    "reason": "Hand-set Austrian crystals deliver high-octane red carpet shimmer."
                },
                {
                    "title": "Bulgari Serpenti Viper Emerald & Diamond Cuff",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
                    "price": 14500,
                    "reason": "Echoes the serpent jewel tone of the gown while creating a striking wrist focal point."
                },
                {
                    "title": "Tom Ford Black Orchid Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
                    "price": 245,
                    "reason": "Seductive dark florals, black truffle, and patchouli for nighttime allure."
                }
            ]
        },
        {
            "id": "prod-w-4",
            "name": "Structured Double-Faced Cashmere Trench in Camel",
            "description": "Hand-stitched unlined double-faced Mongolian cashmere. Features horn buckle belt, epaulettes, deep storm shield, and hand-finished welt pockets.",
            "price": 1650.00,
            "category": "Trench",
            "audience": "Women",
            "gender": "women",
            "style": "Timeless Luxury",
            "color": "Camel",
            "image_url": "https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=80",
            "brand": "Atelier Sense Tailoring",
            "rating": 4.96,
            "accessories": [
                {
                    "title": "Hermès Jumping Leather Knee-High Boots",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
                    "price": 2750,
                    "reason": "Equestrian calfskin structure grounds the soft, flowing double-faced cashmere."
                },
                {
                    "title": "Celine Classic Box Bag in Tan Natural Calfskin",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
                    "price": 3850,
                    "reason": "Harmonious tonal camel leather with antiqued gold clasp for Parisian elegance."
                },
                {
                    "title": "Van Cleef & Arpels Vintage Alhambra Onyx Pendant",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
                    "price": 3100,
                    "reason": "Subtle black onyx clover pops against open collar lapels and warm beige knitwear."
                },
                {
                    "title": "Le Labo Santal 33 Eau de Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
                    "price": 320,
                    "reason": "Smoky Australian sandalwood, cardamom, and leather ideal for crisp autumn avenues."
                }
            ]
        },
        {
            "id": "prod-w-5",
            "name": "High-Waisted Pleated Silk-Wool Trousers & Crisp Poplin Shirt",
            "description": "Two-piece tailored editorial pairing. Wide-leg forward-pleat trousers in ivory virgin wool matched with a crisp 120s Egyptian cotton poplin shirt featuring exaggerated cuffs.",
            "price": 680.00,
            "category": "Top",
            "audience": "Women",
            "gender": "women",
            "style": "Modern Tailoring",
            "color": "Ivory White",
            "image_url": "https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&auto=format&fit=crop&q=80",
            "brand": "The Row Editorial",
            "rating": 4.89,
            "accessories": [
                {
                    "title": "Loro Piana Summer Charms Suede Loafers",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
                    "price": 1050,
                    "reason": "Feather-light unlined suede adds effortless, relaxed movement under wide hemlines."
                },
                {
                    "title": "Prada Cleo Brushed Leather Shoulder Bag in White",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
                    "price": 2950,
                    "reason": "Curved spazzolato leather creates crisp geometric harmony with tailored trousers."
                },
                {
                    "title": "Chaumet Bee My Love Honeycomb Gold Bangle",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
                    "price": 5400,
                    "reason": "Geometric mirror-polished gold facets elevate folded cuffs with modern sheen."
                },
                {
                    "title": "Diptyque Fleur de Peau Eau de Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
                    "price": 230,
                    "reason": "Luminescent musk and iris that leaves an intimate, clean second-skin whisper."
                }
            ]
        },
        # --- WOMEN'S LUXURY ETHNIC & INDO-WESTERN ---
        {
            "id": "prod-w-6",
            "name": "Mulberry Silk Organza Hand-Embroidered Saree",
            "description": "Featherlight pastel blush organza saree embellished with delicate zardozi scalloped borders, pearl sequins, and hand-cut gota patti motifs. Paired with a silk crepe corset blouse.",
            "price": 1250.00,
            "category": "Traditional",
            "audience": "Women",
            "gender": "women",
            "style": "Heritage Luxury",
            "color": "Rose Gold Blush",
            "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80",
            "brand": "Sabyasachi Heritage Guild",
            "rating": 4.97,
            "accessories": [
                {
                    "title": "Needledust Pearl Embroidered Juttis",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
                    "price": 240,
                    "reason": "Hand-sewn micro pearls maintain festive comfort while honoring artisan footwear heritage."
                },
                {
                    "title": "Sabyasachi Royal Bengal Tiger Minaudière",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
                    "price": 1850,
                    "reason": "Antiqued brass filigree with iconic royal tiger emblem anchors traditional opulence."
                },
                {
                    "title": "Polki Kundan Uncut Diamond & Emerald Choker",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
                    "price": 8900,
                    "reason": "High-clarity uncut syndicate polki illuminates sheer organza and collarbones."
                },
                {
                    "title": "Amouage Guidance Extrait de Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
                    "price": 380,
                    "reason": "Pear, hazelnut, and rich royal frankincense for royal festive wedding soirees."
                }
            ]
        },
        {
            "id": "prod-w-7",
            "name": "Chikankari Hand-Embroidered Georgette Anarkali in Pearl White",
            "description": "Floor-length pure viscose georgette ensemble with fine Lucknowi shadow work, mukaish metallic accents, and diaphanous sheer sleeves. Finished with a gossamer organza dupatta.",
            "price": 980.00,
            "category": "Traditional",
            "audience": "Women",
            "gender": "women",
            "style": "Artisanal Luxury",
            "color": "Pearl White",
            "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&auto=format&fit=crop&q=80",
            "brand": "Tarun Tahiliani Atelier",
            "rating": 4.94,
            "accessories": [
                {
                    "title": "Christian Louboutin Follies Strass Mesh Pumps",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
                    "price": 1295,
                    "reason": "Glittering crystal dégradé mesh echoes fine mukaish metallic embroidery."
                },
                {
                    "title": "Marzook Orb Metallic Pearl Plexiglass Clutch",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
                    "price": 1450,
                    "reason": "Spherical architectural mother-of-pearl capsule gives heritage silhouette modern poise."
                },
                {
                    "title": "Meenakari Basra Pearl Chandbali Earrings",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
                    "price": 4600,
                    "reason": "Crescent pearl tassels frame the jawline with timeless Mughal grace."
                },
                {
                    "title": "Kilian Love, Don't Be Shy Extreme Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
                    "price": 335,
                    "reason": "Orange blossom, marshmallow, and rose petals for an intoxicating romantic aura."
                }
            ]
        },

        # --- MEN'S WESTERN & MODERN TAILORING ---
        {
            "id": "prod-m-1",
            "name": "Savile Row Cut Wool Tuxedo Jacket in Midnight Navy",
            "description": "Precision-tailored single-button dinner jacket crafted from Super 150s English wool with black grosgrain silk shawl lapels, jetted pockets, and handcrafted horn buttons.",
            "price": 1450.00,
            "category": "Formal",
            "audience": "Men",
            "gender": "men",
            "style": "Black Tie Savile Row",
            "color": "Midnight Navy",
            "image_url": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80",
            "brand": "Kingsman & Sons",
            "rating": 4.96,
            "accessories": [
                {
                    "title": "Church's Shannon Polished Patent Oxford Shoes",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
                    "price": 1100,
                    "reason": "Mirror-finish black wholecut oxfords meet strict Black Tie white-carpet codes."
                },
                {
                    "title": "Montblanc Meisterstück Leather Tuxedo Card Wallet",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
                    "price": 380,
                    "reason": "Ultra-slim calfskin profile slips into jacket breast pocket without disrupting silhouette."
                },
                {
                    "title": "Cartier Santos 18K White Gold & Onyx Cufflinks",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80",
                    "price": 4250,
                    "reason": "Screw-motif architectural cufflinks add masculine distinction to French poplin cuffs."
                },
                {
                    "title": "Tom Ford Oud Wood Eau de Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
                    "price": 295,
                    "reason": "Rare oud, rosewood, and cardamom create an aura of commanding confidence."
                }
            ]
        },
        {
            "id": "prod-m-2",
            "name": "Italian Linen Structured Blazer in Sand",
            "description": "Neapolitan soft-shoulder tailoring in heavy 380g Solbiati Irish linen. Unlined quarter-back construction with patch pockets, double rear vents, and mother-of-pearl buttons.",
            "price": 780.00,
            "category": "Blazer",
            "audience": "Men",
            "gender": "men",
            "style": "Riviera Tailoring",
            "color": "Sand Beige",
            "image_url": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&auto=format&fit=crop&q=80",
            "brand": "Atelier Sense Tailoring",
            "rating": 4.88,
            "accessories": [
                {
                    "title": "Loro Piana Open Walk Suede Ankle Boots",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
                    "price": 1150,
                    "reason": "Supple calf suede with water-repellent finish for coastal strolls and yacht decks."
                },
                {
                    "title": "Bottega Veneta Intrecciato Leather Document Folio",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
                    "price": 1850,
                    "reason": "Caramel hand-woven leather provides artisanal grounding to crisp linen texture."
                },
                {
                    "title": "IWC Portugieser Chronograph Rose Gold Timepiece",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
                    "price": 18400,
                    "reason": "Silver-plated dial and alligator strap complement warm neutral tailoring."
                },
                {
                    "title": "Acqua di Parma Colonia Essenza",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
                    "price": 215,
                    "reason": "Sun-drenched Calabrian bergamot, rosemary, and vetiver capturing the Italian Riviera."
                }
            ]
        },
        {
            "id": "prod-m-3",
            "name": "Minimalist Double-Breasted Cashmere Overcoat in Navy",
            "description": "Floor-skimming tailored overcoat cut from pure 620gsm Zegna cashmere. Features broad peaked lapels, deep horn buttons, and handcrafted interior chest passport holster.",
            "price": 1890.00,
            "category": "Trench",
            "audience": "Men",
            "gender": "men",
            "style": "Modern Minimalist",
            "color": "Deep Navy",
            "image_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
            "brand": "The Row Menswear",
            "rating": 4.97,
            "accessories": [
                {
                    "title": "Berluti Alessandro Demesure Leather Oxfords",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
                    "price": 2420,
                    "reason": "Iconic patina calfskin wholecut design adds unmatched aristocratic polish."
                },
                {
                    "title": "Valextra Premier Leather Flap Briefcase",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
                    "price": 3600,
                    "reason": "Architectural Costa lacquered edges and grained leather for executive presence."
                },
                {
                    "title": "Breguet Classique 18K White Gold Dress Watch",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
                    "price": 19800,
                    "reason": "Guilloché dial with blue Breguet hands peeking under cashmere overcoat cuffs."
                },
                {
                    "title": "Creed Green Irish Tweed Millésime",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
                    "price": 495,
                    "reason": "Equestrian countryside freshness with French verbena, violet leaves, and ambergris."
                }
            ]
        },
        {
            "id": "prod-m-4",
            "name": "Fine Knit Merino Polo with Tailored Chinos in Bone",
            "description": "30-gauge extra-fine Australian merino wool knit polo paired with single-pleat stretch-cotton cavalry twill trousers. Effortless tonal quiet-luxury ensemble.",
            "price": 540.00,
            "category": "Top",
            "audience": "Men",
            "gender": "men",
            "style": "Quiet Luxury Casual",
            "color": "Bone Ivory",
            "image_url": "https://images.unsplash.com/photo-1618886614638-80e3c1569a79?w=900&auto=format&fit=crop&q=80",
            "brand": "Brunello Cucinelli Edit",
            "rating": 4.86,
            "accessories": [
                {
                    "title": "Common Projects Achilles Low White Leather Sneakers",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
                    "price": 440,
                    "reason": "Gold foil stamp and clean minimalist lines for an elevated weekend uniform."
                },
                {
                    "title": "Brunello Cucinelli Suede Weekender Duffle",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
                    "price": 4100,
                    "reason": "Plush tobacco suede delivers Solomeo artisan craftsmanship on short getaways."
                },
                {
                    "title": "Jacques Marie Mage Dealan Sunglasses in Amber",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
                    "price": 820,
                    "reason": "10mm cured cellulose acetate with custom precious metal hardware."
                },
                {
                    "title": "Maison Margiela REPLICA Jazz Club",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
                    "price": 165,
                    "reason": "Warm rum absolute, tobacco leaf, and pink pepper for fireside evenings."
                }
            ]
        },
        # --- MEN'S LUXURY ETHNIC & HERITAGE ---
        {
            "id": "prod-m-5",
            "name": "Raw Silk Bandhgala Jacket with Antiqued Gold Buttons in Noir",
            "description": "Structured high-collar royal Bandhgala handcrafted in 100% handspun Bhagalpur raw silk. Features bespoke hand-cast lion motif buttons, structured chest padding, and silk lining.",
            "price": 1190.00,
            "category": "Traditional",
            "audience": "Men",
            "gender": "men",
            "style": "Heritage Aristocracy",
            "color": "Noir Black",
            "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
            "brand": "Raghavendra Rathore Jodhpur",
            "rating": 4.95,
            "accessories": [
                {
                    "title": "Custom Patent Leather Monogram Jodhpur Slippers",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
                    "price": 680,
                    "reason": "Tapered velvet-lined dress slippers complement the crisp structured trouser break."
                },
                {
                    "title": "Goyard Saint Louis GM Noir Leather Pouch",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
                    "price": 1950,
                    "reason": "Monogrammed Goyardine canvas provides discreet royal travel distinction."
                },
                {
                    "title": "Polki Emerald & Gold Pocket Watch Chain",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80",
                    "price": 5200,
                    "reason": "Suspended from the second buttonhole down into the breast pocket for regal poise."
                },
                {
                    "title": "Roja Parfums Amber Aoud Crystal Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
                    "price": 795,
                    "reason": "Rich amber, cinnamon, saffron, and oud evoking opulent royal darbars."
                }
            ]
        },
        {
            "id": "prod-m-6",
            "name": "Handspun Chanderi Silk Angrakha Kurta Set in Ivory & Gilded Ochre",
            "description": "Overlapping bias-cut Angrakha silhouette in featherweight handwoven Chanderi silk with zari side ties, paired with tapered churidar trousers and a gilded banarasi stole.",
            "price": 890.00,
            "category": "Traditional",
            "audience": "Men",
            "gender": "men",
            "style": "Heritage Luxury",
            "color": "Ivory & Gilded Ochre",
            "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
            "brand": "Sabyasachi Menswear Guild",
            "rating": 4.93,
            "accessories": [
                {
                    "title": "Handcrafted Zari Embroidered Nagra Mojaris",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
                    "price": 290,
                    "reason": "Traditional upturned toe crafted in soft goat leather with genuine gold thread."
                },
                {
                    "title": "Maison Goyard Leather Grooming Case",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
                    "price": 2400,
                    "reason": "Classic luggage trunk details preserving festive essentials on destination weddings."
                },
                {
                    "title": "Basra Pearl 3-Row Royal Kantha Necklace",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
                    "price": 6800,
                    "reason": "Natural unblemished pearls drape across the chest to honor wedding traditions."
                },
                {
                    "title": "Penhaligon's Halfeti Eau de Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
                    "price": 310,
                    "reason": "Black rose, spiced grapefruit, and cardamom for magnificent festive presence."
                }
            ]
        }
    ]

    db_products = []
    for item in luxury_products:
        p_obj = Product(
            id=item["id"],
            name=item["name"],
            description=item["description"],
            price=item["price"],
            category=item["category"],
            audience=item["audience"],
            gender=item["gender"],
            style=item["style"],
            color=item["color"],
            image_url=item["image_url"],
            brand=item["brand"],
            rating=item["rating"],
            accessories_json=json.dumps(item.get("accessories", [])),
            sellers_json=json.dumps([
                {
                    "id": f"seller-flagship-{item['id']}",
                    "name": "Atelier Sense Flagship",
                    "hub": "New York Express Hub",
                    "location": "New York, NY",
                    "standard_days": 3,
                    "standard_price": 0.0,
                    "express_days": 1,
                    "express_price": 25.0,
                    "rating": 4.9,
                    "is_in_stock": True,
                    "dispatch_time": "Same-Day Dispatch (Order before 4 PM EST)"
                },
                {
                    "id": f"seller-milan-{item['id']}",
                    "name": "Milan Haute Logistics",
                    "hub": "Milan Malpensa Cargo",
                    "location": "Milan, Italy",
                    "standard_days": 5,
                    "standard_price": 0.0,
                    "express_days": 2,
                    "express_price": 40.0,
                    "rating": 4.8,
                    "is_in_stock": True,
                    "dispatch_time": "Next-Day Air Dispatch"
                },
                {
                    "id": f"seller-local-{item['id']}",
                    "name": "Artisan Guild Partner Hub",
                    "hub": "Regional Fulfillment Center",
                    "location": "Local Dispatch Center",
                    "standard_days": 2,
                    "standard_price": 0.0,
                    "express_days": 1,
                    "express_price": 18.0,
                    "rating": 4.7,
                    "is_in_stock": True,
                    "dispatch_time": "Instant 24h Courier Dispatch"
                }
            ])
        )
        db_products.append(p_obj)

    db.add_all(db_products)
    db.commit()
    print(f"Database successfully re-seeded with {len(db_products)} ultra-luxury US standard products & accessories!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

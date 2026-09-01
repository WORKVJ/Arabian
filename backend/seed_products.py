import os
import sys
import django
import shutil
from pathlib import Path

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
sys.path.append(str(Path(__file__).resolve().parent))
django.setup()

from apps.products.models import Media, Document, ProductCategory, Product, ProductImage, ProductSpecification
from apps.industries.models import Industry

def seed():
    print("Starting product database seed...")
    
    # 1. Define folders
    src_public = Path("../frontend/public")
    src_products = Path("../frontend/public/img/products")
    dest_dir = Path("media/uploads/2026/08")
    os.makedirs(dest_dir, exist_ok=True)
    
    # Base files to copy from public
    base_files = [
        "product-steel-grating.jpg",
        "product-frp-grating.jpg",
        "product-ss-grating.jpg",
        "product-aluminium-grating.jpg",
        "product-manhole-cover.jpg",
        "product-grating-clamp.jpg",
        "product-step-iron.jpg",
        "product-tactile-stud.jpg",
        "facility-overview.jpg",
        "hero-industrial.jpg",
        "hero-grp.jpg",
        "hero-steel.jpg",
        "hero-aluminium.jpg",
        "industry-oilgas.jpg",
        "project-marine.jpg",
        "project-refinery.jpg",
        "cta-factory.jpg"
    ]
    
    # Product specific files to copy from public/img/products
    product_files = [
        "prod-molded-gratings.jpg",
        "prod-pultruded-gratings.jpg",
        "prod-pultruded-handrails.jpg",
        "prod-pultruded-ladders.jpg",
        "prod-cable-trays.jpg",
        "prod-platform-structures.jpg",
        "prod-grp-manhole-covers.jpg",
        "prod-grp-sheets.jpg",
        "prod-electro-forged.jpg",
        "prod-press-lock.jpg",
        "prod-heavy-duty.jpg",
        "prod-trench-gratings.jpg",
        "prod-stair-treads.jpg",
        "prod-ss-gratings.jpg",
        "prod-ss-floor-drains.jpg",
        "prod-ss-ladders.jpg",
        "prod-ablution-gratings.jpg",
        "prod-landscape-aluminium.jpg",
        "prod-aluminium-handrail.jpg",
        "prod-aluminium-cage-ladder.jpg",
        "prod-roof-hatch-covers.jpg",
        "prod-aluminium-roof-walkway.jpg",
        "prod-aluminium-ss-gratings.jpg",
        "prod-aluminium-gratings-standard.jpg",
        "prod-heel-proof-grating.jpg",
        "prod-ductile-iron.jpg",
        "prod-sg-iron-white-ductile.jpg", # fallback if needed
        "prod-sg-iron-ductile.jpg",
        "prod-channel-gully-grating.jpg",
        "prod-carriageway-cover.jpg",
        "prod-ss-gi-clamps.jpg",
        "prod-pvc-gi-ss-step-iron.jpg",
        "prod-shear-connector.jpg"
    ]
    
    media_objs = {}
    
    # Copy base files
    for filename in base_files:
        src_path = src_public / filename
        dest_path = dest_dir / filename
        if src_path.exists():
            shutil.copy(src_path, dest_path)
            relative_db_path = f"uploads/2026/08/{filename}"
            media, created = Media.objects.get_or_create(
                file=relative_db_path,
                defaults={
                    "title": filename.split('.')[0].replace('-', ' ').title(),
                    "alt_text": f"Arabian Gratings {filename.split('.')[0].replace('-', ' ')}",
                    "caption": f"Arabian Gratings {filename.split('.')[0].replace('-', ' ')} product"
                }
            )
            media_objs[filename] = media
            print(f"Registered base media: {filename}")
        else:
            print(f"Warning: Base image {src_path} not found.")

    # Copy product specific files
    for filename in product_files:
        src_path = src_products / filename
        dest_path = dest_dir / filename
        if src_path.exists():
            shutil.copy(src_path, dest_path)
            relative_db_path = f"uploads/2026/08/{filename}"
            media, created = Media.objects.get_or_create(
                file=relative_db_path,
                defaults={
                    "title": filename.split('.')[0].replace('-', ' ').title(),
                    "alt_text": f"Arabian Gratings {filename.split('.')[0].replace('-', ' ')}",
                    "caption": f"Arabian Gratings {filename.split('.')[0].replace('-', ' ')} product"
                }
            )
            media_objs[filename] = media
            print(f"Registered product media: {filename}")
        else:
            print(f"Warning: Product image {src_path} not found.")

    default_media = list(media_objs.values())[0] if media_objs else None

    # Clean existing data
    ProductSpecification.objects.all().delete()
    ProductImage.objects.all().delete()
    Product.objects.all().delete()
    ProductCategory.objects.all().delete()

    # 2. Categories
    categories_data = [
        {"name": "FRP/GRP Products",     "slug": "frp-grp-products",     "short": "Corrosion-resistant fiberglass reinforced plastic floor grids and structural products for extreme chemical environments.", "img": "product-frp-grating.jpg",      "count": 8},
        {"name": "Steel Gratings",        "slug": "steel-gratings",        "short": "Heavy-duty electroforge welded carbon steel floor gratings galvanized for extreme load spans.",                           "img": "product-steel-grating.jpg",    "count": 5},
        {"name": "Stainless Steel Products","slug": "stainless-steel-products","short": "Premium hygiene-safe SS304/SS316 grating panels for food processing and marine decks.",                              "img": "product-ss-grating.jpg",       "count": 4},
        {"name": "Aluminium",             "slug": "aluminium",             "short": "Lightweight, non-sparking walkways, access grates, handrails, ladders, and stair steps.",                                "img": "product-aluminium-grating.jpg","count": 8},
        {"name": "Manhole",               "slug": "manhole",               "short": "Ductile iron and GRP heavy-load manhole access covers for roads and infrastructure.",                                    "img": "product-manhole-cover.jpg",    "count": 4},
        {"name": "SS/GI Grating Clamps",  "slug": "ss-gi-grating-clamps",  "short": "Durable, quick, and easy-to-use grating clamps for cost-efficient and reliable clamping.",                              "img": "product-grating-clamp.jpg",    "count": 1},
        {"name": "Step Iron",             "slug": "step-iron",             "short": "Ductile iron step irons, hot-dip galvanized to BS EN ISO 1461, with anti-slip secure designs.",                         "img": "product-step-iron.jpg",        "count": 1},
        {"name": "Stud Products",         "slug": "stud-products",         "short": "Industry-leading shear studs and tactile studs for structural and pedestrian safety applications.",                      "img": "product-tactile-stud.jpg",     "count": 1},
    ]

    cat_objs = {}
    for idx, c in enumerate(categories_data):
        cat = ProductCategory.objects.create(
            name=c["name"], slug=c["slug"],
            short_description=c["short"],
            description=f"Arabian Gratings {c['name']} range: complete supply across Saudi Arabia and GCC region.",
            image=media_objs.get(c["img"], default_media),
            sort_order=idx, is_active=True
        )
        cat_objs[c["slug"]] = cat
        print(f"Created category: {cat.name}")

    # 3. Products data
    products_data = [
        # ── FRP/GRP Products ──────────────────────────────────────────────────
        {
            "category": "frp-grp-products", "sort": 0, "featured": True,
            "name": "Molded Gratings", "slug": "molded-gratings", "code": "AG-GRP-MLD",
            "short": "Made with pre-tensioned glass fibers and chemical-resistant polyester for durable, one-piece interwoven structures.",
            "desc": "Arabian Gratings Moulded GRP gratings are one-piece bi-directional grid panels manufactured by weaving rovings under tension and saturating with chemical-resistant resin. Panels up to 1200×3660mm with mesh pitches from 25mm to 50mm.",
            "material": "Fiberglass Reinforced Plastic (GRP)", "finish": "Gritted Anti-Slip Surface", "standard": "ASTM E84, BS 476 Class 1",
            "applications": "Desalination Plants, Chemical Processing, Marine Access Walks, Refinery Drainage",
            "features": "100% Corrosion immune\nNon-conductive electrical safety\nFire retardant resin chemistry\nHigh strength-to-weight ratio\nBi-directional equal strength",
            "specs": [
                {"name": "Mesh Pitch", "value": "25×25 / 38×38 / 50×50 mm"},
                {"name": "Panel Height", "value": "25 / 38 / 50 mm"},
                {"name": "Open Area", "value": "68% open flow"},
                {"name": "Resin Type", "value": "Isophthalic Polyester / Vinyl Ester"},
                {"name": "Max Panel Size", "value": "1200 × 3660 mm"},
            ],
            "faqs": [
                {"question": "What is the primary benefit of Moulded GRP over steel grating?", "answer": "GRP grating offers complete immunity to chemical corrosion, requires zero maintenance or painting, and is lightweight for easy manual handling during installation."},
                {"question": "Is GRP grating fire-retardant?", "answer": "Yes, our GRP gratings incorporate flame retardant additives yielding ASTM E84 class 1 fire safety classification."},
            ],
            "img": "prod-molded-gratings.jpg",
        },
        {
            "category": "frp-grp-products", "sort": 1, "featured": True,
            "name": "Pultruded Gratings", "slug": "pultruded-gratings", "code": "AG-GRP-PLT",
            "short": "FRP/GRP gratings with I/T-shaped bars, isophthalic or vinyl ester resins, mechanically assembled for heavy-duty applications.",
            "desc": "Pultruded gratings are manufactured using a continuous pultrusion process where glass rovings, mats, and fabrics are impregnated with resin and pulled through a heated die. This produces consistent, high-strength bars that are mechanically assembled into grating panels.",
            "material": "Pultruded Fiberglass (GRP)", "finish": "Smooth or Gritted Surface", "standard": "ISO 14122, EN 13706",
            "applications": "Offshore Platforms, Chemical Plants, Food Processing, Water Treatment",
            "features": "Superior longitudinal strength\nDimensionally precise profiles\nNon-conductive properties\nUV stabilized resin systems\nCustomizable mesh configurations",
            "specs": [
                {"name": "Bar Profile", "value": "I-Bar / T-Bar"},
                {"name": "Bar Pitch", "value": "40 mm standard"},
                {"name": "Panel Height", "value": "30 / 40 / 60 mm"},
                {"name": "Resin System", "value": "Isophthalic Polyester / Vinyl Ester"},
            ],
            "faqs": [
                {"question": "What is the difference between moulded and pultruded GRP gratings?", "answer": "Moulded gratings have equal strength in both directions while pultruded gratings have higher strength along the bar direction, making them suited for longer spans."},
            ],
            "img": "prod-pultruded-gratings.jpg",
        },
        {
            "category": "frp-grp-products", "sort": 2, "featured": False,
            "name": "Pultruded Handrails", "slug": "pultruded-handrails", "code": "AG-GRP-HDR",
            "short": "Pultruded handrails with 70% fiberglass, ensure exceptional strength and durability, ideal for industrial and mechanical applications.",
            "desc": "Arabian Gratings pultruded handrail systems are engineered with 70% fiberglass content, delivering structural performance that rivals steel at a fraction of the weight. Full system packages include top rails, mid rails, kick plates, and posts in round and square profiles.",
            "material": "70% Fiberglass Reinforced Polymer", "finish": "UV Resistant Gel Coat", "standard": "OSHA 29 CFR 1910.23",
            "applications": "Industrial Platforms, Offshore Walkways, Chemical Plants, Public Access Areas",
            "features": "70% glass fiber reinforcement\nLightweight modular system\nNo painting or maintenance required\nChemical and UV resistant\nFull system supply including hardware",
            "specs": [
                {"name": "Profile Shape", "value": "Round Tube / Square Tube"},
                {"name": "Top Rail Height", "value": "1050 mm (standard)"},
                {"name": "Mid Rail Height", "value": "525 mm"},
                {"name": "Kick Plate Height", "value": "100 mm"},
            ],
            "faqs": [
                {"question": "Are GRP handrails electrically safe?", "answer": "Yes, GRP is a non-conductive material, making pultruded handrails ideal for electrical substations and live equipment platforms."},
            ],
            "img": "prod-pultruded-handrails.jpg",
        },
        {
            "category": "frp-grp-products", "sort": 3, "featured": False,
            "name": "Pultruded Ladders", "slug": "pultruded-ladders", "code": "AG-GRP-LAD",
            "short": "Durable ladders with isophthalic resin profiles, ideal for fixed vertical use in corrosive environments.",
            "desc": "Our pultruded GRP ladders are engineered for permanent fixed vertical access in corrosive environments where steel or aluminium would suffer rapid deterioration. Available in single-width and double-width configurations with anti-slip rung covers and optional safety cages.",
            "material": "Pultruded GRP / Fiberglass", "finish": "Gritted Anti-Slip Rungs", "standard": "ANSI A14.5, EN ISO 14122-4",
            "applications": "Refineries, Marine Vessels, Chemical Plants, Utility Chambers",
            "features": "Chemical immune GRP structure\nAnti-slip rung surfaces\nSafety cage compatible\nNo corrosion or maintenance\nMeets EN ISO 14122-4 standard",
            "specs": [
                {"name": "Rung Diameter", "value": "35 mm (round pultruded tube)"},
                {"name": "Side Rail Width", "value": "450 mm inside clearance"},
                {"name": "Rung Spacing", "value": "300 mm center-to-center"},
            ],
            "faqs": [
                {"question": "Can pultruded ladders be used outdoors?", "answer": "Yes, our UV-stabilized gel coat finish protects the fiberglass from UV degradation, making them fully suitable for outdoor permanent installation."},
            ],
            "img": "prod-pultruded-ladders.jpg",
        },
        {
            "category": "frp-grp-products", "sort": 4, "featured": False,
            "name": "Cable Trays / Cable Ladders", "slug": "cable-trays-cable-ladders", "code": "AG-GRP-CBL",
            "short": "Built to NEMA FG-1, IEC 61537, ASTM, and UL standards for unmatched cable management durability and safety.",
            "desc": "Arabian Gratings GRP cable management systems provide a lightweight, strong, non-conductive, and corrosion-free alternative to steel cable trays. Our range includes ventilated cable trays, solid-bottom trays, cable ladders, and wire mesh trays in standard and custom sizes.",
            "material": "Fiberglass Reinforced Plastic (GRP)", "finish": "Smooth Gel Coat / UV Stabilized", "standard": "NEMA FG-1, IEC 61537",
            "applications": "Petrochemical Plants, Data Centres, Marine Electrical Systems, Power Distribution",
            "features": "Non-conductive electrical safety\nCorrosion-free in all environments\nLightweight for easy installation\nUL listed grades available\nCustom lengths and widths",
            "specs": [
                {"name": "Width Range", "value": "100 mm to 900 mm"},
                {"name": "Depth Range", "value": "50 mm to 150 mm"},
                {"name": "Standard Length", "value": "3000 mm per section"},
            ],
            "faqs": [
                {"question": "What is the fire rating of GRP cable trays?", "answer": "Our GRP cable trays carry NEMA FG-1 flame retardant classification and optional Halogen-Free grades for marine and tunnel applications."},
            ],
            "img": "prod-cable-trays.jpg",
        },
        {
            "category": "frp-grp-products", "sort": 5, "featured": False,
            "name": "Platforms / Structures", "slug": "platform-structures", "code": "AG-GRP-PLTSTR",
            "short": "High strength, corrosion resistant GRP platforms with anti-slip surface, chemical resistance, and easy installation.",
            "desc": "Complete GRP platform systems engineered and fabricated to project-specific requirements. Our platforms integrate moulded gratings, pultruded structural members, handrail systems, and stair units into a single corrosion-free access structure.",
            "material": "Glass Reinforced Plastic (GRP)", "finish": "Anti-Slip Grit Finish", "standard": "BS EN 13706, ISO 14122",
            "applications": "Offshore Platforms, Chemical Access Walkways, Water Treatment Plants, Industrial Mezzanines",
            "features": "Complete turnkey platform packages\nCorrosion-free design life 25+ years\nLightweight modular components\nAnti-slip grating surfaces\nCustom engineered to site drawings",
            "specs": [
                {"name": "Design Standard", "value": "ISO 14122 / BS EN 13706"},
                {"name": "Live Load Rating", "value": "2.5 kN/m² (pedestrian) to 7.5 kN/m² (industrial)"},
                {"name": "Grating Type", "value": "Moulded GRP 38×38mm mesh"},
            ],
            "faqs": [
                {"question": "Can GRP platforms replace ageing steel platforms?", "answer": "Yes, GRP platforms are ideal replacements for steel platforms in corrosive environments as they can be lifted into place without crane access using lightweight modular sections."},
            ],
            "img": "prod-platform-structures.jpg",
        },
        {
            "category": "frp-grp-products", "sort": 6, "featured": False,
            "name": "GRP / FRP Manhole Covers", "slug": "grp-frp-manhole-covers", "code": "AG-GRP-MHC",
            "short": "Durable, reliable GRP/FRP manhole covers with decades of proven performance and trusted quality.",
            "desc": "Arabian Gratings GRP manhole covers offer significant weight advantages over ductile iron alternatives while providing Class B125 and D400 load ratings. The lightweight nature makes single-person handling possible, reducing installation costs and injury risks.",
            "material": "Glass Reinforced Plastic (GRP)", "finish": "Smooth Top / Chequered Surface", "standard": "BS EN 124, Class B125 / D400",
            "applications": "Roads, Municipal Infrastructure, Industrial Sites, Utility Access Points",
            "features": "Lightweight single-person handling\nClass B125 to D400 load ratings\nElectrical non-conductivity\nNo corrosion or maintenance\nCustom inlay labels available",
            "specs": [
                {"name": "Clear Opening", "value": "450 mm to 900 mm diameter"},
                {"name": "Load Class", "value": "B125 / C250 / D400"},
                {"name": "Weight", "value": "Approx. 15 kg (600mm B125)"},
            ],
            "faqs": [
                {"question": "Are GRP manhole covers suitable for road traffic?", "answer": "Yes, our D400 rated GRP covers are tested to 400 kN proof load, making them suitable for carriageway applications."},
            ],
            "img": "prod-grp-manhole-covers.jpg",
        },
        {
            "category": "frp-grp-products", "sort": 7, "featured": False,
            "name": "GRP / FRP Sheets", "slug": "grp-frp-sheets", "code": "AG-GRP-SHT",
            "short": "Pioneers in GRP, we provide customized GRP/FRP sheets to meet diverse construction and application needs.",
            "desc": "Our GRP/FRP flat and corrugated sheets are produced using hand layup, spray-up, or continuous lamination processes. Applications range from roofing and cladding panels to chemical containment tank liners. Custom widths, lengths, colors, and gel coat finishes available.",
            "material": "Glass Reinforced Plastic Laminate", "finish": "Smooth or Corrugated", "standard": "ASTM D256, BS 2782",
            "applications": "Roofing, Cladding, Tank Lining, Walkway Decking, Architectural Panels",
            "features": "Customizable thickness and color\nTranslucent options available\nUV resistant gel coat surface\nExcellent impact strength\nFire retardant grades available",
            "specs": [
                {"name": "Thickness Range", "value": "3 mm to 25 mm"},
                {"name": "Standard Width", "value": "1200 mm / 1500 mm"},
                {"name": "Resin", "value": "Polyester / Vinyl Ester / Epoxy"},
            ],
            "faqs": [
                {"question": "Can GRP sheets be used for chemical tank linings?", "answer": "Yes, vinyl ester resin GRP sheets provide exceptional resistance to concentrated acids, alkalis, and solvents for tank lining applications."},
            ],
            "img": "prod-grp-sheets.jpg",
        },

        # ── Steel Gratings ─────────────────────────────────────────────────────
        {
            "category": "steel-gratings", "sort": 0, "featured": True,
            "name": "Electro Forged Type Gratings", "slug": "electro-forged-type-gratings", "code": "AG-STL-ELF",
            "short": "Electro forged gratings are durable and strong steel bars welded together using high current and pressure for lasting performance.",
            "desc": "Arabian Gratings Electroforged Steel Grating is fabricated using high-strength carbon steel structural bars electrically fused with cross rods under heavy hydraulic pressure. All panels are hot-dip galvanized to ISO 1461, ensuring minimum 85 microns of zinc protection.",
            "material": "ASTM A36 Carbon Steel", "finish": "Hot-Dip Galvanized to ISO 1461", "standard": "BS 4592 Part 1, ANSI/NAAMM MBG531",
            "applications": "Industrial Platforms, Power Plant Walkways, Cargo Loading Docks, Drainage Trenches",
            "features": "High load span deflection stiffness\nUniform hot-dip zinc protection\nSlip-resistant serrated bar option\nCNC precision edge banding\nSingle-piece rigid grid",
            "specs": [
                {"name": "Bearing Bar Size", "value": "30×3 mm (up to 65×8 mm)"},
                {"name": "Bearing Bar Pitch", "value": "30 / 34 / 40 mm"},
                {"name": "Cross Rod Pitch", "value": "50 / 100 mm"},
                {"name": "Galvanizing Depth", "value": "Min. 85 microns (ISO 1461)"},
                {"name": "Max Panel Size", "value": "1000 × 6000 mm"},
            ],
            "faqs": [
                {"question": "What standard governs the hot-dip galvanizing?", "answer": "All carbon steel gratings are hot-dip galvanized in compliance with BS EN ISO 1461, ensuring minimum 85 microns of zinc for marine corrosion safety."},
                {"question": "Are custom circular cutouts available?", "answer": "Yes, we custom-cut and weld banded edges for circular penetrations, pipe notches, and custom angle cuts based on client shop layouts."},
            ],
            "img": "prod-electro-forged.jpg",
        },
        {
            "category": "steel-gratings", "sort": 1, "featured": True,
            "name": "Press Lock Type Gratings", "slug": "press-lock-type-gratings", "code": "AG-STL-PRL",
            "short": "Press lock gratings are interlocked steel bars, made under high pressure, ensuring strength and versatility.",
            "desc": "Press Lock gratings feature flat bars pressed into cross bars under high pressure to create a permanently locked, non-welded joint. This produces a smooth top surface ideal for architectural applications, with excellent load distribution and a clean aesthetic finish.",
            "material": "Carbon Steel / Stainless Steel", "finish": "Hot-Dip Galvanized / Plain", "standard": "BS 4592, DIN 24537",
            "applications": "Architectural Screens, Ventilation Covers, Access Floors, Platform Decking",
            "features": "Smooth flat top surface\nNo welding — mechanical lock joint\nAvailable in carbon or SS316\nClean architectural aesthetic\nConsistent dimensional tolerances",
            "specs": [
                {"name": "Bearing Bar Size", "value": "30×3 mm (flat bar)"},
                {"name": "Cross Bar Size", "value": "5×3 mm (flat bar)"},
                {"name": "Pitch", "value": "30×50 mm standard"},
                {"name": "Surface", "value": "Flat smooth top"},
            ],
            "faqs": [
                {"question": "What is the load capacity of press lock gratings?", "answer": "Press lock gratings suit pedestrian and light maintenance loads (Class B125). For heavier industrial use, electro-forged or heavy-duty gratings are recommended."},
            ],
            "img": "prod-press-lock.jpg",
        },
        {
            "category": "steel-gratings", "sort": 2, "featured": False,
            "name": "Heavy Duty Gratings", "slug": "heavy-duty-gratings", "code": "AG-STL-HVD",
            "short": "Manually welded steel gratings are built to withstand heavy loads, ideal for highways, plant floors, and airports.",
            "desc": "Arabian Gratings Heavy Duty Gratings are manufactured from high-strength carbon steel with larger bearing bar cross-sections to handle extreme wheel loads from forklifts, trucks, and aircraft. Available with serrated or plain top surfaces.",
            "material": "High-Strength Carbon Steel", "finish": "Hot-Dip Galvanized to BS EN ISO 1461", "standard": "BS EN 14122-2, EN 1337",
            "applications": "Highways, Airports, Plant Floors, Heavy Industrial Access, Vehicle Loading Bays",
            "features": "Heavy wheel load capacity\nLarge bearing bar cross-sections\nSerrated or plain top surface\nBanded edge for clean finish\nISO 1461 galvanized protection",
            "specs": [
                {"name": "Bearing Bar Size", "value": "50×5 mm (up to 100×10 mm)"},
                {"name": "Cross Rod Pitch", "value": "50 / 100 mm"},
                {"name": "Load Class", "value": "E600 / F900 heavy duty"},
                {"name": "Finish", "value": "Hot-Dip Galvanized (ISO 1461)"},
            ],
            "faqs": [
                {"question": "Can heavy duty gratings withstand forklift loads?", "answer": "Yes, our heavy duty gratings are engineered for Class E600 and F900 loads, comfortably supporting forklift and truck wheel loads in industrial applications."},
            ],
            "img": "prod-heavy-duty.jpg",
        },
        {
            "category": "steel-gratings", "sort": 3, "featured": False,
            "name": "Trench & Custom-Made Gratings", "slug": "trench-custom-made-gratings", "code": "AG-STL-TRN",
            "short": "Tailored grating solutions made to meet specific project requirements, ensuring functionality and application-based customization.",
            "desc": "Our custom fabrication service produces grating panels to exact project drawings, including complex shapes with circular cutouts, angled edges, recessed frames, and special bar spacings. Trench grating systems are available with load-class rated frames for flush or raised installation.",
            "material": "ASTM A36 Carbon Steel / SS316", "finish": "Galvanized / Painted / Plain", "standard": "BS 4592, Client Specification",
            "applications": "Drainage Trenches, Utility Ducts, Bespoke Platform Systems, Custom Access Floors",
            "features": "Custom shapes and cutouts\nProject-specific bar spacings\nLoad-class rated frame systems\nFlush or raised installation\nFull shop drawing service",
            "specs": [
                {"name": "Channel Width", "value": "100 mm to 1200 mm"},
                {"name": "Frame Material", "value": "Galvanized Steel / Stainless Steel"},
                {"name": "Load Rating", "value": "B125 to E600"},
            ],
            "faqs": [
                {"question": "Can you fabricate grating to non-standard shapes?", "answer": "Yes, our CNC precision fabrication service accommodates any custom shape including L-shaped, T-shaped, circular, and polygonal panels to client drawings."},
            ],
            "img": "prod-trench-gratings.jpg",
        },
        {
            "category": "steel-gratings", "sort": 4, "featured": False,
            "name": "Stair Treads", "slug": "stair-treads", "code": "AG-STL-STR",
            "short": "Durable steel stair treads with anti-slip nosing and end plates for secure bolting to stair stringers.",
            "desc": "Arabian Gratings steel stair treads are fabricated from open bar grating with integral front nosing plates and drilled end plates for bolting to stringers. The open grid design prevents accumulation of liquids, ice, and debris.",
            "material": "Carbon Steel / Aluminium", "finish": "Galvanized / Checkered Plate Nosing", "standard": "BS 4592 Part 5, OSHA 1910.24",
            "applications": "Industrial Stairways, Escape Routes, Mezzanine Platforms, Offshore Gangways",
            "features": "Anti-slip serrated bars\nIntegral front nosing plate\nDrilled end plates for bolting\nOpen grid prevents debris build-up\nGalvanized or painted finish",
            "specs": [
                {"name": "Tread Width", "value": "600 mm to 1200 mm"},
                {"name": "Tread Depth", "value": "225 mm / 250 mm"},
                {"name": "Nosing Plate", "value": "50×6 mm flat bar"},
            ],
            "faqs": [
                {"question": "Are stair treads supplied with mounting brackets?", "answer": "Yes, each stair tread is supplied with pre-drilled end plates and can be provided with optional adjustable angle brackets for various stringer profiles."},
            ],
            "img": "prod-stair-treads.jpg",
        },

        # ── Stainless Steel Products ────────────────────────────────────────────
        {
            "category": "stainless-steel-products", "sort": 0, "featured": True,
            "name": "SS Gratings", "slug": "ss-gratings", "code": "AG-SS-GRT",
            "short": "Stainless steel gratings, made from SS 304/316 grades, offer rust-resistant solutions with mill or polished finishes.",
            "desc": "Arabian Gratings Stainless Steel Gratings are electroforged from solid SS304 or SS316 bearing bars and cross rods. The result is a hygienic, cleanable, corrosion-immune grating ideal for food-grade applications. Electro-polished finish options available for the highest hygiene standards.",
            "material": "Stainless Steel SS304 / SS316", "finish": "Mill Finish / Electro-Polished", "standard": "ASTM A240, BS 4592",
            "applications": "Food Processing Plants, Pharmaceutical Facilities, Marine Decks, Coastal Splash Zones",
            "features": "SS304 and SS316 grade options\nElectro-polished finish available\nHygiene compliant surface\nHigh temperature tolerance\nNo painting or maintenance",
            "specs": [
                {"name": "Grade", "value": "SS304 / SS316 (standard)"},
                {"name": "Bearing Bar Size", "value": "25×5 mm (standard)"},
                {"name": "Cross Rod Pitch", "value": "50 mm"},
                {"name": "Finish", "value": "Pickled & Passivated / Electro-Polished"},
            ],
            "faqs": [
                {"question": "Why select Grade 316 over Grade 304?", "answer": "Grade 316 contains molybdenum which significantly increases resistance to chloride pitting corrosion, making it suitable for marine/coastal exposures and acidic cleanups."},
            ],
            "img": "prod-ss-gratings.jpg",
        },
        {
            "category": "stainless-steel-products", "sort": 1, "featured": False,
            "name": "SS Floor Drains", "slug": "ss-floor-drains", "code": "AG-SS-DRN",
            "short": "Stainless steel floor drains, ideal for bathrooms and kitchens, offer durable, stylish solutions in various sizes and designs.",
            "desc": "Our stainless steel floor drain range covers square, round, and channel-type drain bodies with adjustable heights, deep-seal water traps, and removable grating tops. SS316 grade standard for chemical and coastal environments.",
            "material": "Stainless Steel SS304 / SS316", "finish": "Satin / Mirror Polished", "standard": "BS EN 1253, DIN 18195",
            "applications": "Bathrooms, Commercial Kitchens, Food Processing Facilities, Wet Areas",
            "features": "Adjustable height body\nDeep seal water trap\nRemovable grating top\nTile-in or flanged frames\nHigh flow rate designs",
            "specs": [
                {"name": "Body Size", "value": "100×100 to 500×500 mm"},
                {"name": "Outlet Size", "value": "50 mm / 75 mm / 110 mm"},
                {"name": "Flow Rate", "value": "Up to 3.0 L/s"},
            ],
            "faqs": [
                {"question": "Can SS floor drains be used in food processing areas?", "answer": "Yes, our electro-polished SS316 floor drains meet EHEDG hygiene standards for food processing and pharmaceutical wet areas."},
            ],
            "img": "prod-ss-floor-drains.jpg",
        },
        {
            "category": "stainless-steel-products", "sort": 2, "featured": False,
            "name": "SS Ladders", "slug": "ss-ladders", "code": "AG-SS-LAD",
            "short": "High-quality SS ladders are made for durability, cost-effectiveness and minimal environmental impact in harsh conditions.",
            "desc": "Arabian Gratings SS316 ladders offer excellent corrosion resistance in marine and chemical environments. Constructed with tubular side rails and solid rungs, our ladders meet EN ISO 14122-4 requirements. Custom heights and configurations including landing platforms and safety cages available.",
            "material": "Stainless Steel SS316", "finish": "Satin Polished / Mill Finish", "standard": "EN ISO 14122-4, ANSI A14.3",
            "applications": "Marine Vessels, Offshore Platforms, Chemical Plants, Swimming Pools",
            "features": "Marine grade SS316 standard\nTubular side rails and solid rungs\nSafety cage compatible\nCustom height configurations\nCorrosion-free maintenance-free",
            "specs": [
                {"name": "Side Rail Size", "value": "50×50×3 mm square tube"},
                {"name": "Rung Diameter", "value": "25 mm solid round bar"},
                {"name": "Rung Spacing", "value": "300 mm center-to-center"},
                {"name": "Inside Clearance", "value": "450 mm minimum"},
            ],
            "faqs": [
                {"question": "Are SS ladders suitable for seawater environments?", "answer": "Yes, SS316 grade contains molybdenum which provides excellent resistance to seawater chloride attack, making it ideal for marine and coastal ladder applications."},
            ],
            "img": "prod-ss-ladders.jpg",
        },
        {
            "category": "stainless-steel-products", "sort": 3, "featured": False,
            "name": "Ablution Gratings", "slug": "ablution-gratings", "code": "AG-SS-ABL",
            "short": "Stainless steel ablution gratings provide efficient drainage solutions for ablution areas, showers, and wet rooms.",
            "desc": "Designed specifically for mosques, prayer halls, and ablution areas, our SS ablution gratings provide hygienic and efficient drainage in wet prayer washing areas. The narrow slot pattern prevents bare feet from slipping and trapping toes while maintaining high flow rates.",
            "material": "Stainless Steel SS304 / SS316", "finish": "Satin / Brushed", "standard": "BS EN 1253, ISO 1219",
            "applications": "Ablution Rooms, Prayer Halls, Shower Areas, Wet Rooms, Mosques",
            "features": "Narrow slot anti-trap design\nHigh flow rate drainage\nHygienic cleanable surface\nMatching drain body supply\nSS304 or SS316 options",
            "specs": [
                {"name": "Slot Width", "value": "8 mm maximum (foot-safe)"},
                {"name": "Flow Rate", "value": "Up to 1.5 L/s per metre"},
                {"name": "Frame Finish", "value": "Satin Brushed"},
            ],
            "faqs": [
                {"question": "What slot width is recommended for ablution areas?", "answer": "We recommend a maximum 8mm slot width for ablution areas to prevent bare feet and toes from becoming trapped, complying with accessibility safety guidelines."},
            ],
            "img": "prod-ablution-gratings.jpg",
        },

        # ── Aluminium ──────────────────────────────────────────────────────────
        {
            "category": "aluminium", "sort": 0, "featured": True,
            "name": "Landscape", "slug": "landscape-aluminium", "code": "AG-AL-LND",
            "short": "Durable Aluminium structures combining aesthetic appeal and weather resistance, enhancing outdoor spaces with safety and style.",
            "desc": "Arabian Gratings aluminium landscape structures combine elegant aesthetics with engineering durability for outdoor public spaces. Our range includes tree guards, urban grating panels, cycle rack bases, and landscape drainage systems that enhance streetscapes while providing practical functionality.",
            "material": "Aluminium Alloy 6063-T5", "finish": "Anodized / Powder Coated", "standard": "BS EN 755, EN 1090",
            "applications": "Public Parks, Promenades, Streetscape, Landscape Walkways, Drainage Channels",
            "features": "Aesthetic anodized finishes\nWeatherproof all-year performance\nRecyclable green material\nLightweight installation\nBespoke design service",
            "specs": [
                {"name": "Alloy", "value": "Aluminium 6063-T5"},
                {"name": "Anodizing", "value": "Class AA10 / AA20"},
                {"name": "Powder Coat", "value": "Thermosetting polyester, 60-80 microns"},
            ],
            "faqs": [
                {"question": "What colors are available for powder coated aluminium landscape products?", "answer": "We offer the full RAL and BS standard color range, plus metallic and anodic look effect finishes for premium architectural landscape projects."},
            ],
            "img": "prod-landscape-aluminium.jpg",
        },
        {
            "category": "aluminium", "sort": 1, "featured": False,
            "name": "Aluminium & SS Handrail", "slug": "aluminium-ss-handrail", "code": "AG-AL-HDR",
            "short": "Corrosion-resistant Aluminium and stainless steel handrails, offering safety and sleek design for commercial and residential areas.",
            "desc": "Our aluminium and SS316 handrail systems are engineered for commercial and public space applications where both aesthetics and structural performance are critical. Modular component design enables flexible configurations for stairs, ramps, balconies, and terraces.",
            "material": "Aluminium 6063-T6 / SS316", "finish": "Anodized / Mirror Polished", "standard": "BS 6180, EN 1090",
            "applications": "Commercial Balconies, Staircases, Walkways, Bridges, Pedestrian Zones",
            "features": "Modular component system\nStructural compliance to BS 6180\nAnodized or polished finishes\nFlexible configuration options\nAll mounting hardware included",
            "specs": [
                {"name": "Top Rail Diameter", "value": "48.3 mm (standard)"},
                {"name": "Post Spacing", "value": "1500 mm maximum"},
                {"name": "Top Rail Height", "value": "1100 mm (commercial)"},
            ],
            "faqs": [
                {"question": "Are aluminium handrails structurally compliant for commercial buildings?", "answer": "Yes, our handrail systems are designed to BS 6180:2011 and EN 1090 structural requirements for commercial balcony and staircase applications."},
            ],
            "img": "prod-aluminium-handrail.jpg",
        },
        {
            "category": "aluminium", "sort": 2, "featured": False,
            "name": "Aluminium & SS Ladder With Safety Cage", "slug": "aluminium-ss-ladder-with-safety-cage", "code": "AG-AL-LAD",
            "short": "Sturdy Aluminium and stainless steel ladders with safety cages, designed for secure access in industrial and commercial settings.",
            "desc": "Safety cage ladders protect users during ascent and descent on tall structures such as silos, tanks, and industrial towers. Arabian Gratings fabricates complete cage ladder assemblies with 800mm cage diameter, anti-slip rungs, and intermediate rest platforms to OSHA and EN 14122-4 requirements.",
            "material": "Aluminium 6061-T6 / SS316", "finish": "Mill Finish / Anodized", "standard": "EN ISO 14122-4, OSHA 1926.1053",
            "applications": "Industrial Towers, Silos, Storage Tanks, Rooftop Access, Utility Shafts",
            "features": "800mm cage diameter\nAnti-slip rung surfaces\nIntermediate rest platforms\nOSHA and EN 14122-4 compliant\nFull assembly packages",
            "specs": [
                {"name": "Cage Diameter", "value": "800 mm (minimum to EN 14122-4)"},
                {"name": "Rung Spacing", "value": "300 mm center-to-center"},
                {"name": "Rest Platform", "value": "Every 6 m maximum height"},
            ],
            "faqs": [
                {"question": "When is a safety cage required on a vertical ladder?", "answer": "Safety cages are required on fixed vertical ladders where the unprotected height exceeds 3 metres to EN ISO 14122-4 requirements."},
            ],
            "img": "prod-aluminium-cage-ladder.jpg",
        },
        {
            "category": "aluminium", "sort": 3, "featured": False,
            "name": "Roof Hatch Covers", "slug": "roof-hatch-covers", "code": "AG-AL-HCH",
            "short": "Weatherproof Aluminium and stainless steel roof hatch covers, providing safe, durable, and easy rooftop access.",
            "desc": "Arabian Gratings roof access hatches provide weathertight, insulated rooftop access for maintenance personnel. Available in aluminium and SS316 construction with single and double leaf configurations. All hatches include compression seals, hold-open stays, and interior ladder attachment points.",
            "material": "Aluminium / SS316", "finish": "Anodized / Galvanized", "standard": "BS 5081, EN 14351",
            "applications": "Commercial Buildings, Industrial Rooftops, HVAC Access, Utility Shafts",
            "features": "Weathertight compression seal\nSingle and double leaf options\nHold-open stay included\nInsulated options available\nNo membrane penetration required",
            "specs": [
                {"name": "Clear Opening", "value": "600×600 to 1500×900 mm"},
                {"name": "Frame Depth", "value": "150 mm upstand"},
                {"name": "Leaf Thickness", "value": "50 mm insulated sandwich"},
            ],
            "faqs": [
                {"question": "Are roof hatches available with insulation?", "answer": "Yes, our insulated roof hatch covers use 50mm polyurethane foam core panels achieving thermal resistance suitable for air-conditioned building applications."},
            ],
            "img": "prod-roof-hatch-covers.jpg",
        },
        {
            "category": "aluminium", "sort": 4, "featured": False,
            "name": "Aluminium Roof Top Walkway", "slug": "aluminium-roof-top-walkway", "code": "AG-AL-WLK",
            "short": "Lightweight, slip-resistant Aluminium walkways, protecting roofs and ensuring safe maintenance access in industrial environments.",
            "desc": "Rooftop walkway systems protect roof membrane surfaces from foot traffic damage while providing safe, level access paths to HVAC equipment, solar arrays, and communications masts. Arabian Gratings modular systems are installed without penetrating the roof membrane, using adjustable height supports.",
            "material": "Aluminium Alloy 6063-T6", "finish": "Anodized / Powder Coated", "standard": "BS 6399, EN 1090",
            "applications": "Rooftop HVAC Maintenance, Solar Panel Access, Industrial Roof Walkways",
            "features": "No membrane penetration\nAdjustable height support legs\nModular bolt-together design\nAnti-slip grating surfaces\nLightweight installation",
            "specs": [
                {"name": "Walkway Width", "value": "600 mm / 750 mm / 900 mm"},
                {"name": "Support Leg Height", "value": "Adjustable 75 mm to 300 mm"},
                {"name": "Live Load Rating", "value": "1.5 kN/m²"},
            ],
            "faqs": [
                {"question": "How are rooftop walkways fixed without penetrating the membrane?", "answer": "Our walkway support systems use rubber-padded cradle feet that distribute loads across the roof membrane surface without bolts or fasteners, protecting the waterproofing."},
            ],
            "img": "prod-aluminium-roof-walkway.jpg",
        },
        {
            "category": "aluminium", "sort": 5, "featured": False,
            "name": "Stainless Steel Gratings", "slug": "aluminium-ss-gratings", "code": "AG-AL-SSGRT",
            "short": "Strong, corrosion-resistant stainless steel gratings offering slip resistance and durability for harsh industrial conditions.",
            "desc": "Stainless steel gratings within our aluminium product range are engineered for marine deck, pool surround, and architectural applications where both corrosion resistance and a premium finish are required. Available in electroforged and press-locked construction.",
            "material": "Stainless Steel SS316", "finish": "Electro-Polished / Satin", "standard": "BS 4592, ASTM A240",
            "applications": "Industrial Platforms, Marine Access, Chemical Facilities, Food Grade Applications",
            "features": "Electro-polished premium finish\nMarine grade SS316 standard\nCorrosion immune in all environments\nCustom sizes available\nHigh aesthetic quality",
            "specs": [
                {"name": "Grade", "value": "SS316 (standard)"},
                {"name": "Finish", "value": "Electro-Polished / Mill"},
                {"name": "Open Area", "value": "Up to 80%"},
            ],
            "faqs": [
                {"question": "What is the difference between electro-polished and mill finish SS gratings?", "answer": "Electro-polished gratings have a mirror-bright surface with superior cleanability and corrosion resistance, ideal for food-grade and hygienic applications."},
            ],
            "img": "prod-aluminium-ss-gratings.jpg",
        },
        {
            "category": "aluminium", "sort": 6, "featured": False,
            "name": "Aluminium Gratings", "slug": "aluminium-gratings-standard", "code": "AG-AL-GRT",
            "short": "Lightweight Aluminium gratings, designed for safety, durability, and easy maintenance in walkways and platforms.",
            "desc": "Arabian Gratings standard aluminium gratings are produced from 6063-T6 alloy using the same electroforged process as our carbon steel gratings. The result is a lightweight, strong, non-corroding grating suitable for mezzanine floors, platform walkways, and trench covers.",
            "material": "Aluminium Alloy 6063-T6 / 6061-T6", "finish": "Mill Finish / Clear Anodized", "standard": "ASTM B221, BS 4592",
            "applications": "Sewage Treatment, Architectural Screens, Volatile Gas Zones, Suspended Walkways",
            "features": "Lightweight 6063-T6 alloy\nNon-sparking safe in volatile zones\nAnodized corrosion prevention\nRecyclable green specification\nElectroforged strong joints",
            "specs": [
                {"name": "Bearing Bar Size", "value": "25×3 mm (standard)"},
                {"name": "Bearing Bar Pitch", "value": "30 mm"},
                {"name": "Cross Rod Pitch", "value": "100 mm"},
                {"name": "Anodizing Class", "value": "AA 20 (min. 20 microns)"},
            ],
            "faqs": [
                {"question": "Is aluminium grating safe in explosive zones?", "answer": "Yes, the non-sparking characteristics of aluminium alloy make it highly recommended for explosive gas storage access walkways."},
            ],
            "img": "prod-aluminium-gratings-standard.jpg",
        },
        {
            "category": "aluminium", "sort": 7, "featured": False,
            "name": "Heel Proof Grating", "slug": "heel-proof-grating", "code": "AG-AL-HLP",
            "short": "Narrow-opening Aluminium or stainless steel gratings preventing heel traps while maintaining load capacity and durability.",
            "desc": "Heel-proof grating incorporates a small mesh aperture design that prevents stiletto heels, wheelchair wheels, and walking sticks from becoming trapped. Available in aluminium, stainless steel, and GRP materials. Commonly specified in shopping malls, airport terminals, and public pedestrian areas.",
            "material": "Aluminium / Stainless Steel SS316", "finish": "Mill Finish / Anodized", "standard": "ISO 14122, ADA Compliant",
            "applications": "Shopping Centres, Airports, Pedestrian Walkways, Public Buildings, Retail Floors",
            "features": "ADA and wheelchair compliant\nPrevents heel and cane entrapment\nHigh flow rate for drainage\nAvailable in multiple materials\nCustom sizes and finishes",
            "specs": [
                {"name": "Max Aperture", "value": "13×13 mm (ADA/accessibility compliant)"},
                {"name": "Panel Height", "value": "25 / 38 mm"},
                {"name": "Material Options", "value": "Aluminium / SS316 / GRP"},
            ],
            "faqs": [
                {"question": "What aperture size qualifies as heel-proof?", "answer": "Apertures not exceeding 13mm in either direction are generally considered heel-proof and compliant with accessibility guidelines including ADA and BS 8300."},
            ],
            "img": "prod-heel-proof-grating.jpg",
        },

        # ── Manhole ────────────────────────────────────────────────────────────
        {
            "category": "manhole", "sort": 0, "featured": True,
            "name": "Ductile Iron", "slug": "ductile-iron", "code": "AG-MH-DI",
            "short": "Strong, corrosion-resistant ductile iron products ideal for heavy-load infrastructure like manhole covers and frames.",
            "desc": "Arabian Gratings ductile iron manhole covers are cast from GJS-500-7 grade iron which provides significantly higher tensile strength and impact resistance than traditional grey cast iron. Our range covers all BS EN 124 load classes from A15 to F900 in circular and square configurations.",
            "material": "Ductile Iron GJS 500-7", "finish": "Bituminous Paint / Epoxy Coated", "standard": "BS EN 124-2 Class D400",
            "applications": "Main Roads, Highway Shoulders, Commercial Parking, Public Infrastructure",
            "features": "D400 40-tonne load rating\nDouble sealed odour prevention\nAnti-rattle locking design\nSlip-resistant surface pattern\nAll EN 124 load classes available",
            "specs": [
                {"name": "Material Grade", "value": "GJS 500-7 Ductile Iron"},
                {"name": "Clear Opening", "value": "600×600 mm (other sizes available)"},
                {"name": "Load Class", "value": "D400 (40 tonne proof load)"},
                {"name": "Frame Depth", "value": "100 mm standard"},
                {"name": "Coating", "value": "Bituminous Paint / Epoxy"},
            ],
            "faqs": [
                {"question": "What does Class D400 mean?", "answer": "Class D400 covers are certified to withstand test loads of 400 kN (approximately 40 tonnes), making them safe for carriageways of roads and municipal streets."},
                {"question": "Is ductile iron stronger than grey cast iron?", "answer": "Yes, ductile iron (spheroidal graphite iron) has significantly higher tensile strength, yield strength, and impact resistance compared to grey cast iron, making it the preferred material for traffic-loaded manhole covers."},
            ],
            "img": "prod-ductile-iron.jpg",
        },
        {
            "category": "manhole", "sort": 1, "featured": False,
            "name": "S.G Iron / Ductile", "slug": "s-g-iron-ductile", "code": "AG-MH-SG",
            "short": "Tough spheroidal graphite and ductile iron materials for impact-resistant, durable drainage and manhole products.",
            "desc": "Spheroidal Graphite Iron (SG Iron or Ductile Iron) products from Arabian Gratings offer superior impact toughness compared to grey cast iron. The graphite microstructure is spherical rather than flake-shaped, eliminating stress concentration points. Specified for heavy wheel load drainage products.",
            "material": "Spheroidal Graphite Iron (SG) / Ductile Iron", "finish": "Black Bitumen Coated", "standard": "BS EN 124, EN 1561",
            "applications": "Drainage Channels, Municipal Roads, Utility Access, Industrial Yards",
            "features": "Superior impact toughness\nSpherical graphite microstructure\nHigh tensile strength\nAll EN 124 load classes available\nLong-term durability",
            "specs": [
                {"name": "Tensile Strength", "value": "Min. 500 N/mm² (GJS-500-7)"},
                {"name": "Elongation", "value": "Min. 7% (GJS-500-7)"},
                {"name": "Hardness", "value": "170-230 HB"},
            ],
            "faqs": [
                {"question": "What is the difference between SG iron and grey cast iron?", "answer": "SG iron has spheroidal graphite nodules rather than flake graphite, which eliminates the stress concentration effect, resulting in much higher strength, ductility, and impact resistance."},
            ],
            "img": "prod-sg-iron-ductile.jpg",
        },
        {
            "category": "manhole", "sort": 2, "featured": False,
            "name": "Channel / Gully Gratings", "slug": "channel-gully-grating", "code": "AG-MH-CHNL",
            "short": "Efficient drainage gratings made from durable materials, ensuring debris-free water flow and safe walking surfaces.",
            "desc": "Arabian Gratings channel and gully gratings are manufactured in ductile iron with hinged and non-hinged options. Our channel grating systems include full drainage channel systems with matching outlet units and end caps for complete surface water management.",
            "material": "Ductile Iron / Cast Iron", "finish": "Bituminous Paint", "standard": "BS EN 124, BS EN 1433",
            "applications": "Road Drainage, Car Parks, Pedestrian Areas, Shopping Centres, Industrial Sites",
            "features": "Hinged and non-hinged options\nComplete drainage channel systems\nClass B125 to D400 ratings\nMatching outlet and end caps\nCorrosion resistant coating",
            "specs": [
                {"name": "Channel Width", "value": "100 / 150 / 200 / 300 mm"},
                {"name": "Grating Clear Opening", "value": "Matches channel width"},
                {"name": "Load Class", "value": "B125 / C250 / D400"},
            ],
            "faqs": [
                {"question": "Are channel gratings available with hinged access?", "answer": "Yes, our hinged channel grating systems allow one-person opening without lifting tools, ideal for areas requiring frequent access for maintenance."},
            ],
            "img": "prod-channel-gully-grating.jpg",
        },
        {
            "category": "manhole", "sort": 3, "featured": False,
            "name": "Carriageway Cover & Frame", "slug": "carriageway-cover-and-frame", "code": "AG-MH-CW",
            "short": "Heavy-duty ductile iron carriageway covers and frames designed for secure access and high load-bearing capacity.",
            "desc": "Heavy-duty carriageway covers for primary road applications are manufactured to Class E600 and F900 load ratings for heavy commercial vehicle and emergency service access. Arabian Gratings carriageway covers feature anti-slip patterns, double-sealed frame designs, and security bolt locking systems.",
            "material": "Ductile Iron GJS 500-7", "finish": "Epoxy Coated / Bituminous", "standard": "BS EN 124 Class E600 / F900",
            "applications": "Carriageways, Highway Verges, Bridge Decks, Heavy Traffic Areas",
            "features": "Class E600 and F900 ratings\nAnti-slip chequered surface\nDouble sealed frame design\nSecurity bolt locking system\nAnti-theft protection",
            "specs": [
                {"name": "Load Class", "value": "E600 (60 tonne) / F900 (90 tonne)"},
                {"name": "Clear Opening", "value": "600×600 to 900×900 mm"},
                {"name": "Frame Depth", "value": "150 mm minimum"},
            ],
            "faqs": [
                {"question": "What is the maximum load class for carriageway covers?", "answer": "Class F900 covers are the highest classification under BS EN 124, rated for 900 kN (approximately 90 tonnes) test load, suitable for aircraft pavements and heavy industrial yards."},
            ],
            "img": "prod-carriageway-cover.jpg",
        },

        # ── SS/GI Grating Clamps ────────────────────────────────────────────────
        {
            "category": "ss-gi-grating-clamps", "sort": 0, "featured": True,
            "name": "SS/GI Grating Clamps", "slug": "ss-gi-clamps", "code": "AG-CL-SSGI",
            "short": "Our durable, quick, and easy-to-use grating clamps provide a cost-efficient and reliable solution for clamping.",
            "desc": "Arabian Gratings M-Clip grating clamps are manufactured in SS316 stainless steel or hot-dip galvanized steel to anchor grating panels to structural support members without drilling. Each clamp applies a compression force to the grating bearing bar, resisting both uplift and lateral movement under dynamic loads.",
            "material": "Stainless Steel SS316 / Galvanized Steel", "finish": "Acid Pickled / Zinc Plated", "standard": "ISO 4014 / DIN 934",
            "applications": "Steel Grating Installation, GRP Panel Anchoring, Industrial Flooring, Platform Decking",
            "features": "No drilling required\nSS316 or galvanized options\nHigh vibration resistance\nFour clamps per panel minimum\nCompliant with BS and EN standards",
            "specs": [
                {"name": "Material", "value": "SS316 / Galvanized Steel"},
                {"name": "Material Thickness", "value": "2.0 mm heavy-duty gauge"},
                {"name": "Saddle Width", "value": "38 mm standard mesh span"},
                {"name": "Matching Bolt", "value": "M8×70 mm hex bolt with lock nut"},
            ],
            "faqs": [
                {"question": "How many clips are recommended per panel?", "answer": "For safety compliance, we recommend installing at least 4 M-Clips per standard 1m×2m grating panel, placed at the corners."},
                {"question": "Can these clamps be used on GRP grating panels?", "answer": "Yes, our clamps are designed to suit both steel and GRP grating bearing bar widths of 25-40mm without modification."},
            ],
            "img": "prod-ss-gi-clamps.jpg",
        },

        # ── Step Iron ──────────────────────────────────────────────────────────
        {
            "category": "step-iron", "sort": 0, "featured": True,
            "name": "PVC / GI / SS Step Iron", "slug": "pvc-gi-ss", "code": "AG-SI-PVC",
            "short": "Step irons are made from durable ductile iron, hot-dip galvanized to BS EN ISO 1461 and feature anti-slip, secure designs.",
            "desc": "Arabian Gratings step iron range covers three material variants: PVC-encapsulated ductile iron for chemical sewage environments, hot-dip galvanized iron for general utility shafts, and stainless steel SS316 for food grade and marine environments. All types meet BS EN 13101 requirements for pull-out resistance and anti-slip performance.",
            "material": "Ductile Iron / GI / SS316 / PVC Encapsulated", "finish": "PVC Coated / Hot-Dip Galvanized", "standard": "BS EN 13101, BS 1247",
            "applications": "Manhole Shafts, Sewer Chambers, Utility Inspection Pits, Storm Water Stations",
            "features": "PVC encapsulated option for sewers\nGalvanized for general utilities\nSS316 for marine environments\nAnti-slip foot stops\nBS EN 13101 certified pull-out",
            "specs": [
                {"name": "Step Width", "value": "240 mm inside clearance"},
                {"name": "Projection", "value": "150 mm wall projection depth"},
                {"name": "Pull-out Resistance", "value": "Certified up to 5.0 kN"},
                {"name": "Material Variants", "value": "PVC/PP Encapsulated / Hot-Dip GI / SS316"},
            ],
            "faqs": [
                {"question": "Why is the iron core encapsulated in plastic?", "answer": "The polypropylene plastic prevents damp sewage gases from corroding the ductile iron structural core, ensuring structural climbing safety for decades."},
                {"question": "What is the pull-out resistance requirement?", "answer": "BS EN 13101 requires step irons to withstand a minimum 5.0 kN pull-out force to ensure they cannot be dislodged from the shaft wall under operational loads."},
            ],
            "img": "prod-pvc-gi-ss-step-iron.jpg",
        },

        # ── Stud Products ──────────────────────────────────────────────────────
        {
            "category": "stud-products", "sort": 0, "featured": True,
            "name": "Shear Connectors", "slug": "shear-connector", "code": "AG-ST-SHR",
            "short": "Shear studs and metal decking studs by Arabian Gratings are industry-leading, enabling through-deck welding and reinforced concrete bonding.",
            "desc": "Arabian Gratings headed shear studs are manufactured from grade S235J2+C steel and are used in composite steel-concrete construction to transfer shear forces between steel beams and concrete slabs. Through-deck welding capability allows installation through metal decking without pre-drilling. Supplied with BS EN ISO 13918 certification.",
            "material": "Grade S235J2+C (EN 10025) / Mild Steel", "finish": "Black / Galvanized", "standard": "EN ISO 13918, BS EN 14399",
            "applications": "Composite Steel-Concrete Beams, Metal Deck Floors, Bridge Decks, Multi-Storey Buildings",
            "features": "Through-deck welding capability\nBS EN ISO 13918 certified\nHigh shear force transfer\nGrade S235J2+C steel standard\nHeaded stud and decking stud variants",
            "specs": [
                {"name": "Stud Diameter", "value": "13 / 16 / 19 / 22 / 25 mm"},
                {"name": "Stud Height", "value": "65 mm to 200 mm (custom)"},
                {"name": "Head Diameter", "value": "1.5× Stud Diameter"},
                {"name": "Material Grade", "value": "S235J2+C to EN 10025"},
            ],
            "faqs": [
                {"question": "What is through-deck welding?", "answer": "Through-deck welding allows shear studs to be welded through the metal decking sheet directly to the steel beam flange below, eliminating the need to pre-drill holes in the decking."},
                {"question": "What shear stud diameter is most commonly used?", "answer": "19mm diameter headed shear studs are the most commonly specified size in composite beam construction, offering the best balance of shear capacity and weldability."},
            ],
            "img": "prod-shear-connector.jpg",
        },
    ]

    prod_objs = {}
    for p_data in products_data:
        cat = cat_objs[p_data["category"]]
        prod = Product.objects.create(
            category=cat,
            name=p_data["name"],
            slug=p_data["slug"],
            product_code=p_data["code"],
            short_description=p_data["short"],
            description=p_data["desc"],
            material=p_data["material"],
            finish=p_data["finish"],
            standard=p_data["standard"],
            applications=p_data["applications"],
            features=p_data["features"],
            faq=p_data["faqs"],
            is_featured=p_data["featured"],
            sort_order=p_data["sort"],
            is_active=True
        )
        prod_objs[p_data["slug"]] = prod
        print(f"Created product: {prod.name}")

        # Specifications
        for idx, spec in enumerate(p_data["specs"]):
            ProductSpecification.objects.create(
                product=prod, name=spec["name"], value=spec["value"], sort_order=idx
            )

        # Primary image
        img_name = p_data["img"]
        media = media_objs.get(img_name, default_media)
        if media:
            ProductImage.objects.create(
                product=prod,
                media=media,
                alt_text=f"Premium {prod.name}",
                caption=f"Arabian Gratings {prod.name}",
                is_primary=True,
                sort_order=0
            )

    # Link related products (first 3 from different categories)
    all_prods = list(prod_objs.values())
    for prod in all_prods:
        rel = [p for p in all_prods if p.id != prod.id and p.category != prod.category][:3]
        prod.related_products.set(rel)
        prod.save()

    # 4. Seed Industries
    print("Seeding Industries...")
    Industry.objects.all().delete()

    industries_data = [
        {
            "name": "Oil & Gas",
            "slug": "oil-gas",
            "short": "Exploration platforms, processing yards, and seawater splash zones requiring premium corrosion resistance.",
            "desc": "Arabian Gratings supplies high-performance safety flooring and access systems specifically engineered for the demanding conditions of the onshore and offshore Oil & Gas sector. From offshore drilling rigs and FPSO vessels to onshore refineries, gas processing plants, and sulfur storage facilities, our industrial grating products deliver unparalleled durability and compliance with strict API, ISO, and ASTM regulations.",
            "img": "industry-oilgas.jpg",
            "prods": ["molded-gratings", "electro-forged-type-gratings", "ss-gi-clamps"]
        },
        {
            "name": "Marine & Offshore",
            "slug": "marine-offshore",
            "short": "Vessel decks, cargo bays, coastal jetties, and mooring structures subject to harsh salt spray.",
            "desc": "Access walkways, gangways, vessel decks, and dock structures are continuously exposed to saltwater, tidal waves, and severe atmospheric moisture. Arabian Gratings provides hot-dip galvanized steel grids and advanced GRP molded gratings that resist marine corrosion and salt spray fatigue.",
            "img": "project-marine.jpg",
            "prods": ["molded-gratings", "ss-gratings", "ss-gi-clamps"]
        },
        {
            "name": "Desalination Plants",
            "slug": "water-treatment",
            "short": "Chemical-safe GRP grids and stainless floor plates for humid, chlorine-heavy utility yards.",
            "desc": "Desalination plants and wastewater treatment facilities handle highly corrosive chemicals, chlorine-heavy environments, and high humidity levels. Our GRP/FRP gratings and stainless steel gratings are designed with vinyl ester resin matrices and pickling finishes to offer complete resistance to chemical splash and acidic attacks.",
            "img": "project-refinery.jpg",
            "prods": ["molded-gratings", "ss-gratings", "aluminium-gratings-standard"]
        },
        {
            "name": "Infrastructure",
            "slug": "infrastructure",
            "short": "Trench covers, utility ducts, access walkways, and ventilation screens for municipal projects.",
            "desc": "Arabian Gratings supplies heavy-duty trench covers, drainage grates, manhole covers, and utility duct frames for roads, railways, airports, and municipal construction projects. Engineered for heavy wheel loads such as D400 and E600 classes, our access systems ensure safe traffic flow and long service life.",
            "img": "cta-factory.jpg",
            "prods": ["electro-forged-type-gratings", "ductile-iron", "pvc-gi-ss", "shear-connector"]
        }
    ]

    for ind_data in industries_data:
        ind = Industry.objects.create(
            name=ind_data["name"],
            slug=ind_data["slug"],
            short_description=ind_data["short"],
            description=ind_data["desc"],
            image=media_objs.get(ind_data["img"], default_media),
            is_active=True,
            no_index=False
        )
        linked = [prod_objs[s] for s in ind_data["prods"] if s in prod_objs]
        ind.related_products.set(linked)
        ind.save()
        print(f"Created industry: {ind.name}")

    print("Product & Industry database seeding completed successfully!")

if __name__ == "__main__":
    seed()

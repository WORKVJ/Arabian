"""
update_product_seo.py
Non-destructive update script for Arabian Gratings product SEO and content.

Updates per-product:
  - seo_title (unique, keyword-rich, max 60 chars)
  - seo_description (unique, UAE-localized, max 155 chars)
  - description (expanded, 400-600 chars with UAE context)
  - features (expanded bullet list)
  - faq (2-3 FAQs per product)
  - Additional ProductSpecification rows (non-destructive append)

Does NOT touch: images, categories, related_products, slugs, names, product codes.
Run with: python update_product_seo.py
"""

import os
import sys
import django
from pathlib import Path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
sys.path.append(str(Path(__file__).resolve().parent))
django.setup()

from apps.products.models import Product, ProductSpecification


PRODUCT_UPDATES = [
    # ─────────────────────────────────────────────────────────────────────────
    # 1. Electroforged Welded Steel Grating
    # ─────────────────────────────────────────────────────────────────────────
    {
        "slug": "electroforged-welded-steel-grating",
        "seo_title": "Electroforged Steel Grating UAE | ISO 1461 Galvanized | Arabian Gratings",
        "seo_description": (
            "Hot-dip galvanized electroforged steel grating for industrial platforms, walkways and "
            "drainage trenches in UAE and GCC. ISO 1461, BS 4592. Supplier in Dubai and Abu Dhabi."
        ),
        "og_title": "Electroforged Steel Grating UAE | Arabian Gratings Dubai",
        "og_description": (
            "Heavy-duty electroforged steel grating panels, ISO 1461 galvanized. "
            "Engineered for extreme industrial load spans across UAE and GCC."
        ),
        "description": (
            "Arabian Gratings Electroforged Welded Steel Grating is fabricated from high-strength "
            "ASTM A36 / S235JR carbon steel load-bearing bars, electrically fused under hydraulic "
            "pressure into a rigid single-piece grid. Each panel is hot-dip galvanized to BS EN ISO 1461 "
            "at a minimum 85-micron zinc thickness, delivering long-term protection against the marine "
            "atmospheric conditions common across UAE coastal industrial sites.\n\n"
            "These gratings are the standard choice for heavy-duty industrial platforms, power plant "
            "walkways, oil and gas facility decks, and drainage trenches across Dubai, Abu Dhabi, "
            "Sharjah and the wider GCC region. Custom panel sizes, serrated load bar options, and "
            "banded edge cut-outs are available based on project-specific structural drawings."
        ),
        "features": (
            "High load span stiffness — supports UDL up to 45.8 kN/m² at 1.2 m span\n"
            "Hot-dip galvanized to BS EN ISO 1461 — minimum 85 microns zinc protection\n"
            "Serrated load bar option for enhanced anti-slip safety on walkways\n"
            "Custom panel sizes, angle cuts and banded edge penetrations available\n"
            "Electrically forge-welded joints — single-piece rigid grid construction\n"
            "UAE coastal climate rated — resists salt spray and desert heat cycling"
        ),
        "faq": [
            {
                "question": "What hot-dip galvanizing standard is applied?",
                "answer": (
                    "All carbon steel gratings are hot-dip galvanized in full compliance with "
                    "BS EN ISO 1461, ensuring a minimum zinc coating of 85 microns (610 g/m²). "
                    "This provides long-term protection against marine salt spray and UAE industrial "
                    "atmospheric corrosion."
                )
            },
            {
                "question": "Can panels be custom-cut for pipe penetrations and circular cut-outs?",
                "answer": (
                    "Yes. We custom-cut and weld banded steel edging around circular pipe penetrations, "
                    "rectangular notches, and angled cuts based on client-supplied shop drawings or "
                    "site dimension sketches. Custom fabrication is included in the quotation process."
                )
            },
            {
                "question": "Are electroforged gratings suitable for UAE oil and gas facilities?",
                "answer": (
                    "Yes. Electroforged welded steel gratings are widely specified for UAE oil and gas "
                    "facilities, refineries, and petrochemical plants. The galvanized finish provides "
                    "corrosion resistance while the electroforged weld bond ensures structural integrity "
                    "under heavy equipment loading and repeated foot traffic."
                )
            }
        ],
        "extra_specs": [
            {"name": "Panel Standard Length", "value": "Up to 6,000 mm (custom)"},
            {"name": "Panel Standard Width", "value": "Up to 1,000 mm (custom)"},
        ]
    },

    # ─────────────────────────────────────────────────────────────────────────
    # 2. Moulded GRP Walkway Grating
    # ─────────────────────────────────────────────────────────────────────────
    {
        "slug": "moulded-grp-walkway-grating",
        "seo_title": "Moulded GRP Grating UAE | FRP Walkway Panels | Arabian Gratings Dubai",
        "seo_description": (
            "Corrosion-free moulded GRP/FRP grating panels for oil & gas, desalination and chemical "
            "plants in UAE. ASTM E84 fire-rated. Supplier in Dubai and Abu Dhabi."
        ),
        "og_title": "Moulded GRP Grating UAE | FRP Panels | Arabian Gratings",
        "og_description": (
            "Chemical-resistant moulded GRP walkway grating for UAE industrial facilities. "
            "ASTM E84 fire-retardant, zero-maintenance. Arabian Gratings Dubai supplier."
        ),
        "description": (
            "Arabian Gratings Moulded GRP (Glass Reinforced Plastic) Walkway Gratings are "
            "manufactured using continuous filament glass fibres embedded in isophthalic polyester "
            "or chemical-grade vinyl ester resin matrices. The bi-directional moulded construction "
            "provides equal load distribution in both directions, making these panels ideal for "
            "walkways, platforms, and stair treads in highly corrosive environments.\n\n"
            "GRP gratings are the primary specification for UAE desalination plants, chemical "
            "processing yards, offshore oil platforms, and seawater splash zones where carbon steel "
            "would rapidly corrode. The silicon carbide grit top surface provides permanent "
            "anti-slip properties without painting or coating. Standard panels are available in "
            "38×38 mm mesh with custom sizes on request for projects across Dubai, Abu Dhabi, "
            "Sharjah and across the GCC region."
        ),
        "features": (
            "100% corrosion immune — no painting, coating or maintenance required\n"
            "Non-conductive — inherent electrical safety for high-voltage environments\n"
            "Fire retardant resin — ASTM E84 Class 1 low flame spread rating\n"
            "Silicon carbide grit surface — permanent anti-slip, never wears off\n"
            "Lightweight — approximately 1/4 weight of equivalent steel panels\n"
            "Chemical resistant — resists acids, alkalis, chloride and seawater\n"
            "UV stabilized — suitable for UAE outdoor desert and marine exposures\n"
            "Bi-directional strength — equal load capacity in both span directions"
        ),
        "faq": [
            {
                "question": "What is the primary advantage of GRP over steel grating in UAE conditions?",
                "answer": (
                    "In UAE coastal and chemical environments, GRP offers complete immunity to salt "
                    "spray, chloride, and chemical corrosion that would require ongoing maintenance on "
                    "galvanized steel. GRP is also non-conductive, significantly lighter for manual "
                    "handling, and requires zero painting or re-coating over its service life."
                )
            },
            {
                "question": "Is GRP grating fire-retardant and safe for offshore platforms?",
                "answer": (
                    "Yes. Our moulded GRP gratings incorporate flame-retardant additives achieving "
                    "ASTM E84 Class 1 fire safety classification with low flame-spread index. This "
                    "rating is acceptable for offshore oil and gas platform decking, process area "
                    "walkways, and escape routes per typical oil and gas safety specifications."
                )
            },
            {
                "question": "What resin options are available for chemical plants in UAE?",
                "answer": (
                    "We offer standard isophthalic polyester resin for general corrosive environments "
                    "and upgraded vinyl ester resin for aggressive acid or solvent exposure. Vinyl "
                    "ester GRP is widely specified in UAE and GCC petrochemical facilities handling "
                    "strong acids, alkalis, and chlorinated compounds."
                )
            }
        ],
        "extra_specs": [
            {"name": "Standard Colour", "value": "Yellow (RAL 1021) / Grey / Green"},
            {"name": "Max Panel Size", "value": "1,220 mm × 3,660 mm"},
        ]
    },

    # ─────────────────────────────────────────────────────────────────────────
    # 3. Stainless Steel SS316 Floor Grating
    # ─────────────────────────────────────────────────────────────────────────
    {
        "slug": "stainless-steel-ss316-floor-grating",
        "seo_title": "Stainless Steel Grating SS316 UAE | Food-Grade Floor Panels | Arabian Gratings",
        "seo_description": (
            "Grade SS316 stainless steel gratings for food processing, pharmaceutical labs and marine "
            "decks in UAE. Pickled and passivated. Arabian Gratings — Dubai and Abu Dhabi supplier."
        ),
        "og_title": "SS316 Stainless Steel Grating UAE | Arabian Gratings Dubai",
        "og_description": (
            "Premium SS316 floor grating for hygiene-critical and marine environments in UAE. "
            "Pickled, passivated, and electro-polished options. Arabian Gratings Dubai."
        ),
        "description": (
            "Arabian Gratings Stainless Steel SS316 Floor Gratings provide the highest level of "
            "corrosion resistance available in a welded grating product. Grade 316 stainless steel "
            "contains 2–3% molybdenum which dramatically improves pitting resistance in chloride-rich "
            "environments — the critical factor for UAE coastal and seawater applications.\n\n"
            "These panels are specified for food preparation and processing facilities, pharmaceutical "
            "cleanrooms, chemical storage flooring, offshore platform splash zones, and seawater "
            "intake structures across UAE and GCC. The fully pickled and passivated finish removes "
            "all surface contamination to maintain the passive protective oxide layer. "
            "Electro-polished surfaces are available for cleanroom and sanitary specifications "
            "requiring Ra surface roughness values below 0.8 μm."
        ),
        "features": (
            "Grade SS316 molybdenum alloy — superior chloride pitting resistance\n"
            "Fully pickled and passivated — hygienic, cleanable surface\n"
            "Electro-polish option — for Ra < 0.8 μm pharmaceutical and food-grade specs\n"
            "High temperature resistance — suitable up to 870°C continuous service\n"
            "Zero galvanic corrosion risk — single-material homogeneous construction\n"
            "Grade 304 option available for less aggressive indoor environments"
        ),
        "faq": [
            {
                "question": "When should SS316 be specified over SS304 in UAE projects?",
                "answer": (
                    "Grade SS316 is required wherever chloride exposure is present — including UAE "
                    "coastal zones, seawater splash areas, swimming pools, food processing facilities "
                    "using salt brines, or chemical plants with acidic cleaning agents. "
                    "SS304 is acceptable for dry indoor environments with no chloride exposure."
                )
            },
            {
                "question": "Is stainless steel grating suitable for food production facilities in UAE?",
                "answer": (
                    "Yes. SS316 grating with pickled and passivated finish is widely used in UAE "
                    "food processing and dairy facilities. The non-porous surface is fully cleanable "
                    "with standard food-grade sanitisers and conforms to typical food hygiene "
                    "regulatory requirements. Electro-polished finish is available for the strictest "
                    "hygienic specifications."
                )
            },
            {
                "question": "What is the maximum panel size available for SS316 grating?",
                "answer": (
                    "Standard stainless steel grating panels are available up to 1,000 mm × 6,000 mm. "
                    "Custom sizes, banded edge cut-outs, and non-standard bearing bar pitches are "
                    "available with minimum order quantities. Contact our Dubai sales desk for a "
                    "tailored quotation with structural drawing review."
                )
            }
        ],
        "extra_specs": [
            {"name": "Grade Option", "value": "SS304 or SS316 (specified at order)"},
            {"name": "Max Panel Length", "value": "Up to 6,000 mm (custom)"},
        ]
    },

    # ─────────────────────────────────────────────────────────────────────────
    # 4. Aluminium Access Grating Walkway
    # ─────────────────────────────────────────────────────────────────────────
    {
        "slug": "aluminium-access-grating-walkway",
        "seo_title": "Aluminium Grating UAE | Lightweight Walkway Panels | Arabian Gratings Dubai",
        "seo_description": (
            "Aluminium alloy 6063-T6 grating for lightweight walkways, facades and volatile zones "
            "across UAE. Non-sparking, anodized finish. Arabian Gratings — Dubai and Abu Dhabi."
        ),
        "og_title": "Aluminium Grating UAE | Non-Sparking Walkway Panels | Arabian Gratings",
        "og_description": (
            "Lightweight aluminium access grating for UAE walkways and volatile environments. "
            "6063-T6 alloy, anodized. Non-sparking and LEED recyclable. Arabian Gratings Dubai."
        ),
        "description": (
            "Arabian Gratings Aluminium Access Grating Walkways are extruded from aerospace-grade "
            "Aluminium Alloy 6063-T6 and 6061-T6, offering exceptional strength-to-weight "
            "performance. At approximately one-third the weight of equivalent steel panels, aluminium "
            "gratings significantly reduce structural dead loads — a key advantage for suspended "
            "walkways, elevated access platforms, and retrofit projects.\n\n"
            "A primary benefit in UAE industrial applications is the inherent non-sparking property "
            "of aluminium alloys, making these gratings mandatory in ATEX/hazardous area "
            "classifications around volatile gas, solvent and fuel storage. Clear anodized or powder-"
            "coated finishes are available. Aluminium grating is also fully recyclable, supporting "
            "LEED green building credits on UAE infrastructure projects in Dubai, Abu Dhabi and Sharjah."
        ),
        "features": (
            "Lightweight — approximately 1/3rd the weight of equivalent steel grating\n"
            "Inherently non-sparking — mandatory specification for ATEX/volatile zones\n"
            "Anodized corrosion protection — 20-micron AA20 anodizing standard\n"
            "Powder coat options — custom RAL colour matching for architectural projects\n"
            "Fully recyclable — contributes to LEED green building certification\n"
            "Structural alloy 6063-T6 — high tensile strength for load-bearing spans\n"
            "Naturally corrosion resistant without painting in non-marine environments"
        ),
        "faq": [
            {
                "question": "Why is aluminium grating preferred in explosive or volatile gas areas in UAE?",
                "answer": (
                    "Aluminium alloys are inherently non-sparking, meaning friction or impact will "
                    "not generate sparks that could ignite volatile gases or solvents. This makes "
                    "aluminium grating the mandatory specification for ATEX-classified zones in UAE "
                    "refineries, gas processing plants, solvent storage areas, and fuel handling "
                    "facilities per international safety standards."
                )
            },
            {
                "question": "Does aluminium grating require painting or coating in UAE outdoor conditions?",
                "answer": (
                    "Aluminium forms a natural protective oxide layer that prevents corrosion in "
                    "most outdoor environments without painting. For UAE coastal or marine "
                    "environments with salt spray, we recommend our 20-micron anodized finish (AA20 "
                    "class) which provides a hard, permanent protective surface while maintaining "
                    "the metallic appearance."
                )
            },
            {
                "question": "Is aluminium grating suitable for architectural facade projects in UAE?",
                "answer": (
                    "Yes. Aluminium grating panels are widely used in UAE architectural facade "
                    "screens, louvre systems, sunshading structures, and feature wall panels. "
                    "The clean metallic appearance, availability in custom RAL powder coat colours, "
                    "and lightweight construction make it the preferred choice for premium "
                    "architectural applications in Dubai and Abu Dhabi."
                )
            }
        ],
        "extra_specs": [
            {"name": "Alloy Temper", "value": "6063-T6 (standard) / 6061-T6 (heavy)"},
            {"name": "Anodizing Class", "value": "AA20 (20 microns minimum)"},
        ]
    },

    # ─────────────────────────────────────────────────────────────────────────
    # 5. Ductile Iron Double Sealed Manhole Cover
    # ─────────────────────────────────────────────────────────────────────────
    {
        "slug": "ductile-iron-double-sealed-manhole-cover",
        "seo_title": "Ductile Iron Manhole Cover D400 UAE | BS EN 124 | Arabian Gratings",
        "seo_description": (
            "Class D400 ductile iron double-sealed manhole covers for UAE roads and infrastructure. "
            "BS EN 124-2, 40-tonne rated. Arabian Gratings — supplier in Dubai and Abu Dhabi."
        ),
        "og_title": "D400 Ductile Iron Manhole Cover UAE | Arabian Gratings Dubai",
        "og_description": (
            "Heavy-duty ductile iron double-sealed manhole covers rated D400 for UAE highways and "
            "municipal infrastructure. BS EN 124-2 certified. Arabian Gratings Dubai."
        ),
        "description": (
            "Arabian Gratings Ductile Iron Double Sealed Manhole Covers are engineered to the "
            "BS EN 124-2 Class D400 load rating — the internationally recognised standard for "
            "carriageways carrying vehicular traffic up to 40 tonnes. The ductile iron alloy "
            "GJS 500-7 provides significantly higher impact strength and ductility compared to "
            "grey cast iron, preventing sudden brittle fracture under traffic shock loads.\n\n"
            "The double-seal frame design incorporates a grease-sealed compression chamber between "
            "the cover and frame that eliminates sewer gas odour escape and prevents rattling under "
            "dynamic traffic loading — a critical requirement for residential and commercial "
            "developments in UAE. These covers are suitable for UAE municipality road projects, "
            "highway shoulders, commercial parking structures, and public utility channels across "
            "Dubai, Abu Dhabi, Sharjah and the wider GCC."
        ),
        "features": (
            "Class D400 traffic load rated — certified for 40-tonne proof load testing\n"
            "Ductile iron GJS 500-7 alloy — high impact and ductility vs grey iron\n"
            "Double-sealed frame — eliminates sewer gas odour and rattle\n"
            "Locking security system — prevents unauthorised removal or tampering\n"
            "Slip-resistant surface pattern — prevents skidding on wet road surfaces\n"
            "Black bitumen coating — corrosion protection for buried frame elements\n"
            "Multiple load classes available — B125, C250, D400, E600, F900"
        ),
        "faq": [
            {
                "question": "What does Class D400 mean and which areas in UAE require it?",
                "answer": (
                    "Class D400 under BS EN 124-2 means the cover is certified to withstand a test "
                    "load of 400 kN (approximately 40 tonnes). In UAE, D400 covers are specified for "
                    "all carriageways open to heavy vehicular traffic including main roads, industrial "
                    "estate access routes, commercial parking areas, and airport perimeter roads. "
                    "Class B125 and C250 covers are used for pedestrian zones and light vehicle areas."
                )
            },
            {
                "question": "Why specify ductile iron rather than grey cast iron for UAE infrastructure?",
                "answer": (
                    "Ductile iron (GJS 500-7) has a spheroidal graphite microstructure that provides "
                    "12–18% elongation at failure compared to less than 1% for grey iron. This means "
                    "ductile iron covers absorb impact energy from heavy vehicle wheel loads without "
                    "sudden brittle fracture — a critical safety requirement for UAE highway and "
                    "municipal utility infrastructure."
                )
            },
            {
                "question": "Are custom sizes available for UAE municipality projects?",
                "answer": (
                    "Yes. Standard sizes are 600×600 mm and 600×900 mm clear opening, but we "
                    "manufacture custom sizes to project specifications for UAE municipality, "
                    "DEWA, ADWEA, and private developer projects. Provide your site drawing and "
                    "we will confirm size, load class, and frame depth requirements."
                )
            }
        ],
        "extra_specs": [
            {"name": "Load Classes Available", "value": "B125, C250, D400, E600, F900"},
            {"name": "Material Grade", "value": "GJS 500-7 Ductile Iron (EN 1563)"},
        ]
    },

    # ─────────────────────────────────────────────────────────────────────────
    # 6. M-Clip Grating Fastening Clamp
    # ─────────────────────────────────────────────────────────────────────────
    {
        "slug": "m-clip-grating-fastening-clamp",
        "seo_title": "Grating Clamp UAE | M-Clip SS316 Fasteners | Arabian Gratings Dubai",
        "seo_description": (
            "SS316 M-Clip grating fastening clamps for locking FRP and steel panels to structural "
            "beams in UAE. No drilling required. Arabian Gratings — Dubai and Abu Dhabi supplier."
        ),
        "og_title": "M-Clip Grating Clamp SS316 UAE | Arabian Gratings Dubai",
        "og_description": (
            "Grade SS316 M-Clip fastening clamps for securing grating panels without drilling. "
            "High vibration resistance. Arabian Gratings — UAE grating fastener supplier."
        ),
        "description": (
            "Arabian Gratings M-Clip Grating Fastening Clamps are precision-engineered saddle "
            "clamps fabricated from Grade SS316 stainless steel for permanent corrosion resistance "
            "in UAE industrial and marine environments. The M-Clip design grips the grating bearing "
            "bar directly over the structural support beam flange and locks with a captive M8 bolt "
            "and lock nut — requiring no drilling or welding of the support structure.\n\n"
            "These clamps are the standard installation accessory for both GRP/FRP moulded grating "
            "panels and electroforged steel grating panels across UAE industrial, utility, and "
            "offshore projects. The stainless steel construction provides excellent resistance to "
            "high-vibration environments such as pump platforms, compressor decks, and process "
            "area walkways. Galvanized steel clamps are available as a cost-effective alternative "
            "for non-corrosive indoor installations."
        ),
        "features": (
            "No drilling or welding required on support beams — non-invasive installation\n"
            "SS316 stainless steel construction — marine and chemical environment rated\n"
            "Captive M8 bolt and lock nut — vibration-resistant positive locking\n"
            "Compatible with 38mm mesh GRP panels and electroforged steel gratings\n"
            "Galvanized steel option available for indoor non-corrosive applications\n"
            "Reusable — panels can be safely lifted and re-fastened for maintenance access"
        ),
        "faq": [
            {
                "question": "How many M-Clips are required per grating panel in UAE installations?",
                "answer": (
                    "For structural safety compliance, we recommend a minimum of 4 M-Clips per "
                    "standard 1,000 mm × 2,000 mm grating panel, placed at the four corners over "
                    "the supporting beams. For panels in high-traffic or high-vibration areas such "
                    "as pump platforms or elevated walkways in UAE industrial sites, 6 clips per "
                    "panel is recommended for additional security."
                )
            },
            {
                "question": "Are the clamps compatible with both GRP and steel grating panels?",
                "answer": (
                    "Yes. The M-Clip saddle width of 38 mm is matched to the standard mesh pitch "
                    "of both 38×38 mm GRP moulded panels and 30×100 mm electroforged steel grating "
                    "panels. The clamp grips the bearing bar regardless of material, providing a "
                    "universal fastening solution for mixed material grating systems."
                )
            },
            {
                "question": "Can grating panels be removed for maintenance access when using M-Clips?",
                "answer": (
                    "Yes. M-Clips are fully removable. The M8 bolt can be loosened with a standard "
                    "spanner to release the clamp, allowing the grating panel to be lifted for "
                    "inspection, maintenance or utility access. The clamps can then be re-tightened "
                    "when the panel is replaced — a significant advantage over welded installations."
                )
            }
        ],
        "extra_specs": [
            {"name": "Bolt Thread", "value": "M8 × 70 mm hex head with nylon lock nut"},
            {"name": "Material Option", "value": "SS316 or Hot-Dip Galvanized Steel"},
        ]
    },

    # ─────────────────────────────────────────────────────────────────────────
    # 7. Ductile Iron Plastic Encapsulated Step Iron
    # ─────────────────────────────────────────────────────────────────────────
    {
        "slug": "ductile-iron-plastic-encapsulated-step-iron",
        "seo_title": "Step Iron UAE | Plastic-Encapsulated Manhole Steps | Arabian Gratings",
        "seo_description": (
            "BS EN 13101 ductile iron step irons with polypropylene encapsulation for manhole shafts "
            "and utility chambers in UAE. High-visibility yellow. Arabian Gratings Dubai."
        ),
        "og_title": "Plastic Encapsulated Step Iron UAE | Arabian Gratings Dubai",
        "og_description": (
            "Ductile iron step irons with acid-resistant polypropylene encapsulation for UAE "
            "manhole shafts and sewer chambers. BS EN 13101 certified. Arabian Gratings."
        ),
        "description": (
            "Arabian Gratings Plastic Encapsulated Step Irons are designed for safe descent into "
            "manhole shafts, utility chambers, sewer inspection pits, and water pump stations across "
            "UAE and GCC infrastructure projects. The structural core is high-tensile ductile iron "
            "Grade GJS 500-7, fully encapsulated in virgin high-density polypropylene (PP) plastic "
            "that is completely immune to the corrosive hydrogen sulphide (H₂S) gases and organic "
            "acids present in sewage and stormwater chambers.\n\n"
            "The high-visibility bright yellow encapsulation provides easy visual identification "
            "of footholds in dark confined spaces, while the moulded anti-slip foot platform "
            "prevents slipping on wet surfaces during maintenance descents. These step irons are "
            "certified to BS EN 13101 and are the standard specification for UAE municipality "
            "sewerage infrastructure projects in Dubai, Abu Dhabi, Sharjah and across the Emirates."
        ),
        "features": (
            "Ductile iron GJS 500-7 core — high tensile strength for safe climbing loads\n"
            "Polypropylene encapsulation — complete immunity to H₂S, acids and sewage gases\n"
            "High-visibility yellow coating — easy foothold identification in dark shafts\n"
            "Moulded anti-slip foot platform — safe grip on wet confined-space surfaces\n"
            "BS EN 13101 certified — meets UAE municipality sewerage specifications\n"
            "5.0 kN pull-out resistance — tested and certified structural anchorage\n"
            "Zero metal exposure to corrosive atmosphere — full plastic coverage"
        ),
        "faq": [
            {
                "question": "Why use plastic-encapsulated step irons rather than bare metal in UAE manholes?",
                "answer": (
                    "UAE sewer and stormwater manholes contain hydrogen sulphide (H₂S) gas and "
                    "organic acids that aggressively corrode bare metal step irons, eventually "
                    "causing structural failure of the climbing rungs — a serious safety risk for "
                    "maintenance workers. Polypropylene encapsulation creates a complete chemical "
                    "barrier between the ductile iron core and the corrosive atmosphere, ensuring "
                    "structural integrity over the design life of the infrastructure."
                )
            },
            {
                "question": "What pull-out resistance is certified for UAE utility chamber installations?",
                "answer": (
                    "Our step irons are tested and certified to a pull-out resistance of 5.0 kN "
                    "(approximately 500 kg) per step iron, as required by BS EN 13101. This ensures "
                    "the embedded anchor section remains fully structural under the loads imposed by "
                    "maintenance personnel in full safety equipment."
                )
            },
            {
                "question": "Are these step irons compatible with precast concrete manholes used in UAE?",
                "answer": (
                    "Yes. The step irons are designed for direct cast-in installation during precast "
                    "concrete manhole ring production, or for anchor-bolt installation into existing "
                    "structures. Our technical team can advise on the correct embedment depth and "
                    "spacing for each specific manhole shaft diameter and depth."
                )
            }
        ],
        "extra_specs": [
            {"name": "Wall Projection", "value": "150 mm wall projection depth"},
            {"name": "Standard Colour", "value": "High-Visibility Yellow PP Encapsulation"},
        ]
    },

    # ─────────────────────────────────────────────────────────────────────────
    # 8. Stainless Steel Tactile Stud
    # ─────────────────────────────────────────────────────────────────────────
    {
        "slug": "stainless-steel-tactile-stud",
        "seo_title": "Tactile Stud UAE | SS316 Pavement Warning Indicator | Arabian Gratings",
        "seo_description": (
            "Grade SS316 stainless steel tactile warning studs for UAE pedestrian accessibility. "
            "ISO 23599, BS 8300. Supplier in Dubai, Abu Dhabi and Sharjah. Arabian Gratings."
        ),
        "og_title": "Stainless Steel Tactile Stud UAE | Arabian Gratings Dubai",
        "og_description": (
            "SS316 tactile warning studs for UAE metro, airport and public pedestrian zones. "
            "ISO 23599 and BS 8300 compliant. Arabian Gratings — Dubai and Abu Dhabi."
        ),
        "description": (
            "Arabian Gratings Stainless Steel Tactile Warning Studs are precision-machined from "
            "Grade SS316 stainless steel to provide permanent tactile guidance surfaces for visually "
            "impaired pedestrians at hazard warning zones, platform edges, crosswalk beginnings, "
            "and staircase landings. The concentric ring top surface creates a distinctive tactile "
            "pattern detectable underfoot that meets ISO 23599 and BS 8300 international "
            "pedestrian accessibility standards.\n\n"
            "These studs are specified for UAE metro stations, international airports, public "
            "squares, shopping mall entrances, pedestrian bridges, and government building "
            "approaches across Dubai, Abu Dhabi, Sharjah and across the Emirates. Grade SS316 "
            "ensures long-term durability in UAE outdoor conditions including UV exposure, "
            "salt-laden coastal air, and the thermal cycling of desert climates. Installation "
            "uses standard 8 mm diamond core drill bits and high-bond epoxy adhesive compatible "
            "with granite, concrete, and porcelain tile substrate surfaces."
        ),
        "features": (
            "Grade SS316 — superior resistance to outdoor UAE coastal and desert conditions\n"
            "ISO 23599 and BS 8300 compliant — meets UAE accessibility regulatory requirements\n"
            "Concentric ring tactile pattern — detectable by both foot and white cane\n"
            "Precision machine-turned finish — consistent profile height for compliance\n"
            "High-bond epoxy installation — compatible with granite, tile and concrete\n"
            "Anti-vandal design — flush 5 mm profile resistant to tripping and damage\n"
            "Also available in brass, aluminium, and polyurethane materials"
        ),
        "faq": [
            {
                "question": "Which UAE public infrastructure projects require tactile studs?",
                "answer": (
                    "Tactile warning studs are mandatory under UAE Federal Law and Dubai Accessibility "
                    "Code for all public buildings, metro stations, airports, government facilities, "
                    "hospitals, educational institutions, and public pedestrian zones. The Dubai "
                    "Universal Design Code and Abu Dhabi Municipality guidelines specify the placement "
                    "patterns, spacing dimensions, and stud profiles required at hazard warning areas."
                )
            },
            {
                "question": "How are stainless steel tactile studs installed on natural stone or tile?",
                "answer": (
                    "A diamond core drill creates 8 mm diameter anchor holes to the specified depth. "
                    "The holes are thoroughly cleaned with compressed air to remove dust. High-bond "
                    "epoxy adhesive is injected into the hole and the tactile stud stem is inserted "
                    "and rotated to fully coat the anchor. After the manufacturer's curing period "
                    "the stud is flush-trimmed if required. No mechanical fixing or surface damage "
                    "is visible around the installed stud."
                )
            },
            {
                "question": "Are brass or yellow tactile studs available as an alternative to stainless steel?",
                "answer": (
                    "Yes. We supply tactile indicator studs in Grade SS316 stainless steel, "
                    "polished brass, anodized aluminium, and bright yellow polyurethane plastic. "
                    "Brass and yellow polyurethane are commonly specified in Dubai and Abu Dhabi "
                    "metro stations and airports for high visual contrast, while stainless steel "
                    "is preferred for outdoor public squares and building entrances where a premium "
                    "finish is required."
                )
            }
        ],
        "extra_specs": [
            {"name": "Top Surface Pattern", "value": "Concentric rings (tactile dome variant available)"},
            {"name": "Material Options", "value": "SS316 / Brass / Aluminium / Polyurethane"},
        ]
    },
]


def run():
    print("Starting non-destructive product SEO and content update...\n")
    updated = 0
    skipped = 0

    for data in PRODUCT_UPDATES:
        slug = data["slug"]
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            print(f"  [SKIP] Product not found: {slug}")
            skipped += 1
            continue

        # Update text fields
        product.seo_title = data["seo_title"]
        product.seo_description = data["seo_description"]
        product.og_title = data.get("og_title", data["seo_title"])
        product.og_description = data.get("og_description", data["seo_description"])
        product.description = data["description"]
        product.features = data["features"]
        product.faq = data["faq"]
        product.save(update_fields=[
            "seo_title", "seo_description", "og_title", "og_description",
            "description", "features", "faq"
        ])

        # Append extra spec rows (only if they don't already exist for this product)
        for spec_data in data.get("extra_specs", []):
            exists = ProductSpecification.objects.filter(
                product=product, name=spec_data["name"]
            ).exists()
            if not exists:
                # Get current max sort_order
                max_order = ProductSpecification.objects.filter(
                    product=product
                ).order_by("-sort_order").values_list("sort_order", flat=True).first() or 0
                ProductSpecification.objects.create(
                    product=product,
                    name=spec_data["name"],
                    value=spec_data["value"],
                    sort_order=max_order + 1
                )
                print(f"  + Added spec row: {spec_data['name']} = {spec_data['value']}")

        print(f"  [OK] Updated: {product.name}")
        print(f"       SEO title: {product.seo_title}")
        print(f"       FAQs:      {len(product.faq)}")
        print(f"       Spec rows: {product.spec_rows.count()}")
        print()
        updated += 1

    print(f"Done. Updated: {updated} products. Skipped: {skipped}.")


if __name__ == "__main__":
    run()

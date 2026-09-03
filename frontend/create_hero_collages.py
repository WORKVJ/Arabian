import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# Source paths
REAL1_DIR = r"c:\Users\91811\OneDrive\Desktop\arab-New\Arabian_gratings\frontend\public\img\real1"
REAL2_DIR = r"c:\Users\91811\OneDrive\Desktop\arab-New\Arabian_gratings\frontend\public\img\real2"
OUTPUT_DIR = r"c:\Users\91811\OneDrive\Desktop\arab-New\Arabian_gratings\frontend\public\img"

W, H = 1920, 1080
ACCENT_ORANGE = (232, 97, 44)       # #E8612C
ACCENT_HOVER = (207, 77, 27)        # #CF4D1B
DARK_BG = (13, 15, 18)              # #0D0F12
DARK_CHARCOAL = (17, 19, 24)        # #111318

def load_and_crop(path, target_w, target_h):
    """Load image and center-crop to target aspect ratio and size."""
    img = Image.open(path).convert("RGBA")
    src_w, src_h = img.size
    
    target_aspect = target_w / target_h
    src_aspect = src_w / src_h
    
    if src_aspect > target_aspect:
        new_w = int(src_h * target_aspect)
        left = (src_w - new_w) // 2
        img = img.crop((left, 0, left + new_w, src_h))
    else:
        new_h = int(src_w / target_aspect)
        top = (src_h - new_h) // 2
        img = img.crop((0, top, src_w, top + new_h))
        
    return img.resize((target_w, target_h), Image.Resampling.LANCZOS)

def draw_polygon_with_image(base, img_path, polygon_pts, border_color=ACCENT_ORANGE, border_width=8):
    """Crops and masks image to a polygon and pastes onto base with border."""
    min_x = min(p[0] for p in polygon_pts)
    max_x = max(p[0] for p in polygon_pts)
    min_y = min(p[1] for p in polygon_pts)
    max_y = max(p[1] for p in polygon_pts)
    
    poly_w = max(1, max_x - min_x)
    poly_h = max(1, max_y - min_y)
    
    cropped_img = load_and_crop(img_path, poly_w, poly_h)
    
    # Anti-aliased mask
    mask = Image.new("L", (poly_w * 2, poly_h * 2), 0)
    draw_mask = ImageDraw.Draw(mask)
    rel_pts_2x = [((p[0] - min_x) * 2, (p[1] - min_y) * 2) for p in polygon_pts]
    draw_mask.polygon(rel_pts_2x, fill=255)
    mask = mask.resize((poly_w, poly_h), Image.Resampling.LANCZOS)
    
    base.paste(cropped_img, (min_x, min_y), mask)
    
    draw = ImageDraw.Draw(base)
    for i in range(len(polygon_pts)):
        p1 = polygon_pts[i]
        p2 = polygon_pts[(i + 1) % len(polygon_pts)]
        draw.line([p1, p2], fill=border_color, width=border_width)

def generate_collage_1():
    """Collage 1: Marine & Offshore Port Catwalks with real client photos."""
    canvas = Image.new("RGBA", (W, H), DARK_BG)
    draw = ImageDraw.Draw(canvas)
    
    # Left decorative chevrons
    draw.polygon([(40, 260), (120, 140), (160, 140), (80, 260)], fill=ACCENT_ORANGE)
    draw.polygon([(10, 520), (150, 310), (190, 310), (50, 520)], fill=ACCENT_HOVER)
    
    # Right decorative chevrons
    draw.polygon([(W - 50, 280), (W - 190, 490), (W - 150, 490), (W - 10, 280)], fill=ACCENT_ORANGE)
    draw.polygon([(W - 80, 530), (W - 180, 680), (W - 140, 680), (W - 40, 530)], fill=ACCENT_HOVER)
    
    # Poly 1: Left - Refinery Piping & Grating Stairs (img 13)
    p1 = [(80, 220), (460, 40), (580, 40), (320, 940), (80, 940)]
    draw_polygon_with_image(canvas, os.path.join(REAL1_DIR, "img (13).jpeg"), p1)
    
    # Poly 2: Center (MAIN HERO) - Real engineer on walkway over turquoise sea (img 8)
    p2 = [(600, 40), (1140, 40), (1280, 1020), (740, 1020)]
    draw_polygon_with_image(canvas, os.path.join(REAL1_DIR, "img (8).jpeg"), p2)
    
    # Poly 3: Top Right - Giant Shipping Port Crane (img 1)
    p3 = [(1160, 40), (1840, 40), (1700, 500), (1220, 500)]
    draw_polygon_with_image(canvas, os.path.join(REAL1_DIR, "img (1).jpeg"), p3)
    
    # Poly 4: Bottom Right - Detailed Grating Walkway over Harbor (img 2)
    p4 = [(1240, 520), (1720, 520), (1860, 1020), (1300, 1020)]
    draw_polygon_with_image(canvas, os.path.join(REAL1_DIR, "img (2).jpeg"), p4)
    
    out_path = os.path.join(OUTPUT_DIR, "hero-real-1.png")
    canvas.convert("RGB").save(out_path, quality=95)
    print(f"Generated {out_path}")

def generate_collage_2():
    """Collage 2: Quality Inspection, Fabrication & Stair Systems."""
    canvas = Image.new("RGBA", (W, H), DARK_BG)
    draw = ImageDraw.Draw(canvas)
    
    # Decorative chevrons
    draw.polygon([(30, 220), (110, 100), (150, 100), (70, 220)], fill=ACCENT_ORANGE)
    draw.polygon([(10, 480), (130, 300), (170, 300), (50, 480)], fill=ACCENT_HOVER)
    draw.polygon([(W - 60, 240), (W - 180, 420), (W - 140, 420), (W - 20, 240)], fill=ACCENT_ORANGE)
    draw.polygon([(W - 100, 600), (W - 180, 720), (W - 140, 720), (W - 60, 600)], fill=ACCENT_HOVER)
    
    # Poly 1: Top Center - Industrial Stair Treads with Nosing (new 9)
    p1 = [(480, 40), (1380, 40), (1280, 470), (380, 470)]
    draw_polygon_with_image(canvas, os.path.join(REAL2_DIR, "new (9).jpeg"), p1)
    
    # Poly 2: Left - Industrial Plant Facility (new 10)
    p2 = [(80, 140), (360, 470), (740, 470), (640, 1020), (80, 1020)]
    draw_polygon_with_image(canvas, os.path.join(REAL2_DIR, "new (10).jpeg"), p2)
    
    # Poly 3: Center Bottom - Stacks of fabricated gratings with reference tags (new 1)
    p3 = [(660, 490), (1220, 490), (1160, 1020), (620, 1020)]
    draw_polygon_with_image(canvas, os.path.join(REAL2_DIR, "new (1).jpeg"), p3)
    
    # Poly 4: Right Top - Structural Steel Underside of Stairs (new 7)
    p4 = [(1300, 40), (1840, 40), (1720, 510), (1260, 510)]
    draw_polygon_with_image(canvas, os.path.join(REAL2_DIR, "new (7).jpeg"), p4)
    
    # Poly 5: Bottom Right (MAIN TEST FOCUS) - Real Elcometer coating gauge 139 µm (new 8)
    p5 = [(1240, 530), (1740, 530), (1860, 1020), (1180, 1020)]
    draw_polygon_with_image(canvas, os.path.join(REAL2_DIR, "new (8).jpeg"), p5)
    
    out_path = os.path.join(OUTPUT_DIR, "hero-real-2.png")
    canvas.convert("RGB").save(out_path, quality=95)
    print(f"Generated {out_path}")

if __name__ == "__main__":
    generate_collage_1()
    generate_collage_2()

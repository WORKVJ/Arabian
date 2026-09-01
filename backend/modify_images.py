from PIL import Image, ImageOps, ImageEnhance

public_dir = "../frontend/public"
products_dir = "../frontend/public/img/products"

# 1. Channel / Gully Grating: let's take product-steel-grating.jpg, tint it to a very dark black/charcoal cast-iron color, and crop it.
with Image.open(f"{public_dir}/product-steel-grating.jpg") as img:
    # Convert to grayscale
    gray = ImageOps.grayscale(img)
    # Enhance contrast to make it look dark
    enhancer = ImageEnhance.Brightness(gray)
    dark = enhancer.enhance(0.4)
    # Save as prod-channel-gully-grating.jpg
    dark.save(f"{products_dir}/prod-channel-gully-grating.jpg")
    print("Created prod-channel-gully-grating.jpg (Dark-coated gully grate style)")

# 2. S.G Iron / Ductile: let's take product-manhole-cover.jpg, rotate it by 90 degrees, and tint it to a rustic bronze/brown color.
with Image.open(f"{public_dir}/product-manhole-cover.jpg") as img:
    # Rotate 90
    rotated = img.rotate(90)
    # Adjust color (tint to bronze)
    gray = ImageOps.grayscale(rotated)
    bronze = ImageOps.colorize(gray, black="#1a0d00", white="#a67c52")
    bronze.save(f"{products_dir}/prod-sg-iron-ductile.jpg")
    print("Created prod-sg-iron-ductile.jpg (Bronze rust-resistant coated style)")

# 3. Carriageway Cover & Frame: let's take product-manhole-cover.jpg, flip it vertically, and increase contrast and make it a clean dark-grey metallic color.
with Image.open(f"{public_dir}/product-manhole-cover.jpg") as img:
    flipped = ImageOps.flip(img)
    gray = ImageOps.grayscale(flipped)
    metallic = ImageOps.colorize(gray, black="#000814", white="#b3c5d7")
    metallic.save(f"{products_dir}/prod-carriageway-cover.jpg")
    print("Created prod-carriageway-cover.jpg (Clean metallic silver-blue carriageway style)")

# 4. Heel Proof Grating: let's take product-steel-grating.jpg, rotate it 90 degrees, and colorize to a clean steel-blue color.
with Image.open(f"{public_dir}/product-steel-grating.jpg") as img:
    rotated = img.rotate(90)
    gray = ImageOps.grayscale(rotated)
    steel_blue = ImageOps.colorize(gray, black="#0d1b2a", white="#e0e1dd")
    steel_blue.save(f"{products_dir}/prod-heel-proof-grating.jpg")
    print("Created prod-heel-proof-grating.jpg (Stainless steel-blue heel-proof style)")

# 5. Tactile Studs / Shear Connectors: let's take product-tactile-stud.jpg, rotate 180 degrees, and colorize to copper/brass color.
with Image.open(f"{public_dir}/product-tactile-stud.jpg") as img:
    rotated = img.rotate(180)
    gray = ImageOps.grayscale(rotated)
    copper = ImageOps.colorize(gray, black="#1a0a00", white="#cc8800")
    copper.save(f"{products_dir}/prod-shear-connector.jpg")
    print("Created prod-shear-connector.jpg (Bronze/copper composite style)")

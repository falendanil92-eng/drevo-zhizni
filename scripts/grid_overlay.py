from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SOURCE = Path('/Users/filipp/Desktop/Древо Жизни')
OUTPUT = SOURCE / 'grid-analysis'
OUTPUT.mkdir(exist_ok=True)

photos = sorted(SOURCE.glob('photo_*.jpeg'))

for number, source in enumerate(photos, start=1):
    image = Image.open(source).convert('RGB')
    draw = ImageDraw.Draw(image, 'RGBA')
    width, height = image.size
    left, right = round(width * .055), round(width * .945)
    top, bottom = round(height * .075), round(height * .90)

    draw.rectangle((left, top, right, bottom), outline=(210, 30, 30, 230), width=3)
    column = (right - left) / 12
    row = (bottom - top) / 12

    for index in range(13):
        x = round(left + index * column)
        color = (210, 30, 30, 150) if index in (0, 3, 6, 9, 12) else (210, 30, 30, 70)
        draw.line((x, top, x, bottom), fill=color, width=2 if index % 3 == 0 else 1)
    for index in range(13):
        y = round(top + index * row)
        color = (30, 90, 210, 130) if index in (0, 3, 6, 9, 12) else (30, 90, 210, 55)
        draw.line((left, y, right, y), fill=color, width=2 if index % 3 == 0 else 1)

    label = f'{number:02d}  |  12 columns × 12 rows'
    draw.rectangle((left, max(0, top - 34), left + 245, top), fill=(255, 255, 255, 220))
    draw.text((left + 8, max(2, top - 28)), label, fill=(25, 25, 25, 255))
    image.save(OUTPUT / f'{number:02d}-grid.jpg', quality=92)

thumbs = []
for path in sorted(OUTPUT.glob('*-grid.jpg')):
    image = Image.open(path)
    image.thumbnail((480, 360))
    thumbs.append(image.copy())

sheet = Image.new('RGB', (1000, ((len(thumbs) + 1) // 2) * 390), 'white')
for index, image in enumerate(thumbs):
    x = 10 + (index % 2) * 500
    y = 10 + (index // 2) * 390
    sheet.paste(image, (x, y))
sheet.save(OUTPUT / 'contact-sheet-grid.jpg', quality=92)

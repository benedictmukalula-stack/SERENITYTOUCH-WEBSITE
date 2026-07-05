#!/usr/bin/env python3
"""Bulk rebrand Tina's Sanctuary → Serenity Touch Spa"""
import os, re

SRC = '/home/z/my-project/src'
files = []
for root, dirs, fnames in os.walk(SRC):
    for f in fnames:
        if f.endswith(('.tsx', '.ts')):
            files.append(os.path.join(root, f))

replacements = [
    # Brand name
    ("Tina's Sanctuary", "Serenity Touch Spa"),
    ("Tina&apos;s Sanctuary", "Serenity Touch Spa"),
    ("tinassanctuary.zm", "serenitytouch.co.zm"),
    ("tinassanctuary", "serenitytouch"),
    ("tinas-sanctuary-storage", "serenity-touch-storage"),
    
    # Tone - professional wellness
    ("sensual massage", "therapeutic massage"),
    ("sensual", "therapeutic"),
    ("Sensual", "Therapeutic"),
    ("intoxicating", "transformative"),
    ("Intoxicating", "Transformative"),
    ("crave", "seek"),
    ("unravel you completely", "restore your complete well-being"),
    ("MOST DESIRED", "MOST POPULAR"),
    ("Indulge Now", "Join Now"),
    ("Indulge", "Enjoy"),
    ("indulgence", "relaxation"),
    
    # Homepage specific
    ("LUSAKA'S MOST PRIVATE SANCTUARY", "LUSAKA'S PREMIER LUXURY SPA"),
    ("Why they come back", "Why Our Guests Return"),
    ("Three ways to indulge", "Three Ways to Invest in Your Wellness"),
    ("Curious minds", "Frequently Asked Questions"),
    ("Ready to let go?", "Ready to Experience Serenity?"),
    ("Meet Tina", "Learn About Us"),
    ("Book Your Escape", "Book Appointment"),
    ("Explore Our Rituals", "View Treatments"),
]

# WhatsApp URL number change (specific pattern)
wa_replacements = [
    ("wa.me/260572782539", "wa.me/260761404555"),
]

total_changes = 0
for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    for old, new in replacements:
        content = content.replace(old, new)
    
    for old, new in wa_replacements:
        content = content.replace(old, new)
    
    # Logo initials: TS → ST (only in specific logo divs)
    # In Navigation and Footer, the logo has specific patterns
    content = re.sub(
        r'(className="[^"]*w-9 h-9[^"]*"[^>]*>)[^<]*?(</div>)',
        lambda m: m.group(1) + 'ST' + m.group(2) if m.group(0).__contains__('gradient') else m.group(0),
        content
    )
    
    # "sanctuary" → "spa" in visible text (not in CSS classes, file paths, or variable names)
    # Only replace when it appears as a standalone word in text content
    # Be selective: replace in strings, JSX text, but NOT in class names or code identifiers
    content = re.sub(r'\bSanctuary\b', 'Spa', content)
    # lowercase 'sanctuary' only in certain contexts
    content = content.replace("private sanctuary", "premium spa")
    content = content.replace("wellness sanctuary", "wellness spa")
    
    # "Rituals" in nav/section titles → "Treatments"
    content = content.replace("Signature Rituals", "Signature Treatments")
    content = content.replace("Our Signature Rituals", "Our Signature Treatments")
    content = content.replace("Every ritual", "Every treatment")
    content = content.replace("each ritual", "each treatment")
    content = content.replace("first ritual", "first appointment")
    content = content.replace("your ritual", "your treatment")
    content = content.replace("the ritual", "the treatment")
    content = content.replace('composed for', 'designed for')
    content = content.replace('Composed for', 'Designed for')
    
    # "pleasure" → "wellness"
    content = content.replace("Composed for Pleasure", "Designed for Wellness")
    content = content.replace("for Pleasure", "for Wellness")
    content = content.replace("additional pleasures", "additional treatments")
    content = content.replace("of pleasure", "of wellness")
    
    # "surrender" in text
    content = content.replace("ultimate surrender", "ultimate experience")
    content = content.replace("complete surrender", "complete relaxation")
    content = content.replace("Surrender to", "Relax • Restore •")
    content = content.replace("let go", "experience serenity")
    
    # "desire" → wellness goal
    content = content.replace("your deepest desires", "your wellness goals")
    
    # Copyright
    content = content.replace("Crafted in Lusaka, Zambia", "All rights reserved")
    content = content.replace("R18 · Members must be 18 or older.", "")
    
    # Nav labels
    content = content.replace("{ label: 'Rituals'", "{ label: 'Treatments'")
    content = content.replace("{ label: 'Journal'", "{ label: 'Blog'")
    
    if content != original:
        changes = len(original) - len(content)  # rough measure
        total_changes += 1
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  Updated: {filepath}")

print(f"\nTotal files updated: {total_changes}")
# Platform Icons

This directory contains icons for social media platforms featured on the site.

## Guidelines

### File Naming Convention

Use lowercase slugs matching the platform slug in the database:

- `reddit.svg`
- `facebook.svg`
- `discord.svg`
- `youtube.svg`
- `instagram.svg`
- `twitter.svg`

### Icon Specifications

- **Format**: SVG (preferred) or PNG
- **Size**: 48x48px minimum (SVG scales perfectly)
- **Style**: Simple, recognizable brand icons
- **Background**: Transparent
- **Color**: Original brand colors or monochrome

### Sources for Icons

1. **Official Brand Assets**: Check platform's brand/press kit
2. **Simple Icons**: https://simpleicons.org/ (MIT licensed)
3. **Font Awesome Brands**: https://fontawesome.com/search?o=r&m=free&f=brands
4. **Iconify**: https://icon-sets.iconify.design/

### Usage in Database

When adding a platform, set the `icon_url` field to:

```
/platforms/{slug}.svg
```

Example:

```sql
INSERT INTO platforms (slug, name, icon_url, ...)
VALUES ('reddit', 'Reddit', '/platforms/reddit.svg', ...);
```

### Next.js Image Optimization

For PNG files, consider using Next.js Image component:

```tsx
<Image src="/platforms/reddit.png" alt="Reddit" width={48} height={48} />
```

For SVG files, use regular `<img>` tag as implemented in `PublicPlatformCard`.

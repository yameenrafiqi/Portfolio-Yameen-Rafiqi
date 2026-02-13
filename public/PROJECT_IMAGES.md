# Project Images & Live URLs Guide

## How to Add Custom Project Images

To add custom images for your GitHub projects:

1. **Place your image in the `public` folder**
   - Example: `public/your-project-name.png`
   - Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`

2. **Update the mapping in `lib/github.ts`**
   - Open `/lib/github.ts`
   - Find the `getProjectImage` function
   - Add your project to the `projectImages` object:
   
   ```typescript
   const projectImages: Record<string, string> = {
     'real-raw-spill': '/rawspill.png',
     'your-project-name': '/your-image.png',  // Add your project here
   };
   ```

3. **Image naming tips:**
   - Use lowercase
   - Replace spaces with hyphens
   - Match your GitHub repository name
   - Multiple variations supported (e.g., 'real-raw-spill', 'real_raw_spill', 'rawspill')

## How to Add Live Project URLs

To add live/deployed URLs for your projects:

1. **Update the mapping in `lib/github.ts`**
   - Open `/lib/github.ts`
   - Find the `getProjectLiveUrl` function
   - Add your project to the `liveUrls` object:
   
   ```typescript
   const liveUrls: Record<string, string> = {
     'mosque-management-system': 'https://masjid-al-taqwa-lolab.netlify.app/',
     'real-raw-spill': 'https://rawspill.com/',
     'your-project-name': 'https://your-live-url.com/',  // Add your project here
   };
   ```

2. **The "Check Live" button will automatically appear** for projects with live URLs

## Current Custom Images

- **real raw spill**: `/rawspill.png`

## Current Live URLs

- **Mosque Management System**: https://masjid-al-taqwa-lolab.netlify.app/
- **RawSpill**: https://rawspill.com/

## Fallback Images

Projects without custom images automatically get:
- Language-specific stock photos
- Generic coding/tech images

## Recommended Image Specs

- **Dimensions**: 1200x675px (16:9 ratio)
- **Format**: PNG or JPG
- **Size**: Under 500KB for optimal loading
- **Content**: Screenshots, logos, or relevant themed images

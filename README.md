# The Ark Veterinary Clinic Website

A modern, responsive, and accessible static website for The Ark Veterinary Clinic in Chennai, Tamil Nadu.

## 🚀 Features

- **Responsive Design**: Mobile-first approach using Bootstrap 5
- **SEO Optimized**: Meta tags, JSON-LD structured data, and semantic HTML
- **Accessibility**: WCAG compliant with ARIA labels and keyboard navigation
- **Interactive Features**: 
  - Real-time clinic open/closed status
  - Appointment booking with calendar integration (.ics file download)
  - Image gallery with lightbox
  - Testimonials carousel
  - Service cost inquiry modals
- **Contact Integration**: WhatsApp, phone calls, and appointment booking
- **Cookie Consent**: GDPR-friendly cookie notification
- **Print-friendly**: Appointment confirmation printing
- **Performance**: Lazy loading images, optimized assets

## 📁 Project Structure

```
├── index.html           # Main website file
├── css/
│   └── styles.css       # Custom styles
├── js/
│   └── scripts.js       # Custom JavaScript
├── assets/
│   ├── logo.png         # Clinic logo
│   ├── hero.jpg         # Hero section image
│   ├── doctors/
│   │   └── dr-aravind.jpg
│   └── gallery/
│       ├── clinic-interior-1.jpg
│       ├── pet-surgery-1.jpg
│       ├── grooming-1.jpg
│       ├── waiting-area.jpg
│       ├── happy-pets-1.jpg
│       └── equipment.jpg
├── sitemap.xml          # SEO sitemap
├── robots.txt           # Search engine directives
└── README.md            # This file
```

## 🖼️ Image Requirements

### Required Images and Recommended Sizes:

1. **Logo** (`assets/logo.png`)
   - Size: 200x200px
   - Format: PNG with transparent background
   - Alt text: "The Ark Veterinary Clinic Logo"

2. **Hero Image** (`assets/hero.jpg`)
   - Size: 1200x800px
   - Format: JPG (optimized, 80% quality)
   - Subject: Happy pets or friendly clinic environment
   - Alt text: "Happy pets at The Ark Veterinary Clinic"

3. **Doctor Photo** (`assets/doctors/dr-aravind.jpg`)
   - Size: 600x800px (portrait)
   - Format: JPG (optimized, 80% quality)
   - Subject: Professional headshot
   - Alt text: "Dr. Aravind Kumar S M"

4. **Gallery Images** (`assets/gallery/`)
   - Size: 800x600px (landscape)
   - Format: JPG (optimized, 75% quality)
   - Subjects:
     - `clinic-interior-1.jpg`: Modern clinic interior
     - `pet-surgery-1.jpg`: Surgical suite or procedure room
     - `grooming-1.jpg`: Pet grooming area
     - `waiting-area.jpg`: Comfortable waiting room
     - `happy-pets-1.jpg`: Satisfied pet patients
     - `equipment.jpg`: Medical equipment

### Image Optimization Tips:
- Use tools like TinyPNG or ImageOptim to compress images
- Consider using WebP format for modern browsers (with JPG fallback)
- Use `srcset` attributes for responsive images
- Always include descriptive `alt` text for accessibility

## 🔧 Setup and Configuration

### 1. Basic Setup

1. Upload all files to your web server
2. Replace placeholder images in the `assets/` folder
3. Update contact information if needed

### 2. Form Configuration (Formspree)

**Option A: Using Formspree (Recommended)**

1. Create a free account at [Formspree.io](https://formspree.io/)
2. Create a new form and get your form endpoint
3. Open `js/scripts.js` and find the line:
   ```javascript
   const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
4. Replace `YOUR_FORM_ID` with your actual Formspree form ID

**Option B: Email Fallback**

The form automatically saves appointments to localStorage. Users can:
- Download an `.ics` calendar file
- Send appointment details via WhatsApp
- Print confirmation

**Option C: Custom Backend**

To integrate with your own backend:
1. Modify the `submitToFormspree()` function in `js/scripts.js`
2. Change the endpoint to your server's API
3. Update the fetch request as needed

### 3. WhatsApp Configuration

WhatsApp links are pre-configured with both phone numbers:
- Ambattur: +919841877423
- Thiruvanmiyur: +917942699091

To customize messages, edit the `whatsappMessage` variables in `js/scripts.js`.

### 4. Google Maps Integration

The embedded maps use placeholder coordinates. To update:

1. Go to [Google Maps](https://maps.google.com)
2. Find your clinic location
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the existing iframe in `index.html` (search for "map-embed")

### 5. SEO Configuration

**Update Meta Tags:**
- Edit the `<title>` tag
- Update `<meta name="description">` content
- Update Open Graph tags with your domain
- Add your logo/hero image URLs

**Create sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Create robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

### 6. PWA Configuration (Optional)

To enable Progressive Web App features:

1. Create `manifest.json`:
```json
{
  "name": "The Ark Veterinary Clinic",
  "short_name": "Ark Vet",
  "description": "Professional veterinary care in Chennai",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2c7a7b",
  "icons": [
    {
      "src": "assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. Add to `<head>` in `index.html`:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#2c7a7b">
```

3. Create a service worker (`sw.js`) for offline caching:
```javascript
const CACHE_NAME = 'ark-vet-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/scripts.js',
  '/assets/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

## 🎨 Customization

### Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #2c7a7b;      /* Teal */
    --primary-dark: #234e52;
    --primary-light: #81e6d9;
    --secondary-color: #48bb78;     /* Green */
    --accent-color: #ed8936;        /* Orange */
}
```

### Typography

Google Fonts are already included:
- **Headings**: Poppins (600, 700)
- **Body**: Inter (400, 500, 600)

To change fonts, update the Google Fonts link in `index.html` and CSS font-family rules.

### Content Updates

**Clinic Information:**
- Edit addresses, phone numbers, and hours in `index.html`
- Update the JSON-LD structured data in `<script type="application/ld+json">`
- Modify service descriptions in the Services section

**Adding Doctors:**

Copy the doctor card structure in the Doctors section and modify:
```html
<div class="col-md-6 col-lg-4 mb-4">
    <div class="card doctor-card h-100">
        <!-- Update image, name, specialties, etc. -->
    </div>
</div>
```

**Adding Services:**

Copy a service card and customize:
```html
<div class="col-md-6 col-lg-4 mb-4">
    <div class="card service-card h-100">
        <div class="card-body">
            <div class="service-icon"><i class="fas fa-your-icon"></i></div>
            <h5 class="card-title">Your Service</h5>
            <p class="card-text">Description</p>
            <button class="btn btn-outline-primary btn-sm" data-service="Your Service" onclick="openServiceModal(this)">Get Cost</button>
        </div>
    </div>
</div>
```

## 📱 Testing

### Browser Compatibility
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Testing
Test at these breakpoints:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

### Accessibility Testing
- Run [WAVE](https://wave.webaim.org/) accessibility checker
- Test keyboard navigation (Tab, Enter, Escape)
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify color contrast ratios

### Performance Testing
- Use Google PageSpeed Insights
- Aim for 90+ scores on mobile and desktop
- Optimize images if needed
- Minimize CSS/JS if deploying to production

## 🚀 Deployment

### Static Hosting (Recommended)

**Netlify:**
1. Drag and drop the entire folder to [Netlify Drop](https://app.netlify.com/drop)
2. Custom domain configuration available

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory

**GitHub Pages:**
1. Create a GitHub repository
2. Push all files
3. Enable GitHub Pages in repository settings

**Traditional Web Hosting:**
1. Upload all files via FTP/SFTP
2. Ensure `index.html` is in the root directory
3. Set proper file permissions (644 for files, 755 for directories)

### Production Checklist

- [ ] Replace all placeholder images
- [ ] Update contact information
- [ ] Configure Formspree or email handling
- [ ] Test all WhatsApp/phone links
- [ ] Update Google Maps embeds
- [ ] Add real clinic photos to gallery
- [ ] Test appointment form submission
- [ ] Verify SEO meta tags
- [ ] Test on mobile devices
- [ ] Check page load speed
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Submit sitemap to Google Search Console
- [ ] Test all internal links
- [ ] Verify SSL certificate (HTTPS)

## 🐛 Troubleshooting

**Forms not submitting:**
- Check Formspree configuration
- Verify internet connection
- Check browser console for errors
- Ensure localStorage is enabled

**Images not loading:**
- Verify file paths are correct
- Check file permissions
- Ensure images are in correct folders
- Compress large images

**Maps not displaying:**
- Update with your actual Google Maps embed code
- Check API restrictions if using Maps API

**Status not updating:**
- Check browser console for JavaScript errors
- Verify system time is correct
- Test in different browsers

## 📄 License

This website template is created for The Ark Veterinary Clinic. All rights reserved.

## 🤝 Support

For website support or modifications, contact your web developer.

**Clinic Contact:**
- Phone: 098418 77423, 7942699091
- Instagram: @thearkvetclinic_india
- Locations: Ambattur & Thiruvanmiyur, Chennai

---

**Built with ❤️ for The Ark Veterinary Clinic**
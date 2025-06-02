# Analytics Integration for NO-DIG

## Overview

This document outlines the integration of analytics and tracking tools into NO-DIG. These tools are essential for business websites focused on SEO, marketing, and user behavior analysis.

## Core Analytics Features

### 1. Google Analytics Integration

#### 1.1 Google Analytics 4 Support

- Full support for Google Analytics 4 (GA4)
- Configurable measurement ID via global settings or frontmatter
- Enhanced measurement capabilities (scrolling, outbound clicks, file downloads)
- Custom event tracking
- User properties and dimensions

#### 1.2 Implementation Strategy

```javascript
// Configuration in no-dig.config.js
module.exports = {
  // Site configuration
  site: {
    title: "My Business Site",
    url: "https://example.com"
  },
  
  // Analytics configuration
  analytics: {
    googleAnalytics: {
      measurementId: process.env.GA_MEASUREMENT_ID || "G-XXXXXXXXXX",
      enabled: process.env.NODE_ENV === "production",
      anonymizeIp: true,
      respectDoNotTrack: true,
      customDimensions: {
        // Custom dimensions configuration
      }
    }
  }
};
```

```html
<!-- Analytics partial in adapter-11ty package -->
{% if analytics.googleAnalytics.enabled %}
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ analytics.googleAnalytics.measurementId }}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    
    gtag('config', '{{ analytics.googleAnalytics.measurementId }}', {
      'anonymize_ip': {{ analytics.googleAnalytics.anonymizeIp }},
      'page_path': '{{ page.url }}',
      {% if analytics.googleAnalytics.customDimensions %}
        {% for dimension, value in analytics.googleAnalytics.customDimensions %}
          '{{ dimension }}': '{{ value }}',
        {% endfor %}
      {% endif %}
    });
  </script>
{% endif %}
```

### 2. Google Tag Manager Integration

#### 2.1 Tag Manager Features

- Container ID configuration via global settings
- Support for multiple environments (development, staging, production)
- Data layer initialization and management
- Custom event triggers
- Variable configuration

#### 2.2 Implementation Strategy

```javascript
// Configuration in no-dig.config.js
module.exports = {
  // ... other configuration
  
  analytics: {
    // ... Google Analytics config
    googleTagManager: {
      containerId: process.env.GTM_CONTAINER_ID || "GTM-XXXXXXX",
      enabled: process.env.NODE_ENV === "production",
      dataLayer: {
        // Initial data layer values
        siteType: "no-dig",
        contentType: "markdown"
      }
    }
  }
};
```

```html
<!-- Tag Manager head partial in adapter-11ty package -->
{% if analytics.googleTagManager.enabled %}
  <!-- Google Tag Manager -->
  <script>
    window.dataLayer = window.dataLayer || [];
    {% for key, value in analytics.googleTagManager.dataLayer %}
      window.dataLayer.push({'{{ key }}': '{{ value }}'});
    {% endfor %}
  </script>
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','{{ analytics.googleTagManager.containerId }}');</script>
  <!-- End Google Tag Manager -->
{% endif %}
```

```html
<!-- Tag Manager body partial in adapter-11ty package -->
{% if analytics.googleTagManager.enabled %}
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ analytics.googleTagManager.containerId }}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
{% endif %}
```

### 3. Facebook Pixel Integration

#### 3.1 Facebook Pixel Features

- Pixel ID configuration via global settings
- Standard events tracking (PageView, ViewContent, etc.)
- Custom events and conversions
- Advanced matching parameters

#### 3.2 Implementation Strategy

```javascript
// Configuration in no-dig.config.js
module.exports = {
  // ... other configuration
  
  analytics: {
    // ... Other analytics config
    facebookPixel: {
      pixelId: process.env.FB_PIXEL_ID || "XXXXXXXXXX",
      enabled: process.env.NODE_ENV === "production",
      advancedMatching: {
        // Advanced matching parameters
      }
    }
  }
};
```

```html
<!-- Facebook Pixel partial in adapter-11ty package -->
{% if analytics.facebookPixel.enabled %}
  <!-- Facebook Pixel Code -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', '{{ analytics.facebookPixel.pixelId }}', {{ analytics.facebookPixel.advancedMatching | dump | safe }});
    fbq('track', 'PageView');
  </script>
  <noscript>
    <img height="1" width="1" style="display:none" 
         src="https://www.facebook.com/tr?id={{ analytics.facebookPixel.pixelId }}&ev=PageView&noscript=1"/>
  </noscript>
  <!-- End Facebook Pixel Code -->
{% endif %}
```

### 4. LinkedIn Insight Tag

#### 4.1 LinkedIn Insight Features

- Partner ID configuration
- Conversion tracking
- Event-specific tracking

#### 4.2 Implementation Strategy

```javascript
// Configuration in no-dig.config.js
module.exports = {
  // ... other configuration
  
  analytics: {
    // ... Other analytics config
    linkedInInsight: {
      partnerId: process.env.LINKEDIN_PARTNER_ID || "XXXXXXX",
      enabled: process.env.NODE_ENV === "production"
    }
  }
};
```

```html
<!-- LinkedIn Insight partial in adapter-11ty package -->
{% if analytics.linkedInInsight.enabled %}
  <!-- LinkedIn Insight Tag -->
  <script type="text/javascript">
    _linkedin_partner_id = "{{ analytics.linkedInInsight.partnerId }}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    (function(l) {
      if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
      window.lintrk.q=[]}
      var s = document.getElementsByTagName("script")[0];
      var b = document.createElement("script");
      b.type = "text/javascript";b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s.parentNode.insertBefore(b, s);
    })(window.lintrk);
  </script>
  <noscript>
    <img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid={{ analytics.linkedInInsight.partnerId }}&fmt=gif" />
  </noscript>
  <!-- End LinkedIn Insight Tag -->
{% endif %}
```

### 5. Custom Analytics Integration

#### 5.1 Custom Analytics Features

- Support for custom analytics scripts
- Data collection API integration
- Self-hosted analytics options (Plausible, Matomo, etc.)

#### 5.2 Implementation Strategy

```javascript
// Configuration in no-dig.config.js
module.exports = {
  // ... other configuration
  
  analytics: {
    // ... Other analytics config
    customAnalytics: {
      enabled: process.env.CUSTOM_ANALYTICS_ENABLED === "true",
      scriptUrl: process.env.CUSTOM_ANALYTICS_URL || "",
      dataAttributes: {
        // Custom data attributes
      }
    }
  }
};
```

```html
<!-- Custom Analytics partial in adapter-11ty package -->
{% if analytics.customAnalytics.enabled %}
  <!-- Custom Analytics -->
  <script async 
    src="{{ analytics.customAnalytics.scriptUrl }}"
    {% for key, value in analytics.customAnalytics.dataAttributes %}
      data-{{ key }}="{{ value }}"
    {% endfor %}
  ></script>
  <!-- End Custom Analytics -->
{% endif %}
```

## Integration with Base Layout

The analytics components will be integrated into the base layout:

```html
<!-- Base layout in adapter-11ty package -->
<!DOCTYPE html>
<html lang="{{ site.lang | default('en') }}">
<head>
  <!-- ... other head elements ... -->
  
  {% include "partials/tag-manager-head.njk" %}
  {% include "partials/analytics.njk" %}
  {% include "partials/facebook-pixel.njk" %}
  {% include "partials/linkedin-insight.njk" %}
  {% include "partials/custom-analytics.njk" %}
</head>
<body>
  {% include "partials/tag-manager-body.njk" %}
  
  <!-- ... page content ... -->
</body>
</html>
```

## Configuration Options

### Global Configuration

Analytics can be configured globally in `no-dig.config.js`:

```javascript
module.exports = {
  // ... other configuration
  
  analytics: {
    // Analytics configuration
  }
};
```

### Page-Level Configuration

Analytics can be enabled/disabled or customized at the page level via frontmatter:

```yaml
---
title: Page Title
analytics:
  googleAnalytics:
    enabled: true
    customDimensions:
      dimension1: "custom-value"
  googleTagManager:
    enabled: true
    dataLayer:
      pageCategory: "blog"
---
```

### Environment-Based Configuration

Different analytics configurations can be used for different environments:

```javascript
// Environment-specific configuration
const environment = process.env.NODE_ENV || "development";

module.exports = {
  // ... other configuration
  
  analytics: {
    googleAnalytics: {
      enabled: environment === "production",
      // Other configuration
    }
  }
};
```

## Privacy Considerations

### Cookie Consent Integration

The analytics implementation includes cookie consent integration:

```html
<!-- Cookie consent partial in adapter-11ty package -->
<div id="cookie-consent" class="cookie-banner" hidden>
  <div class="cookie-content">
    <p>This website uses cookies to ensure you get the best experience.</p>
    <div class="cookie-buttons">
      <button id="cookie-accept" class="btn btn-primary">Accept</button>
      <button id="cookie-reject" class="btn btn-secondary">Reject</button>
    </div>
  </div>
</div>

<script>
  // Cookie consent logic
  document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieReject = document.getElementById('cookie-reject');
    
    // Check if consent has been given
    const consentGiven = localStorage.getItem('cookie-consent');
    
    if (!consentGiven) {
      cookieConsent.removeAttribute('hidden');
    }
    
    cookieAccept.addEventListener('click', function() {
      localStorage.setItem('cookie-consent', 'accepted');
      cookieConsent.setAttribute('hidden', '');
      // Enable analytics
      enableAnalytics();
    });
    
    cookieReject.addEventListener('click', function() {
      localStorage.setItem('cookie-consent', 'rejected');
      cookieConsent.setAttribute('hidden', '');
      // Disable analytics
      disableAnalytics();
    });
    
    // Functions to enable/disable analytics
    function enableAnalytics() {
      // Enable various analytics scripts
    }
    
    function disableAnalytics() {
      // Disable various analytics scripts
    }
  });
</script>
```

### Privacy Policy Generation

The system includes a privacy policy generator:

```javascript
// Privacy policy generator in core package
function generatePrivacyPolicy(config) {
  // Generate privacy policy based on enabled analytics
  const policy = {
    sections: []
  };
  
  if (config.analytics?.googleAnalytics?.enabled) {
    policy.sections.push({
      title: "Google Analytics",
      content: "This website uses Google Analytics to collect anonymous information such as the number of visitors to the site, and the most popular pages."
    });
  }
  
  // Add sections for other analytics tools
  
  return policy;
}
```

## Business-Specific Analytics Features

### 1. Conversion Tracking

```javascript
// Conversion tracking in core package
function trackConversion(event, value) {
  // Track conversion in various analytics platforms
  if (window.gtag) {
    gtag('event', 'conversion', {
      'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
      'value': value,
      'currency': 'USD'
    });
  }
  
  if (window.fbq) {
    fbq('track', 'Purchase', {
      value: value,
      currency: 'USD'
    });
  }
}
```

### 2. E-commerce Tracking

```javascript
// E-commerce tracking in core package
function trackPurchase(transaction) {
  // Track purchase in various analytics platforms
  if (window.gtag) {
    gtag('event', 'purchase', {
      transaction_id: transaction.id,
      value: transaction.value,
      currency: transaction.currency,
      items: transaction.items
    });
  }
  
  if (window.fbq) {
    fbq('track', 'Purchase', {
      value: transaction.value,
      currency: transaction.currency
    });
  }
}
```

### 3. Lead Generation Tracking

```javascript
// Lead tracking in core package
function trackLead(source, value) {
  // Track lead in various analytics platforms
  if (window.gtag) {
    gtag('event', 'generate_lead', {
      source: source,
      value: value
    });
  }
  
  if (window.fbq) {
    fbq('track', 'Lead', {
      value: value,
      currency: 'USD'
    });
  }
}
```

## Implementation Guidelines

### 1. Installation

The analytics functionality is built into the core NO-DIG packages:

```bash
# No additional installation required
# Analytics is included in the core package
```

### 2. Configuration

Configure analytics in `no-dig.config.js`:

```javascript
// no-dig.config.js
module.exports = {
  // ... other configuration
  
  analytics: {
    googleAnalytics: {
      measurementId: "G-XXXXXXXXXX",
      enabled: true
    },
    // Other analytics configuration
  }
};
```

### 3. Usage

Enable/disable analytics in frontmatter:

```yaml
---
title: Page Title
analytics:
  enabled: true  # Enable all analytics
  googleAnalytics:
    enabled: false  # Disable specific analytics
---
```

### 4. Testing

Test analytics implementation:

```javascript
// Test file in core package
describe('Analytics', () => {
  test('Google Analytics is properly configured', () => {
    // Test implementation
  });
  
  // Other tests
});
```

## Conclusion

This analytics integration provides a comprehensive solution for tracking and analyzing user behavior on business websites built with NO-DIG. The implementation is flexible, privacy-conscious, and supports a wide range of analytics tools, making it ideal for SEO-focused business websites.

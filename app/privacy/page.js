// Privacy Policy, mirroring the i80pass master's page structure
// and disclosures, including the Google advertising cookie
// disclosure, adapted to this site's own data practices (VDOT via 511 Virginia
// and National Weather Service data, Resend storm
// alerts, GA4 when configured).

import { SITE, siteUrl } from "@/lib/site-config";

export const metadata = {
  title: "Privacy Policy | i77pass.com",
  description: "Privacy Policy for i77pass.com: how we collect, use, and protect your information.",
  alternates: { canonical: siteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">Privacy Policy</h1>
      <p className="text-body-md text-secondary mt-2">Last Updated: November 25, 2026</p>

      <p className="text-body-md text-secondary leading-relaxed mt-6">
        At i77pass.com, we take your privacy seriously. This Privacy Policy explains how we collect, use, and
        protect information when you visit our website.
      </p>

      <h2 className="text-headline-md font-bold text-on-surface mt-10 mb-3">1. Information We Collect</h2>
      <p className="text-body-md text-secondary leading-relaxed mb-4">
        We may collect information to improve your experience. This includes:
      </p>
      <ul className="list-disc list-inside text-body-md text-secondary space-y-2 pl-2">
        <li>
          <strong className="text-on-surface">Usage Data:</strong> Information about how you navigate our site
          (e.g., IP address, browser type, pages visited, date and time stamp).
        </li>
        <li>
          <strong className="text-on-surface">Cookies:</strong> We use cookies to store information about your
          preferences and to personalize content.
        </li>
        <li>
          <strong className="text-on-surface">Storm alert signups:</strong> If you subscribe to storm alerts, we
          collect the email address you provide, and only that, so we can send the alerts. Signups are stored by
          our email provider, Resend, and every alert email carries an unsubscribe link.
        </li>
      </ul>

      <h2 className="text-headline-md font-bold text-on-surface mt-10 mb-3">2. Google AdSense and Advertising</h2>
      <p className="text-body-md text-secondary leading-relaxed mb-4">
        i77pass.com uses Google AdSense to serve advertisements. This site may also serve advertisements through Mediavine. Google, as a third-party vendor, uses cookies to
        serve ads on our site based on your prior visits to this website or other websites on the Internet.
      </p>
      <p className="text-body-md text-secondary leading-relaxed mb-4">
        Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your
        visit to this site and/or other sites on the Internet.
      </p>
      <p className="text-body-md text-secondary leading-relaxed">
        Users may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-75">
          Google Ads Settings
        </a>
        .
      </p>

      <h2 className="text-headline-md font-bold text-on-surface mt-10 mb-3">3. Analytics</h2>
      <p className="text-body-md text-secondary leading-relaxed">
        We use Google Analytics to understand how visitors use the site, in aggregate: which pages are read,
        roughly where readers are, and whether the site worked on their device. Analytics data is not sold, and
        it is not used to identify individual visitors.
      </p>

      <h2 className="text-headline-md font-bold text-on-surface mt-10 mb-3">4. Third Party Data Sources</h2>
      <p className="text-body-md text-secondary leading-relaxed">
        Road condition and camera content on this site comes from the Virginia Department of Transportation via
        511 Virginia, and weather content from the National Weather Service. Loading a camera still connects your
        browser to the agency image address, as it would on the agency&apos;s own site.
      </p>

      <h2 className="text-headline-md font-bold text-on-surface mt-10 mb-3">5. Your Privacy Rights</h2>
      <p className="text-body-md text-secondary leading-relaxed">
        You can choose to disable or selectively turn off our cookies or third-party cookies in your browser
        settings. However, this may affect how you are able to interact with our site as well as other websites.
        If you subscribed to storm alerts, the unsubscribe link in any alert email removes you at once.
      </p>

      <h2 className="text-headline-md font-bold text-on-surface mt-10 mb-3">6. Children&apos;s Information</h2>
      <p className="text-body-md text-secondary leading-relaxed">
        We believe it is important to provide added protection for children online. We do not knowingly collect
        any personally identifiable information from children under the age of 13.
      </p>

      <h2 className="text-headline-md font-bold text-on-surface mt-10 mb-3">7. Online Privacy Policy Only</h2>
      <p className="text-body-md text-secondary leading-relaxed">
        This privacy policy applies only to our online activities and is valid for visitors to our website
        regarding information shared and/or collected there. This policy does not apply to any information
        collected offline or via channels other than this website.
      </p>

      <h2 className="text-headline-md font-bold text-on-surface mt-10 mb-3">8. Consent</h2>
      <p className="text-body-md text-secondary leading-relaxed">
        By using our website, you hereby consent to our privacy policy and agree to its terms.
      </p>

      <h2 className="text-headline-md font-bold text-on-surface mt-10 mb-3">9. Contact Us</h2>
      <p className="text-body-md text-secondary leading-relaxed">
        If you have any questions about this Privacy Policy, please contact us at{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="text-primary underline hover:opacity-75">
          {SITE.contactEmail}
        </a>
        .
      </p>
    </main>
  );
}

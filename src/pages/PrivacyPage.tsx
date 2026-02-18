import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | imgtool.in - Your Data is Safe</title>
        <meta name="description" content="Privacy Policy of imgtool.in. Learn how we protect your data and privacy while using our free online image tools." />
        <link rel="canonical" href="https://imgtool.in/privacy" />
      </Helmet>

      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Last updated: January 2025
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                At imgtool.in, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, and protect your personal information when you use our website and services.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                2. Information We Collect
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                <strong>Images:</strong> When you use our tools, your images are processed in your browser 
                or on our secure servers. We do not store your images permanently. All uploaded images are 
                automatically deleted after processing.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                <strong>Usage Data:</strong> We collect anonymous usage statistics to improve our services. 
                This includes page views, tool usage, and error logs. No personally identifiable information 
                is collected.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                <strong>Cookies:</strong> We use cookies to remember your preferences (like dark mode) and 
                to analyze website traffic.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To improve and optimize our website</li>
                <li>To analyze usage patterns and trends</li>
                <li>To detect and prevent technical issues</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                4. Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We implement industry-standard security measures to protect your data. All data transfers 
                are encrypted using SSL/TLS. Your images are processed securely and never shared with third parties.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                5. Third-Party Services
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We use Google Analytics to understand website usage. Google may use cookies to track 
                your activity. You can opt-out of Google Analytics tracking.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We display Google AdSense advertisements. Google uses cookies to personalize ads based 
                on your browsing history.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                <li>Access your personal data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of cookies and tracking</li>
                <li>Contact us with privacy concerns</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                7. Children's Privacy
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our services are not intended for children under 13. We do not knowingly collect 
                personal information from children under 13.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                8. Changes to This Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new policy on this page.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                9. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:support@imgtool.in" className="text-blue-600 hover:underline">
                  support@imgtool.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;

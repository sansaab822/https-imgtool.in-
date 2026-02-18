import { Helmet } from 'react-helmet-async';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | imgtool.in - Usage Terms</title>
        <meta name="description" content="Terms of Service for imgtool.in. Read our terms and conditions for using our free online image tools." />
        <link rel="canonical" href="https://imgtool.in/terms" />
      </Helmet>

      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Terms of Service
            </h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Last updated: January 2025
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                By accessing and using imgtool.in, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                imgtool.in provides free online image processing tools. Our services include but are not 
                limited to image resizing, compression, conversion, editing, and enhancement.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                3. User Conduct
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You agree not to use our services to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                <li>Upload or process illegal, harmful, or offensive content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use our services for spam or malicious purposes</li>
                <li>Interfere with other users' access to our services</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                4. Intellectual Property
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                All content on imgtool.in, including text, graphics, logos, and software, is the property 
                of imgtool.in and is protected by copyright and other intellectual property laws.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You retain all rights to the images you upload and process using our services. We claim 
                no ownership over your content.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                5. Disclaimer of Warranties
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our services are provided "as is" without any warranties, express or implied. We do not 
                guarantee that our services will be uninterrupted, secure, or error-free.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                In no event shall imgtool.in be liable for any indirect, incidental, special, consequential, 
                or punitive damages arising out of or relating to your use of our services.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                7. Modifications to Service
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We reserve the right to modify or discontinue our services at any time without notice. 
                We shall not be liable to you or any third party for any modification, suspension, or 
                discontinuance of the service.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                8. Governing Law
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes arising under these Terms shall be subject to the exclusive jurisdiction 
                of the courts in Noida, Uttar Pradesh.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We may update these Terms of Service from time to time. We will notify you of any changes 
                by posting the new terms on this page. Your continued use of our services after any changes 
                constitutes acceptance of the new terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:support@imgtool.in" className="text-blue-600 hover:underline">
                  support@imgtool.in
                </a>
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                11. Google AdSense
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We use Google AdSense to display advertisements on our website. By using our services, 
                you agree to Google's advertising terms and cookie policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;

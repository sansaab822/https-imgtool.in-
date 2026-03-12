import SEO from '../components/SEO'

export default function Disclaimer() {
    return (
        <>
            <SEO title="Disclaimer - IMG Tool" description="Read the disclaimer regarding the use of IMG Tool, image copyright, and tool accuracy." canonical="/disclaimer" />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Disclaimer</h1>
                <p className="text-slate-500 mb-10">Last updated: March 13, 2026</p>

                <div className="space-y-8 text-slate-600">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-3">1. General Information</h2>
                        <p className="leading-relaxed mb-4">
                            The information and tools provided by IMG Tool (https://imgtool.in) are for general informational purposes and personal use only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or tool on the site.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-3">2. Image Copyright Disclaimer</h2>
                        <p className="leading-relaxed mb-4">
                            IMG Tool strictly acts as a client-side processing utility. We do not host, store, or index any user media. You retain full ownership of any original files you process. Furthermore, it is solely your responsibility to ensure you have the legal right, license, and authorization to use, modify, edit, or convert any image or document uploaded into your browser via our platform. 
                        </p>
                        <p className="leading-relaxed text-red-600 font-semibold bg-red-50 p-4 rounded-lg">
                            Warning: Do not use IMG Tool to infringe upon intellectual property rights, remove valid watermarks, or misappropriate copyrighted material. IMG Tool assumes no liability for user-generated copyright disputes.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-3">3. Tool Accuracy & Limitations</h2>
                        <p className="leading-relaxed mb-4">
                            While we strive for precise functionality, the result of image compression, file conversion, and resizing may vary depending on the original file\'s metadata, format, and browser capabilities. The "Target KB" compression tools provide close approximations but cannot guarantee exact byte-level matches due to how JPEG/WebP compression algorithms function. Always review your processed files before using them for official or critical purposes, such as government exam applications.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-3">4. External Links & Affiliates Disclaimer</h2>
                        <p className="leading-relaxed mb-4">
                            The site may contain links to other websites or content belonging to or originating from third parties, or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy by us. We use Google AdSense to monetize our free tools. AdSense uses cookies to serve ads based on a user\'s prior visits to our website or other websites. We do not endorse the products or services advertised through these network ads.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-3">5. Professional Advice</h2>
                        <p className="leading-relaxed mb-4">
                            The use or reliance of any information contained on this site is solely at your own risk. The site cannot and does not contain legal or professional photography/design advice.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-3">Contact Us</h2>
                        <p className="leading-relaxed text-slate-600">
                            Should you have any feedback, comments, requests for technical support or other inquiries, please contact us by email: <strong>info@imgtool.in</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

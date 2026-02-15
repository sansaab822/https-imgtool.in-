<?php
// --- CONFIGURATION & LOGIC ---

// 1. URL से इनपुट और आउटपुट फॉर्मेट प्राप्त करें (Defaults: JPG to PNG)
$from = isset($_GET['from'])? strtoupper(strip_tags($_GET['from'])) : 'JPG';
$to   = isset($_GET['to'])  ? strtoupper(strip_tags($_GET['to']))   : 'PNG';

// 2. Mime Types का नक्शा (Browser को समझाने के लिए)
$mimeTypes =;

// 3. Output Mime Type सेट करें
$targetMime = isset($mimeTypes[$to])? $mimeTypes[$to] : 'image/jpeg';

// 4. Dynamic SEO Data जनरेट करें
$title = "Convert $from to $to Online (Free & Unlimited) | IMG Tool.in";
$description = "Best free online $from to $to converter. Batch convert $from images to high-quality $to format in seconds. No watermarks, 100% private & secure processing.";
$currentDate = date("F j, Y");

?>
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title><?php echo $title;?></title>
    <meta name="description" content="<?php echo $description;?>" />
    <meta name="keywords" content="<?php echo "$from to $to, convert $from to $to, free $from converter, online image tool, batch convert images";?>" />

    <link rel="canonical" href="[https://imgtool.in/convert/](https://imgtool.in/convert/)<?php echo strtolower($from);?>-to-<?php echo strtolower($to);?>" />

    <meta property="og:title" content="<?php echo $title;?>" />
    <meta property="og:description" content="<?php echo $description;?>" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="[https://imgtool.in/convert/](https://imgtool.in/convert/)<?php echo strtolower($from);?>-to-<?php echo strtolower($to);?>" />
    
    <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)" />
    <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin />
    <link href="[https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap)" rel="stylesheet" />
    <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
    <link rel="stylesheet" href="[https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css)" />
    <script src="[https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js](https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js)"></script>

    <script type="application/ld+json">
        {
            "@context": "[https://schema.org](https://schema.org)",
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "[https://imgtool.in/](https://imgtool.in/)"
                }, {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "<?php echo "$from to $to Converter";?>"
                }]
            },
            "mainEntity":
            }]
        }
    </script>

    <style>
        :root { --primary: #7c3aed; --secondary: #2563eb; --gradient: linear-gradient(135deg, var(--primary), var(--secondary)); }
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #0f172a; }
       .gradient-text { background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
       .drop-zone.dragover { background-color: #eff6ff; border-color: var(--secondary); }
       .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
       .faq-item.active.faq-answer { max-height: 300px; padding-bottom: 1rem; }
       .faq-icon { transition: transform 0.3s; }
       .faq-item.active.faq-icon { transform: rotate(180deg); }
    </style>
</head>

<body class="bg-slate-50">
    <div id="header"></div>

    <main class="container mx-auto px-4 py-12 md:py-16">
        <section class="max-w-4xl mx-auto text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                <?php echo $from;?> to <span class="gradient-text"><?php echo $to;?></span> Converter
            </h1>
            <p class="text-lg text-slate-600">
                Fast, free, and secure. Batch convert your <strong><?php echo $from;?></strong> files to <strong><?php echo $to;?></strong> directly in your browser.
            </p>
        </section>

        <section class="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div id="drop-zone" class="border-3 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <i class="fas fa-cloud-upload-alt text-6xl text-violet-500 mb-4"></i>
                <p class="text-xl font-semibold text-slate-700">Drag & drop <?php echo $from;?> files here</p>
                <p class="text-slate-500 mt-2 text-sm">(Max 20 files supported)</p>
                <button id="select-files-btn" class="mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-full transition-all">
                    Select Files
                </button>
                <input type="file" id="file-input" class="hidden" multiple accept="image/*,.<?php echo strtolower($from);?>">
            </div>

            <div id="file-processing-area" class="hidden mt-8">
                <div class="p-4 bg-slate-50 rounded-lg mb-6">
                    <h3 class="font-semibold mb-3">Settings</h3>
                    <div class="flex gap-4 flex-wrap">
                        <div class="flex-1 min-w-[200px]">
                            <label class="text-sm font-medium text-slate-600">Quality</label>
                            <select id="quality-level" class="w-full mt-1 p-2 border rounded bg-white">
                                <option value="0.92">High (92%)</option>
                                <option value="0.80" selected>Balanced (80%)</option>
                                <option value="0.60">Low (60%)</option>
                            </select>
                        </div>
                        <div class="flex-1 min-w-[200px]">
                             <label class="text-sm font-medium text-slate-600">Background (for Transparent Images)</label>
                             <input type="color" id="background-color" value="#ffffff" class="w-full h-10 mt-1 p-1 rounded border">
                        </div>
                    </div>
                </div>

                <div id="file-list" class="space-y-3"></div>

                <button id="convert-btn" class="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-lg text-lg shadow-lg transition-all">
                    Convert All to <?php echo $to;?>
                </button>
            </div>

            <div id="download-actions" class="hidden mt-8 text-center">
                <h3 class="text-2xl font-bold text-green-600 mb-4"><i class="fas fa-check-circle"></i> Conversion Complete!</h3>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button id="download-all-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg">
                        Download All (ZIP)
                    </button>
                    <button id="reset-btn" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg">
                        Convert More
                    </button>
                </div>
            </div>
        </section>

        <section class="max-w-4xl mx-auto mt-16 prose text-slate-600">
            <h2 class="text-2xl font-bold text-slate-800">About <?php echo $from;?> to <?php echo $to;?> Conversion</h2>
            <p>
                Looking for a reliable way to transform your <strong><?php echo $from;?></strong> images into <strong><?php echo $to;?></strong>? 
                Our tool provides a seamless solution. Whether you are a photographer, designer, or just need to optimize images for the web, 
                converting to <?php echo $to;?> ensures better compatibility and performance.
            </p>

            <h3 class="text-xl font-bold text-slate-800 mt-6">Why Convert to <?php echo $to;?>?</h3>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Compatibility:</strong> <?php echo $to;?> is widely supported across almost all devices and browsers.</li>
                <li><strong>Efficiency:</strong> Optimized <?php echo $to;?> files often load faster on websites.</li>
                <li><strong>Sharing:</strong> Easier to share on social media platforms like Instagram and Twitter.</li>
            </ul>

            <h3 class="text-xl font-bold text-slate-800 mt-8 mb-4">Frequently Asked Questions</h3>
            <div class="space-y-2">
                <div class="faq-item bg-white p-4 rounded-lg border border-slate-200 cursor-pointer">
                    <div class="flex justify-between items-center font-semibold text-slate-800">
                        <span>Is it free to convert <?php echo $from;?> to <?php echo $to;?>?</span>
                        <i class="fas fa-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer mt-2 text-slate-600">
                        Yes, our tool is 100% free. You can convert as many <?php echo $from;?> files as you want without any hidden fees.
                    </div>
                </div>
                <div class="faq-item bg-white p-4 rounded-lg border border-slate-200 cursor-pointer">
                    <div class="flex justify-between items-center font-semibold text-slate-800">
                        <span>Does converting reduce quality?</span>
                        <i class="fas fa-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer mt-2 text-slate-600">
                        We use advanced compression algorithms to ensure your <?php echo $to;?> files retain the highest possible quality while optimizing file size.
                    </div>
                </div>
            </div>
        </section>
    </main>

    <div id="footer"></div>
    <script src="/include/common.js"></script>
    
    <script>
        // PHP Variables injected into JS
        const TARGET_FORMAT = "<?php echo strtolower($to);?>";
        const TARGET_MIME = "<?php echo $targetMime;?>";
        
        document.addEventListener('DOMContentLoaded', () => {
            const dropZone = document.getElementById('drop-zone');
            const fileInput = document.getElementById('file-input');
            const processingArea = document.getElementById('file-processing-area');
            const fileList = document.getElementById('file-list');
            const convertBtn = document.getElementById('convert-btn');
            let filesToProcess =;

            // Drag & Drop Handlers
            dropZone.addEventListener('click', () => fileInput.click());
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                handleFiles(e.dataTransfer.files);
            });
            fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

            function handleFiles(files) {
                const newFiles = Array.from(files).slice(0, 20); // Limit 20
                if(newFiles.length > 0) {
                    filesToProcess =;
                    updateUI();
                }
            }

            function updateUI() {
                if(filesToProcess.length > 0) {
                    dropZone.classList.add('hidden');
                    processingArea.classList.remove('hidden');
                    renderFileList();
                }
            }

            function renderFileList() {
                fileList.innerHTML = filesToProcess.map((file, index) => `
                    <div class="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                        <div class="flex items-center gap-3 overflow-hidden">
                            <div class="bg-slate-200 w-10 h-10 rounded flex items-center justify-center text-slate-500">
                                <i class="fas fa-image"></i>
                            </div>
                            <span class="truncate font-medium text-sm">${file.name}</span>
                        </div>
                        <span class="text-xs text-slate-400" id="status-${index}">Ready</span>
                    </div>
                `).join('');
            }

            // Conversion Logic
            convertBtn.addEventListener('click', async () => {
                convertBtn.disabled = true;
                convertBtn.innerText = "Processing...";
                
                const quality = parseFloat(document.getElementById('quality-level').value);
                const bgColor = document.getElementById('background-color').value;
                const zip = new JSZip();

                for (let i = 0; i < filesToProcess.length; i++) {
                    const file = filesToProcess[i];
                    const statusEl = document.getElementById(`status-${i}`);
                    statusEl.innerText = "Converting...";
                    statusEl.className = "text-xs text-blue-500 font-semibold";

                    try {
                        const blob = await convertImage(file, quality, bgColor);
                        const newName = file.name.split('.').slice(0, -1).join('.') + '.' + TARGET_FORMAT;
                        zip.file(newName, blob);
                        statusEl.innerText = "Done";
                        statusEl.className = "text-xs text-green-600 font-bold";
                    } catch (err) {
                        console.error(err);
                        statusEl.innerText = "Error";
                        statusEl.className = "text-xs text-red-500";
                    }
                }

                // Generate ZIP
                const content = await zip.generateAsync({type:"blob"});
                const downloadUrl = URL.createObjectURL(content);
                
                document.getElementById('download-actions').classList.remove('hidden');
                document.getElementById('convert-btn').classList.add('hidden');
                
                const dlBtn = document.getElementById('download-all-btn');
                dlBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = `converted_images_${TARGET_FORMAT}.zip`;
                    a.click();
                };
            });

            // Core Conversion Function using Canvas
            function convertImage(file, quality, bgColor) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');

                            // Handle Transparency (Fill background)
                            ctx.fillStyle = bgColor;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            
                            ctx.drawImage(img, 0, 0);
                            
                            // Export to target format
                            canvas.toBlob((blob) => {
                                if(blob) resolve(blob);
                                else reject(new Error("Conversion failed"));
                            }, TARGET_MIME, quality);
                        };
                        img.onerror = reject;
                        img.src = event.target.result;
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }
            
            // Reset
            document.getElementById('reset-btn').addEventListener('click', () => {
                location.reload();
            });

            // FAQ Accordion
            document.querySelectorAll('.faq-item').forEach(item => {
                item.addEventListener('click', () => item.classList.toggle('active'));
            });
        });
    </script>
</body>
</html>
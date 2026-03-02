import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { STLExporter } from 'three/addons/exporters/STLExporter.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

const FONT_OPTIONS = [
    { id: 'helvetiker', label: 'Helvetiker', url: 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/helvetiker_regular.typeface.json' },
    { id: 'helvetiker_bold', label: 'Helvetiker Bold', url: 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/helvetiker_bold.typeface.json' },
    { id: 'optimer', label: 'Optimer', url: 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/optimer_regular.typeface.json' },
    { id: 'optimer_bold', label: 'Optimer Bold', url: 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/optimer_bold.typeface.json' },
    { id: 'gentilis', label: 'Gentilis', url: 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/gentilis_regular.typeface.json' },
    { id: 'gentilis_bold', label: 'Gentilis Bold', url: 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/gentilis_bold.typeface.json' },
]

export default function ThreeDTextStl() {
    const [text, setText] = useState('Hello')
    const [depth, setDepth] = useState(8)
    const [fontSize3d, setFontSize3d] = useState(20)
    const [fontId, setFontId] = useState('helvetiker_bold')
    const [bevelEnabled, setBevelEnabled] = useState(true)
    const [bevelSize, setBevelSize] = useState(0.8)
    const [color, setColor] = useState('#4f46e5')
    const [generating, setGenerating] = useState(false)
    const [stlUrl, setStlUrl] = useState(null)
    const mountRef = useRef()
    const sceneRef = useRef({})

    // Initialize 3D scene
    useEffect(() => {
        if (!mountRef.current) return
        const w = mountRef.current.clientWidth
        const h = 350

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf1f5f9)
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
        camera.position.set(0, 20, 80)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(w, h)
        renderer.setPixelRatio(window.devicePixelRatio)
        mountRef.current.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.6))
        const dir = new THREE.DirectionalLight(0xffffff, 1)
        dir.position.set(20, 40, 30)
        scene.add(dir)

        // Grid
        const grid = new THREE.GridHelper(150, 20, 0xcccccc, 0xe5e5e5)
        grid.rotation.x = 0
        scene.add(grid)

        sceneRef.current = { scene, camera, renderer, controls }

        const animate = () => { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera) }
        animate()

        const onResize = () => {
            if (!mountRef.current) return
            const nw = mountRef.current.clientWidth
            camera.aspect = nw / h; camera.updateProjectionMatrix()
            renderer.setSize(nw, h)
        }
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
            mountRef.current?.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, [])

    // Update 3D text
    const updatePreview = async () => {
        const { scene, camera } = sceneRef.current
        if (!scene || !text.trim()) return

        // Remove old text meshes
        const old = scene.children.filter(c => c.name === 'textMesh')
        old.forEach(o => { scene.remove(o); o.geometry?.dispose(); o.material?.dispose() })

        const fontData = FONT_OPTIONS.find(f => f.id === fontId)
        const loader = new FontLoader()
        loader.load(fontData.url, (font) => {
            const geom = new TextGeometry(text, {
                font,
                size: fontSize3d,
                depth: depth,
                curveSegments: 12,
                bevelEnabled,
                bevelThickness: bevelSize,
                bevelSize: bevelSize,
                bevelOffset: 0,
                bevelSegments: 5,
            })
            geom.computeBoundingBox()
            geom.center()
            const mat = new THREE.MeshPhongMaterial({ color: new THREE.Color(color), shininess: 80 })
            const mesh = new THREE.Mesh(geom, mat)
            mesh.name = 'textMesh'
            scene.add(mesh)

            // Auto-frame camera
            const box = new THREE.Box3().setFromObject(mesh)
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            camera.position.set(0, maxDim * 0.5, maxDim * 2)
            camera.lookAt(0, 0, 0)
        })
    }

    useEffect(() => { updatePreview() }, [text, depth, fontSize3d, fontId, bevelEnabled, bevelSize, color])

    const exportStl = () => {
        const { scene } = sceneRef.current
        if (!scene) return
        setGenerating(true)
        setTimeout(() => {
            const mesh = scene.children.find(c => c.name === 'textMesh')
            if (!mesh) { setGenerating(false); return }
            const exporter = new STLExporter()
            const stl = exporter.parse(mesh, { binary: true })
            const blob = new Blob([stl], { type: 'application/octet-stream' })
            setStlUrl(URL.createObjectURL(blob))
            setGenerating(false)
        }, 200)
    }

    return (
        <>
            <SEO title="3D Text to STL Generator - Free Online" description="Create 3D text models and export to STL for 3D printing. Multiple fonts, bevel options, live preview. Free & private." canonical="/3d-text-to-stl" />
            <ToolLayout toolSlug="3d-text-to-stl" title="3D Text to STL" description="Create stunning 3D text models with live preview and export to STL for 3D printing." breadcrumb="3D Text to STL">
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* 3D Preview */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-600"><i className="fas fa-cube text-indigo-400 mr-1"></i>3D Preview — Drag to rotate</span>
                                <span className="text-[10px] text-slate-400">Scroll to zoom · Right-click to pan</span>
                            </div>
                            <div ref={mountRef} className="w-full" style={{ height: 350 }} />
                        </div>

                        {/* Result */}
                        {stlUrl && (
                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-circle-check text-green-500"></i>
                                    <span className="font-bold text-green-800 text-sm">STL file ready for 3D printing!</span>
                                </div>
                                <a href={stlUrl} download={`${text.replace(/\s+/g, '_')}_3d.stl`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all">
                                    <i className="fas fa-download"></i> Download STL
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-cube text-indigo-500"></i> 3D Text Settings
                            </h3>

                            {/* Text */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 font-medium">Text</label>
                                <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-bold focus:border-indigo-500 outline-none" />
                            </div>

                            {/* Font */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1.5 font-medium">Font</label>
                                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                                    {FONT_OPTIONS.map(f => (
                                        <button key={f.id} onClick={() => setFontId(f.id)}
                                            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${fontId === f.id ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-indigo-50'}`}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Depth */}
                            <div>
                                <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                    <span>Extrude Depth</span><span className="font-bold text-indigo-600">{depth}</span>
                                </label>
                                <input type="range" min="1" max="30" value={depth} onChange={e => setDepth(+e.target.value)} className="slider-range w-full" />
                            </div>

                            {/* Font Size */}
                            <div>
                                <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                    <span>Font Size</span><span className="font-bold text-indigo-600">{fontSize3d}</span>
                                </label>
                                <input type="range" min="5" max="60" value={fontSize3d} onChange={e => setFontSize3d(+e.target.value)} className="slider-range w-full" />
                            </div>

                            {/* Bevel */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={bevelEnabled} onChange={e => setBevelEnabled(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-xs font-medium text-slate-600">Bevel (rounded edges)</span>
                                </label>
                                {bevelEnabled && (
                                    <div>
                                        <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                            <span>Bevel Size</span><span className="font-bold text-indigo-600">{bevelSize.toFixed(1)}</span>
                                        </label>
                                        <input type="range" min="0.1" max="3" step="0.1" value={bevelSize} onChange={e => setBevelSize(+e.target.value)} className="slider-range w-full" />
                                    </div>
                                )}
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 font-medium">Preview Color</label>
                                <input type="color" value={color} onChange={e => setColor(e.target.value)}
                                    className="w-full h-9 rounded-lg border border-slate-200 p-0.5 cursor-pointer" />
                            </div>

                            {/* Export */}
                            <button onClick={exportStl} disabled={!text.trim() || generating}
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                                {generating ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...</>
                                ) : (
                                    <><i className="fas fa-download"></i> Export STL</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* SEO Content */}
                <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                        <h2 className="text-2xl font-bold text-slate-800">The Beginner's Guide to 3D Text Printing — From Text to Physical Object</h2>
                        <p>
                            Three-dimensional text has become one of the most popular projects for desktop 3D printing enthusiasts. Name signs for bedrooms, custom labels for workshop shelves, logo prototypes for startups, keyrings with initials, decorative business card holders — the applications for 3D extruded text are genuinely endless. Yet for many beginners, the path from "I want some 3D text" to holding a physical printed object felt intimidating because it seemed to require knowledge of complex CAD software like Blender, Fusion 360, or Tinkercad.
                        </p>
                        <p>
                            Our 3D Text to STL Generator eliminates that entire learning barrier. Type your text, choose a font and depth, preview it in real-time 3D, and export a print-ready STL file. The whole process takes under a minute, even if you have never touched 3D modeling software in your life. The output is a standard binary STL mesh that works in every slicer: Ultimaker Cura, PrusaSlicer, Bambu Studio, Chitubox, and any other slicing program you prefer.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Understanding STL Files and Why They Are the Standard</h3>
                        <p>
                            STL stands for Stereolithography, named after the original 3D printing technology patented in 1986. Despite the age of the format, it remains the universal language of desktop 3D printing because of its simplicity: an STL file is simply a list of triangles that together form the surface of a 3D object. Every slicer in the world can read STL, including free ones like Cura and professional ones like Materialise Magics.
                        </p>
                        <p>
                            Our tool exports specifically in <strong>binary STL format</strong>, which is far more compact than the older ASCII STL format. A binary STL for a four-letter word is typically under 500KB — small enough to email, share easily, or store dozens on a USB drive. Once imported into your slicer, you can scale it, orient it for the best layer adhesion, add supports if needed, and send it to your printer.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Choosing the Right Settings for Your Print</h3>
                        <p>
                            <strong>Extrude Depth:</strong> This controls how thick (in the Z-axis) your letters will be. A depth of 5-8 is ideal for thin decorative wall signs that print quickly. A depth of 15-25 creates chunky, solid text that stands up on a desk and is satisfying to hold. For keyrings and pendants, keep depth low (3-5) and print with PETG for durability.
                        </p>
                        <p>
                            <strong>Font Size:</strong> The size slider controls the scale of your text in the preview. Once you export the STL, you can scale it to any size you want in your slicer software — so don't worry too much about getting this exact. Larger text (higher size value) has thicker letter strokes, making it easier to print at fine detail. Very small text with thin strokes can be challenging to print cleanly at small physical sizes.
                        </p>
                        <p>
                            <strong>Bevel (Rounded Edges):</strong> Beveling adds a chamfered or rounded edge to the top face of each letter. This is a purely aesthetic choice. Without bevel, the text has sharp, clean 90-degree corners — great for a modern, technical look. With bevel enabled at a moderate size (0.8-1.5), the letters look slightly softer and more premium, like professionally manufactured signage. Large bevel sizes can start looking exaggerated, so use sparingly.
                        </p>
                        <p>
                            <strong>Font choices:</strong> Helvetiker Bold is the most reliable choice for 3D printing because its thick, consistent stroke widths print cleanly at any scale. Gentilis has a more serif, literary character. Optimer sits between them — a clean geometric typeface that is great for logos and branding applications. All fonts generate manifold, watertight geometry ready for printing without repair.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-6">Slicing Tips for Perfect 3D Text</h3>
                        <p>
                            When you import your STL into your slicer, orient the text so the flat back face is on the print bed. This eliminates the need for support structures entirely and gives you the cleanest possible top surface finish. Most slicers will auto-orient the model correctly, but verify by looking at the side view.
                        </p>
                        <p>
                            For materials: <strong>PLA</strong> is the easiest choice for decorative text — it prints at low temperatures, requires no heated enclosure, and is available in hundreds of colors. <strong>PETG</strong> is better if the sign will be outdoors or in a warm environment like a car dashboard. <strong>ASA</strong> and <strong>ABS</strong> offer the best UV resistance and heat resistance for outdoor use but require an enclosure and more tuning. For resin printers, the STL imports directly into Chitubox or Lychee Slicer — resin-printed text has exceptional surface detail and is great for jewelry-scale items.
                        </p>
                        <p>
                            After your print, fill any layer lines with a quick sand using 220-grit followed by 400-grit sandpaper, then prime and paint if desired. Even basic Rustoleum primer and spray paint transforms the appearance of PLA text into something that looks like professional injection-molded plastic. For metallic finishing, rub-and-buff metallic wax applied to sanded PLA text is one of the easiest and most impressive post-processing techniques available.
                        </p>
                        <p>
                            If you work with vector graphics and need to convert logo files or custom illustrations into 3D, pair this tool with our <a href="/svg-to-stl" className="text-indigo-600 hover:underline">SVG to STL Converter</a>, which converts vector paths into printable 3D meshes using the same workflow.
                        </p>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-slate-700">What slicers are compatible with the exported STL?</h4>
                                <p className="mt-1">Every major slicer supports binary STL, including Ultimaker Cura, PrusaSlicer, Bambu Studio, Simplify3D, Chitubox, and Lychee Slicer. It is the most universally compatible 3D printing file format in existence.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Is the generated mesh watertight and ready to print?</h4>
                                <p className="mt-1">Yes. The Three.js TextGeometry system generates watertight, manifold meshes for all supported fonts. You should not need mesh repair tools like Meshmixer or Netfabb before slicing.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Can I use non-English characters or emoji?</h4>
                                <p className="mt-1">The available fonts (Helvetiker, Optimer, Gentilis) include the standard ASCII Latin character set. Extended characters, accented letters, Cyrillic, Arabic, Chinese, or emoji will not render correctly. Use only standard A-Z, 0-9, and common punctuation for reliable results.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">How do I scale the text to a specific physical size?</h4>
                                <p className="mt-1">Import the STL into your slicer and use the scale tool to set the exact X dimension you want in millimeters. For example, if you want your sign to be 10cm wide, set the X to 100mm in Cura or PrusaSlicer.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Why does my preview color not appear in the printed object?</h4>
                                <p className="mt-1">The preview color is only for visualization in the browser — STL files contain no color data. The actual printed color is determined entirely by your filament or resin color. Choose your filament first, then print.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}

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
            </ToolLayout>
        </>
    )
}

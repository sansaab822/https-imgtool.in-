import { useState, useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { STLExporter } from 'three/addons/exporters/STLExporter.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import SEO from '../components/SEO'
import ToolLayout from '../components/ToolLayout'

export default function SvgToStl() {
    const [svgFile, setSvgFile] = useState(null)
    const [svgContent, setSvgContent] = useState('')
    const [depth, setDepth] = useState(5)
    const [scale, setScale] = useState(1)
    const [color, setColor] = useState('#6366f1')
    const [centerModel, setCenterModel] = useState(true)
    const [stlUrl, setStlUrl] = useState(null)
    const [generating, setGenerating] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [error, setError] = useState('')
    const mountRef = useRef()
    const sceneRef = useRef({})
    const inputRef = useRef()

    // Initialize 3D scene
    useEffect(() => {
        if (!mountRef.current) return
        const w = mountRef.current.clientWidth
        const h = 380

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf1f5f9)
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000)
        camera.position.set(0, 50, 150)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(w, h)
        renderer.setPixelRatio(window.devicePixelRatio)
        mountRef.current.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        scene.add(new THREE.AmbientLight(0xffffff, 0.6))
        const dir = new THREE.DirectionalLight(0xffffff, 1)
        dir.position.set(30, 50, 40)
        scene.add(dir)
        scene.add(new THREE.GridHelper(200, 20, 0xcccccc, 0xe5e5e5))

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

    const loadSvg = useCallback((file) => {
        if (!file) return
        setSvgFile(file)
        setStlUrl(null)
        setError('')
        const reader = new FileReader()
        reader.onload = (e) => {
            setSvgContent(e.target.result)
        }
        reader.readAsText(file)
    }, [])

    // Update 3D preview when SVG or params change
    useEffect(() => {
        if (!svgContent || !sceneRef.current.scene) return
        const { scene, camera } = sceneRef.current

        // Remove old meshes
        const old = scene.children.filter(c => c.name === 'svgGroup')
        old.forEach(o => { scene.remove(o); o.traverse(child => { child.geometry?.dispose(); child.material?.dispose() }) })

        try {
            const loader = new SVGLoader()
            const data = loader.parse(svgContent)
            const group = new THREE.Group()
            group.name = 'svgGroup'

            data.paths.forEach(path => {
                const shapes = SVGLoader.createShapes(path)
                shapes.forEach(shape => {
                    const geom = new THREE.ExtrudeGeometry(shape, {
                        depth: depth,
                        bevelEnabled: false,
                    })
                    const mat = new THREE.MeshPhongMaterial({
                        color: new THREE.Color(path.color ? `#${path.color.getHexString()}` : color),
                        shininess: 60,
                        side: THREE.DoubleSide,
                    })
                    const mesh = new THREE.Mesh(geom, mat)
                    group.add(mesh)
                })
            })

            group.scale.set(scale, -scale, scale) // SVG Y is inverted
            if (centerModel) {
                const box = new THREE.Box3().setFromObject(group)
                const center = box.getCenter(new THREE.Vector3())
                group.position.sub(center)
            }
            scene.add(group)

            // Auto-frame
            const box = new THREE.Box3().setFromObject(group)
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            camera.position.set(0, maxDim * 0.5, maxDim * 2)
            camera.lookAt(0, 0, 0)
            setError('')
        } catch (e) {
            setError('Could not parse SVG: ' + e.message)
        }
    }, [svgContent, depth, scale, color, centerModel])

    const exportStl = () => {
        const { scene } = sceneRef.current
        const group = scene?.children.find(c => c.name === 'svgGroup')
        if (!group) return
        setGenerating(true)
        setTimeout(() => {
            const exporter = new STLExporter()
            const stl = exporter.parse(group, { binary: true })
            const blob = new Blob([stl], { type: 'application/octet-stream' })
            setStlUrl(URL.createObjectURL(blob))
            setGenerating(false)
        }, 200)
    }

    return (
        <>
            <SEO title="SVG to STL Converter - Free Online 3D Tool" description="Convert SVG files to 3D STL models for 3D printing. Adjust depth, scale, preview in 3D. Free & private." canonical="/svg-to-stl" />
            <ToolLayout toolSlug="svg-to-stl" title="SVG to STL" description="Convert SVG vector graphics into 3D models and export to STL for CNC and 3D printing." breadcrumb="SVG to STL">
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {!svgFile && (
                            <div
                                className={`drop-zone group cursor-pointer ${dragging ? 'active' : ''}`}
                                onDrop={e => { e.preventDefault(); setDragging(false); loadSvg(e.dataTransfer.files?.[0]) }}
                                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input ref={inputRef} type="file" accept=".svg" className="hidden" onChange={e => loadSvg(e.target.files[0])} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-vector-square text-white text-2xl"></i>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-700">Drop SVG file or <span className="text-blue-600">browse</span></p>
                                        <p className="text-slate-400 text-sm mt-0.5">SVG → 3D model with extrusion</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3D Preview */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-600">
                                    <i className="fas fa-cube text-indigo-400 mr-1"></i>3D Preview
                                    {svgFile && <span className="ml-2 text-slate-400">— {svgFile.name}</span>}
                                </span>
                                {svgFile && (
                                    <button onClick={() => { setSvgFile(null); setSvgContent(''); setStlUrl(null) }} className="text-xs text-slate-400 hover:text-red-500">
                                        <i className="fas fa-xmark mr-1"></i>Remove
                                    </button>
                                )}
                            </div>
                            <div ref={mountRef} className="w-full" style={{ height: 380 }} />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                                <i className="fas fa-exclamation-circle"></i> {error}
                            </div>
                        )}

                        {stlUrl && (
                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-circle-check text-green-500"></i>
                                    <span className="font-bold text-green-800 text-sm">STL file ready for 3D printing!</span>
                                </div>
                                <a href={stlUrl} download={`${svgFile?.name?.replace('.svg', '') || 'model'}.stl`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all">
                                    <i className="fas fa-download"></i> Download STL
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fas fa-gear text-indigo-500"></i> Extrusion Settings
                            </h3>

                            {/* Depth */}
                            <div>
                                <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                    <span>Extrude Depth</span><span className="font-bold text-indigo-600">{depth}</span>
                                </label>
                                <input type="range" min="1" max="50" value={depth} onChange={e => setDepth(+e.target.value)} className="slider-range w-full" />
                            </div>

                            {/* Scale */}
                            <div>
                                <label className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                    <span>Scale</span><span className="font-bold text-indigo-600">{scale.toFixed(1)}x</span>
                                </label>
                                <input type="range" min="0.1" max="5" step="0.1" value={scale} onChange={e => setScale(+e.target.value)} className="slider-range w-full" />
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block text-[10px] text-slate-500 mb-1 font-medium">Preview Color (non-colored SVGs)</label>
                                <input type="color" value={color} onChange={e => setColor(e.target.value)}
                                    className="w-full h-9 rounded-lg border border-slate-200 p-0.5 cursor-pointer" />
                            </div>

                            {/* Center */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={centerModel} onChange={e => setCenterModel(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-xs font-medium text-slate-600">Center model at origin</span>
                            </label>

                            {/* Export */}
                            <button onClick={exportStl} disabled={!svgContent || generating}
                                className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2">
                                {generating ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...</>
                                ) : (
                                    <><i className="fas fa-download"></i> Export STL</>
                                )}
                            </button>

                            {!svgFile && (
                                <button onClick={() => inputRef.current?.click()}
                                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm rounded-xl transition-all">
                                    Upload SVG File
                                </button>
                            )}
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4 space-y-2">
                            <h4 className="font-bold text-slate-700 text-sm"><i className="fas fa-lightbulb text-amber-500 mr-2"></i>Tips</h4>
                            {['Simple SVGs with filled paths work best', 'Increase depth for thicker models', 'Scale controls model size', 'Binary STL is widely compatible'].map(t => (
                                <div key={t} className="flex items-start gap-2 text-xs text-slate-600">
                                    <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i> {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ToolLayout>
        </>
    )
}

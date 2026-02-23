/**
 * Shared pdfjs-dist initializer for all PDF tools.
 * Uses Vite's `?url` import to correctly bundle the worker for both
 * dev server and Vercel production builds.
 */
import * as _pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

_pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export const pdfjsLib = _pdfjsLib

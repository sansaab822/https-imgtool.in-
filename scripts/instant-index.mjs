import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { google } from 'googleapis'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const HOST = 'imgtool.in'
const SITE_URL = `https://${HOST}`
const INDEXNOW_KEY = 'imgtool-index-now-key-2026'

const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml')
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json')

// Extract URLs from sitemap
function getUrlsFromSitemap() {
    if (!fs.existsSync(SITEMAP_PATH)) {
        console.error('❌  sitemap.xml not found. Please run build or generate:sitemap first.')
        return []
    }
    const xml = fs.readFileSync(SITEMAP_PATH, 'utf-8')
    const regex = /<loc>(.*?)<\/loc>/g
    const urls = []
    let match
    while ((match = regex.exec(xml)) !== null) {
        if (match[1]) urls.push(match[1])
    }
    return urls
}

// ── 1. IndexNow API (Bing, Yandex, Seznam) ──
async function submitToIndexNow(urls) {
    if (urls.length === 0) return

    console.log(`\n🚀 Submitting ${urls.length} URLs to IndexNow (Bing, Yandex, etc.)...`)
    const payload = {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls
    }

    try {
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })

        if (response.ok) {
            console.log('✅  IndexNow submission successful! (HTTP 200/202)')
        } else {
            console.error(`❌  IndexNow failed. Status: ${response.status} ${response.statusText}`)
        }
    } catch (error) {
        console.error('❌  Error submitting to IndexNow:', error.message)
    }
}

// ── 2. Google Indexing API ──
async function submitToGoogle(urls) {
    if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
        console.log(`\n⚠️  Google Indexing API skipped: ${SERVICE_ACCOUNT_FILE} not found.`)
        console.log('   To enable instant Google indexing, download your Service Account JSON key')
        console.log('   from Google Cloud Console, save it as "scripts/service-account.json",')
        console.log('   and ensure the service email is added as an Owner in Search Console.')
        return
    }

    console.log(`\n🚀 Authenticating with Google Indexing API...`)
    try {
        const authClient = new google.auth.GoogleAuth({
            keyFilename: SERVICE_ACCOUNT_FILE,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        })

        const auth = await authClient.getClient()
        console.log('✅  Authenticated with Google successfully.')

        // Setup indexing client
        const indexing = google.indexing({
            version: 'v3',
            auth: auth,
        })

        // Prepare batches or loop carefully to respect quotas (Google limits to 100/200 requests per batch)
        // We send individual requests with a tiny delay to avoid hitting rate limits instantly
        console.log(`📡  Submitting ${urls.length} URLs to Google Indexing API...`)

        let successCount = 0
        let failCount = 0

        // To prevent API abuse, limit to maximum 200 URLs per run (Google's standard quota)
        const urlsToSubmit = urls.slice(0, 200)

        for (let i = 0; i < urlsToSubmit.length; i++) {
            const url = urlsToSubmit[i]
            try {
                await indexing.urlNotifications.publish({
                    requestBody: {
                        url: url,
                        type: 'URL_UPDATED',
                    },
                })
                successCount++
                process.stdout.write(`\r✅  Google Indexed: ${successCount} / ${urlsToSubmit.length}`)
            } catch (err) {
                failCount++
                console.error(`\n❌  Failed to submit ${url}:`, err.message || err.response?.data)
            }

            // Delay 100ms
            await new Promise(r => setTimeout(r, 100))
        }

        console.log(`\n🎉 Google Indexing complete! Success: ${successCount}, Failed: ${failCount}`)

    } catch (err) {
        console.error('❌  Google Indexing setup failed:', err.message)
    }
}

// Run
async function run() {
    const urls = getUrlsFromSitemap()
    if (urls.length > 0) {
        await submitToIndexNow(urls)
        await submitToGoogle(urls)
    } else {
        console.log('⚠️  No URLs found to index.')
    }
}

run()

/**
 * Clippy HTTP routes. The browser half polls one same-origin JSON endpoint,
 * the same pattern as dsh-pet's /api/pet family.
 * @module dsh-clippy/routes
 */
/** Browser-facing base path of the clippy API. */
export const CLIPPY_API_PREFIX = '/api/clippy';
function json(res, status, body) {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(body));
}
export function makeClippyRoutes(service) {
    return [
        {
            kind: 'exact',
            path: `${CLIPPY_API_PREFIX}/state`,
            handler: (req, res) => {
                if (req.method !== 'GET') {
                    json(res, 405, { ok: false, error: 'method-not-allowed' });
                    return;
                }
                service.state().then((value) => json(res, 200, value), (error) => json(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) }));
            },
        },
    ];
}

# Debug Session: products-load-failure
- **Status**: [OPEN]
- **Issue**: Storefront shows "Failed to load products. Please check your connection and try again."
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-products-load-failure.ndjson

## Reproduction Steps
1. Open the storefront products page.
2. Wait for the initial products request to complete.
3. Observe the generic load error instead of the product grid.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | Storefront is still calling the wrong API base URL in the active runtime. | High | Low | Rejected |
| B | Backend CORS rejects the storefront origin, so the browser reports a network failure. | High | Low | Confirmed |
| C | Backend `/api/products` throws at runtime on deployed data/JSON parsing. | Medium | Medium | Rejected |
| D | Storefront request succeeds but the response shape is not what the page expects. | Medium | Low | Pending |

## Log Evidence
- `GET https://tmobback.vercel.app/api/products` returns `200` with `53` products, so the endpoint is healthy.
- The deployed storefront bundle contains `tmobback.vercel.app`, so the active storefront build is targeting the expected backend.
- Response headers include `Access-Control-Allow-Credentials: true` and `Vary: Origin` but do not include `Access-Control-Allow-Origin` for a test frontend origin.
- `Origin: https://tn-front-admin.vercel.app` receives `Access-Control-Allow-Origin: https://tn-front-admin.vercel.app`.
- `Origin: https://tn-front-eight.vercel.app` does not receive `Access-Control-Allow-Origin`.
- This behavior matches Express `cors({ origin: [process.env.STOREFRONT_URL, process.env.ADMIN_URL], credentials: true })` when the request origin does not match the configured frontend domains.

## Verification Conclusion
- Root cause is a CORS origin mismatch on the deployed backend environment, not a database or endpoint failure.
- `ADMIN_URL` is configured correctly on the deployed backend, while `STOREFRONT_URL` is still incorrect, stale, or not redeployed.

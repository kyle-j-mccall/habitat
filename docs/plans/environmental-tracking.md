# Environmental tracking — temperature, humidity, and Raspberry Pi ingestion

*Deferred: 2026-10-11. Pick up after feeders ships.*

## What this is

A planned feature set for recording and visualizing the thermal/humidity conditions animals live in. Pulls together three related ideas:

- **Specs** — per-species (or per-animal) ideal ranges for daytime temp, nighttime temp, basking temp, humidity.
- **Readings** — a time-series of actual recorded values from each enclosure.
- **Pi ingestion** — a Raspberry Pi in each enclosure that reads sensors and POSTs readings to the API.

## Why defer

Feeders is simpler, lower-risk, and gives the full "schema → migration → service → controller → route → UI" rep without introducing new patterns (time-series, device auth, external ingestion). Shipping feeders first means environmental tracking can lean on the same patterns.

## Design decisions already thought through

### Two different kinds of data, don't mix them

- **Specs** — slowly-changing reference data. Low row count. Lives on `Species` (or `Animal` if we want per-individual overrides).
  - Suggested fields: `daytimeTempMinF`, `daytimeTempMaxF`, `nighttimeTempMinF`, `nighttimeTempMaxF`, `baskingTempMinF`, `baskingTempMaxF`, `humidityMinPct`, `humidityMaxPct`.
  - Lean: start on `Species`. Add `Animal`-level overrides later if biology demands.
- **Readings** — high-frequency time-series. Separate table, probably millions of rows over time.
  - Suggested schema: `EnvironmentReading { id, enclosureId, metric, value, recordedAt }`.
  - Long format (one row per metric) is more flexible than wide format (one column per metric).
  - Index: `(enclosureId, recordedAt)` for range queries.

### Keep raw readings forever (for now)

Pi reports every few minutes → millions of rows over a year. Still "a lot of rows but not actually a lot of data" by Postgres standards. Defer downsampling / TimescaleDB until it's a real problem.

### Raspberry Pi integration

Separate device-auth story, not user auth.

- `Device` table with `apiKey` (long random string), `enclosureId`, maybe `name`.
- `requireDeviceAuth` middleware (parallel to `requireAuth`), reads `X-API-Key` header, looks up device, attaches to `req.device`.
- Push model: Pi runs a Python cron, reads sensor, POSTs JSON to `/environment-readings`. One record per metric per interval.
- Reliability: Pi can buffer locally and retry on failure. Nice-to-have, not required for v1.
- One Pi per enclosure for simplicity. One-to-one relationship.

## Suggested implementation order when we come back

1. **Specs on `Species`** — add the eight numeric fields, migration, UI to view/edit on the species detail page. Smallest possible addition, no new table.
2. **Readings table + manual-entry UI** — add `EnvironmentReading`, service, routes. Build a UI where a keeper manually logs a reading. Validates the model and query patterns before plugging in a device.
3. **Readings display** — chart over time (shadcn/ui + recharts or similar) on the enclosure detail page. Overlay against the species' ideal range to show when the enclosure is in/out of spec.
4. **Device model + auth** — add `Device`, `requireDeviceAuth`, API key provisioning flow (admin UI to generate a key for an enclosure).
5. **Pi script** — Python cron on the Pi, reads sensor (likely DHT22 or similar), POSTs to API. Not Dewey's primary craft but conceptually straightforward.

## Interview talking points this would unlock

- Time-series data patterns (indexing, access patterns, downsampling tradeoffs).
- Device auth distinct from user auth (API keys, long-lived credentials, no human to re-authenticate).
- IoT ingestion pipeline end-to-end (sensor → device → API → DB → dashboard).
- Polymorphic specs (lives on species, could be overridden on individual).
- Why Postgres is "fine" for time-series until you have real scale (and when TimescaleDB earns its complexity).

## Open questions to resolve when we come back

- Fahrenheit vs Celsius storage (lean: Celsius internally, display in user's preferred unit).
- Should historical readings be deletable? Probably not — audit log semantics.
- Alert thresholds — do we want to notify when a reading is out of spec for N minutes? Separate feature, worth considering alongside readings.

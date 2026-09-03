/**
 * =============================================================================
 * validate.ts — a zod-powered request validation middleware
 * =============================================================================
 *
 * WHAT THIS IS
 *   A factory function. You give it a zod schema; it hands you back an Express
 *   middleware that validates (and optionally COERCES) `req.params` against
 *   that schema before your controller ever runs.
 *
 * WHY IT EXISTS
 *   Route params on the wire are always strings ("42", "banana", etc). Your
 *   services want real types (numbers, enums, dates). Rather than sprinkle
 *   parseInt / typeof checks / 400 responses through every controller, we do
 *   it once here and let the controller trust its inputs.
 *
 * THE MENTAL MODEL
 *   validateParams(schema)  →  (req, res, next) => { ...validate... }
 *   ^^^^^^^^^^^^^^^^^^^^^^
 *   A function that RETURNS a middleware. That "function returning a function"
 *   shape is how you parameterize middleware in Express.
 * ---------------------------------------------------------------------------
 */

import type { RequestHandler } from 'express';
import type { z, ZodType } from 'zod';

/**
 * `<S extends ZodType>` — a generic parameter constrained to "any zod schema".
 *
 * We keep the schema type generic so callers can pass ANY shape they want
 * (e.g. `z.object({ id: z.coerce.number() })` or a more elaborate schema),
 * and downstream code can still recover the exact type via `z.infer<typeof S>`.
 *
 * The return type is `RequestHandler` — Express's name for the standard
 * `(req, res, next) => void` middleware signature.
 */
/**
 * The return type is `RequestHandler<z.infer<S>>` — we're telling Express
 * "after this middleware runs, `req.params` will match the schema's inferred
 * type." This makes the route chain typecheck end-to-end: if the controller
 * says `Request<{ id: number }>`, the middleware in front of it must also
 * declare that same params shape. Propagating `z.infer<S>` here is what
 * links the two automatically.
 */
export function validateParams<S extends ZodType>(
  schema: S,
): RequestHandler<z.infer<S>> {
  // The OUTER function ran once at route-registration time (when the app boots).
  // The INNER function is the actual middleware — it runs on every request.
  return (req, res, next) => {
    // .safeParse returns a discriminated union:
    //   { success: true,  data:  <parsed & typed value> }
    //   { success: false, error: ZodError }
    // Using safeParse (instead of .parse, which throws) lets us handle the
    // failure branch ourselves and respond with a proper HTTP 400.
    const result = schema.safeParse(req.params);

    if (!result.success) {
      // `.error.issues` is a structured array describing every validation
      // failure (path, message, code). Great for API clients to render field
      // errors without string-parsing.
      return res.status(400).json({
        status: 'error',
        message: 'Invalid URL parameters',
        errors: result.error.issues,
      });
    }

    // SUCCESS PATH: overwrite req.params with the parsed (and possibly
    // COERCED) data. After this line, downstream code sees the transformed
    // values — e.g. `req.params.id` may now be a `number`, not a string.
    //
    // Why the `as never`?
    //   Express types `req.params` as `Record<string, string>`. Our coerced
    //   data may have non-string values (numbers, enums, etc), so TS would
    //   complain. We reassure it here; the controller side re-types the
    //   Request generic with the schema's inferred type, which is where the
    //   real safety comes back in.
    req.params = result.data as never;

    // Hand control to the next middleware / the controller.
    next();
  };
}

/**
 * validateBody — same idea as validateParams, but for `req.body`.
 *
 * The RequestHandler generics are positional: <Params, ResBody, ReqBody, Query>.
 * We leave Params/ResBody alone (defaults are fine) and pin the third slot to
 * `z.infer<S>` so the body type flows through the route chain to the handler.
 */
export function validateBody<S extends ZodType>(
  schema: S,
): RequestHandler<Record<string, string>, unknown, z.infer<S>> {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request body',
        errors: result.error.issues,
      });
    }
    req.body = result.data;
    next();
  };
}

/**
 * Note on query validation: Express 5 makes `req.query` a getter (not
 * assignable), so we can't use the same "overwrite" trick there. When we
 * need it, we'll stash the parsed value on `res.locals` or a custom
 * `req.valid` property instead.
 */

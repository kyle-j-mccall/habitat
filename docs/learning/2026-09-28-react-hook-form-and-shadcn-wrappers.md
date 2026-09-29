# React Hook Form + shadcn Form wrappers — structure and context flow

*Date: 2026-09-28*

> **Draft note.** Captured from a conversation. Rewrite in my own voice when I want to make it stick.

## What triggered this

Building `AuthForm.tsx` gave me a reason to actually understand the RHF + shadcn Form component stack. The two-layer nature (RHF underneath, shadcn wrappers on top) and the three stacked React contexts were the parts that took the longest to internalize.

## Two layers, cleanly separated

The stack I'm actually using has two independent tiers:

| Layer | What it provides | Where the code lives |
|---|---|---|
| **RHF** | Form state, validation, submission, per-field errors, dirty/touched tracking | `react-hook-form` npm package |
| **shadcn Form wrappers** | Styling, accessibility wiring, auto error rendering | `apps/web/src/components/ui/form.tsx` (my own file) |

The shadcn wrappers *own no state*. They pull everything from RHF via context and just render nicely with `aria-*` attributes wired up.

## RHF fundamentals worth remembering

The core mental model: **uncontrolled inputs, refs, no re-render on keystroke.**

Vanilla React forms use controlled inputs (`value` + `onChange` state) → every keystroke re-renders. RHF flips this by using DOM refs to read `.value` when needed (submit, validate) and skipping re-renders during typing. Same ergonomics, much better perf on real forms.

The API surface I actually use:

- **`useForm({ resolver, defaultValues })`** — the hook. Returns the form instance.
- **`form.handleSubmit(onValid)`** — wraps my onSubmit; runs validation, calls `onValid(values)` only if valid.
- **`form.control`** — the "handle" to this specific form instance, passed to any `Controller`/`FormField`.
- **`form.formState.errors`** — read by `FormMessage` from context, so I don't touch it directly.

Not using in AuthForm, but good to know exist:
- `register` — vanilla RHF's "wire input directly" API. shadcn's `FormField` replaces this by using `Controller` under the hood.
- `watch`, `setValue`, `reset`, `getValues` — only needed for reactive UI or programmatic form manipulation.

## The Zod resolver pattern

```ts
useForm({
  resolver: zodResolver(signInSchema),
  defaultValues: { username: '', password: '' },
});
```

`zodResolver` is an *adapter*. RHF has a "resolver" slot; any lib (Zod, Yup, Joi, Valibot) provides an adapter that fits it. This is dependency inversion — RHF doesn't know about Zod; it knows about a resolver interface.

Same "schemas and types don't have to be 1:1" idea from [[client-server-boundary]] applies:
- The Zod schema is the runtime validator.
- The type comes from `z.infer<typeof signInSchema>`.
- One declaration, two roles.

## The shadcn wrappers — what each one does

Six of the seven exports I use:

| Wrapper | Job |
|---|---|
| `<Form>` | Rename of RHF's `FormProvider`. Just publishes the form instance to context. |
| `<FormField>` | Wraps RHF's `Controller`. Registers a field by `name` and puts `name` into its own context. |
| `<FormItem>` | Generates a unique `id` via `React.useId()` and puts it into its own context. |
| `<FormLabel>` | Reads the id from context, sets `htmlFor` automatically. Turns red on error. |
| `<FormControl>` | Uses Radix's `Slot` to *become* its child — the child gets `id`, `aria-invalid`, `aria-describedby` merged onto it. |
| `<FormMessage>` | Reads `errors[fieldName]` from context and renders it. Empty when no error. |

The wrappers are all tiny (~10 lines each). They can stay tiny because they pull everything from context.

## Three contexts stacked

This was the sticky part. Each has a different scope.

| Context | Provided by | Scope | Carries |
|---|---|---|---|
| **RHF's FormProvider** (aliased as `<Form>`) | `<Form {...form}>` | The whole form | The entire RHF instance |
| **FormFieldContext** | `<FormField name="email">` | One field | `{ name: "email" }` |
| **FormItemContext** | `<FormItem>` | One visual row (label + control + message) | `{ id: ":r7:" }` |

The `useFormField` hook inside `form.tsx` is the aggregator — it reads all three contexts in one call and derives the ids and error state that the visible wrappers need.

Trace through one field:

```tsx
<Form {...form}>                       // ← RHF context: form instance
  <FormField name="email" ...>         // ← FormFieldContext: { name: "email" }
    render={({ field }) => (
      <FormItem>                       // ← FormItemContext: { id: ":r0:" }
        <FormLabel>Email</FormLabel>   // useFormField() → renders <label htmlFor=":r0:-form-item">
        <FormControl>
          <Input {...field} />         // Slot merges id + aria-* onto the Input
        </FormControl>
        <FormMessage />                // renders errors.email.message, or nothing
      </FormItem>
    )}
  />
</Form>
```

**Nearest-provider-wins.** Two different `<FormField>` blocks in the same form don't collide — each subtree sees its own FormFieldContext. Same for FormItem. This is just standard React context scoping (like lexical scoping for React data).

## The `{...form}` spread — how it works

Two mechanisms stacked. Neither is magic:

1. **JSX spread**: `<Form {...form}>` compiles to passing every field of the `form` object as a JSX prop. Pure JS.
2. **FormProvider's implementation**: it takes those props (via rest spread) and puts them into a React context. Any descendant calls `useFormContext()` and gets the whole form instance back.

So the flow is: `useForm() returns object → spread as JSX props → collected into context → descendants read via useFormContext`. Three transformations of the same data.

**Interview one-liner:** "The `useForm` instance is *ambient* in the subtree — spreading it into `FormProvider` makes every wrapper below able to reach it without prop-drilling."

## The two `form` names gotcha

- `<Form {...form}>` — the shadcn context provider. **Not** a DOM element. Doesn't accept `onSubmit`.
- `<form onSubmit={form.handleSubmit(onSubmit)}>` — the HTML element. Where the submit event fires.

They coexist in every shadcn+RHF setup. Confusing at first, but the split is deliberate — `FormProvider` is UI-agnostic (can wrap a modal, a div, whatever), so it can't be the DOM element itself.

## When to abstract a form (Rule of Three)

Also came out of this conversation. Don't extract a reusable Form component until I've written three concrete forms — the shape of the abstraction is only knowable *after* seeing the variation. Extract too early and I'll build the wrong seams.

Right now I have three forms: EnclosureForm, AnimalForm, AuthForm. If a shared pattern earns extraction later, it's more likely a **hook** (`useFormMutation` bundling `useForm` + `useMutation` + reset on success) than a monolithic `<Form>` component with a schema prop.

## What I want to remember

- **RHF = uncontrolled + refs.** Controlled state doesn't re-render on every keystroke; that's the whole perf story.
- **shadcn Form = presentation + a11y layer over RHF.** No new state; just context consumers.
- **Three stacked contexts** (form-wide, field-wide, item-wide) is how the wrappers stay prop-less.
- **`Slot` = merge my behavior onto my child.** Same idea as Base UI's `render` prop from [[client-server-boundary]] worked example — a widely reused React composition pattern.
- **Two `form` names.** Capital = context; lowercase = DOM.
- **Zod resolver pattern** is dependency inversion — one schema, two roles ([[client-server-boundary]]).
- Don't extract forms early — wait for three real usages.

## Interview version

> "RHF uses uncontrolled inputs and refs — same ergonomics as controlled state, none of the per-keystroke re-render cost. shadcn's Form component is a set of tiny wrappers on top that use three stacked React contexts — form, field, and item — to publish state to the wrappers without prop-drilling. `FormField` is `Controller` under the hood, `FormControl` uses `Slot` to merge behavior onto its child, and `FormMessage` reads errors from context. The whole system is dependency injection via context."

That's a two-sentence answer with real substance behind it.

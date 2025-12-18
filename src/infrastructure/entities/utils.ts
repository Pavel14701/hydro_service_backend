export const decimalTransformer = {
  to: (value?: number | null): number | null => value ?? null,
  from: (value?: string | null): number | null =>
    value == null ? null : parseFloat(value),
};
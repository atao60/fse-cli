import { Spec } from "arg";

export interface JobDef {
    name: string;
    spec: Spec;
    'default'?: { [key: string]: unknown};
    options: (_: { _: unknown[] }) => Record<string, unknown>;
    questions: (_: { [_: string]: unknown }) => Record<string, unknown>[]
}

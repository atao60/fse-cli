export interface JobDef {
    name: string;
    spec: {};
    'default'?: {},
    options: Function;
    questions: Function
}
export interface JobDef {
    name: string;
    spec: {[key: string]: any};
    'default'?: {},
    options: Function;
    questions: Function
}
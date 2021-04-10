export function info(message?: string, options?: {quiet?: boolean, params?: unknown[]}): void {
    logger(console.info, message, options);
}

export function error(message?: string, options?: {quiet?: boolean, params?: unknown[]}): void {
    logger(console.error, message, options);
}

export function logger(
    terminal: (message?: unknown, ...optionalParams: unknown[]) => void, 
    message?: string, 
    options?: {quiet?: boolean, params?: unknown[]}): void {
    if (options?.quiet) return;
    terminal(message, ...(options?.params || []));
}
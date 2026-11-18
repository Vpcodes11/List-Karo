// In-memory buffer cache for generated export files
export const exportBuffers = new Map<string, { buffer: Buffer; fileName: string; format: string }>();

/** Verifică dacă browserul poate desena scena 3D. */
export function suportaWebGL() {
    try {
        const canvas = document.createElement("canvas");
        return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
        return false;
    }
}

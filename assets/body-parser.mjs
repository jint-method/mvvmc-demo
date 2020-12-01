import { djinnjsOutDir } from "./config.mjs";
export async function parse(el) {
    let files = [];
    el.querySelectorAll("[css]").forEach(el => {
        const attr = el.getAttribute("css");
        const strings = attr.split(/\s+/g);
        files = [...files, ...strings];
    });
    if (files.length) {
        const { fetchCSS } = await import(`${location.origin}/${djinnjsOutDir}/fetch.mjs`);
        await fetchCSS(files);
    }
    return;
}

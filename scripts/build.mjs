import fs from 'node:fs';
import {build} from 'esbuild';
await build({entryPoints:['src/scene.js'],bundle:true,minify:true,format:'esm',target:'es2020',outfile:'dist/scene.js',legalComments:'eof'});
fs.copyFileSync('node_modules/three/LICENSE','dist/three-LICENSE.txt');
fs.rmSync('dist/runtime',{recursive:true,force:true});
const runtime=await build({entryPoints:['dist/app.js'],bundle:true,minify:true,splitting:true,format:'esm',target:'es2020',outdir:'dist/runtime',entryNames:'interface-[hash]',chunkNames:'scene-[hash]',metafile:true,legalComments:'eof'});
const entry=Object.entries(runtime.metafile.outputs).find(([,output])=>output.entryPoint==='dist/app.js')?.[0];
if(!entry)throw Error('Missing versioned interface bundle');
const htmlPath='dist/index.html';
let page=fs.readFileSync(htmlPath,'utf8');
page=page.replace(/<script type="module" src="(?:app\.js(?:\?[^"]*)?|runtime\/[^"]+)"><\/script>/,`<script type="module" src="${entry.replace(/^dist\//,'')}"></script>`);
fs.writeFileSync(htmlPath,page);

// All paths are relative so both root hosting and GitHub Pages subpaths work.
// Only the optional 3D scene is bundled; core content and navigation remain lightweight ES modules.
if(!fs.existsSync('dist/index.html')) throw Error('Missing static entrypoint');
const origin=process.env.PUBLIC_SITE_URL;
if(origin){const url=new URL(origin.endsWith('/')?origin:origin+'/');const path='dist/index.html';let html=fs.readFileSync(path,'utf8').replace(/<link rel="canonical"[^>]*>/g,'').replace(/<meta property="og:url"[^>]*>/g,'').replace(/<meta property="og:image"[^>]*>/g,'');html=html.replace('</head>',`<link rel="canonical" href="${url.href}"><meta property="og:url" content="${url.href}"><meta property="og:image" content="${new URL('assets/portrait.webp',url).href}"></head>`);fs.writeFileSync(path,html);fs.writeFileSync('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url.href}</loc></url></urlset>`);fs.writeFileSync('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml',url).href}\n`)}
console.log('Static portfolio ready in dist/');

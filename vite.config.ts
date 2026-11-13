import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { nav,contact,footer } from './src/fragments.ts';
export default defineConfig({
  plugins:[{name:'tc-static-components',transformIndexHtml(html,ctx){const isCase=ctx.path.includes('/proyectos/');return html.replace('<!--TC:NAV-->',nav(isCase)).replace('<!--TC:CONTACT-->',contact()).replace('<!--TC:FOOTER-->',footer()).replaceAll('<!--TC:ROBOTS-->',process.env.TC_PUBLIC_INDEXING==='1'?'index,follow':'noindex,nofollow');},generateBundle(){this.emitFile({type:'asset',fileName:'robots.txt',source:process.env.TC_PUBLIC_INDEXING==='1'?'User-agent: *\nAllow: /\nSitemap: https://tc-studio-six.vercel.app/sitemap.xml\n':'User-agent: *\nDisallow: /\n'});this.emitFile({type:'asset',fileName:'sitemap.xml',source:'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://tc-studio-six.vercel.app/</loc></url><url><loc>https://tc-studio-six.vercel.app/proyectos/tcgym/</loc></url><url><loc>https://tc-studio-six.vercel.app/proyectos/pediatria/</loc></url><url><loc>https://tc-studio-six.vercel.app/proyectos/facility/</loc></url></urlset>'});}}],
  build:{
    rollupOptions:{input:{home:resolve(import.meta.dirname,'index.html'),tcgym:resolve(import.meta.dirname,'proyectos/tcgym/index.html'),pediatria:resolve(import.meta.dirname,'proyectos/pediatria/index.html'),facility:resolve(import.meta.dirname,'proyectos/facility/index.html')}},
    sourcemap:false,
  },
  server:{host:'127.0.0.1',port:8770,strictPort:true},
  preview:{host:'127.0.0.1',port:8770,strictPort:true},
});

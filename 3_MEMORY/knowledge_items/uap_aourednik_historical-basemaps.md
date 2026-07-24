# KI: aourednik/historical-basemaps

## Overview
Repository with 197 files across 11 directories. Primary language: JavaScript (27 files).

## Tech Stack (from code)
- JavaScript (27 files)
- **Total:** 197 files, 11 directories
- **File types:** .geojson: 54, .svg: 54, .png: 49, .js: 27, .html: 4, .css: 4, .md: 2, .rmd: 1

## File Structure
```
  CONTRIBUTING.md
  LICENSE
  README.md
  d3v5_FuzzyAndExactBorders_example.html
  d3v5_example.html
  d3v5_roughjs_example.html
  geojson2svg.Rmd
  index.json
  geojson/
    places.geojson
    world_100.geojson
    world_1000.geojson
    world_1100.geojson
    world_1200.geojson
    world_1279.geojson
    world_1300.geojson
    world_1400.geojson
    world_1492.geojson
    world_1500.geojson
    world_1530.geojson
    world_1600.geojson
    world_1650.geojson
    world_1700.geojson
    world_1715.geojson
    world_1783.geojson
    world_1800.geojson
    world_1815.geojson
    world_1880.geojson
    world_1900.geojson
    world_1914.geojson
    world_1920.geojson
    world_1930.geojson
    world_1938.geojson
    world_1945.geojson
    world_1960.geojson
    world_1994.geojson
    world_200.geojson
    world_2000.geojson
    world_2010.geojson
    world_300.geojson
    world_400.geojson
    world_500.geojson
    world_600.geojson
    world_700.geojson
    world_800.geojson
    world_900.geojson
    world_bc1.geojson
    world_bc100.geojson
    world_bc1000.geojson
    world_bc10000.geojson
    world_bc123000.geojson
    world_bc1500.geojson
    world_bc200.geojson
    world_bc2000.geojson
    world_bc300.geojson
    world_bc3000.geojson
    world_bc323.geojson
    world_bc400.geojson
    world_bc4000.geojson
    world_bc500.geojson
    world_bc5000.geojson
    world_bc700.geojson
    world_bc8000.geojson
  img/
    fuzzy-borders.png
    historicBorders_fuzzyNonFuzzy.png
    historical-globe.png
    historicalmaps-leaflet.png
    places.png
    world_1880.png
    world_1880_dymaxion.png
    world_1880_dymaxion_rough.png
    world_bc123000.png
    world_bc2000.png
  leafletExample/
    index.html
    css/
      MarkerCluster.Default.css
      MarkerCluster.css
      leaflet.css
      qgis2web.css
      images/
        cancel.png
        cancel_@2X.png
        check.png
        check_@2X.png
        focus.png
        focus_@2X.png
        layers-2x.png
        layers.pn
```

## Key Source Excerpts
### lib\d3-geo-polygon.min.js
```javascript
// https://github.com/d3/d3-geo-polygon Version 1.4.2. Copyright 2018 Mike Bostock.
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("d3-array"),require("d3-geo"),require("d3-geo-projection")):"function"==typeof define&&define.amd?define(["exports","d3-array","d3-geo","d3-geo-projection"],t):t(n.d3=n.d3||{},n.d3,n.d3,n.d3)}(this,function(n,t,r,e){"use strict";function o(){}var i=1e-6,a=1e-12,u=Math.PI,l=u/2,c=u/4,f=2*u,p=180/u,s=u/180,h=Math.abs,g=Math.atan,v=Math.atan2,d=Math.cos,m=Math.exp,M=Math.log,y=Math.max,P=Math.min,A=Math.pow,E=Math.sin,G=Math.sign||function(n){return n>0?1:n<0?-1:0},x=Math.sqrt,C=Math.tan;function S(n){return n>1?0:n<-1?u:Math.acos(n)}function j(n){return n>1?l:n<-1?-l:Math.asin(n)}function w(n,t,r,e){this.x=n,this.z=t,this.o=r,this.e=e,this.v=!1,this.n=this.p=null}var B=function(n,t,r,e,o){var a,u,l=[],c=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,r,e=n[0],u=n[t];if(p=u,h((f=e)[0]-p[0])<i&&h(f[1]-p[1])<i){for(o.lineStart(),a=0;a<t;++a)o.point((e=n[a])[0],e[1]);o.lineEnd()}else{var f,p;l.push(r=new w(e,n,null,!0)),c.push(r.o=new w(e,null,r,!1)),l.push(r=new w(u,n,null,!1)),c.push(r.o=new w(u,null,r,!0))}}}),l.length){for(c.sort(t),D(l),D(c),a=0,u=c.length;a<u;++a)c[a].e=r=!r;for(var f,p,s=l[0];;){for(var g=s,v=!0;g.v;)if((g=g.n)===s)return;f=g.z,o.lineStart();do{if(g.v=g.o.v=!0,g.e){if(v)for(a=0,u=f.length;a<u;++a)o.point((p=f[a])[0],p[1]);else e(g.x,g.n.x,1,o);g=g.n}else{if(v)for(f=g.p.z,a=f.lengt
```

### lib\d3-geo-projection.v2.min.js
```javascript
// https://d3js.org/d3-geo-projection/ Version 2.4.0. Copyright 2018 Mike Bostock.
!function(n,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports,require("d3-geo"),require("d3-array")):"function"==typeof define&&define.amd?define(["exports","d3-geo","d3-array"],r):r(n.d3=n.d3||{},n.d3,n.d3)}(this,function(n,r,e){"use strict";function t(n){return n>1?Ar:n<-1?-Ar:Math.asin(n)}function o(n){return n>1?0:n<-1?Er:Math.acos(n)}function i(n){return n>0?Math.sqrt(n):0}function u(n){return(sr(n)-sr(-n))/2}function a(n){return(sr(n)+sr(-n))/2}function c(n){function r(n,r){var e=vr(n),t=vr(r),i=Rr(r),u=t*e,a=-((1-u?hr((1+u)/2)/(1-u):-.5)+o/(1+u));return[a*t*Rr(n),a*i]}var e=br(n/2),o=2*hr(vr(n/2))/(e*e);return r.invert=function(r,e){var u,a=i(r*r+e*e),c=-n/2,f=50;if(!a)return[0,0];do{var l=c/2,g=vr(l),v=Rr(l),s=br(l),p=hr(1/g);c-=u=(2/s*p-o*s-a)/(-p/(v*v)+1-o/(2*g*g))}while(fr(u)>jr&&--f>0);var h=Rr(c);return[gr(r*h,a*vr(c)),t(e*h/a)]},r}function f(n,r){var e=vr(r),t=function(n){return n?n/Math.sin(n):1}(o(e*vr(n/=2)));return[2*e*Rr(n)*t,Rr(r)*t]}function l(n){function r(n,r){var a=vr(r),c=vr(n/=2);return[(1+a)*Rr(n),(o*r>-gr(c,i)-.001?0:10*-o)+u+Rr(r)*t-(1+a)*e*c]}var e=Rr(n),t=vr(n),o=n>=0?1:-1,i=br(o*n),u=(1+e-t)/2;return r.invert=function(n,r){var a=0,c=0,f=50;do{var l=vr(a),g=Rr(a),v=vr(c),s=Rr(c),p=1+v,h=p*g-n,d=u+s*t-p*e*l-r,w=p*l/2,y=-g*s,m=e*p*g/2,P=t*v+e*l*s,R=y*m-P*w,b=(d*y-h*P)/R/2,j=(h*m-d*w)/R;a-=b,c-=j}while((fr(b)>jr||fr(j)>jr)&&--f>0);return o*c>-gr(vr(a)
```

### lib\d3-geo.v1.min.js
```javascript
// https://d3js.org/d3-geo/ Version 1.10.0. Copyright 2018 Mike Bostock.
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("d3-array")):"function"==typeof define&&define.amd?define(["exports","d3-array"],t):t(n.d3=n.d3||{},n.d3)}(this,function(n,t){"use strict";function r(){return new i}function i(){this.reset()}function e(n,t,r){var i=n.s=t+r,e=i-t,o=i-e;n.t=t-o+(r-e)}function o(n){return n>1?0:n<-1?nr:Math.acos(n)}function u(n){return n>1?tr:n<-1?-tr:Math.asin(n)}function c(n){return(n=gr(n/2))*n}function a(){}function l(n,t){n&&Sr.hasOwnProperty(n.type)&&Sr[n.type](n,t)}function f(n,t,r){var i,e=-1,o=n.length-r;for(t.lineStart();++e<o;)i=n[e],t.point(i[0],i[1],i[2]);t.lineEnd()}function s(n,t){var r=-1,i=n.length;for(t.polygonStart();++r<i;)f(n[r],t,1);t.polygonEnd()}function p(n,t){n&&yr.hasOwnProperty(n.type)?yr[n.type](n,t):l(n,t)}function h(){xr.point=v}function g(){d(mt,Mt)}function v(n,t){xr.point=d,mt=n,Mt=t,xt=n*=or,_t=lr(t=(t*=or)/2+rr),Nt=gr(t)}function d(n,t){t=(t*=or)/2+rr;var r=(n*=or)-xt,i=r>=0?1:-1,e=i*r,o=lr(t),u=gr(t),c=Nt*u,a=_t*o+c*lr(e),l=c*i*gr(e);mr.add(ar(l,a)),xt=n,_t=o,Nt=u}function E(n){return[ar(n[1],n[0]),u(n[2])]}function y(n){var t=n[0],r=n[1],i=lr(r);return[i*lr(t),i*gr(t),gr(r)]}function S(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function m(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function M(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function x(n,t){return[n[0]*t,n[1]*t,n[2]*t]}
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 20/100 · **Auto-apply:** False
- **Evidence:** `vector`
- **All scores:** {'seosona-os': 20, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}

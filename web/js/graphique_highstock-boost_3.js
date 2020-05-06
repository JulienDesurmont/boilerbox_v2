'use strict';(function(e){if(typeof module==='object'&&module.exports){e['default']=e;module.exports=e}
else if(typeof define==='function'&&define.amd){define('highcharts/modules/boost',['highcharts'],function(t){e(t);e.Highcharts=t;return e})}
else{e(typeof Highcharts!=='undefined'?Highcharts:undefined)}}(function(e){var t=e?e._modules:{};function i(e,t,i,o){if(!e.hasOwnProperty(t)){e[t]=o.apply(null,i)}};i(t,'modules/boost/boostables.js',[],function(){var e=['area','arearange','column','columnrange','bar','line','scatter','heatmap','bubble','treemap'];return e});i(t,'modules/boost/boostable-map.js',[t['modules/boost/boostables.js']],function(e){var t={};e.forEach(function(e){t[e]=1});return t});i(t,'modules/boost/wgl-shader.js',[t['parts/Globals.js'],t['parts/Utilities.js']],function(e,t){var o=t.clamp,r=t.error,i=e.pick;function s(e){var v=['#version 100','#define LN10 2.302585092994046','precision highp float;','attribute vec4 aVertexPosition;','attribute vec4 aColor;','varying highp vec2 position;','varying highp vec4 vColor;','uniform mat4 uPMatrix;','uniform float pSize;','uniform float translatedThreshold;','uniform bool hasThreshold;','uniform bool skipTranslation;','uniform float xAxisTrans;','uniform float xAxisMin;','uniform float xAxisMinPad;','uniform float xAxisPointRange;','uniform float xAxisLen;','uniform bool  xAxisPostTranslate;','uniform float xAxisOrdinalSlope;','uniform float xAxisOrdinalOffset;','uniform float xAxisPos;','uniform bool  xAxisCVSCoord;','uniform bool  xAxisIsLog;','uniform bool  xAxisReversed;','uniform float yAxisTrans;','uniform float yAxisMin;','uniform float yAxisMinPad;','uniform float yAxisPointRange;','uniform float yAxisLen;','uniform bool  yAxisPostTranslate;','uniform float yAxisOrdinalSlope;','uniform float yAxisOrdinalOffset;','uniform float yAxisPos;','uniform bool  yAxisCVSCoord;','uniform bool  yAxisIsLog;','uniform bool  yAxisReversed;','uniform bool  isBubble;','uniform bool  bubbleSizeByArea;','uniform float bubbleZMin;','uniform float bubbleZMax;','uniform float bubbleZThreshold;','uniform float bubbleMinSize;','uniform float bubbleMaxSize;','uniform bool  bubbleSizeAbs;','uniform bool  isInverted;','float bubbleRadius(){','float value = aVertexPosition.w;','float zMax = bubbleZMax;','float zMin = bubbleZMin;','float radius = 0.0;','float pos = 0.0;','float zRange = zMax - zMin;','if (bubbleSizeAbs){','value = value - bubbleZThreshold;','zMax = max(zMax - bubbleZThreshold, zMin - bubbleZThreshold);','zMin = 0.0;','}','if (value < zMin){','radius = bubbleZMin / 2.0 - 1.0;','} else {','pos = zRange > 0.0 ? (value - zMin) / zRange : 0.5;','if (bubbleSizeByArea && pos > 0.0){','pos = sqrt(pos);','}','radius = ceil(bubbleMinSize + pos * (bubbleMaxSize - bubbleMinSize)) / 2.0;','}','return radius * 2.0;','}','float translate(float val,','float pointPlacement,','float localA,','float localMin,','float minPixelPadding,','float pointRange,','float len,','bool  cvsCoord,','bool  isLog,','bool  reversed','){','float sign = 1.0;','float cvsOffset = 0.0;','if (cvsCoord) {','sign *= -1.0;','cvsOffset = len;','}','if (isLog) {','val = log(val) / LN10;','}','if (reversed) {','sign *= -1.0;','cvsOffset -= sign * len;','}','return sign * (val - localMin) * localA + cvsOffset + ','(sign * minPixelPadding);','}','float xToPixels(float value) {','if (skipTranslation){','return value;// + xAxisPos;','}','return translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord, xAxisIsLog, xAxisReversed);// + xAxisPos;','}','float yToPixels(float value, float checkTreshold) {','float v;','if (skipTranslation){','v = value;// + yAxisPos;','} else {','v = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord, yAxisIsLog, yAxisReversed);// + yAxisPos;','if (v > yAxisLen) {','v = yAxisLen;','}','}','if (checkTreshold > 0.0 && hasThreshold) {','v = min(v, translatedThreshold);','}','return v;','}','void main(void) {','if (isBubble){','gl_PointSize = bubbleRadius();','} else {','gl_PointSize = pSize;','}','vColor = aColor;','if (skipTranslation && isInverted) {','gl_Position = uPMatrix * vec4(aVertexPosition.y + yAxisPos, aVertexPosition.x + xAxisPos, 0.0, 1.0);','} else if (isInverted) {','gl_Position = uPMatrix * vec4(yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, xToPixels(aVertexPosition.x) + xAxisPos, 0.0, 1.0);','} else {','gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);','}','}'].join('\n'),T=['precision highp float;','uniform vec4 fillColor;','varying highp vec2 position;','varying highp vec4 vColor;','uniform sampler2D uSampler;','uniform bool isCircle;','uniform bool hasColor;','void main(void) {','vec4 col = fillColor;','vec4 tcol;','if (hasColor) {','col = vColor;','}','if (isCircle) {','tcol = texture2D(uSampler, gl_PointCoord.st);','col *= tcol;','if (tcol.r < 0.0) {','discard;','} else {','gl_FragColor = col;','}','} else {','gl_FragColor = col;','}','}'].join('\n'),h={},t,l,f,u,d,c,p,b,n,g,a=[],m;function x(){if(a.length){r('[highcharts boost] shader error - '+a.join('\n'))}};function y(t,i){var r=i==='vertex'?e.VERTEX_SHADER:e.FRAGMENT_SHADER,o=e.createShader(r);e.shaderSource(o,t);e.compileShader(o);if(!e.getShaderParameter(o,e.COMPILE_STATUS)){a.push('when compiling '+i+' shader:\n'+e.getShaderInfoLog(o));return!1};return o};function A(){var o=y(v,'vertex'),r=y(T,'fragment');if(!o||!r){t=!1;x();return!1};function i(i){return e.getUniformLocation(t,i)};t=e.createProgram();e.attachShader(t,o);e.attachShader(t,r);e.linkProgram(t);if(!e.getProgramParameter(t,e.LINK_STATUS)){a.push(e.getProgramInfoLog(t));x();t=!1;return!1};e.useProgram(t);e.bindAttribLocation(t,0,'aVertexPosition');l=i('uPMatrix');f=i('pSize');u=i('fillColor');d=i('isBubble');c=i('bubbleSizeAbs');p=i('bubbleSizeByArea');m=i('uSampler');b=i('skipTranslation');n=i('isCircle');g=i('isInverted');return!0};function P(){if(e&&t){e.deleteProgram(t);t=!1}};function S(){if(e&&t){e.useProgram(t)}};function s(i,o){if(e&&t){var r=h[i]=(h[i]||e.getUniformLocation(t,i));e.uniform1f(r,o)}};function E(i){if(e&&t){e.uniform1i(m,i)}};function k(i){if(e&&t){e.uniform1i(g,i)}};function M(i){if(e&&t){e.uniform1i(n,i?1:0)}};function C(){if(e&&t){e.uniform1i(d,0);e.uniform1i(n,0)}};function w(r,a,l){var f=r.options,u=Number.MAX_VALUE,h=-Number.MAX_VALUE;if(e&&t&&r.type==='bubble'){u=i(f.zMin,o(a,f.displayNegative===!1?f.zThreshold:-Number.MAX_VALUE,u));h=i(f.zMax,Math.max(h,l));e.uniform1i(d,1);e.uniform1i(n,1);e.uniform1i(p,(r.options.sizeBy!=='width'));e.uniform1i(c,r.options.sizeByAbsoluteValue);s('bubbleZMin',u);s('bubbleZMax',h);s('bubbleZThreshold',r.options.zThreshold);s('bubbleMinSize',r.minPxSize);s('bubbleMaxSize',r.maxPxSize)}};function B(i){if(e&&t){e.uniform4f(u,i[0]/255.0,i[1]/255.0,i[2]/255.0,i[3])}};function R(i){if(e&&t){e.uniform1i(b,i===!0?1:0)}};function U(i){if(e&&t){e.uniformMatrix4fv(l,!1,i)}};function D(i){if(e&&t){e.uniform1f(f,i)}};function z(){return t};if(e){if(!A()){return!1}};return{psUniform:function(){return f},pUniform:function(){return l},fillColorUniform:function(){return u},setBubbleUniforms:w,bind:S,program:z,create:A,setUniform:s,setPMatrix:U,setColor:B,setPointSize:D,setSkipTranslation:R,setTexture:E,setDrawAsCircle:M,reset:C,setInverted:k,destroy:P}};return s});i(t,'modules/boost/wgl-vbuffer.js',[],function(){function e(e,t,i){var r=!1,l=!1,n=i||2,o=!1,a=0,s;function f(){if(r){e.deleteBuffer(r);r=!1;l=!1};a=0;n=i||2;s=[]};function u(i,a,u){var d;s=i||[];if((!s||s.length===0)&&!o){f();return!1};n=u||n;if(r){e.deleteBuffer(r)};if(!o){d=new Float32Array(s)};r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r);e.bufferData(e.ARRAY_BUFFER,o||d,e.STATIC_DRAW);l=e.getAttribLocation(t.program(),a);e.enableVertexAttribArray(l);d=!1;return!0};function d(){if(!r){return!1};e.vertexAttribPointer(l,n,e.FLOAT,!1,0,0)};function h(t,i,a){var l=o?o.length:s.length;if(!r){return!1};if(!l){return!1};if(!t||t>l||t<0){t=0};if(!i||i>l){i=l};a=a||'points';e.drawArrays(e[a.toUpperCase()],t/n,(i-t)/n);return!0};function c(e,t,i,r){if(o){o[++a]=e;o[++a]=t;o[++a]=i;o[++a]=r}};function p(e){e*=4;a=-1;o=new Float32Array(e)};return{destroy:f,bind:d,data:s,build:u,render:h,allocate:p,push:c}};return e});i(t,'modules/boost/wgl-renderer.js',[t['parts/Globals.js'],t['modules/boost/wgl-shader.js'],t['modules/boost/wgl-vbuffer.js'],t['parts/Color.js'],t['parts/Utilities.js']],function(e,t,i,o,r){var s=o.parse,l=r.isNumber,f=r.merge,u=r.objectEach,d=e.win,h=d.document,n=e.some,a=e.pick;function c(r){var c=!1,b=!1,d=!1,x=0,y=0,g=!1,S=!1,v={},T=!1,m=[],A={},E={'column':!0,'columnrange':!0,'bar':!0,'area':!0,'arearange':!0},z={'scatter':!0,'bubble':!0},p={pointSize:1,lineWidth:1,fillColor:'#AA00AA',useAlpha:!0,usePreallocated:!1,useGPUTranslations:!1,debug:{timeRendering:!1,timeSeriesProcessing:!1,timeSetup:!1,timeBufferCopy:!1,timeKDTree:!1,showSkipSummary:!1}};function L(e){f(!0,p,e)};function k(e){var i,o,t;if(e.isSeriesBoosting){i=!!e.options.stacking;o=(e.xData||e.options.xData||e.processedXData);t=(i?e.data:(o||e.options.data)).length;if(e.type==='treemap'){t*=12}
else if(e.type==='heatmap'){t*=6}
else if(E[e.type]){t*=2};return t};return 0};function G(e){var t=0;if(!p.usePreallocated){return};e.series.forEach(function(e){if(e.isSeriesBoosting){t+=k(e)}});b.allocate(t)};function j(e){var t=0;if(!p.usePreallocated){return};if(e.isSeriesBoosting){t=k(e)};b.allocate(t)};function M(e,t){var i=0,o=1;return[2/e,0,0,0,0,-(2/t),0,0,0,0,-2/(o-i),0,-1,1,-(o+i)/(o-i),1]};function C(){d.clear(d.COLOR_BUFFER_BIT|d.DEPTH_BUFFER_BIT)};function N(){return d};function F(e,t){var Z=(e.pointArrayMap&&e.pointArrayMap.join(',')==='low,high'),D=e.chart,l=e.options,j=!!l.stacking,ue=l.data,K=e.xAxis.getExtremes(),A=K.min,v=K.max,ee=e.yAxis.getExtremes(),k=ee.min,N=ee.max,F=e.xData||l.xData||e.processedXData,de=e.yData||l.yData||e.processedYData,c=(e.zData||l.zData||e.processedZData),z=e.yAxis,X=e.xAxis,te=e.chart.plotWidth,ie=!F||F.length===0,O=l.connectNulls,T=e.points||!1,M=!1,L=!1,m,f,C,d=j?e.data:(F||ue),w={x:Number.MAX_VALUE,y:0},B={x:-Number.MAX_VALUE,y:0},oe=0,re=!1,he=1,ce=1,r,i,u,I,a=-1,x=!1,P=!1,R,pe=typeof D.index==='undefined',V=!1,H=!1,f=!1,be=E[e.type],W=!1,se=!0,ne=!0,U=l.zones||!1,S=!1,ae=l.threshold,Y=!1;if(l.boostData&&l.boostData.length>0){return};if(l.gapSize){Y=l.gapUnit!=='value'?l.gapSize*e.closestPointRange:l.gapSize};if(U){n(U,function(e){if(typeof e.value==='undefined'){S=new o(e.color);return!0}});if(!S){S=((e.pointAttribs&&e.pointAttribs().fill)||e.color);S=new o(S)}};if(D.inverted){te=e.chart.plotHeight};e.closestPointRangePx=Number.MAX_VALUE;function y(e){if(e){t.colorData.push(e[0]);t.colorData.push(e[1]);t.colorData.push(e[2]);t.colorData.push(e[3])}};function h(e,t,i,o,r){y(r);if(p.usePreallocated){b.push(e,t,i?1:0,o||1)}
else{g.push(e);g.push(t);g.push(i?1:0);g.push(o||1)}};function q(){if(t.segments.length){t.segments[t.segments.length-1].to=g.length}};function G(){if(t.segments.length&&t.segments[t.segments.length-1].from===g.length){return};q();t.segments.push({from:g.length})};function le(e,t,i,o,r){y(r);h(e+i,t);y(r);h(e,t);y(r);h(e,t+o);y(r);h(e,t+o);y(r);h(e+i,t+o);y(r);h(e+i,t)};G();if(T&&T.length>0){t.skipTranslation=!0;t.drawMode='triangles';if(T[0].node&&T[0].node.levelDynamic){T.sort(function(e,t){if(e.node){if(e.node.levelDynamic>t.node.levelDynamic){return 1};if(e.node.levelDynamic<t.node.levelDynamic){return-1}};return 0})};T.forEach(function(t){var n=t.plotY,i,o,r;if(typeof n!=='undefined'&&!isNaN(n)&&t.y!==null){i=t.shapeArgs;r=D.styledMode?t.series.colorAttribs(t):r=t.series.pointAttribs(t);o=r['stroke-width']||0;f=s(r.fill).rgba;f[0]/=255.0;f[1]/=255.0;f[2]/=255.0;if(e.type==='treemap'){o=o||1;C=s(r.stroke).rgba;C[0]/=255.0;C[1]/=255.0;C[2]/=255.0;le(i.x,i.y,i.width,i.height,C);o/=2};if(e.type==='heatmap'&&D.inverted){i.x=X.len-i.x;i.y=z.len-i.y;i.width=-i.width;i.height=-i.height};le(i.x+o,i.y+o,i.width-(o*2),i.height-(o*2),f)}});q();return}
while(a<d.length-1){u=d[++a];if(pe){break};if(ie){r=u[0];i=u[1];if(d[a+1]){P=d[a+1][0]};if(d[a-1]){x=d[a-1][0]};if(u.length>=3){I=u[2];if(u[2]>t.zMax){t.zMax=u[2]};if(u[2]<t.zMin){t.zMin=u[2]}}}
else{r=u;i=de[a];if(d[a+1]){P=d[a+1]};if(d[a-1]){x=d[a-1]};if(c&&c.length){I=c[a];if(c[a]>t.zMax){t.zMax=c[a]};if(c[a]<t.zMin){t.zMin=c[a]}}};if(!O&&(r===null||i===null)){G();continue};if(P&&P>=A&&P<=v){V=!0};if(x&&x>=A&&x<=v){H=!0};if(Z){if(ie){i=u.slice(1,3)};R=i[0];i=i[1]}
else if(j){r=u.x;i=u.stackY;R=i-u.y};if(k!==null&&typeof k!=='undefined'&&N!==null&&typeof N!=='undefined'){se=i>=k&&i<=N};if(r>v&&B.x<v){B.x=r;B.y=i};if(r<A&&w.x>A){w.x=r;w.y=i};if(i===null&&O){continue};if(i===null||(!se&&!V&&!H)){G();continue};if((P>=A||r>=A)&&(x<=v||r<=v)){W=!0};if(!W&&!V&&!H){continue};if(Y&&r-x>Y){G()};if(U){f=S.rgba;n(U,function(e,t){var o=U[t-1];if(typeof e.value!=='undefined'&&i<=e.value){if(!o||i>=o.value){f=s(e.color).rgba};return!0}});f[0]/=255.0;f[1]/=255.0;f[2]/=255.0};if(!p.useGPUTranslations){t.skipTranslation=!0;r=X.toPixels(r,!0);i=z.toPixels(i,!0);if(r>te){if(t.drawMode==='points'){continue}}};if(be){m=R;if(R===!1||typeof R==='undefined'){if(i<0){m=i}
else{m=0}};if(!Z&&!j){m=Math.max(ae===null?k:ae,k)};if(!p.useGPUTranslations){m=z.toPixels(m,!0)};h(r,m,0,0,f)};if(t.hasMarkers&&W){if(M!==!1){e.closestPointRangePx=Math.min(e.closestPointRangePx,Math.abs(r-M))}};if(!p.useGPUTranslations&&!p.usePreallocated&&(M&&Math.abs(r-M)<he)&&(L&&Math.abs(i-L)<ce)){if(p.debug.showSkipSummary){++oe};continue};if(l.step&&!ne){h(r,L,0,2,f)};h(r,i,0,e.type==='bubble'?(I||1):2,f);M=r;L=i;re=!0;ne=!1};if(p.debug.showSkipSummary){console.log('skipped points:',oe)};function fe(e,i){if(!p.useGPUTranslations){t.skipTranslation=!0;e.x=X.toPixels(e.x,!0);e.y=z.toPixels(e.y,!0)};if(i){g=[e.x,e.y,0,2].concat(g);return};h(e.x,e.y,0,2)};if(!re&&O!==!1&&e.drawMode==='line_strip'){if(w.x<Number.MAX_VALUE){fe(w,!0)};if(B.x>-Number.MAX_VALUE){fe(B)}};q()};function X(e){if(m.length>0){if(m[m.length-1].hasMarkers){m[m.length-1].markerTo=S.length}};if(p.debug.timeSeriesProcessing){console.time('building '+e.type+' series')};m.push({segments:[],markerFrom:S.length,colorData:[],series:e,zMin:Number.MAX_VALUE,zMax:-Number.MAX_VALUE,hasMarkers:e.options.marker?e.options.marker.enabled!==!1:!1,showMarkers:!0,drawMode:{'area':'lines','arearange':'lines','areaspline':'line_strip','column':'lines','columnrange':'lines','bar':'lines','line':'line_strip','scatter':'points','heatmap':'triangles','treemap':'triangles','bubble':'points'}[e.type]||'line_strip'});F(e,m[m.length-1]);if(p.debug.timeSeriesProcessing){console.timeEnd('building '+e.type+' series')}};function P(){m=[];v.data=g=[];S=[];if(b){b.destroy()}};function w(e){if(!c){return};c.setUniform('xAxisTrans',e.transA);c.setUniform('xAxisMin',e.min);c.setUniform('xAxisMinPad',e.minPixelPadding);c.setUniform('xAxisPointRange',e.pointRange);c.setUniform('xAxisLen',e.len);c.setUniform('xAxisPos',e.pos);c.setUniform('xAxisCVSCoord',(!e.horiz));c.setUniform('xAxisIsLog',e.isLog);c.setUniform('xAxisReversed',(!!e.reversed))};function B(e){if(!c){return};c.setUniform('yAxisTrans',e.transA);c.setUniform('yAxisMin',e.min);c.setUniform('yAxisMinPad',e.minPixelPadding);c.setUniform('yAxisPointRange',e.pointRange);c.setUniform('yAxisLen',e.len);c.setUniform('yAxisPos',e.pos);c.setUniform('yAxisCVSCoord',(!e.horiz));c.setUniform('yAxisIsLog',e.isLog);c.setUniform('yAxisReversed',(!!e.reversed))};function R(e,t){c.setUniform('hasThreshold',e);c.setUniform('translatedThreshold',t)};function U(t){if(t){if(!t.chartHeight||!t.chartWidth){};x=t.chartWidth||800;y=t.chartHeight||400}
else{return!1};if(!d||!x||!y||!c){return!1};if(p.debug.timeRendering){console.time('gl rendering')};d.canvas.width=x;d.canvas.height=y;c.bind();d.viewport(0,0,x,y);c.setPMatrix(M(x,y));if(p.lineWidth>1&&!e.isMS){d.lineWidth(p.lineWidth)};b.build(v.data,'aVertexPosition',4);b.bind();c.setInverted(t.inverted);m.forEach(function(e,r){var n=e.series.options,x=n.marker,f,v=(typeof n.lineWidth!=='undefined'?n.lineWidth:1),y=n.threshold,T=l(y),P=e.series.yAxis.getThreshold(y),S=P,g,E=a(n.marker?n.marker.enabled:null,e.series.xAxis.isRadial?!0:null,e.series.closestPointRangePx>2*((n.marker?n.marker.radius:10)||10)),u,m=A[(x&&x.symbol)||e.series.symbol]||A.circle,h=[];if(e.segments.length===0||(e.segmentslength&&e.segments[0].from===e.segments[0].to)){return};if(m.isReady){d.bindTexture(d.TEXTURE_2D,m.handle);c.setTexture(m.handle)};if(t.styledMode){u=(e.series.markerGroup&&e.series.markerGroup.getStyle('fill'))}
else{u=(e.series.pointAttribs&&e.series.pointAttribs().fill)||e.series.color;if(n.colorByPoint){u=e.series.chart.options.colors[r]}};if(e.series.fillOpacity&&n.fillOpacity){u=new o(u).setOpacity(a(n.fillOpacity,1.0)).get()};h=s(u).rgba;if(!p.useAlpha){h[3]=1.0};if(e.drawMode==='lines'&&p.useAlpha&&h[3]<1){h[3]/=10};if(n.boostBlending==='add'){d.blendFunc(d.SRC_ALPHA,d.ONE);d.blendEquation(d.FUNC_ADD)}
else if(n.boostBlending==='mult'||n.boostBlending==='multiply'){d.blendFunc(d.DST_COLOR,d.ZERO)}
else if(n.boostBlending==='darken'){d.blendFunc(d.ONE,d.ONE);d.blendEquation(d.FUNC_MIN)}
else{d.blendFuncSeparate(d.SRC_ALPHA,d.ONE_MINUS_SRC_ALPHA,d.ONE,d.ONE_MINUS_SRC_ALPHA)};c.reset();if(e.colorData.length>0){c.setUniform('hasColor',1.0);g=i(d,c);g.build(e.colorData,'aColor',4);g.bind()};c.setColor(h);w(e.series.xAxis);B(e.series.yAxis);R(T,S);if(e.drawMode==='points'){if(n.marker&&n.marker.radius){c.setPointSize(n.marker.radius*2.0)}
else{c.setPointSize(1)}};c.setSkipTranslation(e.skipTranslation);if(e.series.type==='bubble'){c.setBubbleUniforms(e.series,e.zMin,e.zMax)};c.setDrawAsCircle(z[e.series.type]||!1);if(v>0||e.drawMode!=='line_strip'){for(f=0;f<e.segments.length;f++){b.render(e.segments[f].from,e.segments[f].to,e.drawMode)}};if(e.hasMarkers&&E){if(n.marker&&n.marker.radius){c.setPointSize(n.marker.radius*2.0)}
else{c.setPointSize(10)};c.setDrawAsCircle(!0);for(f=0;f<e.segments.length;f++){b.render(e.segments[f].from,e.segments[f].to,'POINTS')}}});if(p.debug.timeRendering){console.timeEnd('gl rendering')};if(r){r()};P()};function D(e){C();if(e.renderer.forExport){return U(e)};if(T){U(e)}
else{setTimeout(function(){D(e)},1)}};function O(e,t){if((x===e&&y===t)||!c){return};x=e;y=t;c.bind();c.setPMatrix(M(x,y))};function I(e,o){var s=0,n=['webgl','experimental-webgl','moz-webgl','webkit-3d'];T=!1;if(!e){return!1};if(p.debug.timeSetup){console.time('gl setup')};for(;s<n.length;s++){d=e.getContext(n[s],{});if(d){break}};if(d){if(!o){P()}}
else{return!1};d.enable(d.BLEND);d.blendFunc(d.SRC_ALPHA,d.ONE_MINUS_SRC_ALPHA);d.disable(d.DEPTH_TEST);d.depthFunc(d.LESS);c=t(d);if(!c){return!1};b=i(d,c);function r(e,t){var i={isReady:!1,texture:h.createElement('canvas'),handle:d.createTexture()},o=i.texture.getContext('2d');A[e]=i;i.texture.width=512;i.texture.height=512;o.mozImageSmoothingEnabled=!1;o.webkitImageSmoothingEnabled=!1;o.msImageSmoothingEnabled=!1;o.imageSmoothingEnabled=!1;o.strokeStyle='rgba(255, 255, 255, 0)';o.fillStyle='#FFF';t(o);try{d.activeTexture(d.TEXTURE0);d.bindTexture(d.TEXTURE_2D,i.handle);d.texImage2D(d.TEXTURE_2D,0,d.RGBA,d.RGBA,d.UNSIGNED_BYTE,i.texture);d.texParameteri(d.TEXTURE_2D,d.TEXTURE_WRAP_S,d.CLAMP_TO_EDGE);d.texParameteri(d.TEXTURE_2D,d.TEXTURE_WRAP_T,d.CLAMP_TO_EDGE);d.texParameteri(d.TEXTURE_2D,d.TEXTURE_MAG_FILTER,d.LINEAR);d.texParameteri(d.TEXTURE_2D,d.TEXTURE_MIN_FILTER,d.LINEAR);d.bindTexture(d.TEXTURE_2D,null);i.isReady=!0}catch(r){}};r('circle',function(e){e.beginPath();e.arc(256,256,256,0,2*Math.PI);e.stroke();e.fill()});r('square',function(e){e.fillRect(0,0,512,512)});r('diamond',function(e){e.beginPath();e.moveTo(256,0);e.lineTo(512,256);e.lineTo(256,512);e.lineTo(0,256);e.lineTo(256,0);e.fill()});r('triangle',function(e){e.beginPath();e.moveTo(0,512);e.lineTo(256,0);e.lineTo(512,512);e.lineTo(0,512);e.fill()});r('triangle-down',function(e){e.beginPath();e.moveTo(0,0);e.lineTo(256,512);e.lineTo(512,0);e.lineTo(0,0);e.fill()});T=!0;if(p.debug.timeSetup){console.timeEnd('gl setup')};return!0};function V(){return d!==!1};function H(){return T};function W(){P();b.destroy();c.destroy();if(d){u(A,function(e){if(A[e].handle){d.deleteTexture(A[e].handle)}});d.canvas.width=1;d.canvas.height=1}};v={allocateBufferForSingleSeries:j,pushSeries:X,setSize:O,inited:H,setThreshold:R,init:I,render:D,settings:p,valid:V,clear:C,flush:P,setXAxis:w,setYAxis:B,data:g,gl:N,allocateBuffer:G,destroy:W,setOptions:L};return v};return c});i(t,'modules/boost/boost-attach.js',[t['parts/Globals.js'],t['modules/boost/wgl-renderer.js'],t['parts/Utilities.js']],function(e,t,i){var r=i.error,s=e.win,o=s.document,n=o.createElement('canvas');function a(i,a){var l=i.chartWidth,f=i.chartHeight,s=i,u=i.seriesGroup||a.group,h=1,d=o.implementation.hasFeature('www.http://w3.org/TR/SVG11/feature#Extensibility','1.1');if(i.isChartSeriesBoosting()){s=i}
else{s=a};d=!1;if(!s.renderTarget){s.canvas=n;if(i.renderer.forExport||!d){s.renderTarget=i.renderer.image('',0,0,l,f).addClass('highcharts-boost-canvas').add(u);s.boostClear=function(){s.renderTarget.attr({href:''})};s.boostCopy=function(){s.boostResizeTarget();s.renderTarget.attr({href:s.canvas.toDataURL('image/png')})}}
else{s.renderTargetFo=i.renderer.createElement('foreignObject').add(u);s.renderTarget=o.createElement('canvas');s.renderTargetCtx=s.renderTarget.getContext('2d');s.renderTargetFo.element.appendChild(s.renderTarget);s.boostClear=function(){s.renderTarget.width=s.canvas.width;s.renderTarget.height=s.canvas.height};s.boostCopy=function(){s.renderTarget.width=s.canvas.width;s.renderTarget.height=s.canvas.height;s.renderTargetCtx.drawImage(s.canvas,0,0)}};s.boostResizeTarget=function(){l=i.chartWidth;f=i.chartHeight;(s.renderTargetFo||s.renderTarget).attr({x:0,y:0,width:l,height:f}).css({pointerEvents:'none',mixedBlendMode:'normal',opacity:h});if(s instanceof e.Chart){s.markerGroup.translate(i.plotLeft,i.plotTop)}};s.boostClipRect=i.renderer.clipRect();(s.renderTargetFo||s.renderTarget).clip(s.boostClipRect);if(s instanceof e.Chart){s.markerGroup=s.renderer.g().add(u);s.markerGroup.translate(a.xAxis.pos,a.yAxis.pos)}};s.canvas.width=l;s.canvas.height=f;s.boostClipRect.attr(i.getBoostClipRect(s));s.boostResizeTarget();s.boostClear();if(!s.ogl){s.ogl=t(function(){if(s.ogl.settings.debug.timeBufferCopy){console.time('buffer copy')};s.boostCopy();if(s.ogl.settings.debug.timeBufferCopy){console.timeEnd('buffer copy')}});if(!s.ogl.init(s.canvas)){r('[highcharts boost] - unable to init WebGL renderer')};s.ogl.setOptions(i.options.boost||{});if(s instanceof e.Chart){s.ogl.allocateBuffer(i)}};s.ogl.setSize(l,f);return s.ogl};return a});i(t,'modules/boost/boost-utils.js',[t['parts/Globals.js'],t['modules/boost/boostable-map.js'],t['modules/boost/boost-attach.js']],function(e,t,i){var o=e.win,d=o.document,s=e.pick,h=3000;function n(){var i=[];for(var e=0;e<arguments.length;e++){i[e]=arguments[e]};var t=-Number.MAX_VALUE;i.forEach(function(e){if(typeof e!=='undefined'&&e!==null&&typeof e.length!=='undefined'){if(e.length>0){t=e.length;return!0}}});return t};function c(e){return s((e&&e.options&&e.options.boost&&e.options.boost.enabled),!0)};function p(e){var r=0,a=0,l=s(e.options.boost&&e.options.boost.allowForce,!0),i;if(typeof e.boostForceChartBoost!=='undefined'){return e.boostForceChartBoost};if(e.series.length>1){for(var o=0;o<e.series.length;o++){i=e.series[o];if(i.options.boostThreshold===0||i.visible===!1){continue};if(i.type==='heatmap'){continue};if(t[i.type]){++a};if(n(i.processedXData,i.options.data,i.points)>=(i.options.boostThreshold||Number.MAX_VALUE)){++r}}};e.boostForceChartBoost=l&&((a===e.series.length&&r>0)||r>5);return e.boostForceChartBoost};function a(e,t,i){if(e&&t.renderTarget&&t.canvas&&!(i||t.chart).isChartSeriesBoosting()){e.render(i||t.chart)}};function l(e,t){if(e&&t.renderTarget&&t.canvas&&!t.chart.isChartSeriesBoosting()){e.allocateBufferForSingleSeries(t)}};function r(e,t,i,n,s,a){s=s||0;n=n||h;var f=s+n,l=!0;while(l&&s<f&&s<e.length){l=t(e[s],s);++s};if(l){if(s<e.length){if(a){r(e,t,i,n,s,a)}
else if(o.requestAnimationFrame){o.requestAnimationFrame(function(){r(e,t,i,n,s)})}
else{setTimeout(function(){r(e,t,i,n,s)})}}
else if(i){i()}}};function f(){var e=0,i,r=['webgl','experimental-webgl','moz-webgl','webkit-3d'],t=!1;if(typeof o.WebGLRenderingContext!=='undefined'){i=d.createElement('canvas');for(;e<r.length;e++){try{t=i.getContext(r[e]);if(typeof t!=='undefined'&&t!==null){return!0}}catch(s){}}};return!1};function b(e){var o=!0,t;if(this.chart.options&&this.chart.options.boost){o=typeof this.chart.options.boost.enabled==='undefined'?!0:this.chart.options.boost.enabled};if(!o||!this.isSeriesBoosting){return e.call(this)};this.chart.isBoosting=!0;t=i(this.chart,this);if(t){l(t,this);t.pushSeries(this)};a(t,this)};var u={patientMax:n,boostEnabled:c,shouldForceChartSeriesBoosting:p,renderIfNotSeriesBoosting:a,allocateIfNotSeriesBoosting:l,eachAsync:r,hasWebGLSupport:f,pointDrawHandler:b};e.hasWebGLSupport=f;return u});i(t,'modules/boost/boost-init.js',[t['parts/Globals.js'],t['parts/Utilities.js'],t['modules/boost/boost-utils.js'],t['modules/boost/boost-attach.js']],function(e,t,i,o){var a=t.addEvent,s=t.extend,f=t.fireEvent,l=t.wrap,u=e.Series,r=e.seriesTypes,d=function(){},h=i.eachAsync,c=i.pointDrawHandler,p=i.allocateIfNotSeriesBoosting,b=i.renderIfNotSeriesBoosting,g=i.shouldForceChartSeriesBoosting,n;function m(){s(u.prototype,{renderCanvas:function(){var e=this,i=e.options||{},r=!1,t=e.chart,u=this.xAxis,s=this.yAxis,v=i.xData||e.processedXData,R=i.yData||e.processedYData,U=i.data,T=u.getExtremes(),D=T.min,z=T.max,P=s.getExtremes(),L=P.min,G=P.max,S={},c,j=!!e.sampling,E,N=i.enableMouseTracking!==!1,F=i.threshold,g=s.getThreshold(F),k=e.pointArrayMap&&e.pointArrayMap.join(',')==='low,high',M=!!i.stacking,C=e.cropStart||0,X=e.requireSorting,w=!v,m,x,a,l,y,O=i.findNearestPointBy==='x',B=(this.xData||this.options.xData||this.processedXData||!1),A=function(e,i,o){e=Math.ceil(e);n=O?e:e+','+i;if(N&&!S[n]){S[n]=!0;if(t.inverted){e=u.len-e;i=s.len-i};E.push({x:B?B[C+o]:!1,clientX:e,plotX:e,plotY:i,i:C+o})}};r=o(t,e);t.isBoosting=!0;y=r.settings;if(!this.visible){return};if(this.points||this.graph){this.animate=null;this.destroyGraphics()};if(!t.isChartSeriesBoosting()){if(this.markerGroup===t.markerGroup){this.markerGroup=void 0};this.markerGroup=e.plotGroup('markerGroup','markers',!0,1,t.seriesGroup)}
else{if(this.markerGroup&&this.markerGroup!==t.markerGroup){this.markerGroup.destroy()};this.markerGroup=t.markerGroup;if(this.renderTarget){this.renderTarget=this.renderTarget.destroy()}};E=this.points=[];e.buildKDTree=d;if(r){p(r,this);r.pushSeries(e);b(r,this,t)};function I(e,i){var n,o,r,f,h,d=!1,p=typeof t.index==='undefined',b=!0;if(!p){if(w){n=e[0];o=e[1]}
else{n=e;o=R[i]};if(k){if(w){o=e.slice(1,3)};d=o[0];o=o[1]}
else if(M){n=e.x;o=e.stackY;d=o-e.y};h=o===null;if(!X){b=o>=L&&o<=G};if(!h&&n>=D&&n<=z&&b){r=u.toPixels(n,!0);if(j){if(typeof a==='undefined'||r===c){if(!k){d=o};if(typeof l==='undefined'||o>x){x=o;l=i};if(typeof a==='undefined'||d<m){m=d;a=i}};if(r!==c){if(typeof a!=='undefined'){f=s.toPixels(x,!0);g=s.toPixels(m,!0);A(r,f,l);if(g!==f){A(r,g,a)}};a=l=void 0;c=r}}
else{f=Math.ceil(s.toPixels(o,!0));A(r,f,i)}}};return!p};function V(){f(e,'renderedCanvas');delete e.buildKDTree;e.buildKDTree();if(y.debug.timeKDTree){console.timeEnd('kd tree building')}};if(!t.renderer.forExport){if(y.debug.timeKDTree){console.time('kd tree building')};h(M?e.data:(v||U),I,V)}}});['heatmap','treemap'].forEach(function(e){if(r[e]){l(r[e].prototype,'drawPoints',c)}});if(r.bubble){delete r.bubble.prototype.buildKDTree;l(r.bubble.prototype,'markerAttribs',function(e){if(this.isSeriesBoosting){return!1};return e.apply(this,[].slice.call(arguments,1))})};r.scatter.prototype.fill=!0;s(r.area.prototype,{fill:!0,fillOpacity:!0,sampling:!0});s(r.column.prototype,{fill:!0,sampling:!0});e.Chart.prototype.callbacks.push(function(e){function t(){if(e.ogl&&e.isChartSeriesBoosting()){e.ogl.render(e)}};function i(){e.boostForceChartBoost=void 0;e.boostForceChartBoost=g(e);e.isBoosting=!1;if(!e.isChartSeriesBoosting()&&e.didBoost){e.didBoost=!1};if(e.boostClear){e.boostClear()};if(e.canvas&&e.ogl&&e.isChartSeriesBoosting()){e.didBoost=!0;e.ogl.allocateBuffer(e)};if(e.markerGroup&&e.xAxis&&e.xAxis.length>0&&e.yAxis&&e.yAxis.length>0){e.markerGroup.translate(e.xAxis[0].pos,e.yAxis[0].pos)}};a(e,'predraw',i);a(e,'render',t)})};return m});i(t,'modules/boost/boost-overrides.js',[t['parts/Globals.js'],t['parts/Point.js'],t['parts/Utilities.js'],t['modules/boost/boost-utils.js'],t['modules/boost/boostables.js'],t['modules/boost/boostable-map.js']],function(e,t,i,r,a,l){var d=i.addEvent,b=i.error,s=i.isNumber,h=i.pick,n=i.wrap,c=r.boostEnabled,g=r.shouldForceChartSeriesBoosting,p=e.Chart,o=e.Series,f=e.seriesTypes,u=e.getOptions().plotOptions;p.prototype.isChartSeriesBoosting=function(){var e,t=h(this.options.boost&&this.options.boost.seriesThreshold,50);e=t<=this.series.length||g(this);return e};p.prototype.getBoostClipRect=function(e){var t={x:this.plotLeft,y:this.plotTop,width:this.plotWidth,height:this.plotHeight};if(e===this){this.yAxis.forEach(function(e){t.y=Math.min(e.pos,t.y);t.height=Math.max(e.pos-this.plotTop+e.len,t.height)},this)};return t};o.prototype.getPoint=function(e){var t=e,i=(this.xData||this.options.xData||this.processedXData||!1);if(e&&!(e instanceof this.pointClass)){t=(new this.pointClass()).init(this,this.options.data[e.i],i?i[e.i]:void 0);t.category=h(this.xAxis.categories?this.xAxis.categories[t.x]:t.x,t.x);t.dist=e.dist;t.distX=e.distX;t.plotX=e.plotX;t.plotY=e.plotY;t.index=e.i};return t};n(o.prototype,'searchPoint',function(e){return this.getPoint(e.apply(this,[].slice.call(arguments,1)))});n(t.prototype,'haloPath',function(e){var o,t=this,i=t.series,a=i.chart,r=t.plotX,s=t.plotY,n=a.inverted;if(i.isSeriesBoosting&&n){t.plotX=i.yAxis.len-s;t.plotY=i.xAxis.len-r};o=e.apply(this,Array.prototype.slice.call(arguments,1));if(i.isSeriesBoosting&&n){t.plotX=r;t.plotY=s};return o});n(o.prototype,'markerAttribs',function(e,t){var o,i=this,a=i.chart,r=t.plotX,s=t.plotY,n=a.inverted;if(i.isSeriesBoosting&&n){t.plotX=i.yAxis.len-s;t.plotY=i.xAxis.len-r};o=e.apply(this,Array.prototype.slice.call(arguments,1));if(i.isSeriesBoosting&&n){t.plotX=r;t.plotY=s};return o});d(o,'destroy',function(){var t=this,e=t.chart;if(e.markerGroup===t.markerGroup){t.markerGroup=null};if(e.hoverPoints){e.hoverPoints=e.hoverPoints.filter(function(e){return e.series===t})};if(e.hoverPoint&&e.hoverPoint.series===t){e.hoverPoint=null}});n(o.prototype,'getExtremes',function(e){if(!this.isSeriesBoosting||(!this.hasExtremes||!this.hasExtremes())){return e.apply(this,Array.prototype.slice.call(arguments,1))}});['translate','generatePoints','drawTracker','drawPoints','render'].forEach(function(e){function t(t){var i=this.options.stacking&&(e==='translate'||e==='generatePoints');if(!this.isSeriesBoosting||i||!c(this.chart)||this.type==='heatmap'||this.type==='treemap'||!l[this.type]||this.options.boostThreshold===0){t.call(this)}
else if(this[e+'Canvas']){this[e+'Canvas']()}};n(o.prototype,e,t);if(e==='translate'){['column','bar','arearange','columnrange','heatmap','treemap'].forEach(function(i){if(f[i]){n(f[i].prototype,e,t)}})}});n(o.prototype,'processData',function(t){var r=this,i=this.options.data,o;function n(e){return r.chart.isChartSeriesBoosting()||((e?e.length:0)>=(r.options.boostThreshold||Number.MAX_VALUE))};if(c(this.chart)&&l[this.type]){if(!n(i)||this.type==='heatmap'||this.type==='treemap'||this.options.stacking||!this.hasExtremes||!this.hasExtremes(!0)){t.apply(this,Array.prototype.slice.call(arguments,1));i=this.processedXData};this.isSeriesBoosting=n(i);if(this.isSeriesBoosting){o=this.getFirstValidPoint(this.options.data);if(!s(o)&&!e.isArray(o)){b(12,!1,this.chart)};this.enterBoost()}
else if(this.exitBoost){this.exitBoost()}}
else{t.apply(this,Array.prototype.slice.call(arguments,1))}});d(o,'hide',function(){if(this.canvas&&this.renderTarget){if(this.ogl){this.ogl.clear()};this.boostClear()}});o.prototype.enterBoost=function(){this.alteredByBoost=[];['allowDG','directTouch','stickyTracking'].forEach(function(e){this.alteredByBoost.push({prop:e,val:this[e],own:Object.hasOwnProperty.call(this,e)})},this);this.allowDG=!1;this.directTouch=!1;this.stickyTracking=!0;this.animate=null;if(this.labelBySeries){this.labelBySeries=this.labelBySeries.destroy()}};o.prototype.exitBoost=function(){(this.alteredByBoost||[]).forEach(function(e){if(e.own){this[e.prop]=e.val}
else{delete this[e.prop]}},this);if(this.boostClear){this.boostClear()}};o.prototype.hasExtremes=function(e){var i=this.options,n=i.data,o=this.xAxis&&this.xAxis.options,r=this.yAxis&&this.yAxis.options,t=this.colorAxis&&this.colorAxis.options;return n.length>(i.boostThreshold||Number.MAX_VALUE)&&s(r.min)&&s(r.max)&&(!e||(s(o.min)&&s(o.max)))&&(!t||(s(t.min)&&s(t.max)))};o.prototype.destroyGraphics=function(){var i=this,o=this.points,t,e;if(o){for(e=0;e<o.length;e=e+1){t=o[e];if(t&&t.destroyElements){t.destroyElements()}}}['graph','area','tracker'].forEach(function(e){if(i[e]){i[e]=i[e].destroy()}})};a.forEach(function(e){if(u[e]){u[e].boostThreshold=5000;u[e].boostData=[];f[e].prototype.fillOpacity=!0}})});i(t,'modules/boost/named-colors.js',[t['parts/Color.js']],function(e){var t={aliceblue:'#f0f8ff',antiquewhite:'#faebd7',aqua:'#00ffff',aquamarine:'#7fffd4',azure:'#f0ffff',beige:'#f5f5dc',bisque:'#ffe4c4',black:'#000000',blanchedalmond:'#ffebcd',blue:'#0000ff',blueviolet:'#8a2be2',brown:'#a52a2a',burlywood:'#deb887',cadetblue:'#5f9ea0',chartreuse:'#7fff00',chocolate:'#d2691e',coral:'#ff7f50',cornflowerblue:'#6495ed',cornsilk:'#fff8dc',crimson:'#dc143c',cyan:'#00ffff',darkblue:'#00008b',darkcyan:'#008b8b',darkgoldenrod:'#b8860b',darkgray:'#a9a9a9',darkgreen:'#006400',darkkhaki:'#bdb76b',darkmagenta:'#8b008b',darkolivegreen:'#556b2f',darkorange:'#ff8c00',darkorchid:'#9932cc',darkred:'#8b0000',darksalmon:'#e9967a',darkseagreen:'#8fbc8f',darkslateblue:'#483d8b',darkslategray:'#2f4f4f',darkturquoise:'#00ced1',darkviolet:'#9400d3',deeppink:'#ff1493',deepskyblue:'#00bfff',dimgray:'#696969',dodgerblue:'#1e90ff',feldspar:'#d19275',firebrick:'#b22222',floralwhite:'#fffaf0',forestgreen:'#228b22',fuchsia:'#ff00ff',gainsboro:'#dcdcdc',ghostwhite:'#f8f8ff',gold:'#ffd700',goldenrod:'#daa520',gray:'#808080',green:'#008000',greenyellow:'#adff2f',honeydew:'#f0fff0',hotpink:'#ff69b4',indianred:'#cd5c5c',indigo:'#4b0082',ivory:'#fffff0',khaki:'#f0e68c',lavender:'#e6e6fa',lavenderblush:'#fff0f5',lawngreen:'#7cfc00',lemonchiffon:'#fffacd',lightblue:'#add8e6',lightcoral:'#f08080',lightcyan:'#e0ffff',lightgoldenrodyellow:'#fafad2',lightgrey:'#d3d3d3',lightgreen:'#90ee90',lightpink:'#ffb6c1',lightsalmon:'#ffa07a',lightseagreen:'#20b2aa',lightskyblue:'#87cefa',lightslateblue:'#8470ff',lightslategray:'#778899',lightsteelblue:'#b0c4de',lightyellow:'#ffffe0',lime:'#00ff00',limegreen:'#32cd32',linen:'#faf0e6',magenta:'#ff00ff',maroon:'#800000',mediumaquamarine:'#66cdaa',mediumblue:'#0000cd',mediumorchid:'#ba55d3',mediumpurple:'#9370d8',mediumseagreen:'#3cb371',mediumslateblue:'#7b68ee',mediumspringgreen:'#00fa9a',mediumturquoise:'#48d1cc',mediumvioletred:'#c71585',midnightblue:'#191970',mintcream:'#f5fffa',mistyrose:'#ffe4e1',moccasin:'#ffe4b5',navajowhite:'#ffdead',navy:'#000080',oldlace:'#fdf5e6',olive:'#808000',olivedrab:'#6b8e23',orange:'#ffa500',orangered:'#ff4500',orchid:'#da70d6',palegoldenrod:'#eee8aa',palegreen:'#98fb98',paleturquoise:'#afeeee',palevioletred:'#d87093',papayawhip:'#ffefd5',peachpuff:'#ffdab9',peru:'#cd853f',pink:'#ffc0cb',plum:'#dda0dd',powderblue:'#b0e0e6',purple:'#800080',red:'#ff0000',rosybrown:'#bc8f8f',royalblue:'#4169e1',saddlebrown:'#8b4513',salmon:'#fa8072',sandybrown:'#f4a460',seagreen:'#2e8b57',seashell:'#fff5ee',sienna:'#a0522d',silver:'#c0c0c0',skyblue:'#87ceeb',slateblue:'#6a5acd',slategray:'#708090',snow:'#fffafa',springgreen:'#00ff7f',steelblue:'#4682b4',tan:'#d2b48c',teal:'#008080',thistle:'#d8bfd8',tomato:'#ff6347',turquoise:'#40e0d0',violet:'#ee82ee',violetred:'#d02090',wheat:'#f5deb3',white:'#ffffff',whitesmoke:'#f5f5f5',yellow:'#ffff00',yellowgreen:'#9acd32'};e.names=t;return t});i(t,'modules/boost/boost.js',[t['parts/Globals.js'],t['modules/boost/boost-utils.js'],t['modules/boost/boost-init.js'],t['parts/Utilities.js']],function(e,t,i,o){var r=o.error,s=t.hasWebGLSupport;if(!s()){if(typeof e.initCanvasBoost!=='undefined'){e.initCanvasBoost()}
else{r(26)}}
else{i()}});i(t,'masters/modules/boost.src.js',[],function(){})}));
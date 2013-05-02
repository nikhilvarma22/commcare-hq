/*
YUI 3.4.1 (build 4118)
Copyright 2011 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("event-custom-base",function(b){b.Env.evt={handles:{},plugins:{}};var g=0,i=1,p={objs:{},before:function(s,u,v,w){var t=s,r;if(w){r=[s,w].concat(b.Array(arguments,4,true));t=b.rbind.apply(b,r);}return this._inject(g,t,u,v);},after:function(s,u,v,w){var t=s,r;if(w){r=[s,w].concat(b.Array(arguments,4,true));t=b.rbind.apply(b,r);}return this._inject(i,t,u,v);},_inject:function(r,t,u,w){var x=b.stamp(u),v,s;if(!this.objs[x]){this.objs[x]={};}v=this.objs[x];if(!v[w]){v[w]=new b.Do.Method(u,w);u[w]=function(){return v[w].exec.apply(v[w],arguments);};}s=x+b.stamp(t)+w;v[w].register(s,t,r);return new b.EventHandle(v[w],s);},detach:function(r){if(r.detach){r.detach();}},_unload:function(s,r){}};b.Do=p;p.Method=function(r,s){this.obj=r;this.methodName=s;this.method=r[s];this.before={};this.after={};};p.Method.prototype.register=function(s,t,r){if(r){this.after[s]=t;}else{this.before[s]=t;}};p.Method.prototype._delete=function(r){delete this.before[r];delete this.after[r];};p.Method.prototype.exec=function(){var t=b.Array(arguments,0,true),u,s,x,v=this.before,r=this.after,w=false;for(u in v){if(v.hasOwnProperty(u)){s=v[u].apply(this.obj,t);if(s){switch(s.constructor){case p.Halt:return s.retVal;case p.AlterArgs:t=s.newArgs;break;case p.Prevent:w=true;break;default:}}}}if(!w){s=this.method.apply(this.obj,t);}p.originalRetVal=s;p.currentRetVal=s;for(u in r){if(r.hasOwnProperty(u)){x=r[u].apply(this.obj,t);if(x&&x.constructor==p.Halt){return x.retVal;}else{if(x&&x.constructor==p.AlterReturn){s=x.newRetVal;p.currentRetVal=s;}}}}return s;};p.AlterArgs=function(s,r){this.msg=s;this.newArgs=r;};p.AlterReturn=function(s,r){this.msg=s;this.newRetVal=r;};p.Halt=function(s,r){this.msg=s;this.retVal=r;};p.Prevent=function(r){this.msg=r;};p.Error=p.Halt;var m="after",q=["broadcast","monitored","bubbles","context","contextFn","currentTarget","defaultFn","defaultTargetOnly","details","emitFacade","fireOnce","async","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],n=9,a="yui:log";b.CustomEvent=function(r,s){s=s||{};this.id=b.stamp(this);this.type=r;this.context=b;this.logSystem=(r==a);this.silent=this.logSystem;this.subscribers={};this.afters={};this.preventable=true;this.bubbles=true;this.signature=n;this.subCount=0;this.afterCount=0;this.applyConfig(s,true);};b.CustomEvent.prototype={constructor:b.CustomEvent,hasSubs:function(r){var v=this.subCount,t=this.afterCount,u=this.sibling;if(u){v+=u.subCount;t+=u.afterCount;}if(r){return(r=="after")?t:v;}return(v+t);},monitor:function(t){this.monitored=true;var s=this.id+"|"+this.type+"_"+t,r=b.Array(arguments,0,true);r[0]=s;return this.host.on.apply(this.host,r);},getSubs:function(){var u=b.merge(this.subscribers),r=b.merge(this.afters),t=this.sibling;if(t){b.mix(u,t.subscribers);b.mix(r,t.afters);}return[u,r];},applyConfig:function(s,r){if(s){b.mix(this,s,r,q);}},_on:function(w,u,t,r){if(!w){this.log("Invalid callback for CE: "+this.type);}var v=new b.Subscriber(w,u,t,r);if(this.fireOnce&&this.fired){if(this.async){setTimeout(b.bind(this._notify,this,v,this.firedWith),0);}else{this._notify(v,this.firedWith);}}if(r==m){this.afters[v.id]=v;this.afterCount++;}else{this.subscribers[v.id]=v;this.subCount++;}return new b.EventHandle(this,v);},subscribe:function(t,s){var r=(arguments.length>2)?b.Array(arguments,2,true):null;return this._on(t,s,r,true);},on:function(t,s){var r=(arguments.length>2)?b.Array(arguments,2,true):null;if(this.host){this.host._monitor("attach",this.type,{args:arguments});}return this._on(t,s,r,true);},after:function(t,s){var r=(arguments.length>2)?b.Array(arguments,2,true):null;return this._on(t,s,r,m);},detach:function(w,u){if(w&&w.detach){return w.detach();}var t,v,x=0,r=b.merge(this.subscribers,this.afters);for(t in r){if(r.hasOwnProperty(t)){v=r[t];if(v&&(!w||w===v.fn)){this._delete(v);x++;}}}return x;},unsubscribe:function(){return this.detach.apply(this,arguments);},_notify:function(v,u,r){this.log(this.type+"->"+"sub: "+v.id);var t;t=v.notify(u,this);if(false===t||this.stopped>1){this.log(this.type+" cancelled by subscriber");return false;}return true;},log:function(s,r){if(!this.silent){}},fire:function(){if(this.fireOnce&&this.fired){this.log("fireOnce event: "+this.type+" already fired");return true;}else{var r=b.Array(arguments,0,true);this.fired=true;this.firedWith=r;if(this.emitFacade){return this.fireComplex(r);}else{return this.fireSimple(r);}}},fireSimple:function(r){this.stopped=0;this.prevented=0;if(this.hasSubs()){var s=this.getSubs();this._procSubs(s[0],r);this._procSubs(s[1],r);}this._broadcast(r);return this.stopped?false:true;},fireComplex:function(r){r[0]=r[0]||{};return this.fireSimple(r);},_procSubs:function(v,t,r){var w,u;for(u in v){if(v.hasOwnProperty(u)){w=v[u];if(w&&w.fn){if(false===this._notify(w,t,r)){this.stopped=2;}if(this.stopped==2){return false;}}}}return true;},_broadcast:function(s){if(!this.stopped&&this.broadcast){var r=b.Array(s);r.unshift(this.type);if(this.host!==b){b.fire.apply(b,r);}if(this.broadcast==2){b.Global.fire.apply(b.Global,r);}}},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},detachAll:function(){return this.detach();},_delete:function(r){if(r){if(this.subscribers[r.id]){delete this.subscribers[r.id];this.subCount--;}if(this.afters[r.id]){delete this.afters[r.id];this.afterCount--;}}if(this.host){this.host._monitor("detach",this.type,{ce:this,sub:r});}if(r){r.deleted=true;}}};b.Subscriber=function(t,s,r){this.fn=t;this.context=s;this.id=b.stamp(this);this.args=r;};b.Subscriber.prototype={constructor:b.Subscriber,_notify:function(v,t,u){if(this.deleted&&!this.postponed){if(this.postponed){delete this.fn;delete this.context;}else{delete this.postponed;return null;}}var r=this.args,s;switch(u.signature){case 0:s=this.fn.call(v,u.type,t,v);break;case 1:s=this.fn.call(v,t[0]||null,v);break;default:if(r||t){t=t||[];r=(r)?t.concat(r):t;s=this.fn.apply(v,r);}else{s=this.fn.call(v);}}if(this.once){u._delete(this);}return s;},notify:function(s,u){var v=this.context,r=true;
if(!v){v=(u.contextFn)?u.contextFn():u.context;}if(b.config.throwFail){r=this._notify(v,s,u);}else{try{r=this._notify(v,s,u);}catch(t){b.error(this+" failed: "+t.message,t);}}return r;},contains:function(s,r){if(r){return((this.fn==s)&&this.context==r);}else{return(this.fn==s);}}};b.EventHandle=function(r,s){this.evt=r;this.sub=s;};b.EventHandle.prototype={batch:function(r,s){r.call(s||this,this);if(b.Lang.isArray(this.evt)){b.Array.each(this.evt,function(t){t.batch.call(s||t,r);});}},detach:function(){var r=this.evt,t=0,s;if(r){if(b.Lang.isArray(r)){for(s=0;s<r.length;s++){t+=r[s].detach();}}else{r._delete(this.sub);t=1;}}return t;},monitor:function(r){return this.evt.monitor.apply(this.evt,arguments);}};var j=b.Lang,h=":",e="|",l="~AFTER~",k=b.Array,c=b.cached(function(r){return r.replace(/(.*)(:)(.*)/,"*$2$3");}),o=b.cached(function(r,s){if(!s||!j.isString(r)||r.indexOf(h)>-1){return r;}return s+h+r;}),f=b.cached(function(u,w){var s=u,v,x,r;if(!j.isString(s)){return s;}r=s.indexOf(l);if(r>-1){x=true;s=s.substr(l.length);}r=s.indexOf(e);if(r>-1){v=s.substr(0,(r));s=s.substr(r+1);if(s=="*"){s=null;}}return[v,(w)?o(s,w):s,x,s];}),d=function(r){var s=(j.isObject(r))?r:{};this._yuievt=this._yuievt||{id:b.guid(),events:{},targets:{},config:s,chain:("chain" in s)?s.chain:b.config.chain,bubbling:false,defaults:{context:s.context||this,host:this,emitFacade:s.emitFacade,fireOnce:s.fireOnce,queuable:s.queuable,monitored:s.monitored,broadcast:s.broadcast,defaultTargetOnly:s.defaultTargetOnly,bubbles:("bubbles" in s)?s.bubbles:true}};};d.prototype={constructor:d,once:function(){var r=this.on.apply(this,arguments);r.batch(function(s){if(s.sub){s.sub.once=true;}});return r;},onceAfter:function(){var r=this.after.apply(this,arguments);r.batch(function(s){if(s.sub){s.sub.once=true;}});return r;},parseType:function(r,s){return f(r,s||this._yuievt.config.prefix);},on:function(v,A,t){var D=f(v,this._yuievt.config.prefix),F,G,s,J,C,B,H,x=b.Env.evt.handles,u,r,y,I=b.Node,E,z,w;this._monitor("attach",D[1],{args:arguments,category:D[0],after:D[2]});if(j.isObject(v)){if(j.isFunction(v)){return b.Do.before.apply(b.Do,arguments);}F=A;G=t;s=k(arguments,0,true);J=[];if(j.isArray(v)){w=true;}u=v._after;delete v._after;b.each(v,function(M,L){if(j.isObject(M)){F=M.fn||((j.isFunction(M))?M:F);G=M.context||G;}var K=(u)?l:"";s[0]=K+((w)?M:L);s[1]=F;s[2]=G;J.push(this.on.apply(this,s));},this);return(this._yuievt.chain)?this:new b.EventHandle(J);}B=D[0];u=D[2];y=D[3];if(I&&b.instanceOf(this,I)&&(y in I.DOM_EVENTS)){s=k(arguments,0,true);s.splice(2,0,I.getDOMNode(this));return b.on.apply(b,s);}v=D[1];if(b.instanceOf(this,YUI)){r=b.Env.evt.plugins[v];s=k(arguments,0,true);s[0]=y;if(I){E=s[2];if(b.instanceOf(E,b.NodeList)){E=b.NodeList.getDOMNodes(E);}else{if(b.instanceOf(E,I)){E=I.getDOMNode(E);}}z=(y in I.DOM_EVENTS);if(z){s[2]=E;}}if(r){H=r.on.apply(b,s);}else{if((!v)||z){H=b.Event._attach(s);}}}if(!H){C=this._yuievt.events[v]||this.publish(v);H=C._on(A,t,(arguments.length>3)?k(arguments,3,true):null,(u)?"after":true);}if(B){x[B]=x[B]||{};x[B][v]=x[B][v]||[];x[B][v].push(H);}return(this._yuievt.chain)?this:H;},subscribe:function(){return this.on.apply(this,arguments);},detach:function(A,C,r){var G=this._yuievt.events,v,x=b.Node,E=x&&(b.instanceOf(this,x));if(!A&&(this!==b)){for(v in G){if(G.hasOwnProperty(v)){G[v].detach(C,r);}}if(E){b.Event.purgeElement(x.getDOMNode(this));}return this;}var u=f(A,this._yuievt.config.prefix),z=j.isArray(u)?u[0]:null,H=(u)?u[3]:null,w,D=b.Env.evt.handles,F,B,y,t,s=function(M,K,L){var J=M[K],N,I;if(J){for(I=J.length-1;I>=0;--I){N=J[I].evt;if(N.host===L||N.el===L){J[I].detach();}}}};if(z){B=D[z];A=u[1];F=(E)?b.Node.getDOMNode(this):this;if(B){if(A){s(B,A,F);}else{for(v in B){if(B.hasOwnProperty(v)){s(B,v,F);}}}return this;}}else{if(j.isObject(A)&&A.detach){A.detach();return this;}else{if(E&&((!H)||(H in x.DOM_EVENTS))){y=k(arguments,0,true);y[2]=x.getDOMNode(this);b.detach.apply(b,y);return this;}}}w=b.Env.evt.plugins[H];if(b.instanceOf(this,YUI)){y=k(arguments,0,true);if(w&&w.detach){w.detach.apply(b,y);return this;}else{if(!A||(!w&&x&&(A in x.DOM_EVENTS))){y[0]=A;b.Event.detach.apply(b.Event,y);return this;}}}t=G[u[1]];if(t){t.detach(C,r);}return this;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(r){return this.detach(r);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(t,u){var s,y,r,x,w=this._yuievt,v=w.config.prefix;t=(v)?o(t,v):t;this._monitor("publish",t,{args:arguments});if(j.isObject(t)){r={};b.each(t,function(A,z){r[z]=this.publish(z,A||u);},this);return r;}s=w.events;y=s[t];if(y){if(u){y.applyConfig(u,true);}}else{x=w.defaults;y=new b.CustomEvent(t,(u)?b.merge(x,u):x);s[t]=y;}return s[t];},_monitor:function(u,r,v){var s,t=this.getEvent(r);if((this._yuievt.config.monitored&&(!t||t.monitored))||(t&&t.monitored)){s=r+"_"+u;v.monitored=u;this.fire.call(this,s,v);}},fire:function(v){var z=j.isString(v),u=(z)?v:(v&&v.type),y,s,x=this._yuievt.config.prefix,w,r=(z)?k(arguments,1,true):arguments;u=(x)?o(u,x):u;this._monitor("fire",u,{args:r});y=this.getEvent(u,true);w=this.getSibling(u,y);if(w&&!y){y=this.publish(u);}if(!y){if(this._yuievt.hasTargets){return this.bubble({type:u},r,this);}s=true;}else{y.sibling=w;s=y.fire.apply(y,r);}return(this._yuievt.chain)?this:s;},getSibling:function(r,t){var s;if(r.indexOf(h)>-1){r=c(r);s=this.getEvent(r,true);if(s){s.applyConfig(t);s.bubbles=false;s.broadcast=0;}}return s;},getEvent:function(s,r){var u,t;if(!r){u=this._yuievt.config.prefix;s=(u)?o(s,u):s;}t=this._yuievt.events;return t[s]||null;},after:function(t,s){var r=k(arguments,0,true);switch(j.type(t)){case"function":return b.Do.after.apply(b.Do,arguments);case"array":case"object":r[0]._after=true;break;default:r[0]=l+t;}return this.on.apply(this,r);},before:function(){return this.on.apply(this,arguments);}};b.EventTarget=d;b.mix(b,d.prototype);d.call(b,{bubbles:false});YUI.Env.globalEvents=YUI.Env.globalEvents||new d();
b.Global=YUI.Env.globalEvents;},"3.4.1",{requires:["oop"]});
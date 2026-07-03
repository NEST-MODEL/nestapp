/* =========================================================
   Formula Fitness — design tokens
   ========================================================= */
:root{
  --black: #0d0d0d;
  --black-2: #161616;
  --black-3: #1f1f1f;
  --black-4: #262626;
  --yellow: #ffd400;
  --yellow-deep: #e0b400;
  --white: #fafafa;
  --gray: #9a9a9a;
  --gray-dim: #6f6f6f;
  --glow: rgba(255, 212, 0, .18);
  --glow-strong: rgba(255, 212, 0, .35);

  --font-display: 'Oswald', sans-serif;
  --font-body: 'Manrope', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius: 14px;
  --radius-lg: 22px;
  --ease: cubic-bezier(.22,1,.36,1);
}

*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  margin:0;
  background:var(--black);
  color:var(--white);
  font-family:var(--font-body);
  line-height:1.6;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
img,svg{display:block;max-width:100%;}
a{color:inherit;text-decoration:none;}
ul{list-style:none;margin:0;padding:0;}
button{font-family:inherit;cursor:pointer;}

@media (prefers-reduced-motion: reduce){
  *{animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; scroll-behavior:auto !important;}
}

.container{max-width:1180px; margin:0 auto; padding:0 24px;}
.container-narrow{max-width:780px;}

/* =========================================================
   Header
   ========================================================= */
.site-header{
  position:fixed; top:0; left:0; right:0; z-index:500;
  padding:18px 0;
  transition:background .4s var(--ease), padding .4s var(--ease), backdrop-filter .4s var(--ease);
}
.site-header.scrolled{
  background:rgba(13,13,13,.72);
  backdrop-filter:blur(14px) saturate(140%);
  -webkit-backdrop-filter:blur(14px) saturate(140%);
  padding:12px 0;
  box-shadow:0 1px 0 rgba(255,255,255,.06);
}
.header-inner{
  max-width:1180px; margin:0 auto; padding:0 24px;
  display:flex; align-items:center; justify-content:space-between; gap:24px;
}
.logo{display:flex; align-items:center; gap:10px;}
.logo-mark{
  width:36px; height:36px; border-radius:8px; background:var(--yellow);
  color:var(--black); font-family:var(--font-display); font-weight:700; font-size:20px;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 22px var(--glow);
}
.logo-text{
  font-family:var(--font-display); font-weight:600; letter-spacing:.5px; font-size:19px;
  display:flex; flex-direction:column; line-height:1;
}
.logo-text em{
  font-style:normal; font-size:10px; letter-spacing:3px; color:var(--gray); font-weight:400; margin-top:3px;
}
.main-nav{display:flex; gap:30px;}
.nav-link{
  font-size:14px; font-weight:500; color:var(--gray); position:relative; padding:4px 0;
  transition:color .3s;
}
.nav-link::after{
  content:''; position:absolute; left:0; bottom:-2px; width:0; height:2px; background:var(--yellow);
  transition:width .3s var(--ease);
}
.nav-link:hover{color:var(--white);}
.nav-link:hover::after{width:100%;}

.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:9px;
  font-family:var(--font-body); font-weight:700; font-size:14px;
  padding:13px 24px; border-radius:100px; border:1px solid transparent;
  transition:transform .3s var(--ease), box-shadow .3s var(--ease), background .3s var(--ease), border-color .3s var(--ease);
  white-space:nowrap;
}
.btn-primary{ background:var(--yellow); color:var(--black); }
.btn-primary:hover{ transform:translateY(-2px); box-shadow:0 10px 30px var(--glow-strong); background:var(--yellow-deep); }
.btn-ghost{ background:transparent; color:var(--white); border-color:rgba(255,255,255,.22); }
.btn-ghost:hover{ border-color:var(--yellow); color:var(--yellow); transform:translateY(-2px); }
.btn-lg{ padding:16px 30px; font-size:15px; }
.btn-nav{ padding:11px 22px; }

.burger{
  display:none; width:40px; height:40px; border:none; background:transparent;
  flex-direction:column; align-items:center; justify-content:center; gap:5px;
}
.burger span{width:22px; height:2px; background:var(--white); transition:transform .3s, opacity .3s;}
.burger.active span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.burger.active span:nth-child(2){opacity:0;}
.burger.active span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

.mobile-nav{
  position:fixed; inset:0; z-index:480; background:rgba(13,13,13,.98);
  backdrop-filter:blur(20px);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:22px;
  transform:translateY(-100%); opacity:0; transition:transform .5s var(--ease), opacity .5s var(--ease);
}
.mobile-nav.open{ transform:translateY(0); opacity:1; }
.mnav-link{ font-family:var(--font-display); font-size:26px; font-weight:500; color:var(--white); }
.mnav-link:hover{ color:var(--yellow); }

/* =========================================================
   Hero
   ========================================================= */
.hero{
  position:relative; min-height:100vh; display:flex; align-items:center;
  padding:140px 0 80px; overflow:hidden;
  background:
    radial-gradient(ellipse 900px 600px at 85% 15%, var(--glow), transparent 60%),
    radial-gradient(ellipse 700px 500px at 10% 90%, rgba(255,212,0,.08), transparent 60%),
    var(--black);
}
.hero-bg{ position:absolute; inset:0; z-index:0; }
.hero-illustration{ width:100%; height:100%; }
.hero-overlay{
  position:absolute; inset:0; z-index:1;
  background:linear-gradient(180deg, rgba(13,13,13,.2) 0%, rgba(13,13,13,.55) 70%, var(--black) 100%);
}
.hero-content{ position:relative; z-index:2; max-width:760px; }
.eyebrow{
  font-family:var(--font-mono); font-size:12px; letter-spacing:2px; text-transform:uppercase;
  color:var(--yellow); margin:0 0 18px; display:flex; align-items:center; gap:10px;
}
.eyebrow::before{ content:''; width:22px; height:1px; background:var(--yellow); display:inline-block; }
.hero-title{
  font-family:var(--font-display); font-weight:700; text-transform:uppercase;
  font-size:clamp(40px, 6.2vw, 82px); line-height:0.98; letter-spacing:.5px; margin:0 0 22px;
}
.hero-title .accent{ color:var(--yellow); }
.hero-sub{ font-size:17px; color:#cfcfcf; max-width:560px; margin:0 0 36px; }
.hero-actions{ display:flex; gap:16px; flex-wrap:wrap; }

.tacho-widget{
  position:absolute; right:6%; bottom:14%; z-index:2; width:150px; height:150px;
  display:none;
}
@media(min-width:1000px){ .tacho-widget{ display:flex; align-items:center; justify-content:center; } }
.tacho-ring{ width:100%; height:100%; transform:rotate(-90deg); }
.tacho-track{ fill:none; stroke:rgba(255,255,255,.08); stroke-width:6; }
.tacho-fill{
  fill:none; stroke:var(--yellow); stroke-width:6; stroke-linecap:round;
  stroke-dasharray:490; stroke-dashoffset:490;
  transition:stroke-dashoffset 1.6s var(--ease);
  filter:drop-shadow(0 0 8px var(--glow-strong));
}
.tacho-center{ position:absolute; text-align:center; }
.tacho-value{ display:block; font-family:var(--font-mono); font-size:30px; font-weight:700; color:var(--yellow); }
.tacho-label{ display:block; font-size:10px; color:var(--gray); letter-spacing:1px; text-transform:uppercase; margin-top:2px; }

.scroll-cue{
  position:absolute; bottom:28px; left:50%; transform:translateX(-50%); z-index:2;
  width:26px; height:42px; border:2px solid rgba(255,255,255,.25); border-radius:20px;
}
.scroll-cue span{
  position:absolute; top:6px; left:50%; transform:translateX(-50%); width:4px; height:8px;
  background:var(--yellow); border-radius:3px; animation:cueMove 1.8s infinite;
}
@keyframes cueMove{ 0%{opacity:1; top:6px;} 70%{opacity:0; top:22px;} 100%{opacity:0; top:6px;} }

/* =========================================================
   Trust strip
   ========================================================= */
.trust-strip{ background:var(--black-2); padding:34px 0; border-top:1px solid rgba(255,255,255,.06); border-bottom:1px solid rgba(255,255,255,.06); }
.trust-grid{ display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; }
.trust-item{ display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; min-width:130px; }
.trust-item--text{ font-family:var(--font-display); font-size:15px; text-transform:uppercase; letter-spacing:.5px; color:var(--white); text-align:center; }
.trust-num{ font-family:var(--font-mono); font-size:32px; font-weight:700; color:var(--yellow); }
.trust-label{ font-size:12px; color:var(--gray); text-transform:uppercase; letter-spacing:1px; }
.trust-divider{ width:1px; height:34px; background:rgba(255,255,255,.1); }
@media(max-width:800px){ .trust-divider{ display:none; } }

/* =========================================================
   Stripe divider — subtle finish-line echo, not hazard tape
   ========================================================= */
.stripe-divider{ padding:0; background:var(--black); }
.stripe-track{
  height:6px; width:100%;
  background:repeating-linear-gradient(100deg,
    var(--black-3) 0 26px, transparent 26px 30px,
    var(--yellow) 30px 34px, transparent 34px 38px);
  opacity:.55;
}

/* =========================================================
   Sections
   ========================================================= */
.section{ padding:110px 0; position:relative; }
.section-dark{ background:var(--black-2); }
.section-eyebrow{
  font-family:var(--font-mono); font-size:12px; letter-spacing:2px; text-transform:uppercase;
  color:var(--yellow); margin:0 0 12px;
}
.section-title{
  font-family:var(--font-display); font-weight:600; text-transform:uppercase;
  font-size:clamp(30px,4vw,46px); line-height:1.08; margin:0 0 22px; max-width:680px;
}
.section-lead{ color:var(--gray); max-width:640px; font-size:16px; margin-bottom:44px; }

/* Why cards */
.why-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin-top:50px; }
.why-card{
  background:var(--black-2); border:1px solid rgba(255,255,255,.06); border-radius:var(--radius-lg);
  padding:32px 26px; transition:transform .4s var(--ease), border-color .4s var(--ease), box-shadow .4s var(--ease);
}
.why-card:hover{ transform:translateY(-6px); border-color:rgba(255,212,0,.35); box-shadow:0 20px 40px rgba(0,0,0,.35); }
.why-icon{
  width:50px; height:50px; border-radius:12px; background:var(--glow); color:var(--yellow);
  display:flex; align-items:center; justify-content:center; margin-bottom:20px;
}
.why-icon svg{ width:24px; height:24px; }
.why-card h3{ font-family:var(--font-display); font-weight:600; font-size:19px; text-transform:uppercase; margin:0 0 10px; letter-spacing:.3px; }
.why-card p{ color:var(--gray); font-size:14.5px; margin:0; }

/* Services */
.services-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-top:50px; }
.service-card{
  background:linear-gradient(160deg, var(--black-3), var(--black-2));
  border:1px solid rgba(255,255,255,.06); border-radius:var(--radius);
  padding:26px 20px; text-align:left; transition:transform .35s var(--ease), border-color .35s;
}
.service-card:hover{ transform:translateY(-5px) scale(1.02); border-color:var(--yellow); }
.service-ico{ width:30px; height:30px; color:var(--yellow); margin-bottom:16px; }
.service-card h3{ font-family:var(--font-display); font-size:16px; text-transform:uppercase; margin:0 0 6px; font-weight:600; }
.service-card p{ color:var(--gray); font-size:13px; margin:0; }

/* Zones (inside) */
.zones-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
.zone-card{
  background:var(--black-3); border:1px solid rgba(255,255,255,.07); border-radius:var(--radius-lg);
  padding:26px; transition:transform .4s var(--ease);
}
.zone-card:hover{ transform:translateY(-6px); }
.zone-visual{
  background:var(--black); border-radius:var(--radius); padding:14px; margin-bottom:20px;
}
.zv-frame{ fill:none; stroke:rgba(255,255,255,.12); stroke-width:1.5; }
.zv-fill{ fill:var(--yellow); opacity:.85; }
.zv-outline{ fill:none; stroke:var(--yellow); stroke-width:2; opacity:.85; }
.zone-card h3{ font-family:var(--font-display); font-size:18px; text-transform:uppercase; margin:0 0 8px; }
.zone-card p{ color:var(--gray); font-size:14px; margin:0; }

/* Pricing */
.pricing-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin-top:50px; }
.price-card{
  position:relative; background:var(--black-2); border:1px solid rgba(255,255,255,.08); border-radius:var(--radius-lg);
  padding:36px 30px; display:flex; flex-direction:column; gap:18px; transition:transform .4s var(--ease), border-color .4s;
}
.price-card:hover{ transform:translateY(-6px); border-color:rgba(255,212,0,.3); }
.price-card--highlight{ background:linear-gradient(160deg, #1c1a10, var(--black-2)); border-color:var(--yellow); box-shadow:0 20px 50px var(--glow); }
.price-badge{
  position:absolute; top:-13px; left:30px; background:var(--yellow); color:var(--black);
  font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; padding:5px 14px; border-radius:100px;
}
.price-card h3{ font-family:var(--font-display); text-transform:uppercase; font-size:18px; margin:0; font-weight:600; }
.price-value{ font-family:var(--font-mono); font-size:30px; color:var(--yellow); font-weight:700; margin:0; }
.price-list{ display:flex; flex-direction:column; gap:8px; flex:1; }
.price-list li{ font-size:13.5px; color:var(--gray); padding-left:18px; position:relative; }
.price-list li::before{ content:'—'; position:absolute; left:0; color:var(--yellow); }
.price-cta{
  margin-top:50px; padding:34px; border-radius:var(--radius-lg); background:var(--black-3);
  display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap;
}
.price-cta p{ margin:0; max-width:460px; color:var(--gray); font-size:15px; }

/* Accordion */
.accordion{ display:flex; flex-direction:column; gap:12px; margin-top:44px; }
.acc-item{ background:var(--black-2); border:1px solid rgba(255,255,255,.07); border-radius:var(--radius); overflow:hidden; }
.acc-head{
  width:100%; background:none; border:none; color:var(--white); text-align:left;
  padding:22px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px;
  font-size:15.5px; font-weight:600;
}
.acc-plus{ color:var(--yellow); font-size:22px; font-weight:400; transition:transform .35s var(--ease); flex-shrink:0; }
.acc-item.active .acc-plus{ transform:rotate(45deg); }
.acc-body{ max-height:0; overflow:hidden; transition:max-height .4s var(--ease); }
.acc-body p{ margin:0; padding:0 24px 22px; color:var(--gray); font-size:14.5px; }

/* Contacts */
.contacts-grid{ display:grid; grid-template-columns:1fr 1fr; gap:36px; align-items:stretch; }
.contacts-info{ display:flex; flex-direction:column; gap:26px; }
.contact-row{ display:flex; gap:16px; align-items:flex-start; }
.contact-row svg{ width:22px; height:22px; color:var(--yellow); flex-shrink:0; margin-top:2px; }
.c-label{ display:block; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--gray); margin-bottom:4px; }
.c-value{ display:block; font-size:16.5px; font-weight:600; }
.contact-actions{ display:flex; gap:14px; flex-wrap:wrap; margin-top:8px; }
.contacts-map{ border-radius:var(--radius-lg); overflow:hidden; min-height:340px; border:1px solid rgba(255,255,255,.08); filter:grayscale(.3) contrast(1.1); }

/* =========================================================
   Footer
   ========================================================= */
.site-footer{ background:var(--black); padding:50px 0 30px; border-top:1px solid rgba(255,255,255,.06); }
.footer-inner{ display:flex; flex-direction:column; align-items:center; gap:14px; text-align:center; }
.footer-note{ color:var(--gray); font-size:14px; margin:0; }
.footer-copy{ color:var(--gray-dim); font-size:12.5px; margin:6px 0 0; }

/* =========================================================
   Floating buttons
   ========================================================= */
.fab{
  position:fixed; right:24px; z-index:400; width:56px; height:56px; border-radius:50%;
  display:flex; align-items:center; justify-content:center; border:none;
  box-shadow:0 10px 30px rgba(0,0,0,.4); transition:transform .3s var(--ease), opacity .3s var(--ease);
}
.fab-wa{ bottom:24px; background:var(--yellow); color:var(--black); }
.fab-wa:hover{ transform:scale(1.08); }
.fab-top{
  bottom:92px; background:var(--black-3); color:var(--white); border:1px solid rgba(255,255,255,.12);
  opacity:0; pointer-events:none; transform:translateY(10px);
}
.fab-top.show{ opacity:1; pointer-events:auto; transform:translateY(0); }
.fab-top:hover{ border-color:var(--yellow); color:var(--yellow); }

/* =========================================================
   Reveal animation
   ========================================================= */
.reveal-up{ opacity:0; transform:translateY(28px); transition:opacity .8s var(--ease), transform .8s var(--ease); }
.reveal-up.in{ opacity:1; transform:translateY(0); }

/* stagger children a touch */
.why-grid .why-card:nth-child(2){ transition-delay:.06s; }
.why-grid .why-card:nth-child(3){ transition-delay:.12s; }
.services-grid .service-card:nth-child(2){ transition-delay:.05s; }
.services-grid .service-card:nth-child(3){ transition-delay:.1s; }
.services-grid .service-card:nth-child(4){ transition-delay:.15s; }

/* parallax layers */
.parallax-slow{ will-change:transform; }
.parallax-fast{ will-change:transform; }

/* focus visibility */
a:focus-visible, button:focus-visible{ outline:2px solid var(--yellow); outline-offset:3px; }

/* =========================================================
   Responsive
   ========================================================= */
@media(max-width:980px){
  .main-nav{ display:none; }
  .btn-nav{ display:none; }
  .burger{ display:flex; }
  .why-grid{ grid-template-columns:repeat(2,1fr); }
  .services-grid{ grid-template-columns:repeat(2,1fr); }
  .zones-grid{ grid-template-columns:1fr; }
  .pricing-grid{ grid-template-columns:1fr; }
  .contacts-grid{ grid-template-columns:1fr; }
  .contacts-map{ min-height:280px; }
}
@media(max-width:560px){
  .why-grid{ grid-template-columns:1fr; }
  .services-grid{ grid-template-columns:1fr; }
  .hero{ padding-top:120px; }
  .hero-actions{ flex-direction:column; align-items:stretch; }
  .price-cta{ flex-direction:column; align-items:flex-start; }
  .trust-grid{ justify-content:center; }
}

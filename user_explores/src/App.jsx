import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const programs = [
  {id:1,  name:"هندسة الميكاترونكس الصناعية المتقدمة",            interests:["الهندسة","التكنولوجيا","الأتمتة","الميكانيك","الكهرباء","الإلكترونيات","الأنظمة الذكية","الصيانة"], learn:["تصميم وتشغيل الأنظمة الصناعية الذكية","برمجة أنظمة الأتمتة والتحكم الصناعي","استخدام الحساسات وأجهزة القياس في التطبيقات العملية","صيانة وتشغيل الأنظمة الكهروميكانيكية الحديثة","تطبيق تقنيات الروبوتات وSCADA وإنترنت الأشياء الصناعية"], jobs:["فني ميكاترونكس","فني أتمتة","فني صيانة متقدمة"], places:["المصانع","الشركات الصناعية"]},
  {id:2,  name:"تشكيل المعادن والتصنيع المتقدم",                  interests:["التصنيع","الميكانيك","الإنتاج","الجودة","الهندسة"], learn:["قراءة الرسومات الهندسية الخاصة بأعمال اللحام","تجهيز المعادن وعمليات القطع والثني قبل اللحام","تنفيذ تقنيات اللحام المختلفة باحتراف","فحص جودة اللحام ومعالجة العيوب","تطبيق السلامة المهنية وصيانة معدات اللحام"], jobs:["فني تصنيع","فني لحام"], places:["المصانع","الإنشاءات"]},
  {id:3,  name:"فني الأوتوترونكس (المركبات الهجينة/الكهربائية)",   interests:["التكنولوجيا","الميكانيك","الكهرباء","الإلكترونيات","الصيانة"], learn:["قراءة المخططات الكهربائية للمركبة","تتبع المشاكل الكهربائية في المركبة والعمل على حلها","صيانة نظام إدارة بطارية الجهد المرتفع","صيانة نظام المحول/العاكس","صيانة نظام نقل الحركة والمحرك الكهربائي","تشخيص وصيانة نظام الشاحن الداخلي للمركبة"], jobs:["فني أوتوترونكس","مستشار خدمة"], places:["مراكز الصيانة","وكالات السيارات"]},
  {id:4,  name:"ميكاترونكس المركبات الهجينة/الكهربائية",           interests:["التكنولوجيا","الميكانيك","الكهرباء","الإلكترونيات","الأنظمة الذكية","الصيانة"], learn:["صيانة محركات البنزين والنظام المتكامل لحقن الوقود","صيانة الأنظمة الإلكترونية في أنظمة الشحن وبدء التشغيل","صيانة مكونات أنظمة التوجيه والتعليق والفرامل","صيانة أنظمة الجهد العالي"], jobs:["فني مركبات كهربائية"], places:["مراكز الصيانة","وكالات السيارات"]},
  {id:5,  name:"فني الميكانيك وأنظمة الأنابيب الصناعية",           interests:["الميكانيك","التصنيع","الصيانة","الإنتاج"], learn:["قراءة مخططات الأنابيب والأنظمة الميكانيكية الصناعية","تركيب وتمديد شبكات الأنابيب الصناعية باحتراف","تشغيل وربط المضخات والمعدات الميكانيكية المختلفة","فحص الأنظمة واختبار الضغط والتسريب والتشغيل","صيانة الأنابيب والمكونات الميكانيكية في المنشآت الصناعية"], jobs:["فني ميكانيك صناعي"], places:["المصانع","المشاريع الصناعية"]},
  {id:6,  name:"ميكانيكي تركيب وصيانة الآلات والمعدات الصناعية",  interests:["الميكانيك","الصيانة","الإنتاج","التصنيع"], learn:["تركيب الآلات والمعدات الصناعية وفق المخططات الفنية","تشغيل الأنظمة الميكانيكية ومراقبة أدائها","إجراء الصيانة الوقائية والدورية للمعدات","تشخيص الأعطال وإصلاحها باحتراف","توثيق أعمال الصيانة وإعداد التقارير الفنية"], jobs:["فني إنتاج","فني صيانة"], places:["المصانع"]},
  {id:7,  name:"إلكتروني تركيب وصيانة الأجهزة الإلكترونية الصناعية", interests:["الإلكترونيات","التكنولوجيا","الصيانة","الأتمتة","الأنظمة الذكية"], learn:["تركيب وصيانة الأجهزة والأنظمة الإلكترونية الصناعية","بناء الدوائر الكهربائية والإلكترونية واختبارها","برمجة أنظمة التحكم الدقيقة وPLC","تشغيل أنظمة الأتمتة والتحكم الصناعي","صيانة المستشعرات ولوحات التحكم والأجهزة الصناعية"], jobs:["فني إلكترونيات"], places:["المصانع","شركات التقنية"]},
  {id:8,  name:"أنظمة التبريد الصناعية",                           interests:["الميكانيك","الصيانة","الإنتاج","الطاقة"], learn:["قراءة مخططات أنظمة التبريد الصناعية وتنفيذها","فحص مكونات دوائر التبريد وتشغيلها","تنفيذ التمديدات والربط واللحام والتوصيلات الكهروميكانيكية","تشخيص الأعطال وصيانة أنظمة التبريد الصناعية","استخدام أنظمة التحكم والإلكترونيات لتحسين الأداء"], jobs:["فني تبريد"], places:["المصانع","شركات التبريد"]},
  {id:9,  name:"التصميم والتصنيع الرقمي",                          interests:["التصميم","التصنيع","التكنولوجيا","الهندسة","الإنتاج"], learn:["أساسيات الرسم الهندسي والقياسات ومقياس الرسم","استخدام برامج CAD في إنشاء الرسومات الهندسية","التعامل مع أنظمة التشغيل والبرامج الفنية المرتبطة بالتصميم","إعداد الرسومات الرقمية الدقيقة للتصنيع باستخدام CNC"], jobs:["مشغل CNC","فني تصنيع"], places:["المصانع"]},
  {id:10, name:"أنظمة الطاقة المتجددة",                            interests:["الطاقة","الكهرباء","التكنولوجيا","الأنظمة الذكية"], learn:["تركيب وصيانة أنظمة الطاقة الشمسية وطاقة الرياح","تقييم مواقع التركيب وتجهيزها وفق المتطلبات الفنية","تركيب الهياكل والتمديدات والأنظمة الكهربائية","تشغيل أنظمة المراقبة والتحكم وضبط إعداداتها","فحص الأنظمة وصيانتها لضمان كفاءة الأداء"], jobs:["فني طاقة"], places:["شركات الطاقة"]},
  {id:11, name:"تكنولوجيا إدارة النظم والشبكات",                   interests:["التكنولوجيا","الشبكات والتحول الرقمي","الأنظمة الذكية"], learn:["تركيب وربط شبكات الحاسوب وأجهزتها","ضبط إعدادات الشبكات وأنظمة التشغيل وخدمات الاتصال","تشخيص الأعطال وصيانة الحواسيب والشبكات","تحديث الأنظمة وترقية مكونات الشبكة واختبارها","توثيق الأعمال الفنية وحماية البيانات والعمل باحتراف"], jobs:["مسؤول شبكات"], places:["شركات التقنية"]},
  {id:12, name:"المواد المتقدمة (ألياف الكربون)",                   interests:["التكنولوجيا","الهندسة","التصنيع","الجودة"], learn:["تصنيع المواد المركبة","استخدام الألياف في التطبيقات الصناعية","تطبيقات صناعية متقدمة"], jobs:["فني مواد"], places:["صناعات متقدمة"]},
  {id:13, name:"الأنظمة الكهربائية المتكاملة في المباني الذكية",   interests:["الكهرباء","الأنظمة الذكية","البناء والإنشاءات","التكنولوجيا","الأتمتة"], learn:["تنفيذ التمديدات الكهربائية وفحصها وتأريضها في المباني","بناء الدارات الكهربائية والإلكترونية الأساسية واختبارها","تركيب أنظمة المراقبة والإنذار والتحكم والاتصال الداخلي","تنفيذ أنظمة التحكم بالمحركات والتمديدات الكهربائية الصناعية","تركيب شبكات الحاسوب وPLC والمشاركة في أنظمة المباني الذكية"], jobs:["فني مباني"], places:["شركات إدارة المباني"]},
  {id:14, name:"فني أنظمة التكييف والتبريد وأتمتتها",              interests:["الميكانيك","الصيانة","الأتمتة","الطاقة","الأنظمة الذكية"], learn:["تركيب أنظمة التكييف والتبريد والتهوية","تمديد الأنابيب وعزلها وفحصها وفق المخططات","تركيب أنظمة التهوية والتبريد التجاري","برمجة وحدات التحكم والحساسات وأنظمة الأتمتة","تشغيل الأنظمة وصيانتها بكفاءة واحتراف"], jobs:["فني HVAC"], places:["شركات المقاولات","المنشآت الكبيرة والفنادق والمولات"]},
  {id:15, name:"تمديدات صحية وتدفئة",                              interests:["البناء والإنشاءات","الميكانيك","الصيانة","الطاقة"], learn:["تركيب شبكات المياه والصرف الصحي والغاز","تمديد الأنابيب وعزلها وفحصها وتثبيتها","تركيب وتشغيل أنظمة التدفئة وسخانات المياه","تركيب الأدوات الصحية وربطها بالشبكات","فحص الأنظمة وصيانتها وتسليمها بكفاءة"], jobs:["سباك"], places:["شركات المقاولات","المنشآت الكبيرة والفنادق والمولات"]},
  {id:16, name:"كهرباء الشاحنات والحافلات",                        interests:["الكهرباء","التكنولوجيا","الصيانة","الميكانيك"], learn:["الأنظمة الكهربائية للشاحنات والحافلات","تشخيص الأعطال الكهربائية وإصلاحها","صيانة أنظمة الإضاءة والتحكم"], jobs:["فني كهرباء مركبات"], places:["ورشات كهرباء الشاحنات","شركات النقل العام والخاص","شركات الآليات الثقيلة"]},
  {id:17, name:"ميكانيك الشاحنات والحافلات",                       interests:["الميكانيك","الصيانة","التكنولوجيا"], learn:["صيانة المحركات والأنظمة الميكانيكية","تشخيص وإصلاح الأعطال","صيانة أنظمة الفرامل والتعليق"], jobs:["فني ميكانيك"], places:["ورشات ميكانيك الشاحنات","شركات النقل","شركات الآليات الثقيلة"]},
  {id:18, name:"تكنولوجيا الإنشاءات والهياكل المعدنية",            interests:["البناء والإنشاءات","التصنيع","الميكانيك","الهندسة","الجودة"], learn:["قراءة المخططات وقياس العناصر المعدنية بدقة","قطع وثني المعادن باستخدام أدوات ومعدات حديثة","تنفيذ أعمال اللحام والتجميع المعدني","تركيب الهياكل المعدنية وإنجاز التشطيبات","تطبيق السلامة المهنية والعمل بكفاءة داخل الورشة والموقع"], jobs:["فني إنشاءات"], places:["شركات تشكيل المعادن","مصانع الأثاث","شركات الصيانة العامة"]},
  {id:19, name:"تصميم الأزياء الرقمي (CAD Fashion)",               interests:["التصميم","التكنولوجيا","الإنتاج"], learn:["أساسيات تصميم الأزياء باستخدام الحاسوب والباترون الرقمي","رسم الأزياء والقطع المسطحة ثنائي الأبعاد بدقة","استخدام البرمجيات في تصميم الأزياء","إعداد لوحات الألوان والخامات وتصدير الملفات للإنتاج","تنفيذ مشاريع تصميم رقمية بطريقة احترافية ومنظمة"], jobs:["مصمم رقمي"], places:["مصانع تصميم الأزياء","مشاغل الخياطة"]},
  {id:20, name:"مطور التطبيقات المتقدمة",                          interests:["التكنولوجيا","الشبكات والتحول الرقمي","الأنظمة الذكية","التصميم"], learn:["تحليل متطلبات العميل وتخطيط وتصميم التطبيقات","برمجة التطبيقات باستخدام لغات وأطر عمل حديثة","تصميم واجهات المستخدم وبناء الواجهة الأمامية والخلفية","إدارة قواعد البيانات وربطها بالتطبيق","اختبار التطبيقات وتحسين أدائها وأمانها وتوثيقها"], jobs:["Associate Programmer","مطور تطبيقات","مصمم UI/UX"], places:["شركات البرمجة"]},
];

const interests = [
  {id:0,  label:"الأتمتة",        sub:"والتحكم",        emoji:"🤖", angle:-90,  key:"الأتمتة"},
  {id:1,  label:"الأنظمة الذكية", sub:"والتقنية",       emoji:"🧠", angle:-66,  key:"الأنظمة الذكية"},
  {id:2,  label:"الإلكترونيات",   sub:"والدوائر",       emoji:"📡", angle:-42,  key:"الإلكترونيات"},
  {id:3,  label:"الإنتاج",        sub:"والتصنيع",       emoji:"🏭", angle:-18,  key:"الإنتاج"},
  {id:4,  label:"البناء",         sub:"والإنشاءات",     emoji:"🏗️", angle:6,    key:"البناء والإنشاءات"},
  {id:5,  label:"التصميم",        sub:"والإبداع",       emoji:"🎨", angle:30,   key:"التصميم"},
  {id:6,  label:"التصنيع",        sub:"المتقدم",        emoji:"⚙️", angle:54,   key:"التصنيع"},
  {id:7,  label:"التكنولوجيا",    sub:"والرقمنة",       emoji:"💻", angle:78,   key:"التكنولوجيا"},
  {id:8,  label:"الجودة",         sub:"والمعايير",      emoji:"✅", angle:102,  key:"الجودة"},
  {id:9,  label:"الشبكات",        sub:"والتحول الرقمي", emoji:"🌐", angle:126,  key:"الشبكات والتحول الرقمي"},
  {id:10, label:"الصيانة",        sub:"الصناعية",       emoji:"🔧", angle:150,  key:"الصيانة"},
  {id:11, label:"الطاقة",         sub:"والمتجددة",      emoji:"⚡", angle:174,  key:"الطاقة"},
  {id:12, label:"الكهرباء",       sub:"والأنظمة",       emoji:"🔌", angle:198,  key:"الكهرباء"},
  {id:13, label:"الميكانيك",      sub:"والآلات",        emoji:"🔩", angle:222,  key:"الميكانيك"},
  {id:14, label:"الهندسة",        sub:"التطبيقية",      emoji:"📐", angle:246,  key:"الهندسة"},
];

const categoryIconKind = {
  0: 'gear',
  1: 'chip',
  2: 'circuit',
  3: 'factory',
  4: 'building',
  5: 'pen',
  6: 'wrench',
  7: 'laptop',
  8: 'check',
  9: 'network',
  10: 'wrench',
  11: 'bolt',
  12: 'plug',
  13: 'gear',
  14: 'ruler',
};

const CX = 360, CY = 285;
const BALL_R = 22;
const LONG_R = 180, MED_R = 148, SHORT_R = 112;
const LEAF_LONG = 258, LEAF_MED = 214, LEAF_SHORT = 168;

const sortedByAngle = [...interests].sort((a, b) => a.angle - b.angle);
const pattern = ['long', 'short', 'medium'];
const armType = {};
sortedByAngle.forEach((cat, i) => { armType[cat.id] = pattern[i % 3]; });

function posAt(angleDeg, r) {
  const a = angleDeg * Math.PI / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function getNodePos(cat) {
  const arm = armType[cat.id];
  const r = arm === 'long' ? LONG_R : arm === 'medium' ? MED_R : SHORT_R;
  return posAt(cat.angle, r);
}

function getLeafPos(cat) {
  const arm = armType[cat.id];
  const r = arm === 'long' ? LEAF_LONG : arm === 'medium' ? LEAF_MED : LEAF_SHORT;
  return posAt(cat.angle, r);
}

function getProgramsFor(cat) {
  return programs.filter(p => p.interests.includes(cat.key));
}

function CategoryIcon({ kind, active, hovered }) {
  const stroke = active ? '#fff' : hovered ? '#8a0f16' : '#AB131C';
  const fill = active ? '#fff' : hovered ? 'rgba(171,19,28,0.22)' : 'rgba(171,19,28,0.08)';
  const common = { stroke, fill, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', vectorEffect: 'non-scaling-stroke' };

  switch (kind) {
    case 'gear':
      return (
        <g transform="translate(0 0)">
          <circle cx="8" cy="8" r="3" {...common} />
          <circle cx="8" cy="8" r="6.2" fill="none" stroke={stroke} strokeWidth="1.8" />
          <path d="M8 0.8v2.1M8 13.1v2.1M0.8 8h2.1M13.1 8h2.1M2.5 2.5l1.5 1.5M12 12l1.5 1.5M2.5 13.5 4 12M12 4l1.5-1.5" {...common} fill="none" />
        </g>
      );
    case 'chip':
      return (
        <g>
          <rect x="2.5" y="2.5" width="11" height="11" rx="2.2" {...common} />
          <rect x="5" y="5" width="6" height="6" rx="1.2" fill="none" stroke={stroke} strokeWidth="1.8" />
          <path d="M1 5h1.2M1 8h1.2M1 11h1.2M13.8 5h1.2M13.8 8h1.2M13.8 11h1.2M5 1v1.2M8 1v1.2M11 1v1.2M5 13.8v1.2M8 13.8v1.2M11 13.8v1.2" {...common} fill="none" />
        </g>
      );
    case 'circuit':
      return (
        <g>
          <path d="M3 4.5h5.5v3H11a2 2 0 0 1 2 2v3" {...common} fill="none" />
          <path d="M4 4.5v-2M8.5 4.5v-2M12 12.5v2" {...common} fill="none" />
          <circle cx="3" cy="4.5" r="1.2" {...common} />
          <circle cx="8.5" cy="7.5" r="1.2" {...common} />
          <circle cx="13" cy="12.5" r="1.2" {...common} />
        </g>
      );
    case 'factory':
      return (
        <g>
          <path d="M2.5 13.5V7l3 1.8V7l3 1.8V6l3 1.8V13.5z" {...common} fill="none" />
          <path d="M3.5 13.5h9" {...common} fill="none" />
          <path d="M4 6.2 6 4.7M7 5.5 9 4M10 6.2l1.8-1.4" {...common} fill="none" />
          <rect x="4" y="9" width="1.2" height="1.2" fill={stroke} stroke="none" />
          <rect x="6.7" y="9" width="1.2" height="1.2" fill={stroke} stroke="none" />
          <rect x="9.4" y="9" width="1.2" height="1.2" fill={stroke} stroke="none" />
        </g>
      );
    case 'building':
      return (
        <g>
          <path d="M3 13.5V4.5h7.8v9" {...common} fill="none" />
          <path d="M6 13.5v-2.5h1.8v2.5" {...common} fill="none" />
          <path d="M5 6.2h1.2M7.6 6.2h1.2M5 8.3h1.2M7.6 8.3h1.2M5 10.4h1.2M7.6 10.4h1.2" {...common} fill="none" />
        </g>
      );
    case 'pen':
      return (
        <g>
          <path d="M3 11.8 10.8 4c.4-.4 1-.4 1.4 0l.8.8c.4.4.4 1 0 1.4L5.2 13.2 2.5 13.5z" {...common} fill="none" />
          <path d="M9.5 5.3l2.2 2.2" {...common} fill="none" />
          <path d="M2.5 13.5 5.2 13.2" {...common} fill="none" />
        </g>
      );
    case 'wrench':
      return (
        <g>
          <path d="M11.5 3.5a2.8 2.8 0 0 0-3.7 3.7L3.2 12a1.5 1.5 0 1 0 2.1 2.1l5-4.6a2.8 2.8 0 0 0 3.7-3.7l-2 2-1.6-.6-.6-1.6z" {...common} fill="none" />
        </g>
      );
    case 'laptop':
      return (
        <g>
          <rect x="3" y="4" width="10" height="6.2" rx="1" {...common} fill="none" />
          <path d="M2.5 12.5h11" {...common} fill="none" />
          <path d="M5 7.2h6" {...common} fill="none" />
        </g>
      );
    case 'check':
      return (
        <g>
          <path d="M3 8.2 6 11 13 4.5" {...common} fill="none" />
          <circle cx="8" cy="8" r="6.1" fill="none" stroke={stroke} strokeWidth="1.8" />
        </g>
      );
    case 'network':
      return (
        <g>
          <circle cx="8" cy="8" r="2" {...common} />
          <path d="M8 3.5v2.1M8 10.4v2.1M3.5 8h2.1M10.4 8h2.1M4.6 4.6l1.5 1.5M10.4 10.4l1.5 1.5M4.6 11.4 6.1 9.9M10.4 5.6l1.5-1.5" {...common} fill="none" />
        </g>
      );
    case 'bolt':
      return (
        <g>
          <path d="M9.3 1.8 4 8h3.1L6.7 14.2 12 8H8.9z" {...common} fill="none" />
        </g>
      );
    case 'plug':
      return (
        <g>
          <path d="M6 3.5v3M10 3.5v3M4.5 6.5h7v2.2a3.5 3.5 0 0 1-3.5 3.5h0A3.5 3.5 0 0 1 4.5 8.7z" {...common} fill="none" />
          <path d="M8 12.2v2M8 12.2h2" {...common} fill="none" />
        </g>
      );
    case 'ruler':
      return (
        <g>
          <path d="M3 11 11 3l2 2-8 8H3z" {...common} fill="none" />
          <path d="M6 6l1 1M7.8 4.2l1 1M4.2 7.8l1 1M9.6 5.4l1 1" {...common} fill="none" />
        </g>
      );
    default:
      return null;
  }
}

// ─── Background canvas ───────────────────────────────────────────────────────
function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const C = '#AB131C';
    const ALPHA = 0.07;
    const CELL = 110;
    const S = 28;

    const icons = [
      function gear(ctx) {
        const teeth = 8, R = S / 2, r = R * 0.65, ir = R * 0.38;
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
          const a0 = (i / teeth) * Math.PI * 2, a1 = ((i + 0.35) / teeth) * Math.PI * 2,
            a2 = ((i + 0.65) / teeth) * Math.PI * 2, a3 = ((i + 1) / teeth) * Math.PI * 2;
          if (i === 0) ctx.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
          ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
          ctx.lineTo(Math.cos(a1) * R, Math.sin(a1) * R);
          ctx.lineTo(Math.cos(a2) * R, Math.sin(a2) * R);
          ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
          ctx.lineTo(Math.cos(a3) * r, Math.sin(a3) * r);
        }
        ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, ir, 0, Math.PI * 2); ctx.stroke();
      },
      function laptop(ctx) {
        const w = S * 0.85, h = S * 0.55;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
        ctx.beginPath(); ctx.moveTo(-w / 2, h / 2); ctx.lineTo(-w / 2 - 4, h / 2 + 5);
        ctx.lineTo(w / 2 + 4, h / 2 + 5); ctx.lineTo(w / 2, h / 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-w * 0.25, -h * 0.1); ctx.bezierCurveTo(-w * 0.05, -h * 0.35, w * 0.05, -h * 0.35, w * 0.25, -h * 0.1);
        ctx.stroke();
      },
      function car(ctx) {
        const bw = S * 0.9, bh = S * 0.28, by = S * 0.08;
        ctx.beginPath();
        ctx.moveTo(-bw / 2, by); ctx.lineTo(-bw / 2, by - bh);
        ctx.lineTo(-bw * 0.28, by - bh - S * 0.22); ctx.lineTo(bw * 0.18, by - bh - S * 0.22);
        ctx.lineTo(bw / 2, by - bh); ctx.lineTo(bw / 2, by); ctx.closePath(); ctx.stroke();
        const wy = by + S * 0.07, wr = S * 0.14;
        ctx.beginPath(); ctx.arc(-bw * 0.3, wy, wr, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(bw * 0.3, wy, wr, 0, Math.PI * 2); ctx.stroke();
      },
      function energy(ctx) {
        ctx.beginPath();
        ctx.moveTo(-S * 0.18, -S * 0.48); ctx.lineTo(-S * 0.28, 0); ctx.lineTo(-S * 0.02, 0);
        ctx.lineTo(-S * 0.18, S * 0.48); ctx.lineTo(S * 0.28, 0); ctx.lineTo(S * 0.02, 0);
        ctx.closePath(); ctx.stroke();
      },
      function building(ctx) {
        const bw = S * 0.65, bh = S * 0.7, bx = -bw / 2, by = S * 0.38 - bh;
        ctx.strokeRect(bx, by, bw, bh);
        const ww = bw * 0.22, wh = bh * 0.16, gap = bw * 0.14;
        for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++)
          ctx.strokeRect(bx + gap + (ww + gap) * c, by + gap + (wh + gap * 1.2) * r, ww, wh);
        ctx.beginPath();
        ctx.moveTo(bx + bw - 4, by); ctx.lineTo(bx + bw + S * 0.25, by);
        ctx.moveTo(bx + bw + S * 0.25, by); ctx.lineTo(bx + bw + S * 0.25, by + S * 0.25);
        ctx.stroke();
      },
      function pen(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, S * 0.48);
        ctx.lineTo(-S * 0.22, -S * 0.1); ctx.lineTo(S * 0.22, -S * 0.1);
        ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-S * 0.22, -S * 0.1); ctx.lineTo(-S * 0.22, -S * 0.3);
        ctx.lineTo(S * 0.22, -S * 0.3); ctx.lineTo(S * 0.22, -S * 0.1); ctx.stroke();
        ctx.beginPath(); ctx.arc(-S * 0.48, -S * 0.05, 3, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(S * 0.32, S * 0.3, 3, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.setLineDash([2, 3]);
        ctx.moveTo(-S * 0.48, -S * 0.05); ctx.bezierCurveTo(-S * 0.2, S * 0.1, S * 0.1, S * 0.2, S * 0.32, S * 0.3);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    ];

    function draw() {
      const stage = canvas.parentElement;
      canvas.width = stage.offsetWidth;
      canvas.height = stage.offsetHeight;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = C;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = ALPHA;
      const cols = Math.ceil(canvas.width / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = (row * 3 + col) % icons.length;
          const offX = (row % 2 === 0) ? 0 : CELL * 0.5;
          const cx = col * CELL + offX;
          const cy = row * CELL;
          ctx.save();
          ctx.translate(cx, cy);
          icons[idx](ctx);
          ctx.restore();
        }
      }
    }

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

// ─── Programs Panel ──────────────────────────────────────────────────────────
function ProgramsPanel({ visible, cat, programs, selectedProgram, onSelectProgram, onClose, footerOffset = 0 }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;

  return (
    <div style={{
      position: 'absolute',
      left: isMobile ? 10 : 16,
      right: isMobile ? 10 : 'auto',
      top: isMobile ? 'auto' : '50%',
      bottom: isMobile ? footerOffset + 10 : 'auto',
      transform: isMobile
        ? `translateY(${visible ? 0 : 14}px)`
        : `translateY(-50%) translateX(${visible ? 0 : -16}px)`,
      width: isMobile ? 'auto' : 252,
      maxHeight: isMobile ? '42dvh' : 'calc(100vh - 120px)',
      background: '#fff', border: '1.5px solid rgba(171,19,28,0.2)',
      borderRadius: 16, boxShadow: '0 8px 40px rgba(171,19,28,0.1)',
      opacity: visible ? 1 : 0, pointerEvents: visible ? 'all' : 'none',
      transition: 'opacity 0.4s, transform 0.4s',
      zIndex: 70, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ background: '#AB131C', padding: '14px 14px 12px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontFamily: 'Tajawal,sans-serif', marginBottom: 4 }}>
              البرامج المتاحة
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'Tajawal,sans-serif', lineHeight: 1.3 }}>
              {cat ? `${cat.label} ${cat.sub}` : '—'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>
              {programs.length} برنامج متاح
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق قائمة البرامج"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, padding: 10 }}>
        {programs.map(p => (
          <div
            key={p.id}
            onClick={() => onSelectProgram(p)}
            style={{
              border: `1px solid ${selectedProgram?.id === p.id ? '#AB131C' : 'rgba(171,19,28,0.1)'}`,
              borderRadius: 10, padding: '10px 12px', marginBottom: 7, cursor: 'pointer',
              transition: 'all 0.2s',
              background: selectedProgram?.id === p.id ? 'rgba(171,19,28,0.06)' : '#fafafa',
              boxShadow: selectedProgram?.id === p.id ? '0 2px 12px rgba(171,19,28,0.1)' : 'none',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2c2c2c', fontFamily: 'Tajawal,sans-serif', lineHeight: 1.4, marginBottom: 5 }}>
              {p.name}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {p.jobs.slice(0, 2).map((j, i) => (
                <span key={i} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: 'rgba(171,19,28,0.08)', color: '#AB131C' }}>
                  {j}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Detail Panel ────────────────────────────────────────────────────────────
function DetailPanel({ visible, program, onClose, footerOffset = 0 }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;

  return (
    <div style={{
      position: 'absolute',
      right: isMobile ? 10 : 16,
      left: isMobile ? 10 : 'auto',
      top: isMobile ? 10 : '50%',
      bottom: isMobile ? footerOffset + 10 : 'auto',
      transform: isMobile
        ? `translateY(${visible ? 0 : 16}px)`
        : `translateY(-50%) translateX(${visible ? 0 : 16}px)`,
      width: isMobile ? 'auto' : 248,
      maxHeight: isMobile ? 'calc(100dvh - 96px)' : 'calc(100vh - 120px)',
      background: '#fff', border: '1.5px solid rgba(171,19,28,0.2)',
      borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(171,19,28,0.1)',
      opacity: visible ? 1 : 0, pointerEvents: visible ? 'all' : 'none',
      transition: 'opacity 0.4s, transform 0.4s',
      zIndex: 90, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ background: '#2c2c2c', padding: '14px 14px 12px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontFamily: 'Tajawal,sans-serif', marginBottom: 4 }}>
              تفاصيل البرنامج
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'white', fontFamily: 'Tajawal,sans-serif', lineHeight: 1.4 }}>
              {program?.name || '—'}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق تفاصيل البرنامج"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.24)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      </div>
      {program && (
        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 14px' }}>
          <Section title="ماذا ستتعلم؟" />
          {program.learn.map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 11, color: '#555', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.04)', lineHeight: 1.55 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#AB131C', flexShrink: 0, marginTop: 5, display: 'inline-block' }} />
              {l}
            </div>
          ))}
          <Section title="الفرص الوظيفية" />
          {program.jobs.map((j, i) => <JobRow key={i} text={j} />)}
          <Section title="أماكن العمل المستقبلية" />
          {program.places.map((pl, i) => <JobRow key={i} text={pl} />)}
        </div>
      )}
    </div>
  );
}

function Section({ title }) {
  return (
    <div style={{ fontSize: 9, letterSpacing: 2, color: '#AB131C', textTransform: 'uppercase', fontFamily: 'Tajawal,sans-serif', marginBottom: 7, marginTop: 12, fontWeight: 700 }}>
      {title}
    </div>
  );
}

function JobRow({ text }) {
  return (
    <div style={{ fontSize: 11, color: '#777', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(171,19,28,0.3)', flexShrink: 0, display: 'inline-block' }} />
      {text}
    </div>
  );
}

// ─── Main SVG ────────────────────────────────────────────────────────────────
function InterestNode({ cat, active, onClick }) {
  const np = getNodePos(cat);
  const [hovered, setHovered] = useState(false);

  const ringStyle = active
    ? { fill: '#AB131C', stroke: '#7a0b13', strokeWidth: 2.5, filter: 'drop-shadow(0 0 12px rgba(171,19,28,0.6))' }
    : hovered
    ? { fill: 'rgba(171,19,28,0.1)', stroke: 'rgba(171,19,28,0.5)', strokeWidth: 1.5, filter: 'drop-shadow(0 0 6px rgba(171,19,28,0.25))' }
    : { fill: 'rgba(171,19,28,0.04)', stroke: 'rgba(171,19,28,0.22)', strokeWidth: 1.5 };

  const innerStyle = active
    ? { fill: '#c0222b', stroke: '#8a0f16', strokeWidth: 1 }
    : { fill: 'rgba(171,19,28,0.08)', stroke: 'rgba(171,19,28,0.28)', strokeWidth: 1 };

  const coreStyle = active
    ? { fill: '#d42f3a' }
    : hovered
    ? { fill: 'rgba(171,19,28,0.35)' }
    : { fill: 'rgba(171,19,28,0.2)' };

  const labelFill = active ? '#ffffff' : '#555';
  const labelWeight = active ? 700 : 400;

  return (
    <g
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', transition: 'all 0.3s' }}
    >
      <circle cx={np.x} cy={np.y} r={BALL_R + 9} style={{ ...ringStyle, transition: 'all 0.3s' }} />
      <circle cx={np.x} cy={np.y} r={BALL_R} style={{ ...innerStyle, transition: 'all 0.3s' }} />
      <circle cx={np.x} cy={np.y} r={BALL_R - 12} style={{ ...coreStyle, transition: 'all 0.3s' }} />
      <g transform={`translate(${np.x - 8} ${np.y - 22})`} style={{ pointerEvents: 'none' }}>
        <CategoryIcon kind={categoryIconKind[cat.id]} active={active} hovered={hovered} />
      </g>
      <text x={np.x} y={np.y - 2} textAnchor="middle" fill={labelFill} fontFamily="Cairo,sans-serif" fontSize={9} fontWeight={labelWeight} style={{ pointerEvents: 'none', transition: 'fill 0.3s' }}>{cat.label}</text>
      <text x={np.x} y={np.y + 9} textAnchor="middle" fill={labelFill} fontFamily="Cairo,sans-serif" fontSize={9} fontWeight={labelWeight} style={{ pointerEvents: 'none', transition: 'fill 0.3s' }}>{cat.sub}</text>
    </g>
  );
}

function LeafBadge({ cat, visible, programCount, onClick }) {
  const lp = getLeafPos(cat);
  const [hovered, setHovered] = useState(false);

  return (
    <g
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'opacity 0.4s',
        cursor: 'pointer',
        animation: visible ? 'leafPulse 2.5s ease-in-out infinite' : 'none',
      }}
    >
      <circle cx={lp.x} cy={lp.y} r={16} fill={hovered ? '#8a0f16' : '#AB131C'} style={{ transition: 'fill 0.3s' }} />
      <text x={lp.x} y={lp.y + 4} textAnchor="middle" fill="white" fontFamily="Tajawal,sans-serif" fontSize={11} fontWeight={800} style={{ pointerEvents: 'none' }}>{programCount}</text>
      <text x={lp.x} y={lp.y + 22} textAnchor="middle" fill="#666" fontFamily="Cairo,sans-serif" fontSize={8} style={{ pointerEvents: 'none' }}>برنامج</text>
    </g>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function CAVTInterestsExplorer({ onBack = () => {} }) {
  const [activeId, setActiveId] = useState(null);
  const [leafVisible, setLeafVisible] = useState({});
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 900;
  });
  const headerHeight = isMobile ? 56 : 64;
  const footerHeight = isMobile ? 220 : 178;

  const activeCategory = activeId !== null ? interests.find(c => c.id === activeId) : null;
  const activePrograms = activeCategory ? getProgramsFor(activeCategory) : [];

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSelectInterest = useCallback((id) => {
    if (activeId === id) {
      setActiveId(null);
      setLeafVisible({});
      setSelectedProgram(null);
      setShowDetail(false);
      return;
    }
    setActiveId(id);
    setLeafVisible({});
    setSelectedProgram(null);
    setShowDetail(false);
    setShowHint(false);
    setTimeout(() => {
      setLeafVisible(prev => ({ ...prev, [id]: true }));
    }, 300);
  }, [activeId]);

  const handleSelectProgram = useCallback((p) => {
    setSelectedProgram(p);
    setShowDetail(true);
  }, []);

  const handleClosePrograms = useCallback(() => {
    setActiveId(null);
    setLeafVisible({});
    setSelectedProgram(null);
    setShowDetail(false);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedProgram(null);
    setShowDetail(false);
  }, []);

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLeafClick = useCallback((id) => {
    // already shows panel — leaf click just focuses it
    if (activeId !== id) handleSelectInterest(id);
  }, [activeId, handleSelectInterest]);

  return (
    <div style={{ width: '100%', minHeight: '100dvh', fontFamily: 'Cairo,sans-serif', direction: 'rtl', overflow: 'auto', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Tajawal:wght@300;400;700;800&display=swap');
        @keyframes hubB { 0%,100%{opacity:0.35} 50%{opacity:0.85} }
        @keyframes leafPulse { 0%,100%{filter:drop-shadow(0 0 3px rgba(171,19,28,0.2))} 50%{filter:drop-shadow(0 0 10px rgba(171,19,28,0.55))} }
        @keyframes flowLine { from{stroke-dashoffset:20} to{stroke-dashoffset:0} }
        * { margin:0; padding:0; box-sizing:border-box; }
      `}</style>

      {/* Header */}
      <div style={{
        
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: headerHeight, background: '#9C0D13',
        display: 'grid', alignItems: 'center',
        gridTemplateColumns: isMobile ? '88px 1fr 80px' : '150px 1fr 110px',
        gap: isMobile ? 6 : 12,
        padding: isMobile ? '0 10px' : '0 18px',
        boxShadow: '0 3px 20px rgba(156,13,19,0.4)',
        direction: 'ltr',
      }}
      
      >
        <img
          src="data:image/png;base64,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"
          alt="CAVT Logo"
          style={{
            height: isMobile ? 28 : 40,
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            justifySelf: 'start',
            maxWidth: isMobile ? 84 : 140,
          }}
        />
        <span style={{
          direction: 'rtl',
          fontSize: isMobile ? 9 : 11, letterSpacing: isMobile ? 0.8 : 1.5, color: 'rgba(255,255,255,0.75)', fontFamily: 'Tajawal,sans-serif',
          whiteSpace: 'nowrap',
          maxWidth: isMobile ? '100%' : 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          justifySelf: 'center',
        }}>
          اكتشف اهتماماتك — المسار الثاني
        </span>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)',
            color: 'white', padding: isMobile ? '5px 12px' : '6px 18px', borderRadius: 6,
            fontFamily: 'Cairo,sans-serif', fontSize: isMobile ? 12 : 13, cursor: 'pointer',
            justifySelf: 'end',
          }}
        >
          رجوع
        </button>
      </div>

      {/* Stage */}
      <div style={{ position: 'relative', marginTop: headerHeight, height: `calc(100vh - ${headerHeight}px)`, flexShrink: 0, display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'center', background: '#fff', overflow: 'hidden', paddingTop: isMobile ? 8 : 0 }}>
        <BackgroundCanvas />

        {/* SVG */}
        <svg viewBox="0 0 720 570" style={{ width: isMobile ? '100vw' : 'min(920px,99vw)', height: isMobile ? 'auto' : 'min(730px,94vh)', maxHeight: isMobile ? '58dvh' : 'none', overflow: 'visible' }}>
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#AB131C" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#AB131C" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Hub glow */}
          <circle cx={CX} cy={CY} r={110} fill="url(#hubGlow)" style={{ animation: 'hubB 3.5s ease-in-out infinite' }} />

          {/* Lines */}
          {interests.map(cat => {
            const np = getNodePos(cat);
            const a = cat.angle * Math.PI / 180;
            const edgeR = 43;
            const ex = CX + edgeR * Math.cos(a);
            const ey = CY + edgeR * Math.sin(a);
            const lit = activeId === cat.id;
            return (
              <line
                key={cat.id}
                x1={ex} y1={ey}
                x2={np.x} y2={np.y}
                strokeDasharray="5 4"
                stroke={lit ? 'rgba(171,19,28,0.6)' : 'rgba(171,19,28,0.15)'}
                strokeWidth={lit ? 2 : 1.5}
                fill="none"
                strokeLinecap="round"
                style={lit ? { animation: 'flowLine 1.2s linear infinite', transition: 'stroke 0.3s, stroke-width 0.3s' } : { transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
            );
          })}

          {/* Hub rings */}
          <circle cx={CX} cy={CY} r={74} fill="none" stroke="rgba(171,19,28,0.1)" strokeWidth={1} strokeDasharray="4 8" />
          <circle cx={CX} cy={CY} r={58} fill="rgba(171,19,28,0.04)" stroke="rgba(171,19,28,0.18)" strokeWidth={1.5} />
          <circle cx={CX} cy={CY} r={43} fill="#AB131C" stroke="#8a0f16" strokeWidth={1.5} />
          <circle cx={CX} cy={CY} r={41} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <line x1={CX} y1={244} x2={CX} y2={251} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <line x1={CX} y1={319} x2={CX} y2={326} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <line x1={319} y1={CY} x2={326} y2={CY} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <line x1={394} y1={CY} x2={401} y2={CY} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <text x={CX} y={279} textAnchor="middle" fill="white" fontFamily="Tajawal" fontSize={13} fontWeight={800}>اهتماماتك</text>
          <text x={CX} y={297} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontFamily="Tajawal" fontSize={10}>اضغط للاكتشاف</text>

          {/* Nodes */}
          {interests.map(cat => (
            <InterestNode
              key={cat.id}
              cat={cat}
              active={activeId === cat.id}
              onClick={() => handleSelectInterest(cat.id)}
            />
          ))}

          {/* Leaves */}
          {interests.map(cat => {
            const matched = getProgramsFor(cat);
            if (matched.length === 0) return null;
            return (
              <LeafBadge
                key={cat.id}
                cat={cat}
                visible={!!leafVisible[cat.id]}
                programCount={matched.length}
                onClick={() => handleLeafClick(cat.id)}
              />
            );
          })}
        </svg>

        {/* Programs Panel */}
        <ProgramsPanel
          visible={activeId !== null}
          cat={activeCategory}
          programs={activePrograms}
          selectedProgram={selectedProgram}
          onSelectProgram={handleSelectProgram}
          onClose={handleClosePrograms}
          footerOffset={0}
        />

        {/* Detail Panel */}
        <DetailPanel
          visible={showDetail}
          program={selectedProgram}
          onClose={handleCloseDetail}
          footerOffset={0}
        />

        {/* Hint */}
        <div style={{
          position: 'absolute', bottom: isMobile ? 8 : 20, left: '50%', transform: 'translateX(-50%)',
          fontSize: isMobile ? 10 : 12, letterSpacing: 1, color: '#999',
          fontFamily: 'Tajawal,sans-serif', pointerEvents: 'none',
          transition: 'opacity 0.5s', whiteSpace: isMobile ? 'normal' : 'nowrap',
          textAlign: 'center',
          maxWidth: isMobile ? '88vw' : 'none',
          background: 'rgba(255,255,255,0.95)', padding: isMobile ? '6px 12px' : '5px 16px',
          borderRadius: 20, border: '1px solid rgba(171,19,28,0.12)',
          opacity: showHint ? 1 : 0,
        }}>
          اضغط على كرة اهتمامك لتكتشف البرامج المناسبة
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#414141',
        color: 'rgba(255,255,255,0.92)',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: isMobile ? '18px 16px 14px' : '28px 48px 22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: isMobile ? 14 : 18,
          fontFamily: 'Tajawal,sans-serif',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1.6fr 0.9fr',
            gap: isMobile ? 20 : 24,
            alignItems: 'start',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <img
                src="data:image/png;base64,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"
                alt="CAVT Logo"
                style={{ width: isMobile ? 118 : 150, height: 'auto', objectFit: 'contain', display: 'block' }}
              />
              <div style={{ color: 'rgba(255,255,255,0.84)', fontSize: isMobile ? 12 : 14, lineHeight: 1.7, maxWidth: 280 }}>
                اكتشف اهتماماتك، وتعرّف على المسارات والبرامج المناسبة لك بطريقة واضحة وسريعة.
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 18, alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'center', paddingTop: isMobile ? 0 : 18 }}>
              {[
                { label: 'Home', href: 'http://localhost:3000/#' },
                { label: 'About Us', href: 'http://localhost:3000/#' },
                { label: 'FAQs', href: 'http://localhost:3000/#' },
                { label: 'Contact Us', href: 'http://localhost:3000/#' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(event) => event.preventDefault()}
                  style={{
                    color: 'rgba(255,255,255,0.92)',
                    textDecoration: 'none',
                    fontSize: isMobile ? 14 : 18,
                    fontWeight: 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'flex-end', alignItems: 'flex-start', gap: 10, paddingTop: isMobile ? 0 : 6, flexWrap: 'wrap' }}>
              {[
                { label: 'f', name: 'Facebook' },
                { label: 'x', name: 'X' },
                { label: '◎', name: 'Instagram' },
                { label: 'in', name: 'LinkedIn' },
              ].map((social) => (
                <button
                  key={social.name}
                  type="button"
                  aria-label={social.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: 'none',
                    background: '#fff',
                    color: '#7b6f5e',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: social.label === 'in' ? 16 : 18,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
                    textTransform: 'lowercase',
                  }}
                >
                  {social.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            paddingTop: isMobile ? 0 : 6,
            flexWrap: 'wrap',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: isMobile ? 12 : 14 }}>
              © All rights reserved 2026 CAVT
            </div>
            <button
              type="button"
              onClick={handleScrollTop}
              aria-label="Scroll to top"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: 'none',
                background: '#000',
                color: '#fff',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                boxShadow: '0 6px 16px rgba(0,0,0,0.28)',
                position: isMobile ? 'static' : 'fixed',
                right: isMobile ? 'auto' : 22,
                bottom: isMobile ? 'auto' : 18,
                zIndex: 70,
              }}
            >
              ^
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

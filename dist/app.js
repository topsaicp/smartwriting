(function () {
  'use strict';
  const D = window.SF_DATA;
  const KEY = 'scholarflow-prototype-v1';
  const app = document.getElementById('app');
  const modal = document.getElementById('modal');
  const shapes = {
    pen:'<path d="m16 3 5 5-12 12-6 1 1-6z"/><path d="m14 5 5 5M3 21h18"/>',
    book:'<path d="M3 4c4-1 6 0 9 2v15c-3-2-5-3-9-2zM21 4c-4-1-6 0-9 2v15c3-2 5-3 9-2z"/>',
    file:'<path d="M14 2H5v20h14V7zM14 2v6h5M8 12h8M8 16h6"/>',
    folder:'<path d="M3 5h6l2 3h10v12H3z"/>',
    layers:'<path d="m12 3 10 5-10 5L2 8zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    message:'<path d="M21 4H3v13h5l4 4 4-4h5zM7 9h10M7 13h7"/>',
    check:'<path d="m5 12 4 4L20 5"/>',
    chevron:'<path d="m8 10 4 4 4-4"/>',
    right:'<path d="m9 5 7 7-7 7"/>',
    plus:'<path d="M12 4v16M4 12h16"/>',
    spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM21 2v4M19 4h4"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .5-1.5 1-1.5 2M12 16v.1"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    quote:'<path d="M4 8h6v7H4V8l3-4M14 8h6v7h-6V8l3-4"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.1M3 12h.1M3 18h.1"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    cap:'<path d="m2 9 10-6 10 6-10 6zM6 12v6q6 5 12 0v-6M22 9v9"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 5V3H3v13h2"/>',
    upload:'<path d="M12 17V3m-4 4 4-4 4 4M4 16v5h16v-5"/>',
    home:'<path d="m3 10 9-8 9 8v11h-7v-7h-4v7H3z"/>',
    users:'<circle cx="9" cy="7" r="3"/><path d="M2 21v-4a7 7 0 0 1 14 0v4M17 4a3 3 0 0 1 0 6M19 13a6 6 0 0 1 3 5v3"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18M7 15h3M14 15h3"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    play:'<path d="m8 4 12 8-12 8z"/>',
    refresh:'<path d="M21 8a9 9 0 1 0 0 8M21 3v6h-6"/>',
    external:'<path d="M14 3h7v7M21 3l-9 9M10 3H3v18h18v-7"/>'
  };
  const icon = name => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+(shapes[name] || shapes.file)+'</svg>';
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cleanHtml = html => {
    const template = document.createElement('template'); template.innerHTML = html;
    const allowed = new Set(['P','BR','B','STRONG','I','EM','U','H2','H3','UL','OL','LI','BLOCKQUOTE']);
    const walk = node => Array.from(node.childNodes).forEach(child => {
      if (child.nodeType !== 1) return;
      if (['SCRIPT','STYLE','IFRAME','OBJECT','IMG','SVG','VIDEO','AUDIO'].includes(child.tagName)) {child.remove();return;}
      walk(child);
      if (!allowed.has(child.tagName)) child.replaceWith(...child.childNodes);
      else Array.from(child.attributes).forEach(a=>child.removeAttribute(a.name));
    });
    walk(template.content); return template.innerHTML;
  };
  const textFrom = html => {const el=document.createElement('div');el.innerHTML=cleanHtml(html);return el.textContent || '';};
  let stored = {}; try {stored=JSON.parse(localStorage.getItem(KEY) || '{}') || {};} catch (_) {}
  if(typeof stored !== 'object' || Array.isArray(stored)) stored={};
  const state={draftHtml:D.draftHtml,title:D.draftTitle,accepted:[],dismissed:[],view:'writing',role:'student',...stored};
  state.draftHtml=cleanHtml(typeof state.draftHtml==='string'?state.draftHtml:D.draftHtml);
  if(!Array.isArray(state.accepted))state.accepted=[];
  if(!Array.isArray(state.dismissed))state.dismissed=[];
  let assistantTab='suggestions',filter='all',toastTimer,saveTimer,previousFocus;
  const views={writing:['学术写作','把想法写清楚，让表达更进一步。','pen'],courses:['我的课程','从正在学习的课程开始。','book'],reading:['资料阅读','让每一次阅读，都有清楚的线索。','file'],sources:['文献与引用','把观点与可信的来源联系起来。','quote'],review:['复习与练习','找到重点，也找到适合自己的节奏。','layers'],feedback:['辅导反馈','把每一次建议，变成下一步行动。','message'],tutor:['辅导工作台','看见学生的进展，让指导更有针对性。','users']};
  const save = () => {try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){toast('浏览器暂时无法保存，请先导出您的草稿。');}};
  function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3800);}
  function openModal(title,html,onReady){previousFocus=document.activeElement;modal.innerHTML='<div class="modal-head"><h2 id="modal-title">'+escape(title)+'</h2><button class="icon-button" aria-label="关闭弹窗">'+icon('close')+'</button></div><div class="modal-content">'+html+'</div>';modal.querySelector('.modal-head button').onclick=closeModal;if(!modal.open)modal.showModal();if(onReady)onReady(modal);}
  function closeModal(){modal.close();if(previousFocus&&previousFocus.isConnected)previousFocus.focus();}
  modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
  const ctx={icon,toast,navigate,openModal,closeModal,state,save};
  function shell(){
    app.innerHTML='<header class="topbar"><button class="icon-button top-menu" aria-label="展开导航" aria-expanded="false">'+icon('menu')+'</button><a class="brand" href="#writing"><img src="./favicon.svg" alt=""><div class="brand-text">慧策学伴<span>SCHOLARFLOW</span></div></a><span class="top-caption">陪伴学习，也成就表达。</span><div class="top-actions"><span class="prototype-label">交互原型 · 示例数据</span><button class="icon-button" id="help-top" aria-label="原型使用说明">'+icon('help')+'</button><div class="top-role"><span class="avatar">林</span><select aria-label="切换体验角色"><option value="student">学生视图</option><option value="tutor">辅导老师视图</option></select><span class="chevron">'+icon('chevron')+'</span></div></div></header><aside class="sidebar" aria-label="主导航"><button class="new-document">'+icon('plus')+'新建文档</button><div class="nav-label">我的学习空间</div><nav>'+['writing','courses','reading','sources','review','feedback'].map(v=>'<button class="nav-item" data-nav="'+v+'">'+icon(views[v][2])+'<span>'+views[v][0]+'</span>'+(v==='feedback'?'<span class="nav-badge">2</span>':'')+'</button>').join('')+'</nav><div class="nav-label">最近打开</div><button class="recent-file" data-nav="writing">'+icon('file')+'<span>Digital feedback · 草稿</span></button><button class="recent-file" data-nav="reading">'+icon('file')+'<span>Research Methods · Week 4</span></button><div class="sidebar-bottom"><div class="usage-heading"><span>课程学习进度 · 示例</span><span>28%</span></div><div class="usage-track"><div></div></div><p class="sidebar-note">每一小步，都在接近目标。</p><button class="help-link" id="help-side">'+icon('help')+'使用说明与演示范围</button><div class="sidebar-footer">'+icon('lock')+'草稿保存在当前浏览器</div></div></aside><main class="main" id="main"><div class="breadcrumb">我的空间 '+icon('right')+'<span id="breadcrumb-title"></span></div><div class="page-heading"><div><h1 id="view-title"></h1><p id="view-description"></p></div><div class="page-actions" id="page-actions"></div></div><div id="page-content" tabindex="-1"></div></main>';
    app.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>navigate(b.dataset.nav));
    app.querySelector('.new-document').onclick=newDocument;
    app.querySelector('#help-top').onclick=help;app.querySelector('#help-side').onclick=help;
    app.querySelector('.top-menu').onclick=e=>{const opened=app.querySelector('.sidebar').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(opened));};
    app.querySelector('.top-role select').onchange=e=>{state.role=e.target.value;navigate(state.role==='tutor'?'tutor':'writing');};
  }
  function navigate(view,skipCapture){if(!views[view])view='writing';if(!skipCapture)captureDraft();state.view=view;if(view==='tutor')state.role='tutor';save();if(location.hash!=='#'+view)history.replaceState(null,'','#'+view);render();}
  function render(){
    const view=views[state.view]?state.view:'writing';state.view=view;if(view==='tutor')state.role='tutor';document.getElementById('main').classList.toggle('learning-main',!['writing','sources'].includes(view));
    app.querySelectorAll('.nav-item').forEach(b=>{b.classList.toggle('active',b.dataset.nav===view);if(b.dataset.nav===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    app.querySelector('.top-role select').value=state.role==='tutor'?'tutor':'student';
    app.querySelector('.sidebar').classList.remove('open');app.querySelector('.top-menu').setAttribute('aria-expanded','false');
    document.getElementById('view-title').textContent=views[view][0];document.getElementById('view-description').textContent=views[view][1];document.getElementById('breadcrumb-title').textContent=views[view][0];
    const actions=document.getElementById('page-actions');actions.innerHTML=view==='writing'?'<button class="button btn-secondary" id="assignment-button">'+icon('file')+'作业要求</button><button class="button btn-primary" id="export-button">'+icon('download')+'导出文档</button>':view==='sources'?'<button class="button btn-primary" id="upload-button">'+icon('upload')+'导入资料</button>':'';
    const root=document.getElementById('page-content');
    if(view==='writing'){root.innerHTML=writing();bindWriting(root);document.getElementById('assignment-button').onclick=showAssignment;document.getElementById('export-button').onclick=exportModal;}
    else if(view==='sources'){root.innerHTML=library();bindLibrary(root);document.getElementById('upload-button').onclick=importFile;}
    else if(window.SFLearning){root.innerHTML=window.SFLearning.render(view,ctx);window.SFLearning.bind(root,ctx);}
    else root.innerHTML='<p>课程工作区正在准备中。</p>';
  }
  function getPending(){const text=textFrom(state.draftHtml);return D.suggestions.filter(s=>!state.accepted.includes(s.id)&&!state.dismissed.includes(s.id)&&text.includes(s.original));}
  function textRange(root,needle){const index=root.textContent.indexOf(needle);if(index<0)return null;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node,offset=0,startNode,endNode,startOffset,endOffset;while((node=walker.nextNode())){const length=node.textContent.length;if(!startNode&&index<offset+length){startNode=node;startOffset=index-offset;}if(startNode&&index+needle.length<=offset+length){endNode=node;endOffset=index+needle.length-offset;break;}offset+=length;}if(!startNode||!endNode)return null;const range=document.createRange();range.setStart(startNode,startOffset);range.setEnd(endNode,endOffset);return range;}
  function markedHtml(){const temp=document.createElement('div');temp.innerHTML=state.draftHtml;getPending().forEach(s=>{const range=textRange(temp,s.original);if(!range)return;const mark=document.createElement('mark');mark.className=s.category;mark.dataset.suggestion=s.id;mark.append(range.extractContents());range.insertNode(mark);});return temp.innerHTML;}
  function writing(){return '<div class="writing-layout"><section class="editor-shell" aria-label="文档编辑器"><div class="document-header"><div class="document-name">'+icon('file')+'<span>'+escape(state.title)+'</span></div><span class="saved-state" id="saved-state">'+icon('check')+'已保存到本机</span></div><div class="editor-toolbar" role="toolbar" aria-label="文本格式"><span class="toolbar-label">正文</span>'+icon('chevron')+'<span class="toolbar-separator"></span><button data-format="bold" aria-label="加粗选中文字"><b>B</b></button><button data-format="italic" aria-label="倾斜选中文字"><i>I</i></button><button data-format="underline" aria-label="下划线选中文字"><u>U</u></button><span class="toolbar-separator"></span><button data-format="insertUnorderedList" aria-label="项目符号">'+icon('list')+'</button><button id="cite-toolbar" aria-label="打开引用">'+icon('quote')+'</button><span class="toolbar-note">English (UK) · APA 7</span></div><div class="paper"><div class="document-context"><span>ESSAY DRAFT</span>Academic Writing · 示例作业</div><h2 class="draft-title">'+escape(state.title)+'</h2><div class="draft-editor" id="draft-editor" contenteditable="true" role="textbox" aria-multiline="true" aria-label="英文写作草稿" spellcheck="false">'+markedHtml()+'</div></div><div class="document-footer"><span id="word-count">'+wordCount()+' words</span><span>自动保存 · 当前浏览器</span><button id="version-button">'+icon('clock')+'版本对照</button></div></section><div class="assistant-panel-wrap"><aside class="assistant-shell" aria-label="AI写作助手"><div class="assistant-heading"><span class="spark-icon">'+icon('spark')+'</span>AI 写作助手<span class="badge">演示</span></div><div class="assistant-tabs" role="tablist" aria-label="写作辅助"><button role="tab" data-tab="suggestions">修改建议</button><button role="tab" data-tab="chat">构思</button><button role="tab" data-tab="references">引用</button></div><div class="assistant-body" id="assistant-body"></div><div class="assistant-bottom">'+icon('lock')+'预设建议 · 不发送您的草稿</div></aside><div class="insight-callout">'+icon('cap')+'<div><h3>让反馈成为学习的起点</h3><p>结合课件、作业评语与练习，找到下一步值得关注的内容。</p><button id="open-review">查看课程复习</button></div></div></div></div>';}
  function wordCount(){return textFrom(state.draftHtml).trim().match(/\b[\w'-]+\b/g)?.length || 0;}
  function captureDraft(){const editor=document.getElementById('draft-editor');if(editor){state.draftHtml=cleanHtml(editor.innerHTML);save();}}
  function bindWriting(root){
    const editor=root.querySelector('#draft-editor');
    editor.addEventListener('input',()=>{state.draftHtml=cleanHtml(editor.innerHTML);document.getElementById('word-count').textContent=wordCount()+' words';document.getElementById('saved-state').textContent='正在保存…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>{save();const status=document.getElementById('saved-state');if(status)status.innerHTML=icon('check')+'已保存到本机';renderAssistant();},350);});
    editor.addEventListener('paste',e=>{e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'));});
    editor.addEventListener('drop',e=>{e.preventDefault();const text=e.dataTransfer?.getData('text/plain');if(text){editor.focus();document.execCommand('insertText',false,text);editor.dispatchEvent(new Event('input'));}});
    root.querySelectorAll('[data-format]').forEach(b=>{b.onmousedown=e=>e.preventDefault();b.onclick=()=>{editor.focus();document.execCommand(b.dataset.format,false);editor.dispatchEvent(new Event('input'));};});
    root.querySelector('#cite-toolbar').onclick=()=>{assistantTab='references';renderAssistant();};
    root.querySelector('#open-review').onclick=()=>navigate('review');root.querySelector('#version-button').onclick=showVersions;
    root.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{assistantTab=b.dataset.tab;renderAssistant();});renderAssistant();
  }
  function renderAssistant(){
    const body=document.getElementById('assistant-body');if(!body)return;
    app.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===assistantTab);b.setAttribute('aria-selected',String(b.dataset.tab===assistantTab));});
    const pending=getPending();
    if(assistantTab==='suggestions'){
      const items=pending.filter(s=>filter==='all'||s.category===filter);
      body.innerHTML='<div class="suggestion-summary"><span class="summary-count">发现 <b>'+pending.length+'</b> 条可改进之处</span><button class="btn-text" id="recheck" style="font-size:12px">重新检查</button></div><div class="suggestion-filter">'+[['all','全部'],['language','语言'],['argument','论证'],['citation','引用']].map(([v,l])=>'<button class="'+(filter===v?'active':'')+'" data-filter="'+v+'">'+l+'</button>').join('')+'</div><div class="assistant-scroll">'+(items.length?items.map(s=>'<article class="suggestion-card"><div class="suggestion-label"><span>'+escape(s.label)+'</span>'+icon('spark')+'</div><div class="suggestion-original">'+escape(s.original)+'</div><div class="suggestion-replacement">'+escape(s.replacement)+'</div><p class="suggestion-reason">'+escape(s.reason)+'</p><div class="suggestion-actions"><button class="accept-button" data-accept="'+s.id+'">'+icon('check')+'采纳修改</button><button class="dismiss-button" data-dismiss="'+s.id+'">暂时忽略</button></div></article>').join(''):'<div class="completion">'+icon('check')+'<h3>这部分建议已处理</h3><p>您可以继续编辑，或切换其他类型的建议。</p><p class="demo-hint">本原型只匹配示例草稿的预设建议，尚未接入实时AI分析。</p></div>')+'</div>';
      body.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;renderAssistant();});
      body.querySelectorAll('[data-accept]').forEach(b=>b.onclick=()=>acceptSuggestion(b.dataset.accept));
      body.querySelectorAll('[data-dismiss]').forEach(b=>b.onclick=()=>{state.dismissed.push(b.dataset.dismiss);save();renderAssistant();toast('已忽略这条示例建议。');});
      body.querySelector('#recheck').onclick=()=>{captureDraft();state.dismissed=[];save();renderAssistant();toast('已重新匹配示例建议。自由文本分析将在接入模型后开放。');};
    } else if(assistantTab==='chat'){
      body.innerHTML='<p style="font-size:14px;color:#81758e;line-height:1.8">从一个问题开始，梳理这篇文章的思路。</p><div class="chat-prompts">'+['生成写作提纲','如何强化论证','用中文解释'].map(t=>'<button data-prompt="'+t+'">'+t+'</button>').join('')+'</div><form class="chat-form"><label class="form-field" for="assistant-question">想讨论什么？</label><textarea id="assistant-question" placeholder="试试：帮我梳理这篇文章的提纲"></textarea><button class="button btn-primary" type="submit">'+icon('spark')+'查看示例建议</button></form><div id="chat-answer"></div><p class="demo-hint" style="margin:15px 0 0">预设问答演示，尚未连接大模型。</p>';
      body.querySelector('form').onsubmit=e=>{e.preventDefault();answer(body.querySelector('textarea').value);};body.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>{body.querySelector('textarea').value=b.dataset.prompt;answer(b.dataset.prompt);});
    } else {
      body.innerHTML='<p class="demo-hint" style="margin-bottom:6px">以下文献元数据已核实；具体引用内容请结合全文确认。</p>'+D.references.map(r=>'<article class="mini-reference"><span class="badge neutral">'+r.year+'</span><h3 style="margin-top:8px">'+escape(r.title)+'</h3><p>'+escape(r.authors)+'</p><button class="button btn-secondary" data-insert="'+r.id+'">'+icon('plus')+'插入引用</button><a href="'+r.url+'" target="_blank" rel="noopener noreferrer">查看来源</a></article>').join('');
      body.querySelectorAll('[data-insert]').forEach(b=>b.onclick=()=>insertCitation(b.dataset.insert));
    }
  }
  function answer(question){
    let html;
    if(/提纲|大纲|结构|outline/i.test(question))html='<strong>这篇示例草稿可以这样展开</strong><p>1. 引言：说明数字反馈为何值得研究，并提出中心问题。</p><p>2. 作用过程：从理解评语、尝试修改到反思迁移，逐步解释自主学习如何发生。</p><p>3. 条件与局限：讨论反馈清晰度、学生参与和辅导老师支持。</p><p>4. 结论：回应研究问题，明确结论的适用条件。</p>';
    else if(/论证|证据|argument/i.test(question))html='<strong>把判断、证据和解释连接起来</strong><p>先说明一个具体判断，再提供能够支持它的文献或材料，最后解释二者的关系。</p><p>文中的虚构学生案例可以帮助说明使用过程。要评价实际学习效果，还需要真实研究证据，并核对研究条件。</p>';
    else if(/中文|解释|翻译/i.test(question))html='<strong>用中文理解这篇草稿</strong><p>文章讨论学生怎样把数字化评语转化为自主学习行动。重点在于读懂建议、亲自修改并说明修改理由。</p><p>辅导老师可以在学生遇到困难时提供解释，平台则把草稿、反馈和修改过程组织在一起。</p>';
    else html='<strong>当前是预设问答演示</strong><p>您可以选择上方的“生成写作提纲”“如何强化论证”或“用中文解释”，查看相应交互。个性化问答将在接入模型和课程资料检索后提供。</p>';
    document.getElementById('chat-answer').innerHTML='<div class="chat-answer">'+html+'</div>';
  }
  function acceptSuggestion(id){captureDraft();const s=D.suggestions.find(x=>x.id===id);if(!s)return;const el=document.createElement('div');el.innerHTML=state.draftHtml;const range=textRange(el,s.original);if(!range){renderAssistant();toast('草稿已变化，这条建议暂时无法匹配。');return;}range.deleteContents();range.insertNode(document.createTextNode(s.replacement));state.draftHtml=el.innerHTML;state.accepted.push(id);save();render();toast('已采纳修改，并保存到当前浏览器。');}
  function insertCitation(id){captureDraft();const r=D.references.find(x=>x.id===id);if(!r)return;state.draftHtml+='<p>'+escape(r.apaShort)+'</p>';save();render();toast('已将 APA 短引加入草稿末尾，可继续编辑位置。');}
  function showAssignment(){const a=D.assignment;openModal('作业要求 · 示例','<p class="eyebrow">ACADEMIC WRITING</p><h3>'+escape(a.title)+'</h3><p>'+escape(a.description)+'</p><div class="assignment-grid"><div><strong>字数要求</strong>'+escape(a.wordLimit)+'</div><div><strong>引用格式</strong>'+escape(a.citationStyle)+'</div></div><h3>评分关注点</h3>'+a.criteria.map(c=>'<p><strong>'+escape(c.label)+' · '+escape(c.weight)+'</strong><br>'+escape(c.description)+'</p>').join('')+'<p class="demo-hint">'+escape(a.notice)+'</p>');}
  function showVersions(){captureDraft();openModal('修改对照','<p class="demo-hint">对照初始示例与当前草稿；当前已采纳 '+state.accepted.length+' 条建议。</p><h3>初始示例</h3><div style="font:15px/1.9 Georgia,serif;background:#faf7fb;padding:16px;border-radius:7px">'+D.draftHtml+'</div><h3 style="margin-top:24px">当前草稿</h3><div style="font:15px/1.9 Georgia,serif;background:#f3f8f6;padding:16px;border-radius:7px">'+state.draftHtml+'</div>');}
  function newDocument(){openModal('新建写作项目','<form id="new-form"><label class="form-field">文档标题<input name="title" required maxlength="140" placeholder="例如：Research proposal · 初稿"></label><label class="form-field">起始内容<select name="starter"><option value="blank">空白文档</option><option value="example">英文示例草稿</option></select></label><p class="demo-hint">当前原型保留一个活动草稿；新建前可先导出已有内容。</p><div class="modal-actions"><button type="button" class="button btn-secondary" id="new-cancel">取消</button><button class="button btn-primary" type="submit">创建文档</button></div></form>',root=>{root.querySelector('#new-cancel').onclick=closeModal;root.querySelector('form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.currentTarget),title=String(data.get('title')).trim();if(!title)return;state.title=title;state.draftHtml=data.get('starter')==='example'?D.draftHtml:'<p>Start writing your ideas here.</p>';state.accepted=[];state.dismissed=[];assistantTab='suggestions';filter='all';save();closeModal();navigate('writing',true);toast('已创建文档，可以开始编辑。');};});}
  function download(content,type,name){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);}
  function exportModal(){captureDraft();openModal('导出文档','<p>导出当前草稿，便于在本地继续修改。</p><label class="form-field">文件格式<select id="export-format"><option value="doc">Word 兼容文档（.doc）</option><option value="txt">纯文本（.txt）</option></select></label><p class="demo-hint">Word 兼容文档使用 HTML 文档格式，可由 Word 打开；原型尚未提供原生 DOCX 排版。</p><div class="modal-actions"><button class="button btn-secondary" id="export-cancel">取消</button><button class="button btn-primary" id="export-confirm">'+icon('download')+'下载文档</button></div>',root=>{root.querySelector('#export-cancel').onclick=closeModal;root.querySelector('#export-confirm').onclick=()=>{const format=root.querySelector('select').value;const filename=state.title.replace(/[\\/:*?"<>|]/g,'-').slice(0,90)||'ScholarFlow-draft';if(format==='txt')download(state.title+'\n\n'+textFrom(state.draftHtml),'text/plain;charset=utf-8',filename+'.txt');else download('\ufeff<html><head><meta charset="utf-8"><title>'+escape(state.title)+'</title></head><body style="font-family:Georgia;font-size:12pt;line-height:1.7"><h1>'+escape(state.title)+'</h1>'+state.draftHtml+'</body></html>','application/msword;charset=utf-8',filename+'.doc');closeModal();toast('文档已准备下载。');};});}
  function library(){return '<div class="library-toolbar"><label class="search-field">'+icon('search')+'<input id="reference-search" aria-label="检索示例文献" placeholder="搜索标题、作者或关键词"></label><span class="badge neutral">'+D.references.length+' 篇示例文献</span></div><div class="library-note">文献元数据已核实。点击“查看来源”访问出版页面；加入引用前，请结合全文确认具体论断。</div><div class="reference-list" id="reference-list"></div>';}
  function referenceCards(query){const refs=D.references.filter(r=>(r.title+' '+r.authors+' '+r.year).toLowerCase().includes(query.toLowerCase()));return refs.length?refs.map(r=>'<article class="reference-card"><div class="reference-icon">'+icon('file')+'</div><div class="reference-detail"><div class="reference-meta">'+escape(r.journal)+' · '+r.year+'</div><h2 style="margin-top:8px">'+escape(r.title)+'</h2><p>'+escape(r.authors)+'</p><p>'+escape(r.relevance)+'</p><span class="badge teal">元数据已核实</span><div class="reference-actions"><button class="button btn-secondary" data-copy="'+r.id+'">'+icon('copy')+'复制 APA 引用</button><button class="button btn-secondary" data-add="'+r.id+'">'+icon('plus')+'加入草稿</button><a class="button btn-secondary" href="'+r.url+'" target="_blank" rel="noopener noreferrer">'+icon('external')+'查看来源</a></div></div></article>').join(''):'<div class="empty-state">没有找到匹配的示例文献，请换一个关键词。</div>';}
  function bindLibrary(root){const update=()=>{root.querySelector('#reference-list').innerHTML=referenceCards(root.querySelector('input').value);root.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{const r=D.references.find(x=>x.id===b.dataset.copy);try{await navigator.clipboard.writeText(r.apa);toast('APA 引用已复制。');}catch(_){openModal('复制引用','<textarea aria-label="APA引用" style="width:100%;min-height:150px">'+escape(r.apa)+'</textarea>');}});root.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const r=D.references.find(x=>x.id===b.dataset.add);state.draftHtml+='<p>'+escape(r.apaShort)+'</p>';save();toast('已加入当前草稿末尾。');});};root.querySelector('input').oninput=update;update();}
  function importFile(){openModal('导入资料','<p>可以体验本地 TXT、Markdown 文件的文本导入，也可以直接打开预置的课程资料。</p><div class="upload-area">'+icon('upload')+'<br>选择本地资料<br><input type="file" id="local-file" aria-label="选择本地资料" accept=".txt,.md,.pdf,.docx,.pptx"></div><p id="import-status" class="import-status" role="status"></p><p class="demo-hint">文件不上传服务器。原型可读取 2 MB 以内的 TXT、Markdown；PDF、Word 和 PPT 的解析将在后端接入后提供。</p><div class="modal-actions"><button class="button btn-secondary" id="read-sample">打开课程示例资料</button></div>',root=>{root.querySelector('#read-sample').onclick=()=>{closeModal();navigate('reading');};root.querySelector('input').onchange=async e=>{const file=e.target.files[0];if(!file)return;const status=root.querySelector('#import-status');if(!/\.(txt|md)$/i.test(file.name)){status.textContent='已选择 '+file.name+'。该格式的解析尚未接入，可打开课程示例体验阅读。';return;}if(file.size>2*1024*1024){status.textContent='文件超过 2 MB，请选择较小的文本文件。';return;}const text=await file.text();state.importedText=text.slice(0,80000);state.importedName=file.name;save();status.textContent='已在当前浏览器读取 '+file.name+'。';const preview=document.createElement('pre');preview.style.cssText='white-space:pre-wrap;max-height:220px;overflow:auto;font-size:14px;line-height:1.8';preview.textContent=text.slice(0,4000);root.querySelector('.modal-content').append(preview);};});}
  function help(){openModal('欢迎体验慧策学伴','<p>把资料、写作与复习放在同一工作区，让辅导更连贯。</p><div class="help-grid"><div><strong>写作体验</strong><p>编辑英文草稿，逐条采纳建议，插入引用并导出文档。</p></div><div><strong>课程体验</strong><p>打开示例课件，查看带来源的复习重点，翻阅知识卡片并完成练习。</p></div><div><strong>辅导老师体验</strong><p>通过右上角切换视图，查看示例学生，审核计划并保存批注。</p></div><div><strong>本次原型范围</strong><p>使用虚构课程与学生数据、预设AI建议。编辑、练习和审核状态仅保存在当前浏览器；尚未接入真实登录、服务器、AI模型及在线支付。</p></div></div>');}
  window.addEventListener('hashchange',()=>{const v=location.hash.slice(1);if(views[v]&&v!==state.view)navigate(v);});
  window.addEventListener('pagehide',captureDraft);
  shell();const initial=location.hash.slice(1);if(views[initial])state.view=initial;if(!views[state.view])state.view='writing';render();
}());

(function () {
  'use strict';

  const paragraphs = [
    'Digital feedback are increasingly common in university courses. Students can receive comments on a draft while their ideas are still developing, rather than waiting until an assignment has been marked. It helps students improve their writing very quickly. However, receiving a comment and understanding how to use it are different stages of learning. A useful starting point is to connect each comment with the assignment criteria and a specific passage in the draft. Research shows that feedback is useful. The important question for this essay is how feedback can become a practical resource for independent learning.',
    'Consider a fictional student who receives the comment “explain the link between your evidence and your claim” on a short essay. A digital workspace could display the comment beside the relevant paragraph, show the assessment criterion, and invite the student to attempt a revision before opening a suggested example. The student could then compare versions and record what changed. This proves that technology always makes learners independent. In this illustrative case, independence develops through the learner’s decisions and reflection; the software provides a place to organise those activities. No student outcomes have been measured in this example.',
    'The tutor remains important when a comment is unclear or a revision introduces a new problem. Students should do something with the comments. A follow-up discussion can focus on why the revision works and how the same principle might apply to a later assignment. Nicol and Macfarlane-Dick (2006) offer a framework for considering feedback alongside self-regulated learning, while Carless and Boud (2018) examine student feedback literacy. These references provide starting points for further reading. A course-specific argument would also need evidence from the relevant learning context, together with careful attention to the opportunities students have to act on feedback.'
  ];

  const references = [
    {
      id: 'hattie-2007',
      authors: 'John Hattie & Helen Timperley',
      year: 2007,
      title: 'The Power of Feedback',
      journal: 'Review of Educational Research',
      volume: '77',
      issue: '1',
      pages: '81–112',
      doi: '10.3102/003465430298487',
      url: 'https://doi.org/10.3102/003465430298487',
      crossrefUrl: 'https://api.crossref.org/works/10.3102/003465430298487',
      citation: 'Hattie & Timperley, 2007',
      apaShort: '(Hattie & Timperley, 2007)',
      apa: 'Hattie, J., & Timperley, H. (2007). The power of feedback. Review of Educational Research, 77(1), 81–112. https://doi.org/10.3102/003465430298487',
      relevance: '可用于进一步阅读反馈的形式、使用条件与学习作用；不能据此直接推断本原型的使用效果。',
      status: 'Crossref 元数据已核实',
      verification: '作者、标题、年份、期刊与 DOI 已核实；未进行全文及具体引文页码核验。'
    },
    {
      id: 'nicol-2006',
      authors: 'David J. Nicol & Debra Macfarlane-Dick',
      year: 2006,
      title: 'Formative assessment and self-regulated learning: a model and seven principles of good feedback practice',
      journal: 'Studies in Higher Education',
      volume: '31',
      issue: '2',
      pages: '199–218',
      doi: '10.1080/03075070600572090',
      url: 'https://doi.org/10.1080/03075070600572090',
      crossrefUrl: 'https://api.crossref.org/works/10.1080/03075070600572090',
      citation: 'Nicol & Macfarlane-Dick, 2006',
      apaShort: '(Nicol & Macfarlane-Dick, 2006)',
      apa: 'Nicol, D. J., & Macfarlane-Dick, D. (2006). Formative assessment and self-regulated learning: A model and seven principles of good feedback practice. Studies in Higher Education, 31(2), 199–218. https://doi.org/10.1080/03075070600572090',
      relevance: '为“反馈与自主学习如何衔接”提供进一步阅读线索；具体论点需阅读原文后确定。',
      status: 'Crossref 元数据已核实',
      verification: '作者、标题、年份、期刊与 DOI 已核实；未进行全文及具体引文页码核验。'
    },
    {
      id: 'carless-2018',
      authors: 'David Carless & David Boud',
      year: 2018,
      title: 'The development of student feedback literacy: enabling uptake of feedback',
      journal: 'Assessment & Evaluation in Higher Education',
      volume: '43',
      issue: '8',
      pages: '1315–1325',
      doi: '10.1080/02602938.2018.1463354',
      url: 'https://doi.org/10.1080/02602938.2018.1463354',
      crossrefUrl: 'https://api.crossref.org/works/10.1080/02602938.2018.1463354',
      citation: 'Carless & Boud, 2018',
      apaShort: '(Carless & Boud, 2018)',
      apa: 'Carless, D., & Boud, D. (2018). The development of student feedback literacy: Enabling uptake of feedback. Assessment & Evaluation in Higher Education, 43(8), 1315–1325. https://doi.org/10.1080/02602938.2018.1463354',
      relevance: '为学生理解、判断和使用反馈的学习过程提供进一步阅读线索。',
      status: 'Crossref 元数据已核实',
      verification: '作者、标题、年份、期刊与 DOI 已核实；未进行全文及具体引文页码核验。'
    }
  ];

  window.SF_DATA = {
    draftTitle: 'How digital feedback supports independent learning',
    draftSubtitle: 'Academic Writing · Essay draft',
    draftHtml: paragraphs.map(function (text) { return '<p>' + text + '</p>'; }).join('\n'),
    draftText: paragraphs.join('\n\n'),
    draftWordCount: paragraphs.join(' ').trim().split(/\s+/).length,
    assignment: {
      title: 'Digital feedback and independent learning',
      course: 'Academic Writing',
      type: 'Argumentative essay',
      wordLimit: '1,200–1,500 words',
      citationStyle: 'APA 7',
      language: 'English',
      description: 'Discuss how digital feedback can support independent learning in higher education. Develop a clear argument, consider limitations, and distinguish examples from research evidence.',
      brief: '讨论数字化反馈如何支持大学生自主学习，并分析其适用条件与局限。',
      criteria: [
        { label: 'Argument & structure', weight: '35%', description: '提出清晰判断，让各段围绕同一个问题推进。' },
        { label: 'Evidence & critical thinking', weight: '35%', description: '使用可核实来源，区分研究证据、示例与个人解释。' },
        { label: 'Academic language', weight: '20%', description: '保持准确、自然的英文表达，并说明必要条件。' },
        { label: 'Referencing', weight: '10%', description: '按 APA 7 组织引用，并核对文献与实际论断的对应关系。' }
      ],
      notice: '虚构课程作业要求，仅用于交互演示。'
    },
    suggestions: [
      {
        id: 'subject-verb',
        category: 'language',
        label: '主谓一致',
        original: 'Digital feedback are increasingly common in university courses.',
        replacement: 'Digital feedback is increasingly common in university courses.',
        reason: 'Feedback 在这里是不可数名词，应搭配单数动词 is。'
      },
      {
        id: 'measured-claim',
        category: 'language',
        label: '让表达更准确',
        original: 'It helps students improve their writing very quickly.',
        replacement: 'It can help students revise their writing when comments identify a clear next step.',
        reason: '用具体条件和行动替代 very quickly，避免对改进速度作出缺少依据的判断。'
      },
      {
        id: 'illustration-boundary',
        category: 'argument',
        label: '区分示例与证据',
        original: 'This proves that technology always makes learners independent.',
        replacement: 'This example illustrates how a digital workspace may support independent learning when students actively use feedback.',
        reason: '这段是虚构示例，适合解释使用过程；它不能证明普遍效果。明确学生主动使用反馈这一条件。'
      },
      {
        id: 'specific-source',
        category: 'citation',
        label: '补充明确来源',
        original: 'Research shows that feedback is useful.',
        replacement: 'Hattie and Timperley (2007) discuss how the effectiveness of feedback depends on its form and conditions of use.',
        reason: '将笼统的 Research shows 改为明确作者与年份，并保留反馈效果所依赖的条件。正式提交前应阅读原文，核对该句与文献的对应关系。',
        sourceLabel: 'Hattie & Timperley, 2007',
        sourceId: 'hattie-2007'
      },
      {
        id: 'actionable-step',
        category: 'argument',
        label: '写清具体行动',
        original: 'Students should do something with the comments.',
        replacement: 'Students should identify one priority, revise a relevant passage, and explain the reason for the change.',
        reason: '把模糊的 do something 展开为可操作的学习步骤，使建议更容易理解和执行。'
      }
    ],
    references: references,
    tabs: [
      { id: 'language', label: '语言修改' },
      { id: 'argument', label: '论证建议' },
      { id: 'citation', label: '引用与来源' }
    ],
    sourceNotice: '写作内容与辅导建议为预设演示。3 篇文献的 Crossref 元数据已核实，未核验全文中的具体引文位置。',
    demoNotice: '交互原型 · 示例数据',
    prototype: true
  };
}());

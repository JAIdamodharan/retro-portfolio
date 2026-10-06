// ✏️ Edit your details here — everything on the page reads from this file.
export const profile = {
  name: 'JAISHREE DAMODHARAN',
  tagline: 'Software engineering student building secure, intelligent systems.',
  facts: ['MTech SE @ VIT', '2022–2027', 'CGPA 8.65', 'Open to opportunities'],
  location: 'Currently at VIT Vellore, India.',
  email: 'jai.shree.dam@gmail.com',
  resume: '/resume.pdf',
  github: 'https://github.com/JAIdamodharan',
  linkedin: 'https://www.linkedin.com/in/jaishree-damodharan',
}

export type Study = {
  kicker: string; problem: string; steps: string[]
  data: { source: string; split: [string, number][]; note: string }
  results: [string, string][]; checks: string; shipped: string; stack: string
}
export type Project = { title: string; line: string; stat: string; label: string; art: ArtKey; log: string[]; repo?: string; study?: Study }
export type ArtKey = 'deepfake' | 'reviews' | 'finance' | 'pods'

export const projects: Project[] = [
  {
    title: 'Deepfake Detection', line: 'Spots AI-generated fake images with a CNN.',
    stat: '93.85%', label: 'accuracy', art: 'deepfake', repo: 'https://github.com/JAIdamodharan/Deep_Fake_Detection',
    study: {
      kicker: 'CASE STUDY 01',
      problem: 'AI-generated faces are getting hard to spot, which makes impersonation and fraud easier. The goal: flag fake images automatically and report how confident the model is.',
      steps: ['Image 224×224', 'ResNeXt-50 (ImageNet)', 'Bi-LSTM × 2', 'Classifier', 'Real / Fake + confidence'],
      data: {
        source: '140K Real and Fake Faces (Kaggle) · 70K real, 70K fake',
        split: [['Train', 70], ['Validation', 15], ['Test', 15]],
        note: 'Resized to 224×224 · flips, ±10° rotation and colour jitter for augmentation',
      },
      results: [['93.85%', 'test accuracy'], ['0.9939', 'ROC-AUC'], ['0.9943', 'PR-AUC'], ['21,000', 'unseen test images']],
      checks: 'Accuracy alone is not enough for a security tool, so I also measured precision, recall, F1, calibration and where the model is confidently wrong.',
      shipped: 'Exported to PyTorch (.pth) and ONNX, ready for web deployment.',
      stack: 'Python · PyTorch · CNNs · OpenCV · Scikit-learn',
    },
    log: [
      '> WHAT  Telling real images from AI-made fakes',
      '> HOW   Python, PyTorch, CNNs, OpenCV · 140K images',
      '> WIN   93.85% accuracy · ROC-AUC 0.9939',
    ],
  },
  {
    title: 'Review Analysis', line: 'Big-data sentiment mining of e-commerce reviews.',
    stat: '85%', label: 'accuracy', art: 'reviews',
    log: [
      '> WHAT  Making sense of huge review datasets',
      '> HOW   Hadoop, MapReduce, TF-IDF, SVM, Naive Bayes',
      '> WIN   85% sentiment accuracy + trend dashboards',
    ],
  },
  {
    title: 'Secure Finance App', line: 'Full-stack money tracker, hardened against attacks.',
    stat: 'Secure', label: 'by design', art: 'finance', repo: 'https://github.com/JAIdamodharan/expense-tracker',
    log: [
      '> WHAT  Login, transactions and finance dashboards',
      '> HOW   PHP, MySQL, hashed passwords, safe queries',
      '> WIN   SQL-injection proof · users see only their data',
    ],
  },
  {
    title: 'Microgreen Pods', line: 'Solar-powered IoT irrigation for homes and anganwadis.',
    stat: 'Patent', label: 'filed', art: 'pods',
    log: [
      '> WHAT  Automatic watering for household microgreens',
      '> HOW   Soil + climate sensors, microcontrollers, solar',
      '> WIN   Co-inventor · Indian Patent App. 202541030147 (Jan 2026)',
    ],
  },
]

export const soon = {
  title: 'Next Quest',
  line: 'Currently learning AI & machine learning.',
  teaser: 'Exciting projects coming soon!',
  log: [
    '> NOW   Learning AI and machine learning',
    '> MOOD  Positive. Very positive.',
    '> NEXT  Exciting new projects, loading soon ★',
  ],
}

export const inventory = {
  skills: ['Java', 'Python', 'SQL', 'PyTorch', 'TensorFlow', 'OpenCV', 'NLP', 'Postman', 'GitHub'],
  badges: [
    'Software Dev Intern · NXTIO Technologies · 2025',
    'Google Cybersecurity Certificate',
    '100+ LeetCode problems',
  ],
}

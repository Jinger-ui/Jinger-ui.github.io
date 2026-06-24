(function (global) {
  var COVER_VER = "20260614b";

  var projects = [
    {
      slug: "ecogo",
      title: "EcoGo",
      role: "Capstone Technical Lead | NUS-ISS",
      year: "2026",
      category: "built",
      description: "EcoGo is a sustainability capstone that helps campus users choose lower-carbon travel options. As technical lead, I coordinated a six-member team building route-level carbon visibility, personalized recommendations, and an AI mobility assistant across mobile, backend, and data pipelines. The platform integrates NUS NextBus and Google Directions for emissions-aware routing, complemented by a LoRA-based RAG assistant powered by Elasticsearch and Kafka-driven document processing.",
      tags: ["Sustainability", "Kotlin", "Spring", "RAG", "Kafka"],
      image: "images/ecogo-cover.png?v=" + COVER_VER,
      imageAlt: "EcoGo - Your Green Campus Travel Companion",
      detailImages: [
        "images/ecogo-cover02.png?v=" + COVER_VER
      ],
      bullets: [
        "Led a six-member sustainability capstone for route-level carbon visibility, recommendations, and AI-assisted campus mobility.",
        "Built across React, Kotlin, Spring Boot, Python, MongoDB, MySQL, Redis, MinIO, Elasticsearch, Docker, SonarQube, JUnit, and GitHub Actions, personally owning Android, ML components, and CI/CD.",
        "Implemented low-carbon routing with NUS NextBus and Google Directions APIs, comparing route efficiency and estimated emissions.",
        "Designed a LoRA-based assistant with Ollama middleware plus RAG using Apache Tika, hybrid Elasticsearch retrieval, and Kafka-driven parsing, vectorization, and indexing."
      ]
    },
    {
      slug: "codex-code-book-platform",
      title: "Codex Code Book Web Platform",
      role: "Full-stack Developer | NUS-ISS",
      year: "2025",
      category: "built",
      description: "Codex is a full-stack programming reference CMS built for collaborative teams at NUS-ISS. I developed the React frontend, Spring Boot APIs, and SQL schema to support secure browsing, authoring, and management of coding resources. Spring Security with role-based access control ensures authenticated workflows, while Figma prototypes kept the interface consistent from design through implementation.",
      tags: ["React", "Spring Security", "SQL"],
      image: "images/codex-cover.png?v=" + COVER_VER,
      imageAlt: "Codex Code Book Web Platform cover",
      detailImages: [
        "images/codex-cover02.png?v=" + COVER_VER
      ],
      bullets: [
        "Built a full-stack programming reference CMS with React.js, Spring Boot, and SQL across UI, APIs, schema design, and CRUD flows.",
        "Created responsive components and Figma prototypes to keep navigation and interaction patterns consistent.",
        "Implemented Spring Security authentication and role-based access control within a collaborative GitHub workflow.",
        "Technology stack: React.js, JavaScript, HTML, CSS, Spring Boot, Spring Security, SQL, Git, GitHub, and Figma."
      ]
    },
    {
      slug: "flip-card-memory-game",
      title: "Flip Card Memory Game",
      role: "Android Developer | NUS-ISS",
      year: "2025",
      category: "built",
      description: "This Android memory matching game challenges players to find card pairs through flip animations, sound feedback, and responsive touch interactions. I implemented card-state logic, validation rules, and polish for match, mismatch, and completion events to support repeat play sessions. XML-based layouts and login flows were tested across varied device scenarios in Android Studio with Java.",
      tags: ["Java", "Android Studio", "XML"],
      image: "images/flipcard-cover.png?v=" + COVER_VER,
      imageAlt: "Flip Card Memory Game cover art",
      bullets: [
        "Developed a flip-card memory game in Java and Android Studio with clean card-state handling, gameplay validation, and responsive UI behavior.",
        "Added sound cues and polished match, mismatch, and completion feedback for repeated play sessions.",
        "Built login flows with XML layouts and tested a wide range of interaction and device scenarios.",
        "Technology stack: Android Studio, Java, XML, and mobile UI design."
      ]
    },
    {
      slug: "getfreshfood-application",
      title: "GetFreshFood Application",
      role: "UI/UX and Requirements | NUS-ISS",
      year: "2025",
      category: "designed",
      description: "GetFreshFood is a food-delivery application design focused on clarity, consistency, and user-centered workflows. I translated functional requirements into high-fidelity Figma prototypes with coherent navigation across ordering and account screens. Supporting SRS and UML artifacts—including use case, sequence, and class diagrams—plus relational normalization from 1NF to 3NF grounded the design in structured data planning.",
      tags: ["Figma", "PlantUML", "Normalization"],
      image: "images/getfreshfood-cover04.png?v=" + COVER_VER,
      imageAlt: "GetFreshFood Application UI design",
      detailImages: [
        "images/getfreshfood-cover.png?v=" + COVER_VER,
        "images/getfreshfood-cover02.png?v=" + COVER_VER,
        "images/getfreshfood-cover03.png?v=" + COVER_VER
      ],
      bullets: [
        "Designed user-centered workflows in Figma to improve usability and screen-to-screen consistency.",
        "Produced SRS artifacts and UML diagrams including use case, sequence, and class models in PlantUML.",
        "Applied relational normalization from 1NF to 3NF for structured data design documentation.",
        "Technology stack: Figma, PlantUML, UML, database design, and technical documentation."
      ]
    },
    {
      slug: "ci-cd-workflow-automation",
      title: "CI/CD Workflow Automation",
      role: "DevOps Engineer | NUS-ISS",
      year: "2025",
      category: "built",
      description: "This DevOps project defines an end-to-end CI/CD pipeline covering integration, automated build, deployment, release, and post-deployment monitoring. I established Git and GitHub branching practices to support reliable collaborative delivery and traceable releases. Automated testing and deployment stages reduced manual release effort while improving consistency across environments.",
      tags: ["GitHub", "Pipelines"],
      image: "images/CICD-cover.png?v=" + COVER_VER,
      imageAlt: "CI/CD Workflow Automation cover",
      bullets: [
        "Designed a full CI/CD flow covering integration, automated build, deployment, release, and post-deployment monitoring.",
        "Set up Git and GitHub branching, merge, and repository practices to support reliable release tracking.",
        "Reduced manual delivery work with automated testing and deployment pipelines.",
        "Technology stack: Git, GitHub, CI/CD, automated testing, and deployment automation."
      ]
    },
    {
      slug: "fruit-image-classification",
      title: "Fruit Image Classification",
      role: "ML Engineer | NUS-ISS",
      year: "2025",
      category: "built",
      description: "A deep learning pipeline classifies apple, banana, and orange images using TensorFlow and Keras with rigorous evaluation across lighting and background variation. I compared MobileNet, ResNet, and a custom CNN with transfer learning and hyperparameter tuning to maximize accuracy and robustness. The best configuration reached approximately 98% accuracy, supported by confusion matrices, precision-recall analysis, and error studies.",
      tags: ["TensorFlow", "Keras", "CNN"],
      image: "images/FruitClassifier-cover.png?v=" + COVER_VER,
      imageAlt: "Fruit Image Classification deep learning project cover",
      detailImages: [
        "images/FruitClassifier-cover02.png?v=" + COVER_VER,
        "images/FruitClassifier-cover03.png?v=" + COVER_VER,
        "images/FruitClassifier-cover04.png?v=" + COVER_VER
      ],
      bullets: [
        "Built a deep learning classification pipeline in Python, TensorFlow, and Keras for apples, bananas, and oranges.",
        "Compared MobileNet, ResNet, and a custom CNN with transfer learning and hyperparameter tuning.",
        "Reached about 98 percent accuracy with confusion matrices, precision-recall analysis, and error studies across varied lighting and backgrounds.",
        "Technology stack: Python, TensorFlow, Keras, CNNs, MobileNet, ResNet, NumPy, and Matplotlib."
      ]
    },
    {
      slug: "machine-learning-model-evaluation",
      title: "Machine Learning Model Evaluation",
      role: "ML Engineer | NUS-ISS",
      year: "2025",
      category: "explored",
      description: "A comparative machine learning study evaluates multiple algorithms through preprocessing, feature engineering, training, and performance benchmarking. Using Python, Pandas, and scikit-learn, I compared models on accuracy, classification metrics, and parameter sensitivity. NumPy and Matplotlib visualizations summarized trade-offs to support model selection and reporting.",
      tags: ["Pandas", "Scikit-learn"],
      image: "images/Grids-cover.png?v=" + COVER_VER,
      imageAlt: "Machine Learning Model Evaluation cover",
      detailImages: [
        "images/Grids-cover02.png?v=" + COVER_VER
      ],
      bullets: [
        "Evaluated multiple models with Python, Pandas, and scikit-learn through preprocessing, feature engineering, training, and comparison.",
        "Compared algorithms across accuracy, classification metrics, and parameter configurations.",
        "Generated charts and performance summaries with NumPy and Matplotlib.",
        "Technology stack: Python, Pandas, scikit-learn, NumPy, and Matplotlib."
      ]
    },
    {
      slug: "classroom-behavior-analytics-platform",
      title: "Classroom Behavior Analytics Platform",
      role: "Individual Project | XMUM",
      year: "2024",
      category: "built",
      description: "An end-to-end analytics platform monitors six classroom behaviors in high-density settings with 30+ students, addressing occlusion, viewpoint shifts, and identity fragmentation. YOLOv8 detection, face recognition, and ByteTrack provide temporally consistent tracking, with asynchronous event streaming into MySQL for engagement analysis. Delivery includes a PyQt5 real-time client, a web dashboard for batch review, and Docker plus CI/CD for deployment.",
      tags: ["YOLOv8", "ByteTrack", "MySQL", "Docker"],
      image: "images/Classbehavior-cover.png?v=" + COVER_VER,
      imageAlt: "Classroom Behavior Analytics Platform cover",
      detailImages: [
        "images/Classbehavior-cover02.png?v=" + COVER_VER
      ],
      bullets: [
        "Built end-to-end analytics for high-density classrooms handling occlusion, viewpoint shifts, and identity fragmentation for 30 plus students.",
        "Combined YOLOv8, face recognition, and ByteTrack to model six classroom behaviors with stronger temporal identity consistency.",
        "Streamed events asynchronously into MySQL for frequency, duration, confidence, and session engagement analysis.",
        "Delivered a PyQt5 real-time client, a web dashboard for batch review, plus Docker and CI/CD support for deployment."
      ]
    },
    {
      slug: "multimodal-attention-analysis-system",
      title: "Multimodal Attention Analysis System",
      role: "Individual Project | XMUM",
      year: "2024",
      category: "built",
      description: "This system analyzes student attention in restricted study and exam environments by synchronizing gaze estimation with object detection. YOLOv8 identifies laptops, tablets, phones, and papers while real-time gaze tracking measures focus under occlusion and pose variation. Attention scores combine region-of-interest alignment and focus-duration metrics to distinguish productive study from distraction or misconduct.",
      tags: ["YOLOv8", "Gaze Tracking"],
      image: "images/MultiStudenybehavior-cover.png?v=" + COVER_VER,
      imageAlt: "Multimodal Attention Analysis System cover",
      bullets: [
        "Created an attention monitoring system for restricted study and exam scenarios with timestamps, realtime visualization, and backend logging.",
        "Used YOLOv8 detection with realtime gaze estimation to track laptops, tablets, phones, and papers under occlusion and pose variation.",
        "Computed attention scores by synchronizing gaze with regions of interest and focus-duration metrics for study and misconduct hypotheses."
      ]
    },
    {
      slug: "defect-detection-for-power-transmission",
      title: "Defect Detection for Power Transmission",
      role: "Project Researcher | China Southern Power Grid",
      year: "2024",
      category: "researched",
      description: "Automated visual inspection for power transmission infrastructure detects insulator damage, bird nests, and corrosion in challenging outdoor scenes. I extended YOLOv8 into a custom CSG-YOLO variant with backbone and attention ablations tuned for small-defect recall. Curated datasets with fog, glare, and low-light augmentation supported field-oriented validation that improved maintenance planning efficiency.",
      tags: ["CSG-YOLO", "YOLOv8"],
      image: "images/Grids-cover.png?v=" + COVER_VER,
      imageAlt: "Defect Detection for Power Transmission cover",
      detailImages: [
        "images/Grids-cover02.png?v=" + COVER_VER
      ],
      bullets: [
        "Worked on automated visual inspection for insulators, nests, and corrosion in difficult outdoor transmission scenes.",
        "Extended YOLOv8 into a custom CSG-YOLO variant with ablations on backbone and attention modules for small-defect recall.",
        "Curated and augmented transmission-line datasets for fog, glare, and low-light conditions.",
        "Validated the approach in field-oriented testing to improve inspection efficiency and defect recall."
      ]
    },
    {
      slug: "parallelism-for-high-performance-processors",
      title: "Parallelism for High-Performance Processors",
      role: "Project Researcher | XMUM",
      year: "2024",
      category: "researched",
      description: "A systems research survey examines heterogeneous processors—including Apple M1, Tesla FSD, and NVIDIA H100—through power, performance, and parallelism trade-offs. Analysis covers hardware pipelines, neural-network scheduling, irregular workloads, and limits of automatic parallelization. Experiments with Rhino scheduling, DNN partitioning, and parallelized clustering benchmarks on Colab and Kaggle illustrate memory-wall and scaling constraints in AI silicon.",
      tags: ["Apple M1", "NVIDIA H100", "Rhino", "Colab"],
      image: "images/highperformance-subcover.png?v=" + COVER_VER,
      imageAlt: "Parallelism for High-Performance Processors research cover",
      detailImages: [
        "images/highperformance-cover.png?v=" + COVER_VER,
        "images/highperformance-cover02.png?v=" + COVER_VER
      ],
      bullets: [
        "Studied heterogeneous processors such as Apple M1, Tesla FSD, and NVIDIA H100 through a power-performance and parallelism lens.",
        "Analyzed hardware pipelines, neural-network scheduling, irregular workloads, and the limits of automatic parallelization.",
        "Evaluated Rhino scheduling, DNN partitioning, and parallelized clustering benchmarks on multi-core systems.",
        "Ran experiments in Colab and Kaggle while discussing memory-wall, contention, and scaling limits in AI silicon."
      ]
    },
    {
      slug: "privacy-preserving-financial-computing",
      title: "Privacy-Preserving Financial Computing",
      role: "Project Researcher | XMUM x Industrial Bank x Hyperfusion",
      year: "2023",
      category: "researched",
      description: "A privacy-preserving pipeline enables Industrial Bank credit records to migrate to Hyperfusion Cloud without exposing personal data. SecretFlow SPU supports federated and ciphertext-based ML workloads, while a React.js portal orchestrates distributed jobs and monitors shard execution. PSI preprocessing secures entity alignment and optimized three-party SPU graphs reduce communication rounds for risk scoring models.",
      tags: ["SecretFlow", "PSI", "Federated ML"],
      image: "images/PrivacyPreserving-cover.png?v=" + COVER_VER,
      imageAlt: "Privacy-Preserving Financial Computing cover",
      detailImages: [
        "images/PrivacyPreserving-cover02.png?v=" + COVER_VER,
        "images/PrivacyPreserving-cover03.png?v=" + COVER_VER
      ],
      bullets: [
        "Built a privacy-preserving pipeline for Industrial Bank credit records before migration to Hyperfusion Cloud.",
        "Used SecretFlow SPU to support ML and federated workloads on ciphertext without exposing personal data to the cloud.",
        "Developed a React.js portal to orchestrate tasks and monitor shard execution.",
        "Added PSI preprocessing for secure entity alignment and optimized the SPU execution graph to reduce communication rounds in three-party computation."
      ]
    },
    {
      slug: "credit-card-fraud-and-illegal-trading-analysis",
      title: "Credit Card Fraud and Illegal Trading Analysis",
      role: "Project Researcher | GUFE",
      year: "2023",
      category: "researched",
      description: "Risk analytics for regional governance identifies credit card fraud and illicit account trading patterns from structured transaction data. Standardized preprocessing handles outliers, normalization, and feature engineering for downstream machine learning detectors. Segment analysis across age and occupation supports differentiated monitoring and prevention strategies.",
      tags: ["Risk Analytics", "Machine Learning"],
      image: "images/CardFraud-cover.png?v=" + COVER_VER,
      imageAlt: "Credit Card Fraud and Illegal Trading Analysis cover",
      detailImages: [
        "images/CardFraud-cover-02.png?v=" + COVER_VER
      ],
      bullets: [
        "Analyzed fraud and illicit account trading patterns for regional governance and operational risk control.",
        "Standardized preprocessing for outliers, normalization, and structured feature creation.",
        "Applied machine learning to identify risk features and suspicious behavior patterns.",
        "Compared age and occupation segments to support a differentiated monitoring and prevention framework."
      ]
    },
    {
      slug: "bert-car-reviews-topic-and-sentiment",
      title: "BERT Car Reviews (Topic and Sentiment)",
      role: "Project Lead | EMIE 2023 | SPIE 12919",
      year: "2023",
      category: "researched",
      description: "As project lead, I built a BERT-based framework for automotive review topic and sentiment classification, published at EMIE 2023 (Proc. SPIE 12919). A custom summative attention mechanism with domain vocabulary injection and penalty loss for class imbalance improved topic accuracy from 0.676 to 0.816 and sentiment accuracy from 0.701 to 0.746. I owned the full pipeline from preprocessing and augmentation through training, validation, and baseline comparison.",
      tags: ["BERT", "NLP Publication"],
      image: "images/Bert-carreview-cover.png?v=" + COVER_VER,
      imageAlt: "BERT Car Reviews Topic and Sentiment cover",
      detailImages: [
        "images/Bert-carreview-cover02.png?v=" + COVER_VER
      ],
      bullets: [
        "Led a two-person team to build a BERT-based framework for automotive review topic and sentiment analysis.",
        "Introduced a custom summative attention mechanism with domain vocabulary injection and penalty loss for class imbalance.",
        "Owned the full pipeline from preprocessing and augmentation through training, validation, and baseline comparison.",
        "Improved topic accuracy from 0.676 to 0.816 and sentiment accuracy from 0.701 to 0.746, resulting in publication at EMIE 2023."
      ]
    },
    {
      slug: "campus-digital-twin-and-navigation",
      title: "Campus Digital Twin and Navigation",
      role: "Technical Lead | XMUM",
      year: "2023",
      category: "built",
      description: "Led an eight-person team over nine months to deliver a Unity-based campus digital twin for historical reconstruction, navigation, and interactive digital-human guidance. The platform manages 40+ optimized 3D models with LOD balancing, spatial wayfinding, multi-terminal deployment, and voice plus motion-enabled guides. Partner pilots across 10+ provinces and third prize in the Cross-Strait University IT competition validated real-world usability.",
      tags: ["Unity", "LOD", "Award-winning"],
      image: "images/TwinCampus-cover.png?v=" + COVER_VER,
      imageAlt: "Campus Digital Twin and Navigation cover",
      detailImages: [
        "images/TwinCampus-cover02.png?v=" + COVER_VER
      ],
      bullets: [
        "Led an eight-person team over nine months to build a Unity-based campus digital twin for historical reconstruction, navigation, and digital-human guidance.",
        "Managed 3D production, modular scenes, optimization, and cross-platform integration with LOD support across more than 40 models.",
        "Delivered spatial wayfinding, multi-terminal deployment, and voice plus motion support for the digital-human layer.",
        "Coordinated partner trials across more than 10 provinces and won third prize in the Cross-Strait University IT competition."
      ]
    },
    {
      slug: "rop-mitigation-framework",
      title: "ROP Mitigation Framework",
      role: "Contributor | IEEE ICSECS 2023",
      year: "2023",
      category: "explored",
      description: "Contributed to an IEEE ICSECS 2023 publication on return-oriented programming mitigation combining operating-system protections with hardware-assisted control-flow monitoring. The framework analyzes trade-offs among ASLR, DEP, and Intel LBR for branch anomaly detection in virtualized environments. A workflow integrating overflow mitigation, LBR analysis, and VMI improves visibility into indirect jumps and supports visualization-driven alerting.",
      tags: ["ASLR", "LBR", "VMI"],
      image: "images/Rop-cover.png?v=" + COVER_VER,
      imageAlt: "ROP Mitigation Framework cover",
      detailImages: [
        "images/Rop-cover02.png?v=" + COVER_VER
      ],
      bullets: [
        "Contributed to a return-oriented programming mitigation framework combining operating-system protections and hardware-assisted control-flow monitoring.",
        "Analyzed trade-offs across ASLR, DEP, and Intel LBR for branch anomaly detection.",
        "Defined a workflow that combined overflow mitigation, LBR analysis, and VMI for indirect-jump visibility in virtualized setups.",
        "Supported the resulting IEEE ICSECS 2023 publication and its visualization and alerting concept."
      ]
    }
  ];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stripHtml(text) {
    return String(text).replace(/<[^>]*>/g, "");
  }

  function renderCover(project, className) {
    if (project.image) {
      return (
        '<figure class="' +
        className +
        '"><img src="' +
        escapeHtml(project.image) +
        '" alt="' +
        escapeHtml(project.imageAlt || project.title) +
        '" width="1200" height="675" loading="lazy" decoding="async" /></figure>'
      );
    }

    return (
      '<div class="' +
      className +
      " " +
      className +
      '--placeholder"><span>' +
      escapeHtml(project.year) +
      "</span></div>"
    );
  }

  function renderGallery(project) {
    var images = project.detailImages || [];
    if (!images.length) return "";

    return (
      '<div class="project-gallery-grid">' +
      images
        .map(function (src, index) {
          return (
            '<figure class="project-gallery-item">' +
            '<img src="' +
            escapeHtml(src) +
            '" alt="' +
            escapeHtml((project.imageAlt || project.title) + " screenshot " + (index + 1)) +
            '" width="1200" height="675" loading="lazy" decoding="async" />' +
            "</figure>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function getBySlug(slug) {
    for (var i = 0; i < projects.length; i += 1) {
      if (projects[i].slug === slug) return projects[i];
    }
    return null;
  }

  global.JingjiaProjectData = {
    projects: projects,
    escapeHtml: escapeHtml,
    stripHtml: stripHtml,
    renderCover: renderCover,
    renderGallery: renderGallery,
    getBySlug: getBySlug
  };
})(window);

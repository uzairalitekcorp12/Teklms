const firstNames = ['Ayaan','Sara','Hassan','Ayesha','Zain','Hira','Ali','Maham','Usman','Noor','Hamza','Iqra','Bilal','Laiba','Saad','Anaya','Raza','Minal','Daniyal','Eman','Huzaifa','Areeba','Shayan','Mehak'];
const lastNames = ['Khan','Ahmed','Malik','Sheikh','Raza','Qureshi','Siddiqui','Ali','Baig','Farooq','Ansari','Iqbal','Soomro','Memon','Hashmi','Abbasi'];
const teachers = ['Ms. Hira Khan','Mr. Usman Ali','Mrs. Sara Ahmed','Mr. Bilal Raza','Ms. Maham Qureshi','Mr. Ahmed Shah','Ms. Noor Siddiqui','Mr. Zain Malik'];
const subjects = ['Mathematics','English','Physics','Chemistry','Computer Science','Biology','Pakistan Studies','Business Studies'];
const courseCodePool = ['MTH-201','PHY-210','CSC-220','ENG-205','PST-206','BIO-208'];

export const initialStudents = Array.from({length:96},(_,i)=>({
  id:`ST-${String(i+1).padStart(4,'0')}`,
  name:i===9?'Student Account':`${firstNames[i%firstNames.length]} ${lastNames[(i*5)%lastNames.length]}`,
  className:i===9?'Grade 10':`Grade ${8+(i%5)}`,
  section:i===9?'A':['A','B','C'][i%3],
  email:i===9?'muhammad.17388.ac@iqra.edu.pk':`student${i+1}@teklms.edu`,
  phone:i===9?'+923282626204':`+92 3${String(10+(i%89)).padStart(2,'0')} ${String(1000000+i*731).slice(-7)}`,
  guardian:`${firstNames[(i+7)%firstNames.length]} ${lastNames[(i*3)%lastNames.length]}`,
  attendance:82+(i%17),
  score:66+(i*7)%33,
  status:i%13===0?'On Leave':'Active',
  fee:i%6===0?'Due':'Paid',
  joined:`202${3+(i%4)}-${String(1+(i%9)).padStart(2,'0')}-${String(2+(i%24)).padStart(2,'0')}`,
  address:['Gulshan-e-Iqbal, Karachi','North Nazimabad, Karachi','PECHS, Karachi','Clifton, Karachi','DHA, Karachi'][i%5],
  courseCodes:i===9?['MTH-201','PHY-210','CSC-220','ENG-205']:courseCodePool.filter((_,courseIndex)=>(i+courseIndex)%3!==0).slice(0,4),
}));

export const initialClasses = Array.from({length:18},(_,i)=>({
  id:`CLS-${String(i+1).padStart(3,'0')}`,
  name:`Grade ${7+Math.floor(i/3)}`,
  section:['A','B','C'][i%3],
  subjects:6+(i%3),
  students:24+(i*4)%14,
  teacher:teachers[i%teachers.length],
  room:`${['A','B','C'][i%3]}-${101+i}`,
  schedule:['08:00 AM','09:30 AM','11:00 AM','12:30 PM','01:45 PM'][i%5],
  status:i%8===0?'Review':'Active'
}));

export const initialPayments = Array.from({length:54},(_,i)=>{
  const total=[50000,60000,45000,55000,65000][i%5];
  const paid=i%5===0?Math.round(total*.6):total;
  return {
    id:`PAY-${String(i+1).padStart(4,'0')}`,
    receipt:`RC-${202600+i}`,
    student:initialStudents[i%initialStudents.length].name,
    studentId:initialStudents[i%initialStudents.length].id,
    amount:total,
    paid,
    due:total-paid,
    date:`2026-09-${String(1+(i%28)).padStart(2,'0')}`,
    method:['Bank Transfer','Card','Cash','Online'][i%4],
    status:paid===total?'Paid':'Due'
  }
});

export const initialAnnouncements = [
  {id:'ANN-001',title:'Mid-term examination schedule published',body:'The mid-term examination schedule is now available in the academic calendar. Students should review dates and reporting times carefully.',meta:'Academic Office · 2 hours ago',tag:'Academic',audience:'All Students',read:false},
  {id:'ANN-002',title:'Parent-teacher meeting registrations are open',body:'Appointment windows are available for the upcoming parent-teacher meeting. Families can select a preferred time through the student portal.',meta:'Administration · Today',tag:'Event',audience:'Parents',read:false},
  {id:'ANN-003',title:'Fee submission deadline reminder',body:'The current fee cycle closes on September 15. Please review outstanding balances before the deadline.',meta:'Accounts · Yesterday',tag:'Fees',audience:'All Students',read:true},
  {id:'ANN-004',title:'New digital library resources added',body:'New mathematics, science and computing resources have been added to the resource library.',meta:'Library · 2 days ago',tag:'Resources',audience:'All Students',read:true},
  {id:'ANN-005',title:'Computer lab maintenance window',body:'Computer Lab 2 will be unavailable on Saturday between 10:00 AM and 2:00 PM for scheduled maintenance.',meta:'IT Office · 3 days ago',tag:'IT',audience:'Grade 10-12',read:true},
  {id:'ANN-006',title:'Inter-class sports registrations',body:'Registration for football, cricket and badminton teams is now open through Student Affairs.',meta:'Student Affairs · 4 days ago',tag:'Sports',audience:'All Students',read:true}
];

export const initialLiveSessions = [];

export const initialMessages = [
  {id:'MSG-001',recipient:'Parents of Grade 9',message:'Your child’s monthly attendance summary is now available in TekLMS.',status:'Delivered',sentAt:'Sep 09, 10:24 AM'},
  {id:'MSG-002',recipient:'Fee Due Students',message:'Please review your current fee balance and due date in the student portal.',status:'Delivered',sentAt:'Sep 08, 03:18 PM'},
  {id:'MSG-003',recipient:'Grade 10 - Section A',message:'Tomorrow’s Physics lab will begin at 9:00 AM in Lab 2.',status:'Delivered',sentAt:'Sep 07, 01:10 PM'},
];

export const courses = [
  {code:'MTH-201',title:'Mathematics II',teacher:'Ms. Hira Khan',progress:74,color:'teal',next:'Problem solving · Tue, 10:30 AM',lessons:24,completed:18,description:'Functions, analytical geometry, mathematical modelling and problem solving.',resources:['Chapter 6 Notes','Practice Set 12','Formula Sheet']},
  {code:'PHY-210',title:'Physics',teacher:'Mr. Usman Ali',progress:61,color:'violet',next:'Waves · Wed, 9:00 AM',lessons:21,completed:13,description:'Mechanics, waves, energy, electricity and practical laboratory concepts.',resources:['Waves Lab Guide','Numericals Pack','Motion Revision']},
  {code:'CSC-220',title:'Computer Science',teacher:'Mr. Bilal Raza',progress:88,color:'green',next:'Arrays · Thu, 12:00 PM',lessons:25,completed:22,description:'Programming logic, data structures, web fundamentals and computational thinking.',resources:['Array Exercises','Logic Worksheet','Project Brief']},
  {code:'ENG-205',title:'English Language',teacher:'Ms. Sara Ahmed',progress:79,color:'orange',next:'Writing · Fri, 11:15 AM',lessons:19,completed:15,description:'Reading, writing, grammar, presentation and communication practice.',resources:['Essay Framework','Grammar Review','Reading Pack']},
  {code:'PST-206',title:'Pakistan Studies',teacher:'Mr. Ahmed Shah',progress:68,color:'cyan',next:'Constitutional history · Fri, 1:00 PM',lessons:18,completed:12,description:'History, constitutional development, geography and civic understanding.',resources:['Timeline Notes','Map Activity','Revision Questions']},
  {code:'BIO-208',title:'Biology',teacher:'Ms. Noor Siddiqui',progress:72,color:'rose',next:'Cell division · Mon, 9:30 AM',lessons:22,completed:16,description:'Cell biology, genetics, human systems and practical observations.',resources:['Cell Diagram Pack','Genetics Notes','Lab Worksheet']}
];

export const initialAssignments = [
  {id:'AS-001',title:'Algebra Practice Set',subject:'Mathematics',due:'Sep 12, 2026',status:'Pending',score:'—',priority:'High',instructions:'Complete questions 1–18 and show the working for every step.'},
  {id:'AS-002',title:'Literature Reflection',subject:'English',due:'Sep 13, 2026',status:'Submitted',score:'—',priority:'Medium',instructions:'Write a 600-word reflection on the assigned reading.'},
  {id:'AS-003',title:'Physics Lab Report',subject:'Physics',due:'Sep 14, 2026',status:'Pending',score:'—',priority:'High',instructions:'Submit observations, calculations and a short conclusion.'},
  {id:'AS-004',title:'Pakistan Studies Essay',subject:'Pakistan Studies',due:'Sep 16, 2026',status:'Graded',score:'86/100',priority:'Medium',instructions:'Discuss constitutional developments with references.'},
  {id:'AS-005',title:'Programming Exercise',subject:'Computer Science',due:'Sep 17, 2026',status:'Graded',score:'94/100',priority:'High',instructions:'Complete the array manipulation exercise.'},
  {id:'AS-006',title:'Chemistry Worksheet',subject:'Chemistry',due:'Sep 18, 2026',status:'Submitted',score:'—',priority:'Medium',instructions:'Complete the worksheet on atomic structure.'},
  {id:'AS-007',title:'Biology Diagram',subject:'Biology',due:'Sep 20, 2026',status:'Pending',score:'—',priority:'Low',instructions:'Label the cell division stages clearly.'},
  {id:'AS-008',title:'Business Case Study',subject:'Business Studies',due:'Sep 21, 2026',status:'Pending',score:'—',priority:'Medium',instructions:'Analyze the provided business case and propose two improvements.'}
];

export const timetable = {
  Mon:[['08:00','Mathematics','Room A-201','Ms. Hira Khan'],['09:30','Biology','Lab 3','Ms. Noor Siddiqui'],['11:00','English','Room C-104','Ms. Sara Ahmed'],['12:30','Computer Science','Lab 1','Mr. Bilal Raza']],
  Tue:[['08:00','Physics','Lab 2','Mr. Usman Ali'],['09:30','Pakistan Studies','Room B-206','Mr. Ahmed Shah'],['11:00','Mathematics','Room A-201','Ms. Hira Khan'],['12:30','English','Room C-104','Ms. Sara Ahmed']],
  Wed:[['08:00','Mathematics','Room A-201','Ms. Hira Khan'],['09:00','Physics','Lab 2','Mr. Usman Ali'],['10:30','English','Room C-104','Ms. Sara Ahmed'],['12:00','Computer Science','Lab 1','Mr. Bilal Raza'],['01:30','Pakistan Studies','Room B-206','Mr. Ahmed Shah']],
  Thu:[['08:00','Biology','Lab 3','Ms. Noor Siddiqui'],['09:30','Mathematics','Room A-201','Ms. Hira Khan'],['11:00','Computer Science','Lab 1','Mr. Bilal Raza'],['12:30','Physics','Lab 2','Mr. Usman Ali']],
  Fri:[['08:00','English','Room C-104','Ms. Sara Ahmed'],['09:30','Pakistan Studies','Room B-206','Mr. Ahmed Shah'],['11:00','Mathematics','Room A-201','Ms. Hira Khan'],['12:30','Biology','Lab 3','Ms. Noor Siddiqui']]
};

export const adminModules = [
  {key:'dashboard',label:'Dashboard'}, {key:'academic',label:'Academic'}, {key:'lectures',label:'Lectures'}, {key:'liveSessions',label:'Live Sessions'}, {key:'registrations',label:'Registrations'}, {key:'students',label:'Students'}, {key:'administration',label:'Administration'}, {key:'accounts',label:'Accounts'}, {key:'whatsapp',label:'Communication'}, {key:'reports',label:'Reports'}, {key:'settings',label:'Settings'}
];

export const studentModules = [
  {key:'overview',label:'Overview'}, {key:'courses',label:'My Courses'}, {key:'lectures',label:'Lectures'}, {key:'liveSessions',label:'Live Classes'}, {key:'schedule',label:'Schedule'}, {key:'assignments',label:'Assignments'}, {key:'results',label:'Exams & Results'}, {key:'attendance',label:'Attendance'}, {key:'fees',label:'Fees'}, {key:'announcements',label:'Announcements'}, {key:'profile',label:'Profile'}
];

export const reportCards = [
  {id:'R-01',title:'Academic Performance',description:'Subject averages, grade movement and class performance.',value:'82.4%',trend:'+4.8%',type:'Academic'},
  {id:'R-02',title:'Attendance Overview',description:'Attendance health by class, section and month.',value:'94.2%',trend:'+1.6%',type:'Attendance'},
  {id:'R-03',title:'Fee Collection',description:'Collections, outstanding balances and payment methods.',value:'PKR 1.25M',trend:'+12.1%',type:'Finance'},
  {id:'R-04',title:'Admissions',description:'New admissions, active records and class distribution.',value:'86',trend:'+9 this week',type:'Admissions'},
  {id:'R-05',title:'Communication',description:'Messages sent, recipient coverage and delivery history.',value:'1,482',trend:'+18.6%',type:'Communication'},
  {id:'R-06',title:'Course Completion',description:'Course progress and assignment completion indicators.',value:'76.8%',trend:'+3.1%',type:'Learning'}
];

export const pexels = {
  hero:'https://images.pexels.com/photos/8199165/pexels-photo-8199165.jpeg?auto=compress&cs=tinysrgb&w=1600',
  classroom:'https://images.pexels.com/photos/8197511/pexels-photo-8197511.jpeg?auto=compress&cs=tinysrgb&w=1200',
  teamwork:'https://images.pexels.com/photos/8518812/pexels-photo-8518812.jpeg?auto=compress&cs=tinysrgb&w=1200',
  student:'https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=1000',
  library:'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1200'
};

export const defaultSettings = {
  institutionName:'TekLMS Academy',
  academicYear:'2026–2027',
  term:'Fall Term',
  timezone:'Asia/Karachi',
  emailNotifications:true,
  parentAlerts:true,
  attendanceAlerts:true,
  feeReminders:true,
  weeklySummary:true,
  profileVisibility:true,
  glassEffects:true,
  gradientText:true,
  workspaceDensity:'comfortable',
  mediaContextProtection:true,
  mediaDragProtection:true,
  shortcutProtection:true,
  printProtection:true,
  capturePrivacyVeil:true,
  dynamicWatermarks:true
};

export const defaultProfile = {
  name:'Student Account',
  id:'ST-0010',
  grade:'Grade 10 — Section A',
  email:'muhammad.17388.ac@iqra.edu.pk',
  phone:'+923282626204',
  address:'Karachi, Pakistan',
  guardian:'Mr. Ahmed Khan',
  courseCodes:['MTH-201','PHY-210','CSC-220','ENG-205']
};

export const initialLectures = [
  {id:'LEC-001',courseCode:'MTH-201',course:'Mathematics II',title:'Problem-Solving Roadmap',lesson:8,teacher:'Ms. Hira Khan',duration:'18 min',status:'Published',published:'Sep 09, 2026',audience:'Grade 10 — A',audienceScope:'course',description:'Build a clear approach for translating mathematical questions into accurate, well-explained solutions.',progress:68,completed:false,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/6238048/pexels-photo-6238048.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-002',courseCode:'MTH-201',course:'Mathematics II',title:'Functions and Graph Behaviour',lesson:7,teacher:'Ms. Hira Khan',duration:'24 min',status:'Published',published:'Sep 07, 2026',audience:'Grade 10 — A',description:'Read, compare and interpret functions through graph transformations and domain-range analysis.',progress:100,completed:true,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-003',courseCode:'PHY-210',course:'Physics',title:'Waves: Frequency and Amplitude',lesson:6,teacher:'Mr. Usman Ali',duration:'21 min',status:'Published',published:'Sep 08, 2026',audience:'Grade 10 — A',description:'A practical introduction to wave properties, frequency, amplitude and measurement.',progress:42,completed:false,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/60582/newton-s-cradle-balls-sphere-action-60582.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-004',courseCode:'CSC-220',course:'Computer Science',title:'Arrays and Indexing',lesson:10,teacher:'Mr. Bilal Raza',duration:'27 min',status:'Published',published:'Sep 08, 2026',audience:'Grade 10 — A',description:'Build a strong mental model for arrays, indexes, traversal and common data operations.',progress:15,completed:false,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-005',courseCode:'ENG-205',course:'English Language',title:'Structured Academic Writing',lesson:5,teacher:'Ms. Sara Ahmed',duration:'19 min',status:'Published',published:'Sep 06, 2026',audience:'Grade 10 — A',description:'Plan paragraphs, create stronger topic sentences and connect evidence to a clear argument.',progress:100,completed:true,secure:true,watermark:true,focusGuard:false,poster:'https://images.pexels.com/photos/261949/pexels-photo-261949.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-006',courseCode:'BIO-208',course:'Biology',title:'Cell Division Overview',lesson:7,teacher:'Ms. Noor Siddiqui',duration:'23 min',status:'Published',published:'Sep 05, 2026',audience:'Grade 10 — A',description:'Follow the stages of cell division with labelled visual checkpoints and revision prompts.',progress:74,completed:false,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-007',courseCode:'PST-206',course:'Pakistan Studies',title:'Constitutional Development',lesson:6,teacher:'Mr. Ahmed Shah',duration:'25 min',status:'Published',published:'Sep 04, 2026',audience:'Grade 10 — A',description:'Trace major constitutional milestones and the ideas that shaped institutional development.',progress:0,completed:false,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/159832/justice-law-case-hearing-159832.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-008',courseCode:'PHY-210',course:'Physics',title:'Energy and Work',lesson:7,teacher:'Mr. Usman Ali',duration:'22 min',status:'Scheduled',published:'Sep 11, 2026',audience:'Grade 10 — A',description:'Connect work, kinetic energy and potential energy through worked numerical examples.',progress:0,completed:false,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-009',courseCode:'CSC-220',course:'Computer Science',title:'Searching Collections',lesson:11,teacher:'Mr. Bilal Raza',duration:'28 min',status:'Scheduled',published:'Sep 12, 2026',audience:'Grade 10 — A',description:'Compare linear and binary search and learn when each approach is appropriate.',progress:0,completed:false,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-010',courseCode:'MTH-201',course:'Mathematics II',title:'Mathematical Modelling Workshop',lesson:9,teacher:'Ms. Hira Khan',duration:'31 min',status:'Scheduled',published:'Sep 13, 2026',audience:'Grade 10 — A',audienceScope:'course',description:'Translate real situations into mathematical models and evaluate solutions with worked examples.',progress:0,completed:false,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/6238048/pexels-photo-6238048.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-011',courseCode:'ENG-205',course:'English Language',title:'Evidence and Analysis',lesson:6,teacher:'Ms. Sara Ahmed',duration:'20 min',status:'Published',published:'Sep 03, 2026',audience:'Grade 10 — A',description:'Use textual evidence accurately and build analysis that explains why the evidence matters.',progress:35,completed:false,secure:true,watermark:true,focusGuard:false,poster:'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'LEC-012',courseCode:'BIO-208',course:'Biology',title:'Genetics: Core Vocabulary',lesson:8,teacher:'Ms. Noor Siddiqui',duration:'26 min',status:'Published',published:'Sep 02, 2026',audience:'Grade 10 — A',description:'Master genes, alleles, genotype, phenotype and the language used in inheritance questions.',progress:100,completed:true,secure:true,watermark:true,focusGuard:true,poster:'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=1200'}
];

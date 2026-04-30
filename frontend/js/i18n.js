// Internationalization (i18n) - Language translations
const translations = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_about: 'About',
    nav_education: 'Education',
    nav_skills: 'Skills',
    nav_portfolio: 'Portfolio',
    nav_contact: 'Contact',

    // Hero Section
    hero_hello: "Hello, It's Me",
    hero_name: 'Alemenew Dubie',
    hero_and: "And I'm a",
    hero_description: 'A passionate Software Engineer with strong problem-solving skills and a focus on building efficient, scalable applications.',
    hero_download_cv: 'Download CV',

    // Typing animation roles
    role_frontend: 'Full-Stack Web Developer',
    role_designer: 'Problem Solver',
    role_ux: 'Software Engineer',
    role_solver: 'Problem Solver',

    // About Section
    about_title: 'About',
    about_me: 'Me',
    about_im: "I'm a",
    about_frontend: 'Full-stack web Developer',
    about_description_1: 'I am an experienced Software Engineer with a strong background in system development and modern technologies. My expertise includes Artificial Intelligence (AI) and Machine Learning (ML), where I enjoy building intelligent solutions that solve real-world problems.',
    about_description_2: 'I have strong analytical and problem-solving skills, allowing me to design efficient, scalable, and reliable applications. With a natural ability to learn quickly and adapt to new challenges, I continuously improve my technical skills and stay updated with emerging technologies.',
    about_read_more: 'Read More',

    // Education Section
    education_title: 'My',
    education_education: 'Education',
    education_certifications: 'Certifications & Awards',

    // Skills Section
    skills_title: 'My',
    skills_skills: 'Skills',

    // Projects Section
    projects_title: 'Latest',
    projects_projects: 'Projects',
    projects_loading: 'Loading projects...',
    projects_no_projects: 'No projects yet. Check back soon!',
    projects_error: 'Error loading projects. Please try again later.',
    projects_tech: 'Tech:',
    projects_code: 'Code',
    projects_live: 'Live',

    // Contact Section
    contact_title: 'Contact',
    contact_me: 'Me',
    contact_name: 'Full Name',
    contact_email: 'Email Address',
    contact_subject: 'Subject',
    contact_message: 'Your Message',
    contact_send: 'Send Message',
    contact_attach: 'Attach files (optional)',
    contact_drop_files: 'Click to select or drag & drop files here',
    contact_get_in_touch: 'GET IN TOUCH',
    contact_lets_work: "Let's work together",
    contact_intro: "I'm open to freelance opportunities, internships, and full-time positions in software engineering and web development. Feel free to reach out!",
    contact_label_email: 'Email',
    contact_label_phone: 'Phone',
    contact_label_location: 'Location',
    contact_label_name: 'Full Name',
    contact_label_email_addr: 'Email Address',
    contact_label_subject: 'Subject',
    contact_label_message: 'Message',
    contact_success: 'Message sent successfully!',
    contact_error: 'Error sending message. Please try again.',
    contact_network_error: 'Network error. Please try again.',
    contact_sending: 'Sending...',

    // Footer
    footer_rights: 'All rights reserved.',
    footer_admin: 'Admin',

    // Admin Page
    admin_title: 'Portfolio Admin',
    admin_upload_images: 'Upload Images',
    admin_view_portfolio: 'View Portfolio',
    admin_add_project: 'Add New Project',
    admin_project_title: 'Project Title',
    admin_description: 'Description',
    admin_technologies: 'Technologies Used',
    admin_github: 'GitHub URL',
    admin_live_demo: 'Live Demo URL',
    admin_project_image: 'Project Image',
    admin_browse: 'Browse',
    admin_add_button: 'Add Project',
    admin_your_projects: 'Your Projects',
    admin_loading: 'Loading projects...',
    admin_no_projects: 'No projects yet. Add your first project!',
    admin_delete: 'Delete project',
    admin_added: 'Added:',
    admin_select_image: 'Select Project Image',
    admin_no_images: 'No project images uploaded yet.',
    admin_upload_first: 'Upload images first',
    admin_success: 'Project added successfully!',
    admin_delete_success: 'Project deleted successfully!',
    admin_delete_confirm: 'Are you sure you want to delete',

    // Contact Messages
    contacts_title: 'Contact Messages',
    contacts_unread: 'Unread',
    contacts_all: 'All Messages',
    contacts_filter_all: 'All',
    contacts_filter_unread: 'Unread',
    contacts_filter_read: 'Read',
    contacts_filter_replied: 'Replied',
    contacts_from: 'From:',
    contacts_email: 'Email:',
    contacts_subject: 'Subject:',
    contacts_date: 'Date:',
    contacts_message: 'Message:',
    contacts_response: 'Your Response:',
    contacts_response_placeholder: 'Type your response here...',
    contacts_mark_read: 'Mark as Read',
    contacts_mark_unread: 'Mark as Unread',
    contacts_send_response: 'Send Response',
    contacts_delete: 'Delete Message',
    contacts_delete_confirm: 'Are you sure you want to delete this message?',
    contacts_no_messages: 'No contact messages yet.',
    contacts_loading: 'Loading messages...',
    contacts_response_sent: 'Response sent successfully!',
    contacts_status_updated: 'Status updated successfully!',
    contacts_deleted: 'Message deleted successfully!',
    contacts_error: 'Error loading messages. Please try again.',

    // Upload Page
    upload_title: 'Upload Images',
    upload_admin_panel: 'Admin Panel',
    upload_home: 'Home',
    upload_logo: 'Upload Logo',
    upload_profile: 'Upload Profile Image',
    upload_project: 'Upload Project Image',
    upload_select_logo: 'Select Logo Image',
    upload_select_profile: 'Select Profile Image',
    upload_select_project: 'Select Project Image',
    upload_project_name: 'Project Name',
    upload_button: 'Upload',
    upload_uploaded_images: 'Uploaded Images',
    upload_loading: 'Loading images...',
    upload_no_images: 'No images uploaded yet',
    upload_delete: 'Delete',
    upload_success: 'Image uploaded successfully! Path:',
    upload_error: 'Upload failed',
    upload_delete_confirm: 'Are you sure you want to delete this image?',
    upload_delete_success: 'Image deleted successfully',
    upload_delete_error: 'Failed to delete image',
  },

  am: {
    // Navigation (Amharic)
    nav_home: 'መነሻ',
    nav_about: 'ስለኔ',
    nav_education: 'ትምህርት',
    nav_skills: 'ክህሎቶች',
    nav_portfolio: 'ስራዎች',
    nav_contact: 'አግኙኝ',

    // Hero Section
    hero_hello: 'ሰላም፣ እኔ ነኝ',
    hero_name: 'አለምነው ዱቤ',
    hero_and: 'እና እኔ',
    hero_description: 'ጠንካራ የችግር መፍቻ ክህሎቶች ያለው እና ውጤታማ እና ሊስፋፉ የሚችሉ መተግበሪያዎችን በመገንባት ላይ ያተኮረ ጠንካራ ሶፍትዌር ኢንጂነር።',
    hero_download_cv: 'ሲቪ አውርድ',

    // Typing animation roles
    role_frontend: 'ሙሉ-ስታክ ዌብ ገንቢ',
    role_designer: 'ችግር ፈቺ',
    role_ux: 'ሶፍትዌር ኢንጂነር',
    role_solver: 'ችግር ፈቺ',

    // About Section
    about_title: 'ስለ',
    about_me: 'እኔ',
    about_im: 'እኔ',
    about_frontend: 'የፊት ገጽ ገንቢ ነኝ',
    about_description_1: 'በስርዓት ልማት እና ዘመናዊ ቴክኖሎጂዎች ላይ ጠንካራ ዳራ ያለው ልምድ ያለው ሶፍትዌር ኢንጂነር ነኝ። የእኔ እውቀት አርቴፊሻል ኢንተለጀንስ (AI) እና ማሽን ለርኒንግ (ML) ን ያካትታል፣ እውነተኛ ችግሮችን የሚፈቱ ብልህ መፍትሄዎችን መገንባት እወዳለሁ።',
    about_description_2: 'ጠንካራ የትንተና እና የችግር መፍቻ ክህሎቶች አሉኝ፣ ይህም ውጤታማ፣ ሊስፋፉ የሚችሉ እና አስተማማኝ መተግበሪያዎችን እንድነድፍ ያስችለኛል። በፍጥነት የመማር እና ለአዳዲስ ፈተናዎች የመላመድ ተፈጥሯዊ ችሎታ ስላለኝ፣ የቴክኒክ ክህሎቶቼን በቀጣይነት አሻሽላለሁ።',
    about_read_more: 'ተጨማሪ አንብብ',

    // Education Section
    education_title: 'የእኔ',
    education_education: 'ትምህርት',
    education_certifications: 'የምስክር ወረቀቶች እና ሽልማቶች',

    // Skills Section
    skills_title: 'የእኔ',
    skills_skills: 'ክህሎቶች',

    // Projects Section
    projects_title: 'የቅርብ ጊዜ',
    projects_projects: 'ፕሮጀክቶች',
    projects_loading: 'ፕሮጀክቶችን በመጫን ላይ...',
    projects_no_projects: 'ገና ምንም ፕሮጀክቶች የሉም። በቅርቡ ይመለሱ!',
    projects_error: 'ፕሮጀክቶችን በመጫን ላይ ስህተት። እባክዎ ቆየት ብለው ይሞክሩ።',
    projects_tech: 'ቴክኖሎጂ:',
    projects_code: 'ኮድ',
    projects_live: 'ቀጥታ',

    // Contact Section
    contact_title: 'አግኙኝ',
    contact_me: '',
    contact_name: 'ሙሉ ስም',
    contact_email: 'ኢሜይል አድራሻ',
    contact_subject: 'ርዕስ',
    contact_message: 'መልእክትዎ',
    contact_send: 'መልእክት ላክ',
    contact_attach: 'ፋይሎችን አያይዝ (አማራጭ)',
    contact_drop_files: 'ፋይሎችን ለመምረጥ ጠቅ ያድርጉ ወይም እዚህ ይጎትቱ',
    contact_get_in_touch: 'ያግኙን',
    contact_lets_work: 'አብረን እንስራ',
    contact_intro: 'ለፍሪላንስ፣ ለልምምድ እና ለሙሉ ጊዜ ስራ ክፍት ነኝ። ያነጋግሩኝ!',
    contact_label_email: 'ኢሜይል',
    contact_label_phone: 'ስልክ',
    contact_label_location: 'አድራሻ',
    contact_label_name: 'ሙሉ ስም',
    contact_label_email_addr: 'ኢሜይል አድራሻ',
    contact_label_subject: 'ርዕስ',
    contact_label_message: 'መልእክት',
    contact_success: 'መልእክት በተሳካ ሁኔታ ተልኳል!',
    contact_error: 'መልእክት በመላክ ላይ ስህተት። እባክዎ እንደገና ይሞክሩ።',
    contact_network_error: 'የኔትወርክ ስህተት። እባክዎ እንደገና ይሞክሩ።',
    contact_sending: 'በመላክ ላይ...',

    // Footer
    footer_rights: 'ሁሉም መብቶች የተጠበቁ ናቸው።',
    footer_admin: 'አስተዳዳሪ',

    // Admin Page
    admin_title: 'የፖርትፎሊዮ አስተዳዳሪ',
    admin_upload_images: 'ምስሎችን ስቀል',
    admin_view_portfolio: 'ፖርትፎሊዮ ይመልከቱ',
    admin_add_project: 'አዲስ ፕሮጀክት ጨምር',
    admin_project_title: 'የፕሮጀክት ርዕስ',
    admin_description: 'መግለጫ',
    admin_technologies: 'ጥቅም ላይ የዋሉ ቴክኖሎጂዎች',
    admin_github: 'GitHub አድራሻ',
    admin_live_demo: 'ቀጥታ ማሳያ አድራሻ',
    admin_project_image: 'የፕሮጀክት ምስል',
    admin_browse: 'አስስ',
    admin_add_button: 'ፕሮጀክት ጨምር',
    admin_your_projects: 'የእርስዎ ፕሮጀክቶች',
    admin_loading: 'ፕሮጀክቶችን በመጫን ላይ...',
    admin_no_projects: 'ገና ምንም ፕሮጀክቶች የሉም። የመጀመሪያውን ፕሮጀክትዎን ያክሉ!',
    admin_delete: 'ፕሮጀክት ሰርዝ',
    admin_added: 'ታክሏል:',
    admin_select_image: 'የፕሮጀክት ምስል ይምረጡ',
    admin_no_images: 'ገና ምንም የፕሮጀክት ምስሎች አልተሰቀሉም።',
    admin_upload_first: 'መጀመሪያ ምስሎችን ስቀል',
    admin_success: 'ፕሮጀክት በተሳካ ሁኔታ ታክሏል!',
    admin_delete_success: 'ፕሮጀክት በተሳካ ሁኔታ ተሰርዟል!',
    admin_delete_confirm: 'እርግጠኛ ነዎት መሰረዝ ይፈልጋሉ',

    // Contact Messages
    contacts_title: 'የእውቂያ መልዕክቶች',
    contacts_unread: 'ያልተነበቡ',
    contacts_all: 'ሁሉም መልዕክቶች',
    contacts_filter_all: 'ሁሉም',
    contacts_filter_unread: 'ያልተነበቡ',
    contacts_filter_read: 'የተነበቡ',
    contacts_filter_replied: 'ምላሽ የተሰጣቸው',
    contacts_from: 'ከ:',
    contacts_email: 'ኢሜይል:',
    contacts_subject: 'ርዕስ:',
    contacts_date: 'ቀን:',
    contacts_message: 'መልዕክት:',
    contacts_response: 'የእርስዎ ምላሽ:',
    contacts_response_placeholder: 'ምላሽዎን እዚህ ይተይቡ...',
    contacts_mark_read: 'እንደተነበበ ምልክት አድርግ',
    contacts_mark_unread: 'እንደያልተነበበ ምልክት አድርግ',
    contacts_send_response: 'ምላሽ ላክ',
    contacts_delete: 'መልዕክት ሰርዝ',
    contacts_delete_confirm: 'እርግጠኛ ነዎት ይህን መልዕክት መሰረዝ ይፈልጋሉ?',
    contacts_no_messages: 'ገና ምንም የእውቂያ መልዕክቶች የሉም።',
    contacts_loading: 'መልዕክቶችን በመጫን ላይ...',
    contacts_response_sent: 'ምላሽ በተሳካ ሁኔታ ተልኳል!',
    contacts_status_updated: 'ሁኔታ በተሳካ ሁኔታ ተዘምኗል!',
    contacts_deleted: 'መልዕክት በተሳካ ሁኔታ ተሰርዟል!',
    contacts_error: 'መልዕክቶችን በመጫን ላይ ስህተት። እባክዎ እንደገና ይሞክሩ።',

    // Upload Page
    upload_title: 'ምስሎችን ስቀል',
    upload_admin_panel: 'የአስተዳዳሪ ፓነል',
    upload_home: 'መነሻ',
    upload_logo: 'አርማ ስቀል',
    upload_profile: 'የመገለጫ ምስል ስቀል',
    upload_project: 'የፕሮጀክት ምስል ስቀል',
    upload_select_logo: 'የአርማ ምስል ይምረጡ',
    upload_select_profile: 'የመገለጫ ምስል ይምረጡ',
    upload_select_project: 'የፕሮጀክት ምስል ይምረጡ',
    upload_project_name: 'የፕሮጀክት ስም',
    upload_button: 'ስቀል',
    upload_uploaded_images: 'የተሰቀሉ ምስሎች',
    upload_loading: 'ምስሎችን በመጫን ላይ...',
    upload_no_images: 'ገና ምንም ምስሎች አልተሰቀሉም',
    upload_delete: 'ሰርዝ',
    upload_success: 'ምስል በተሳካ ሁኔታ ተሰቅሏል! መንገድ:',
    upload_error: 'መስቀል አልተሳካም',
    upload_delete_confirm: 'እርግጠኛ ነዎት ይህን ምስል መሰረዝ ይፈልጋሉ?',
    upload_delete_success: 'ምስል በተሳካ ሁኔታ ተሰርዟል',
    upload_delete_error: 'ምስልን መሰረዝ አልተሳካም',
  },

  ar: {
    // Navigation (Arabic)
    nav_home: 'الرئيسية',
    nav_about: 'عني',
    nav_education: 'التعليم',
    nav_skills: 'المهارات',
    nav_portfolio: 'الأعمال',
    nav_contact: 'اتصل بي',

    // Hero Section
    hero_hello: 'مرحباً، أنا',
    hero_name: 'أليمنيو دوبي',
    hero_and: 'وأنا',
    hero_description: 'مهندس برمجيات شغوف بمهارات قوية في حل المشكلات والتركيز على بناء تطبيقات فعالة وقابلة للتطوير.',
    hero_download_cv: 'تحميل السيرة الذاتية',

    // Typing animation roles
    role_frontend: 'مطور ويب متكامل',
    role_designer: 'حلال المشاكل',
    role_ux: 'مهندس برمجيات',
    role_solver: 'حلال المشاكل',

    // About Section
    about_title: 'عن',
    about_me: 'نفسي',
    about_im: 'أنا',
    about_frontend: 'مطور واجهة أمامية',
    about_description_1: 'أنا مهندس برمجيات ذو خبرة مع خلفية قوية في تطوير الأنظمة والتقنيات الحديثة. تشمل خبرتي الذكاء الاصطناعي (AI) والتعلم الآلي (ML)، حيث أستمتع ببناء حلول ذكية تحل المشاكل الحقيقية.',
    about_description_2: 'لدي مهارات تحليلية قوية وحل المشكلات، مما يسمح لي بتصميم تطبيقات فعالة وقابلة للتطوير وموثوقة. مع القدرة الطبيعية على التعلم بسرعة والتكيف مع التحديات الجديدة، أقوم بتحسين مهاراتي التقنية باستمرار.',
    about_read_more: 'اقرأ المزيد',

    // Education Section
    education_title: 'تعليمي',
    education_education: '',
    education_certifications: 'الشهادات والجوائز',

    // Skills Section
    skills_title: 'مهاراتي',
    skills_skills: '',

    // Projects Section
    projects_title: 'أحدث',
    projects_projects: 'المشاريع',
    projects_loading: 'جاري تحميل المشاريع...',
    projects_no_projects: 'لا توجد مشاريع حتى الآن. تحقق مرة أخرى قريباً!',
    projects_error: 'خطأ في تحميل المشاريع. يرجى المحاولة مرة أخرى لاحقاً.',
    projects_tech: 'التقنية:',
    projects_code: 'الكود',
    projects_live: 'مباشر',

    // Contact Section
    contact_title: 'اتصل',
    contact_me: 'بي',
    contact_name: 'الاسم الكامل',
    contact_email: 'عنوان البريد الإلكتروني',
    contact_subject: 'الموضوع',
    contact_message: 'رسالتك',
    contact_send: 'إرسال الرسالة',
    contact_attach: 'إرفاق ملفات (اختياري)',
    contact_drop_files: 'انقر للاختيار أو اسحب الملفات هنا',
    contact_get_in_touch: 'تواصل معي',
    contact_lets_work: 'لنعمل معاً',
    contact_intro: 'أنا منفتح على فرص العمل الحر والتدريب والوظائف في هندسة البرمجيات وتطوير الويب. لا تتردد في التواصل!',
    contact_label_email: 'البريد الإلكتروني',
    contact_label_phone: 'الهاتف',
    contact_label_location: 'الموقع',
    contact_label_name: 'الاسم الكامل',
    contact_label_email_addr: 'عنوان البريد الإلكتروني',
    contact_label_subject: 'الموضوع',
    contact_label_message: 'الرسالة',
    contact_success: 'تم إرسال الرسالة بنجاح!',
    contact_error: 'خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    contact_network_error: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
    contact_sending: 'جاري الإرسال...',

    // Footer
    footer_rights: 'جميع الحقوق محفوظة.',
    footer_admin: 'المسؤول',

    // Admin Page
    admin_title: 'لوحة تحكم المحفظة',
    admin_upload_images: 'رفع الصور',
    admin_view_portfolio: 'عرض المحفظة',
    admin_add_project: 'إضافة مشروع جديد',
    admin_project_title: 'عنوان المشروع',
    admin_description: 'الوصف',
    admin_technologies: 'التقنيات المستخدمة',
    admin_github: 'رابط GitHub',
    admin_live_demo: 'رابط العرض المباشر',
    admin_project_image: 'صورة المشروع',
    admin_browse: 'تصفح',
    admin_add_button: 'إضافة مشروع',
    admin_your_projects: 'مشاريعك',
    admin_loading: 'جاري تحميل المشاريع...',
    admin_no_projects: 'لا توجد مشاريع حتى الآن. أضف مشروعك الأول!',
    admin_delete: 'حذف المشروع',
    admin_added: 'تمت الإضافة:',
    admin_select_image: 'اختر صورة المشروع',
    admin_no_images: 'لم يتم رفع صور المشروع بعد.',
    admin_upload_first: 'قم برفع الصور أولاً',
    admin_success: 'تمت إضافة المشروع بنجاح!',
    admin_delete_success: 'تم حذف المشروع بنجاح!',
    admin_delete_confirm: 'هل أنت متأكد أنك تريد حذف',

    // Contact Messages
    contacts_title: 'رسائل الاتصال',
    contacts_unread: 'غير مقروءة',
    contacts_all: 'جميع الرسائل',
    contacts_filter_all: 'الكل',
    contacts_filter_unread: 'غير مقروءة',
    contacts_filter_read: 'مقروءة',
    contacts_filter_replied: 'تم الرد',
    contacts_from: 'من:',
    contacts_email: 'البريد الإلكتروني:',
    contacts_subject: 'الموضوع:',
    contacts_date: 'التاريخ:',
    contacts_message: 'الرسالة:',
    contacts_response: 'ردك:',
    contacts_response_placeholder: 'اكتب ردك هنا...',
    contacts_mark_read: 'وضع علامة كمقروءة',
    contacts_mark_unread: 'وضع علامة كغير مقروءة',
    contacts_send_response: 'إرسال الرد',
    contacts_delete: 'حذف الرسالة',
    contacts_delete_confirm: 'هل أنت متأكد أنك تريد حذف هذه الرسالة؟',
    contacts_no_messages: 'لا توجد رسائل اتصال بعد.',
    contacts_loading: 'جاري تحميل الرسائل...',
    contacts_response_sent: 'تم إرسال الرد بنجاح!',
    contacts_status_updated: 'تم تحديث الحالة بنجاح!',
    contacts_deleted: 'تم حذف الرسالة بنجاح!',
    contacts_error: 'خطأ في تحميل الرسائل. يرجى المحاولة مرة أخرى.',

    // Upload Page
    upload_title: 'رفع الصور',
    upload_admin_panel: 'لوحة الإدارة',
    upload_home: 'الرئيسية',
    upload_logo: 'رفع الشعار',
    upload_profile: 'رفع صورة الملف الشخصي',
    upload_project: 'رفع صورة المشروع',
    upload_select_logo: 'اختر صورة الشعار',
    upload_select_profile: 'اختر صورة الملف الشخصي',
    upload_select_project: 'اختر صورة المشروع',
    upload_project_name: 'اسم المشروع',
    upload_button: 'رفع',
    upload_uploaded_images: 'الصور المرفوعة',
    upload_loading: 'جاري تحميل الصور...',
    upload_no_images: 'لم يتم رفع صور بعد',
    upload_delete: 'حذف',
    upload_success: 'تم رفع الصورة بنجاح! المسار:',
    upload_error: 'فشل الرفع',
    upload_delete_confirm: 'هل أنت متأكد أنك تريد حذف هذه الصورة؟',
    upload_delete_success: 'تم حذف الصورة بنجاح',
    upload_delete_error: 'فشل حذف الصورة',
  }
};

// Get translation
function t(key, lang = null) {
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

// Get current language from localStorage or default to English
function getCurrentLanguage() {
  return localStorage.getItem('portfolio_language') || 'en';
}

// Set language
function setLanguage(lang) {
  localStorage.setItem('portfolio_language', lang);
  updatePageLanguage();
}

// Update page content based on current language
function updatePageLanguage() {
  const lang = getCurrentLanguage();

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update text direction for Arabic
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key, lang);

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });

  // Update language selector
  const langSelector = document.getElementById('language-selector');
  if (langSelector) {
    langSelector.value = lang;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { t, getCurrentLanguage, setLanguage, updatePageLanguage };
}

import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  km: {
    // Branding
    appName: 'ដ្រូនកសិកម្មព្រៃតូច',
    appSubtitle: 'ប្រព័ន្ធគ្រប់គ្រងការបាញ់ថ្នាំកសិកម្ម',
    brandTag: 'មជ្ឈមណ្ឌលប្រតិបត្តិការបាញ់ថ្នាំ',

    // Navigation
    navOverview: 'ទិដ្ឋភាពទូទៅ',
    navSprays: 'កំណត់ត្រាបាញ់ថ្នាំ',
    navCustomers: 'បញ្ជីអតិថិជន',
    navPayments: 'មជ្ឈមណ្ឌលទូទាត់',
    navUsers: 'ក្រុមការងារ & តួនាទី',
    navAbout: 'អំពីយើង',
    navContact: 'ទំនាក់ទំនង',
    informationSupport: 'ព័ត៌មាន & ជំនួយ',
    mainManagement: 'ការគ្រប់គ្រងទូទៅ',
    syncDatabase: 'ធ្វើសមកាលកម្មទិន្នន័យ',
    role: 'តួនាទី',
    signOut: 'ចាកចេញ',

    // Auth
    signIn: 'ចូលប្រព័ន្ធ',
    signUp: 'ចុះឈ្មោះ',
    username: 'ឈ្មោះគណនី',
    email: 'អ៊ីមែល',
    password: 'ពាក្យសម្ងាត់',
    confirmPassword: 'ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់',
    passwordsDoNotMatch: 'ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នាទេ',
    roleAssignment: 'កំណត់តួនាទី',
    userRole: 'អ្នកប្រើប្រាស់ទូទៅ',
    adminRole: 'អ្នកគ្រប់គ្រង (Admin)',
    superRole: 'អភិបាលជាន់ខ្ពស់ (Super Admin)',
    useDefaultAdmin: 'ប្រើគណនី Admin គំរូ',
    connectingServer: 'កំពុងភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ ដ្រូនកសិកម្មព្រៃតូច...',
    authFailed: 'ការផ្ទៀងផ្ទាត់មិនជោគជ័យ សូមពិនិត្យមើលព័ត៌មានម្តងទៀត',
    loginSubtitle: 'ច្រកចូលប្រព័ន្ធគ្រប់គ្រងការបាញ់ថ្នាំកសិកម្មច្បាស់លាស់',

    // Overview KPIs
    totalSprays: 'ការបាញ់សរុប',
    sessionsRecorded: 'ដងដែលបានកត់ត្រា',
    totalCustomers: 'អតិថិជនសរុប',
    registeredClients: 'កសិដ្ឋាន / ចម្ការដែលបានចុះឈ្មោះ',
    cashCollected: 'ប្រាក់បានទទួល',
    dueBalance: 'នៅខ្វះ',
    staffAdmins: 'បុគ្គលិក / អ្នកគ្រប់គ្រង',
    activeTeam: 'សមាជិកក្រុមការងារសកម្ម',
    overviewHeroTitle: 'ប្រតិបត្តិការបាញ់ថ្នាំកសិកម្ម',
    overviewHeroDesc: 'តាមដានការប្រើប្រាស់ថ្នាំកសិកម្ម ការទូទាត់ប្រាក់ដំណាក់កាល និងគណនីចម្ការរបស់អតិថិជនបានទាន់ពេល។',
    recordSprayBtn: 'កត់ត្រាការបាញ់ថ្នាំ',
    viewPaymentsBtn: 'ពិនិត្យការទូទាត់',
    recentApplications: 'កំណត់ត្រាបាញ់ថ្នាំថ្មីៗ',
    recentApplicationsSubtitle: 'ការបាញ់ថ្នាំថ្មីៗបំផុតរួមជាមួយស្ថានភាពទូទាត់ និងសមតុល្យនៅខ្វះ',
    viewAll: 'មើលទាំងអស់',
    noSpraysYet: 'មិនទាន់មានកំណត់ត្រាបាញ់ថ្នាំនៅឡើយទេ។',
    recordFirstSpray: 'កត់ត្រាការបាញ់ថ្នាំដំបូង',

    // Table Headers
    thDate: 'កាលបរិច្ឆេទ',
    thCustomer: 'អតិថិជន',
    thChemical: 'ប្រភេទថ្នាំ',
    thQtyPrice: 'ចំនួនហិចតា & តម្លៃ',
    thTotalPaid: 'សរុប / បានបង់',
    thStatus: 'ស្ថានភាពទូទាត់',
    thActions: 'សកម្មភាព',
    thInvoiceTotal: 'វិក្កយបត្រសរុប',
    thPhone: 'លេខទូរស័ព្ទ',
    thCreated: 'បានបង្កើតនៅ',
    thRole: 'តួនាទី',
    thUser: 'អ្នកប្រើប្រាស់',

    // Payment Statuses
    statusPaid: 'បានបង់គ្រប់',
    statusPartial: 'បង់ខ្លះ',
    statusPending: 'រង់ចាំបង់',
    statusUnpaid: 'មិនទាន់បង់',

    // Actions & Buttons
    btnPay: 'បង់ប្រាក់',
    btnEdit: 'កែប្រែ',
    btnDelete: 'លុប',
    btnCancel: 'បោះបង់',
    btnSave: 'រក្សាទុក',
    btnSaving: 'កំពុងរក្សាទុក...',
    btnDeleting: 'កំពុងលុប...',
    btnAddCustomer: 'បន្ថែមអតិថិជន',
    btnNewSpray: 'បន្ថែមកំណត់ត្រាថ្មី',
    btnNewUser: 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី',
    btnRecordPayment: 'កត់ត្រាការបង់ប្រាក់',
    btnPayFull: 'បង់គ្រប់',
    btnSettleFull: 'បង់ផ្តាច់សមតុល្យដែលនៅខ្វះ',
    btnConfirmPayFull: 'យល់ព្រមបង់គ្រប់',
    confirmPayFullTitle: 'ផ្ទៀងផ្ទាត់ការបង់ប្រាក់គ្រប់',
    confirmPayFullDesc: 'តើអ្នកប្រាកដជាចង់បញ្ជាក់ការទូទាត់គ្រប់ចំនួនសម្រាប់',
    confirmPayFullAmount: 'ចំនួនទឹកប្រាក់ត្រូវទូទាត់បង្គ្រប់៖',
    confirmPayFullNote: 'កំណត់ត្រានេះនឹងត្រូវផ្លាស់ប្តូរទៅជា «បានបង់គ្រប់» ១០០%។',
    payFullSuccess: 'បានទូទាត់ប្រាក់គ្រប់ចំនួនដោយជោគជ័យ!',
    btnConfirmDelete: 'យល់ព្រមលុប',

    // Search & Filters
    searchSprayCustomer: 'ស្វែងរកតាមឈ្មោះថ្នាំ ឬអតិថិជន...',
    searchCustomer: 'ស្វែងរកតាមឈ្មោះអតិថិជន ឬលេខទូរស័ព្ទ...',
    searchUser: 'ស្វែងរកតាមឈ្មោះ អ៊ីមែល ឬតួនាទី...',
    filterAllCustomers: 'អតិថិជនទាំងអស់',
    filterAllStatuses: 'ស្ថានភាពទូទាត់ទាំងអស់',
    filterPaidOnly: 'បានបង់គ្រប់',
    filterPartialOnly: 'បង់មួយផ្នែក (ខ្លះ)',
    filterPendingOnly: 'រង់ចាំបង់',
    filterUnpaidOnly: 'មិនទាន់បង់',

    // Modals
    modalNewSprayTitle: 'បន្ថែមកំណត់ត្រាបាញ់ថ្នាំថ្មី',
    modalEditSprayTitle: 'កែប្រែកំណត់ត្រាបាញ់ថ្នាំ',
    modalSprayDesc: 'បំពេញព័ត៌មានលម្អិតអំពីការប្រើប្រាស់ថ្នាំកសិកម្ម និងការបង់ប្រាក់',
    fieldDate: 'កាលបរិច្ឆេទ *',
    fieldCustomer: 'អតិថិជន (FK) *',
    selectCustomerPlaceholder: 'ជ្រើសរើសអតិថិជន...',
    fieldSprayName: 'ឈ្មោះថ្នាំ / ជី *',
    fieldQuantity: 'ចំនួនហិចតា *',
    unitHectare: 'ហិចតា',
    fieldUnitPrice: 'តម្លៃរាយ (៛) *',
    fieldPaidAmount: 'ប្រាក់បានបង់រួច (៛)',
    fieldPaymentStatus: 'ស្ថានភាពទូទាត់ *',
    totalCalculated: 'តម្លៃសរុបគណនា៖',
    paidReceived: 'ប្រាក់បានទទួល៖',
    remainingDue: 'សមតុល្យនៅខ្វះ៖',
    autoStatus: 'ស្ថានភាពគណនាស្វ័យប្រវត្ត៖',
    presetZero: '0 ៛',

    // Quick Pay Modal
    quickPayTitle: 'កត់ត្រាការបង់ប្រាក់របស់អតិថិជន',
    quickPayDesc: 'អតិថិជន៖',
    totalInvoice: 'វិក្កយបត្រសរុប៖',
    alreadyCollected: 'បានទទួលរួច៖',
    currentBalanceDue: 'សមតុល្យនៅខ្វះបច្ចុប្បន្ន៖',
    amountPaidToday: 'ចំនួនទឹកប្រាក់បង់បន្ថែមថ្ងៃនេះ (៛)',
    errPaymentExceedsDue: 'ចំនួនប្រាក់បង់មិនអាចលើសពីសមតុល្យនៅខ្វះបានទេ',
    errPaymentExceedsTotal: 'ប្រាក់បានបង់មិនអាចលើសពីតម្លៃសរុបបានទេ',

    // Delete Modals
    deleteSprayTitle: 'លុបកំណត់ត្រាបាញ់ថ្នាំ?',
    deleteSprayDesc: 'តើអ្នកប្រាកដជាចង់លុបកំណត់ត្រា',
    deleteCustomerTitle: 'លុបអតិថិជន?',
    deleteCustomerDesc: 'តើអ្នកប្រាកដជាចង់លុបអតិថិជន',
    deleteUserTitle: 'លុបគណនីអ្នកប្រើប្រាស់?',
    deleteUserDesc: 'តើអ្នកប្រាកដជាចង់លុបគណនី',
    cannotUndo: 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
    cannotDeleteSelf: 'អ្នកមិនអាចលុបគណនីផ្ទាល់ខ្លួនរបស់អ្នកបានទេ!',
    adminOnlyDeleteUsers: 'អ្នកគ្រប់គ្រង (Admin) អាចលុបបានតែគណនីអ្នកប្រើប្រាស់ទូទៅ (User) ប៉ុណ្ណោះ!',
    cannotDeleteCustomerHasSprays: 'មិនអាចលុបអតិថិជននេះបានទេ ដោយសារមានកំណត់ត្រាបាញ់ថ្នាំដែលកំពុងប្រើប្រាស់។ សូមលុបកំណត់ត្រាបាញ់ថ្នាំជាមុនសិន!',

    // Payments Page
    paymentsTitle: 'មជ្ឈមណ្ឌលទូទាត់ & ជម្រះបញ្ជី',
    paymentsSubtitle: 'តាមដានបំណុលទទួល កត់ត្រាការបង់រំលស់ និងពិនិត្យគណនីចម្ការដែលនៅខ្វះ',
    totalBilled: 'វិក្កយបត្រសរុប',
    collectedCash: 'ប្រាក់បានប្រមូល',
    outstandingDue: 'បំណុលនៅខ្វះ',
    partialAccounts: 'គណនីបង់ខ្លះ',
    partiallyPaidJobs: 'ការងារដែលបង់មិនទាន់គ្រប់',
    receivablesRemaining: 'ប្រាក់ដែលត្រូវប្រមូលបន្ថែម',
    fullySettled: 'បានទូទាត់រួចរាល់',
    leftDue: 'នៅខ្វះ',
    progress: 'វឌ្ឍនភាព',

    // Customer Page
    customerDirectory: 'បញ្ជីឈ្មោះអតិថិជន',
    customerDirectorySub: 'គ្រប់គ្រងម្ចាស់ចម្ការ គណនីអតិថិជន និងព័ត៌មានទំនាក់ទំនង',
    modalNewCustomer: 'បន្ថែមអតិថិជនថ្មី',
    modalEditCustomer: 'កែប្រែព័ត៌មានអតិថិជន',
    customerName: 'ឈ្មោះអតិថិជន *',
    customerPhone: 'លេខទូរស័ព្ទ (មិនចាំបាច់)',
    noPhone: 'មិនមានលេខទូរស័ព្ទ',

    // User Page
    userManagementTitle: 'ការគ្រប់គ្រងគណនីអ្នកប្រើប្រាស់',
    userManagementSub: 'គ្រប់គ្រងសិទ្ធិប្រើប្រាស់ និងតួនាទីក្នុងប្រព័ន្ធ (Admin / Super Admin)',
    modalNewUser: 'បង្កើតអ្នកប្រើប្រាស់ថ្មី',
    modalEditUser: 'កែប្រែអ្នកប្រើប្រាស់',
    passwordPlaceholder: 'យ៉ាងតិច ៦ តួអក្សរ',
    passwordLeaveBlank: 'ពាក្យសម្ងាត់ (ទុកទំនេរបើមិនចង់ប្តូរ)',
    adminCannotEditSuper: 'អ្នកគ្រប់គ្រង (Admin) មិនអាចកែប្រែគណនី Super Admin បានទេ',

    // About Page
    aboutTitle: 'អំពីប្រព័ន្ធ ដ្រូនកសិកម្មព្រៃតូច',
    aboutSubtitle: 'ប្រព័ន្ធបច្ចេកវិទ្យាគ្រប់គ្រងការបាញ់ថ្នាំកសិកម្មច្បាស់លាស់ និងការតាមដានចម្ការទំនើប',
    aboutMissionTitle: 'បេសកកម្មរបស់យើង',
    aboutMissionDesc: 'បង្កើនប្រសិទ្ធភាពកសិកម្មកម្ពុជា តាមរយៈការគ្រប់គ្រងការប្រើប្រាស់ថ្នាំកសិកម្មដោយសុវត្ថិភាព កាត់បន្ថយការខ្ជះខ្ជាយ និងការពារសុខភាពកសិករ។',
    aboutVisionTitle: 'ចក្ខុវិស័យ',
    aboutVisionDesc: 'ក្លាយជាប្រព័ន្ធគ្រប់គ្រងប្រតិបត្តិការកសិកម្មឈានមុខគេ ដែលផ្តល់ភាពងាយស្រួល តម្លាភាព និងទំនុកចិត្តខ្ពស់បំផុត។',
    feature1Title: 'ការបាញ់ថ្នាំច្បាស់លាស់',
    feature1Desc: 'កត់ត្រាការប្រើប្រាស់បរិមាណថ្នាំ ជី និងគីមីកសិកម្មបានត្រឹមត្រូវ និងទាន់ពេលវេលា។',
    feature2Title: 'ការគ្រប់គ្រងគណនីចម្ការ',
    feature2Desc: 'រក្សាទុកទិន្នន័យអតិថិជន ទីតាំងចម្ការ និងប្រវត្តិសេវាកម្មបានច្បាស់លាស់។',
    feature3Title: 'ការទូទាត់ និងវិក្កយបត្រ',
    feature3Desc: 'គណនាសមតុល្យប្រាក់បង់រួច និងប្រាក់នៅខ្វះដោយស្វ័យប្រវត្តិជាមួយប្រព័ន្ធរូបិយប័ណ្ណរៀល (៛)។',
    feature4Title: 'សុវត្ថិភាពទិន្នន័យ & សិទ្ធិប្រើប្រាស់',
    feature4Desc: 'ការការពារទិន្នន័យកម្រិតខ្ពស់ជាមួយប្រព័ន្ធបែងចែកសិទ្ធិបុគ្គលិក និងអ្នកគ្រប់គ្រង។',
    standardsTitle: 'ស្តង់ដារគុណភាព និងសុវត្ថិភាព',
    standardItem1: 'កម្រិតថ្នាំត្រូវបានគណនាត្រឹមត្រូវតាមទំហំដី',
    standardItem2: 'បុគ្គលិកបាញ់ថ្នាំមានឧបករណ៍ការពារសុវត្ថិភាពពេញលេញ (PPE)',
    standardItem3: 'តម្លាភាពតម្លៃ និងមិនមានការគិតប្រាក់បន្ថែមដែលមិនច្បាស់លាស់',
    standardItem4: 'ការគាំទ្រ និងប្រឹក្សាយោបល់បច្ចេកទេសកសិកម្មឥតគិតថ្លៃ',

    // Contact Page
    contactTitle: 'ទំនាក់ទំនងមកកាន់យើងខ្ញុំ',
    contactSubtitle: 'ប្រសិនបើលោកអ្នកមានចម្ងល់ សំណើសេវាកម្ម ឬត្រូវការជំនួយបច្ចេកទេស សូមទាក់ទងមកកាន់យើងខ្ញុំ',
    contactInfoTitle: 'ព័ត៌មានទំនាក់ទំនង',
    phoneHotline: 'ខ្សែទូរស័ព្ទជំនួយការ',
    phoneHotlineNumber: '081 686 9014',
    telegramSupport: 'ឆានែល Telegram ជំនួយការ',
    telegramHandle: 'Nary (@Nary_drone)',
    emailSupport: 'អាសយដ្ឋានអ៊ីមែល',
    emailAddressVal: 'supportTeam@gmail.com',
    locationTitle: 'ទីតាំងមជ្ឈមណ្ឌលប្រតិបត្តិការ',
    locationDesc: 'ខេត្តបាត់ដំបង ស្រុកមោងឫស្សី, ឃុំព្រៃតូច',
    workingHoursTitle: 'ម៉ោងធ្វើការ',
    workingHoursDesc: 'ច័ន្ទ - សៅរ៍៖ ៧:០០ ព្រឹក - ៦:០០ ល្ងាច (បិទថ្ងៃអាទិត្យ)',
    sendMessageTitle: 'ផ្ញើសារមកកាន់យើងខ្ញុំ',
    sendMessageSub: 'បំពេញព័ត៌មានខាងក្រោមដើម្បីផ្ញើសារទៅកាន់ក្រុមការងារបច្ចេកទេស',
    fullName: 'ឈ្មោះពេញ *',
    fullNamePlaceholder: 'ឧទាហរណ៍៖ សុខ ចាន់ដារា',
    phoneNumber: 'លេខទូរស័ព្ទ *',
    phonePlaceholder: '012 345 678',
    subjectTopic: 'ប្រធានបទ / សំណើសេវាកម្ម *',
    subjectPlaceholder: 'ជ្រើសរើសប្រធានបទ...',
    topicGeneral: 'ការសាកសួរទូទៅ',
    topicSprayService: 'ស្នើសុំសេវាកម្មបាញ់ថ្នាំ',
    topicBilling: 'ការទូទាត់ប្រាក់ និងវិក្កយបត្រ',
    topicTechnical: 'ជំនួយបច្ចេកទេសគណនី',
    messageContent: 'ខ្លឹមសារសារ *',
    messagePlaceholder: 'សូមសរសេរព័ត៌មានលម្អិតអំពីសំណើ ឬចម្ងល់របស់អ្នកនៅទីនេះ...',
    btnSendMessage: 'ផ្ញើសារឥឡូវនេះ',
    messageSentSuccess: 'សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ! ក្រុមការងារយើងនឹងទាក់ទងទៅវិញឆាប់ៗ។',

    // Toast Notifications
    toastLoginSuccess: 'ចូលប្រព័ន្ធបានជោគជ័យ! សូមស្វាគមន៍',
    toastLogoutSuccess: 'បានចាកចេញពីប្រព័ន្ធដោយជោគជ័យ',
    toastSignupSuccess: 'បានចុះឈ្មោះ និងចូលប្រព័ន្ធដោយជោគជ័យ',
    toastCustomerAdded: 'បានបន្ថែមអតិថិជនថ្មីដោយជោគជ័យ',
    toastCustomerUpdated: 'បានកែប្រែព័ត៌មានអតិថិជនដោយជោគជ័យ',
    toastCustomerDeleted: 'បានលុបអតិថិជនដោយជោគជ័យ',
    toastSprayAdded: 'បានបន្ថែមកំណត់ត្រាបាញ់ថ្នាំដោយជោគជ័យ',
    toastSprayUpdated: 'បានកែប្រែកំណត់ត្រាបាញ់ថ្នាំដោយជោគជ័យ',
    toastSprayDeleted: 'បានលុបកំណត់ត្រាបាញ់ថ្នាំដោយជោគជ័យ',
    toastPaymentSuccess: 'បានកត់ត្រាការទូទាត់ប្រាក់ដោយជោគជ័យ',
    toastUserAdded: 'បានបង្កើតអ្នកប្រើប្រាស់ថ្មីដោយជោគជ័យ',
    toastUserUpdated: 'បានកែប្រែព័ត៌មានអ្នកប្រើប្រាស់ដោយជោគជ័យ',
    toastUserDeleted: 'បានលុបអ្នកប្រើប្រាស់ដោយជោគជ័យ',
  },
  en: {
    // Branding
    appName: 'ដ្រូនកសិកម្មព្រៃតូច',
    appSubtitle: 'Agri-Spray Precision Operations',
    brandTag: 'Operations Hub',

    // Navigation
    navOverview: 'Overview',
    navSprays: 'Spray Records',
    navCustomers: 'Customers',
    navPayments: 'Payment Center',
    navUsers: 'Team & Roles',
    navAbout: 'About Us',
    navContact: 'Contact Us',
    informationSupport: 'Information & Support',
    mainManagement: 'Main Management',
    syncDatabase: 'Sync with Database',
    role: 'Role',
    signOut: 'Sign Out',

    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    username: 'Username',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Verify Password',
    passwordsDoNotMatch: 'Passwords do not match',
    roleAssignment: 'Role Assignment',
    userRole: 'User',
    adminRole: 'Admin',
    superRole: 'Super Admin',
    useDefaultAdmin: 'Use Default Admin Credentials',
    connectingServer: 'Connecting to ដ្រូនកសិកម្មព្រៃតូច Server...',
    authFailed: 'Authentication failed. Please check credentials.',
    loginSubtitle: 'Precision Agricultural Spray Management Portal',

    // Overview KPIs
    totalSprays: 'Total Sprays',
    sessionsRecorded: 'Sessions recorded',
    totalCustomers: 'Total Customers',
    registeredClients: 'Registered farms / clients',
    cashCollected: 'Cash Collected',
    dueBalance: 'Due Balance',
    staffAdmins: 'Staff / Admins',
    activeTeam: 'Active team members',
    overviewHeroTitle: 'Agricultural Spray Operations',
    overviewHeroDesc: 'Monitor chemical distributions, customer records, and payment installment settlements in real time.',
    recordSprayBtn: 'Record Spray',
    viewPaymentsBtn: 'Payment Center',
    recentApplications: 'Recent Spray Applications',
    recentApplicationsSubtitle: 'Latest field chemical spray records with payment status and due balances',
    viewAll: 'View All',
    noSpraysYet: 'No spray records created yet.',
    recordFirstSpray: 'Record First Spray',

    // Table Headers
    thDate: 'Date',
    thCustomer: 'Customer',
    thChemical: 'Chemical',
    thQtyPrice: 'Hectares & Price',
    thTotalPaid: 'Total / Paid Balance',
    thStatus: 'Payment Status',
    thActions: 'Actions',
    thInvoiceTotal: 'Invoice Total',
    thPhone: 'Phone',
    thCreated: 'Created',
    thRole: 'Role',
    thUser: 'User',

    // Payment Statuses
    statusPaid: 'Paid in Full',
    statusPartial: 'Partial',
    statusPending: 'Pending',
    statusUnpaid: 'Unpaid',

    // Actions & Buttons
    btnPay: 'Pay',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    btnCancel: 'Cancel',
    btnSave: 'Save',
    btnSaving: 'Saving...',
    btnDeleting: 'Deleting...',
    btnAddCustomer: 'Add Customer',
    btnNewSpray: 'New Spray Record',
    btnNewUser: 'New User',
    btnRecordPayment: 'Record Payment',
    btnPayFull: 'Pay Full',
    btnSettleFull: 'Pay Remaining Balance in Full',
    btnConfirmPayFull: 'Confirm Full Payment',
    confirmPayFullTitle: 'Verify Full Payment',
    confirmPayFullDesc: 'Are you sure you want to confirm full payment for',
    confirmPayFullAmount: 'Amount to settle in full:',
    confirmPayFullNote: 'This record will be updated to 100% Fully Paid.',
    payFullSuccess: 'Full payment recorded successfully!',
    btnConfirmDelete: 'Delete',

    // Search & Filters
    searchSprayCustomer: 'Search by spray chemical or customer...',
    searchCustomer: 'Search by customer name or phone...',
    searchUser: 'Search by username, email, or role...',
    filterAllCustomers: 'All Customers',
    filterAllStatuses: 'All Payment Statuses',
    filterPaidOnly: 'Paid Only',
    filterPartialOnly: 'Partial Payment',
    filterPendingOnly: 'Pending Only',
    filterUnpaidOnly: 'Unpaid Only',

    // Modals
    modalNewSprayTitle: 'Record New Spray',
    modalEditSprayTitle: 'Edit Spray Record',
    modalSprayDesc: 'Fill in the chemical application and payment installment details below',
    fieldDate: 'Date *',
    fieldCustomer: 'Customer (FK) *',
    selectCustomerPlaceholder: 'Select customer...',
    fieldSprayName: 'Spray / Chemical Name *',
    fieldQuantity: 'Hectares (ha) *',
    unitHectare: 'ha',
    fieldUnitPrice: 'Unit Price (៛) *',
    fieldPaidAmount: 'Paid So Far (៛)',
    fieldPaymentStatus: 'Payment Status *',
    totalCalculated: 'Total Calculated:',
    paidReceived: 'Paid Received:',
    remainingDue: 'Remaining Balance Due:',
    autoStatus: 'Auto-calculated Status:',
    presetZero: '0 ៛',

    // Quick Pay Modal
    quickPayTitle: 'Record Payment',
    quickPayDesc: 'Customer:',
    totalInvoice: 'Total Invoice:',
    alreadyCollected: 'Paid so far:',
    currentBalanceDue: 'Current Balance Due:',
    amountPaidToday: 'Additional Payment Received (៛)',
    errPaymentExceedsDue: 'Payment amount cannot exceed the current balance due',
    errPaymentExceedsTotal: 'Paid amount cannot exceed the total invoice price',

    // Delete Modals
    deleteSprayTitle: 'Delete Spray Record?',
    deleteSprayDesc: 'Are you sure you want to delete',
    deleteCustomerTitle: 'Delete Customer?',
    deleteCustomerDesc: 'Are you sure you want to delete',
    deleteUserTitle: 'Delete User Account?',
    deleteUserDesc: 'Are you sure you want to delete user',
    cannotUndo: 'This action cannot be undone.',
    cannotDeleteSelf: 'You cannot delete your own account!',
    adminOnlyDeleteUsers: 'Admins can only delete accounts with the user role!',
    cannotDeleteCustomerHasSprays: 'Cannot delete this customer because they have active spray records. Please delete or reassign their spray records first.',

    // Payments Page
    paymentsTitle: 'Payment & Settlement Hub',
    paymentsSubtitle: 'Track receivables, collect installments, and monitor outstanding farm accounts',
    totalBilled: 'Total Billed',
    collectedCash: 'Cash Collected',
    outstandingDue: 'Outstanding Due',
    partialAccounts: 'Partial Accounts',
    partiallyPaidJobs: 'Partially paid jobs',
    receivablesRemaining: 'Receivables remaining',
    fullySettled: 'Fully settled',
    leftDue: 'left',
    progress: 'Progress',

    // Customer Page
    customerDirectory: 'Customer Directory',
    customerDirectorySub: 'Manage farm owners, client accounts, and contact details',
    modalNewCustomer: 'Add New Customer',
    modalEditCustomer: 'Edit Customer',
    customerName: 'Customer Name *',
    customerPhone: 'Phone (Optional)',
    noPhone: 'No phone provided',

    // User Page
    userManagementTitle: 'System User Management',
    userManagementSub: 'Control user authorization levels (Admin / Super Admin privilege)',
    modalNewUser: 'Create New User',
    modalEditUser: 'Edit User',
    passwordPlaceholder: 'Min 6 characters',
    passwordLeaveBlank: 'Password (Leave blank to keep unchanged)',
    adminCannotEditSuper: 'Admins are not allowed to edit Super Admin accounts',

    // About Page
    aboutTitle: 'About ដ្រូនកសិកម្មព្រៃតូច',
    aboutSubtitle: 'Modern precision agricultural spraying and plantation service management system',
    aboutMissionTitle: 'Our Mission',
    aboutMissionDesc: 'Empowering modern agriculture through safe chemical application, waste reduction, and protecting farm worker health.',
    aboutVisionTitle: 'Our Vision',
    aboutVisionDesc: 'To be Cambodia’s leading agricultural operations platform delivering unmatched ease of use, transparency, and trust.',
    feature1Title: 'Precision Application',
    feature1Desc: 'Accurate logging of crop spray volumes, chemical formulations, and dosage timing.',
    feature2Title: 'Farm & Client Tracking',
    feature2Desc: 'Structured management of customer plantations, contact records, and spray histories.',
    feature3Title: 'Billing & Installments',
    feature3Desc: 'Automated settlement calculations and due balance ledgers with full Khmer Riel (៛) support.',
    feature4Title: 'Security & Access Control',
    feature4Desc: 'Enterprise-grade authentication with role-based access controls for team protection.',
    standardsTitle: 'Quality & Safety Standards',
    standardItem1: 'Chemical ratios calibrated precisely according to plantation land area',
    standardItem2: 'Spraying operators equipped with full certified PPE safety gear',
    standardItem3: 'Transparent pricing with no hidden charges or unaccounted fees',
    standardItem4: 'Free agricultural technical advisory and field consultation',

    // Contact Page
    contactTitle: 'Contact Our Team',
    contactSubtitle: 'Have questions, need service scheduling, or require technical support? Get in touch with us.',
    contactInfoTitle: 'Contact Information',
    phoneHotline: 'Support Hotline',
    phoneHotlineNumber: '+855 (0) 81 686 9014',
    telegramSupport: 'Telegram Support',
    telegramHandle: 'Nary (@Nary_drone)',
    emailSupport: 'Support Email',
    emailAddressVal: 'supportTeam@gmail.com',
    locationTitle: 'Operations Hub Location',
    locationDesc: 'Prey Touch Commune, Moung Ruessei District, Battambang Province',
    workingHoursTitle: 'Working Hours',
    workingHoursDesc: 'Monday - Saturday: 7:00 AM - 6:00 PM (សម្រាកថ្ងៃបុណ្យប្រចាំឆ្នាំ)',
    sendMessageTitle: 'Send Us a Message',
    sendMessageSub: 'Fill out the form below to submit an inquiry to our operations team',
    fullName: 'Full Name *',
    fullNamePlaceholder: 'e.g. Sok Chandara',
    phoneNumber: 'Phone Number *',
    phonePlaceholder: '012 345 678',
    subjectTopic: 'Topic / Inquiry *',
    subjectPlaceholder: 'Select topic...',
    topicGeneral: 'General Inquiries',
    topicSprayService: 'Request Spraying Service',
    topicBilling: 'Payment & Invoice Support',
    topicTechnical: 'Account Technical Help',
    messageContent: 'Your Message *',
    messagePlaceholder: 'Please describe your request, farmland size, or question here...',
    btnSendMessage: 'Send Message Now',
    messageSentSuccess: 'Your message has been sent successfully! Our team will reach out to you shortly.',

    // Toast Notifications
    toastLoginSuccess: 'Signed in successfully! Welcome back.',
    toastLogoutSuccess: 'Signed out successfully.',
    toastSignupSuccess: 'Account created and signed in successfully.',
    toastCustomerAdded: 'Customer added successfully.',
    toastCustomerUpdated: 'Customer updated successfully.',
    toastCustomerDeleted: 'Customer deleted successfully.',
    toastSprayAdded: 'Spray record added successfully.',
    toastSprayUpdated: 'Spray record updated successfully.',
    toastSprayDeleted: 'Spray record deleted successfully.',
    toastPaymentSuccess: 'Payment recorded successfully.',
    toastUserAdded: 'User created successfully.',
    toastUserUpdated: 'User updated successfully.',
    toastUserDeleted: 'User deleted successfully.',
  },
};

const LanguageContext = createContext(null);

export const formatRiel = (amount) => {
  const num = Number(amount) || 0;
  return num % 1 === 0
    ? `${num.toLocaleString('en-US')} ៛`
    : `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ៛`;
};

export const LanguageProvider = ({ children }) => {
  // Khmer is default ('km')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('spray_lang') || 'km';
  });

  const toggleLanguage = () => {
    const next = lang === 'km' ? 'en' : 'km';
    setLang(next);
    localStorage.setItem('spray_lang', next);
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('spray_lang', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['km']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, changeLanguage, t, formatRiel }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

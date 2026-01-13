/**
 * পাঠশালা ই-ম্যানেজার - অ্যাডমিন ম্যানেজার
 * School Management System - Admin Manager
 * Handles all admin panel functionality including all modules
 */

const AdminManager = {
    // Drag and drop instances
    menuSortable: null,
    sectionSortable: null,
    
    // Current module state
    currentModule: 'dashboard',
    currentSubModule: null,
    
    // Initialize admin panel
    init() {
        this.initDragAndDrop();
        this.initEventListeners();
        this.initContentEditorTabs();
        this.initModuleTabs();
    },
    
    // Initialize module tabs
    initModuleTabs() {
        const moduleTabs = document.querySelectorAll('.module-tab');
        moduleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const module = tab.dataset.module;
                this.switchModule(module);
            });
        });
    },
    
    // Switch between modules
    switchModule(moduleName) {
        this.currentModule = moduleName;
        
        // Update tab active states
        document.querySelectorAll('.module-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`.module-tab[data-module="${moduleName}"]`)?.classList.add('active');
        
        // Render module content
        RenderManager.renderModule(moduleName);
    },
    
    // Initialize drag and drop functionality
    initDragAndDrop() {
        // Menu drag and drop
        const menuList = document.getElementById('admin-menu-list');
        if (menuList) {
            this.menuSortable = new Sortable(menuList, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                onEnd: function(evt) {
                    console.log('Menu order changed');
                }
            });
        }
        
        // Section drag and drop
        const sectionList = document.getElementById('section-list');
        if (sectionList) {
            this.sectionSortable = new Sortable(sectionList, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                onEnd: function(evt) {
                    console.log('Section order changed');
                }
            });
        }
    },
    
    // Initialize all event listeners
    initEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Add menu form
        const addMenuForm = document.getElementById('add-menu-form');
        if (addMenuForm) {
            addMenuForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addMenuItem();
            });
        }
        
        // Hero form
        const heroForm = document.getElementById('hero-form');
        if (heroForm) {
            heroForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveHeroContent();
            });
        }
        
        // About form
        const aboutForm = document.getElementById('about-form');
        if (aboutForm) {
            aboutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAboutContent();
            });
        }
        
        // CTA form
        const ctaForm = document.getElementById('cta-form');
        if (ctaForm) {
            ctaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCTAContent();
            });
        }
        
        // Add notice form
        const addNoticeForm = document.getElementById('add-notice-form');
        if (addNoticeForm) {
            addNoticeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNotice();
            });
        }
        
        // School info form
        const schoolInfoForm = document.getElementById('school-info-form');
        if (schoolInfoForm) {
            schoolInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSchoolInfo();
            });
        }
        
        // Gallery upload
        this.initGalleryUpload();
        
        // Image inputs with preview
        this.initImagePreviews();
        
        // Module form listeners
        this.initStudentFormListeners();
        this.initTeacherFormListeners();
        this.initAttendanceFormListeners();
        this.initFeeFormListeners();
        this.initExamFormListeners();
        this.initPaymentFormListeners();
        this.initNotificationFormListeners();
    },
    
    // Initialize content editor tabs
    initContentEditorTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Remove active from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active to clicked
                btn.classList.add('active');
                const panel = document.getElementById(tabId);
                if (panel) panel.classList.add('active');
            });
        });
    },
    
    // Initialize gallery upload
    initGalleryUpload() {
        const uploadZone = document.getElementById('gallery-upload-zone');
        const uploadInput = document.getElementById('gallery-upload');
        
        if (uploadZone && uploadInput) {
            uploadZone.addEventListener('click', () => {
                uploadInput.click();
            });
            
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = '#4f46e5';
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.style.borderColor = '#e5e7eb';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = '#e5e7eb';
                const files = e.dataTransfer.files;
                this.handleGalleryUpload(files);
            });
            
            uploadInput.addEventListener('change', (e) => {
                this.handleGalleryUpload(e.target.files);
            });
        }
    },
    
    // Handle gallery image upload
    handleGalleryUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    StorageManager.addGalleryImage({
                        src: e.target.result,
                        caption: file.name.replace(/\.[^/.]+$/, '')
                    });
                    RenderManager.renderGalleryEditor();
                    showToast('ছবি যোগ করা হয়েছে', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    },
    
    // Initialize image previews
    initImagePreviews() {
        // Hero background image
        const heroBgInput = document.getElementById('hero-bg-image');
        if (heroBgInput) {
            heroBgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewImage(file, 'hero-bg-preview');
                }
            });
        }
        
        // About image
        const aboutImageInput = document.getElementById('about-image');
        if (aboutImageInput) {
            aboutImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewImage(file, 'about-image-preview');
                }
            });
        }
        
        // Student image
        const studentImageInput = document.getElementById('student-image');
        if (studentImageInput) {
            studentImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewImage(file, 'student-image-preview');
                }
            });
        }
        
        // Teacher image
        const teacherImageInput = document.getElementById('teacher-image');
        if (teacherImageInput) {
            teacherImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewImage(file, 'teacher-image-preview');
                }
            });
        }
    },
    
    // Preview image before upload
    previewImage(file, previewId) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
        };
        reader.readAsDataURL(file);
    },
    
    // ==================== Login Handling ====================
    
    handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // Simple admin check (in production, use proper authentication)
        if (username === 'admin' && password === 'admin123') {
            StorageManager.setAdminSession({ username, loginTime: Date.now() });
            this.showAdminPanel();
            showToast('স্বাগতম! অ্যাডমিন প্যানেলে প্রবেশ করুন', 'success');
        } else {
            showToast('ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল', 'error');
        }
    },
    
    showAdminPanel() {
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('public-view').classList.add('hidden');
        document.getElementById('admin-view').classList.remove('hidden');
        
        // Initialize admin content
        RenderManager.renderAdminMenu();
        RenderManager.renderPageSections();
        RenderManager.renderContentEditor();
        RenderManager.renderLandingSettings();
        RenderManager.renderDashboard();
    },
    
    logout() {
        StorageManager.clearAdminSession();
        document.getElementById('public-view').classList.remove('hidden');
        document.getElementById('admin-view').classList.add('hidden');
        showToast('লগআউট সম্পন্ন হয়েছে', 'info');
    },
    
    // ==================== Menu Management ====================
    
    addMenuItem() {
        const name = document.getElementById('menu-item-name').value;
        const link = document.getElementById('menu-item-link').value;
        const parent = document.getElementById('menu-item-parent').value;
        
        if (!name || !link) {
            showToast('অনুগ্রহ করে সমস্ত ফিল্ড পূরণ করুন', 'error');
            return;
        }
        
        StorageManager.addMenuItem({
            name,
            link,
            parent: parent ? parseInt(parent) : null
        });
        
        // Reset form
        document.getElementById('menu-item-name').value = '';
        document.getElementById('menu-item-link').value = '';
        document.getElementById('menu-item-parent').value = '';
        
        // Refresh menu list
        RenderManager.renderAdminMenu();
        showToast('মেনু আইটেম যোগ করা হয়েছে', 'success');
    },
    
    saveMenuOrder() {
        const menuList = document.getElementById('admin-menu-list');
        const items = menuList.querySelectorAll('li');
        const newOrder = [];
        
        items.forEach(item => {
            const id = parseInt(item.dataset.id);
            newOrder.push(id);
        });
        
        // Get current menu and reorder
        const currentMenu = StorageManager.getMenu();
        const reorderedMenu = newOrder.map(id => {
            return currentMenu.find(item => item.id === id);
        });
        
        StorageManager.saveMenu(reorderedMenu);
        
        // Show success message
        const status = document.getElementById('menu-save-status');
        status.textContent = '✓ সেভ হয়েছে';
        status.classList.add('show');
        setTimeout(() => status.classList.remove('show'), 2000);
        
        // Refresh public menu
        RenderManager.renderLandingPage();
    },
    
    // ==================== Section Management ====================
    
    saveSectionOrder() {
        const sectionList = document.getElementById('section-list');
        const items = sectionList.querySelectorAll('li');
        const newOrder = [];
        
        items.forEach(item => {
            newOrder.push(item.dataset.id);
        });
        
        StorageManager.updateSectionOrder(newOrder);
        
        // Show success message
        const status = document.getElementById('section-save-status');
        status.textContent = '✓ সেভ হয়েছে';
        status.classList.add('show');
        setTimeout(() => status.classList.remove('show'), 2000);
        
        showToast('সেকশন অর্ডার সেভ করা হয়েছে', 'success');
    },
    
    addNewSection() {
        const sectionName = prompt('নতুন সেকশনের নাম লিখুন:');
        if (sectionName) {
            const sectionId = 'custom_' + Date.now();
            StorageManager.addSection({
                id: sectionId,
                name: sectionName,
                type: 'custom'
            });
            RenderManager.renderPageSections();
            showToast('নতুন সেকশন যোগ করা হয়েছে', 'success');
        }
    },
    
    deleteSection(id) {
        if (confirm('এই সেকশন মুছে ফেলতে চান?')) {
            StorageManager.deleteSection(id);
            RenderManager.renderPageSections();
            showToast('সেকশন মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    // ==================== Content Editing ====================
    
    saveHeroContent() {
        const title = document.getElementById('hero-title').value;
        const subtitle = document.getElementById('hero-subtitle').value;
        const buttonText = document.getElementById('hero-btn-text').value;
        const buttonLink = document.getElementById('hero-btn-link').value;
        
        StorageManager.updateHero({
            title,
            subtitle,
            buttonText,
            buttonLink
        });
        
        // Handle background image
        const bgInput = document.getElementById('hero-bg-image');
        if (bgInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                StorageManager.updateHero({ backgroundImage: e.target.result });
                showToast('হিরো কন্টেন্ট সেভ করা হয়েছে', 'success');
            };
            reader.readAsDataURL(bgInput.files[0]);
        } else {
            showToast('হিরো কন্টেন্ট সেভ করা হয়েছে', 'success');
        }
    },
    
    saveAboutContent() {
        const title = document.getElementById('about-title').value;
        const description = document.getElementById('about-description').value;
        
        StorageManager.updateAbout({
            title,
            description
        });
        
        // Handle image
        const imageInput = document.getElementById('about-image');
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                StorageManager.updateAbout({ image: e.target.result });
                showToast('এবাউট কন্টেন্ট সেভ করা হয়েছে', 'success');
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            showToast('এবাউট কন্টেন্ট সেভ করা হয়েছে', 'success');
        }
    },
    
    saveCTAContent() {
        const title = document.getElementById('cta-title').value;
        const description = document.getElementById('cta-description').value;
        const buttonText = document.getElementById('cta-btn-text').value;
        const buttonLink = document.getElementById('cta-btn-link').value;
        
        StorageManager.updateCTA({
            title,
            description,
            buttonText,
            buttonLink
        });
        
        showToast('কল টু অ্যাকশন কন্টেন্ট সেভ করা হয়েছে', 'success');
    },
    
    addFeature() {
        const title = prompt('ফিচার শিরোনাম লিখুন:');
        if (title) {
            const description = prompt('ফিচার বিবরণ লিখুন:') || '';
            const icon = prompt('আইকন ক্লাস (যেমন: fas fa-star):', 'fas fa-star');
            
            StorageManager.addFeature({ title, description, icon });
            RenderManager.renderFeaturesEditor();
            showToast('ফিচার যোগ করা হয়েছে', 'success');
        }
    },
    
    updateFeature(id, field, value) {
        StorageManager.updateFeature(id, { [field]: value });
    },
    
    deleteFeature(id) {
        if (confirm('এই ফিচার মুছে ফেলতে চান?')) {
            StorageManager.deleteFeature(id);
            RenderManager.renderFeaturesEditor();
            showToast('ফিচার মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    addNotice() {
        const title = document.getElementById('notice-title').value;
        const date = document.getElementById('notice-date').value;
        const description = document.getElementById('notice-description').value;
        
        if (!title || !date) {
            showToast('শিরোনাম এবং তারিখ প্রয়োজন', 'error');
            return;
        }
        
        // Format date
        const formattedDate = this.formatDate(date);
        
        StorageManager.addNotice({
            title,
            date: formattedDate,
            description
        });
        
        // Reset form
        document.getElementById('notice-title').value = '';
        document.getElementById('notice-date').value = '';
        document.getElementById('notice-description').value = '';
        
        RenderManager.renderNoticesEditor();
        showToast('নোটিশ যোগ করা হয়েছে', 'success');
    },
    
    deleteNotice(id) {
        if (confirm('এই নোটিশ মুছে ফেলতে চান?')) {
            StorageManager.deleteNotice(id);
            RenderManager.renderNoticesEditor();
            showToast('নোটিশ মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    deleteGalleryImage(id) {
        if (confirm('এই ছবি মুছে ফেলতে চান?')) {
            StorageManager.deleteGalleryImage(id);
            RenderManager.renderGalleryEditor();
            showToast('ছবি মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    // ==================== School Settings ====================
    
    saveSchoolInfo() {
        const config = StorageManager.getConfig();
        
        config.name = document.getElementById('school-name').value;
        config.tagline = document.getElementById('school-tagline').value;
        config.established = document.getElementById('school-established').value;
        config.address = document.getElementById('school-address').value;
        config.phone = document.getElementById('school-phone').value;
        config.email = document.getElementById('school-email').value;
        config.facebook = document.getElementById('school-facebook').value;
        config.youtube = document.getElementById('school-youtube').value;
        
        StorageManager.saveConfig(config);
        
        // Handle logo upload
        const logoInput = document.getElementById('school-logo-upload');
        if (logoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                config.logo = e.target.result;
                StorageManager.saveConfig(config);
                showToast('সমস্ত সেটিংস সেভ করা হয়েছে', 'success');
            };
            reader.readAsDataURL(logoInput.files[0]);
        } else {
            showToast('সমস্ত সেটিংস সেভ করা হয়েছে', 'success');
        }
    },
    
    // ==================== Student Module ====================
    
    initStudentFormListeners() {
        // Add student form
        const addStudentForm = document.getElementById('add-student-form');
        if (addStudentForm) {
            addStudentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addStudent();
            });
        }
        
        // Search students
        const studentSearch = document.getElementById('student-search');
        if (studentSearch) {
            studentSearch.addEventListener('input', (e) => {
                this.searchStudents(e.target.value);
            });
        }
        
        // Filter by class
        const studentClassFilter = document.getElementById('student-class-filter');
        if (studentClassFilter) {
            studentClassFilter.addEventListener('change', (e) => {
                RenderManager.renderStudentList(parseInt(e.target.value));
            });
        }
    },
    
    addStudent() {
        const studentData = {
            firstName: document.getElementById('student-first-name').value,
            lastName: document.getElementById('student-last-name').value,
            gender: document.getElementById('student-gender').value,
            dateOfBirth: document.getElementById('student-dob').value,
            religion: document.getElementById('student-religion').value,
            bloodGroup: document.getElementById('student-blood-group').value,
            phone: document.getElementById('student-phone').value,
            email: document.getElementById('student-email').value,
            classId: parseInt(document.getElementById('student-class').value),
            section: document.getElementById('student-section').value,
            rollNumber: parseInt(document.getElementById('student-roll').value) || 0,
            fatherName: document.getElementById('student-father-name').value,
            fatherPhone: document.getElementById('student-father-phone').value,
            motherName: document.getElementById('student-mother-name').value,
            address: document.getElementById('student-address').value
        };
        
        if (!studentData.firstName || !studentData.classId) {
            showToast('অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
            return;
        }
        
        const newStudent = StorageManager.addStudent(studentData);
        
        // Handle image
        const imageInput = document.getElementById('student-image');
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                StorageManager.updateStudent(newStudent.id, { image: e.target.result });
                this.resetStudentForm();
                showToast('শিক্ষার্থী যোগ করা হয়েছে', 'success');
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            this.resetStudentForm();
            showToast('শিক্ষার্থী যোগ করা হয়েছে', 'success');
        }
    },
    
    updateStudent() {
        const studentId = document.getElementById('edit-student-id').value;
        if (!studentId) return;
        
        const studentData = {
            firstName: document.getElementById('edit-student-first-name').value,
            lastName: document.getElementById('edit-student-last-name').value,
            gender: document.getElementById('edit-student-gender').value,
            dateOfBirth: document.getElementById('edit-student-dob').value,
            religion: document.getElementById('edit-student-religion').value,
            bloodGroup: document.getElementById('edit-student-blood-group').value,
            phone: document.getElementById('edit-student-phone').value,
            email: document.getElementById('edit-student-email').value,
            classId: parseInt(document.getElementById('edit-student-class').value),
            section: document.getElementById('edit-student-section').value,
            rollNumber: parseInt(document.getElementById('edit-student-roll').value) || 0,
            fatherName: document.getElementById('edit-student-father-name').value,
            fatherPhone: document.getElementById('edit-student-father-phone').value,
            motherName: document.getElementById('edit-student-mother-name').value,
            address: document.getElementById('edit-student-address').value,
            status: document.getElementById('edit-student-status').value
        };
        
        StorageManager.updateStudent(parseInt(studentId), studentData);
        this.closeModal('student-edit-modal');
        RenderManager.renderStudentList();
        showToast('শিক্ষার্থীর তথ্য আপডেট হয়েছে', 'success');
    },
    
    deleteStudent(id) {
        if (confirm('এই শিক্ষার্থী মুছে ফেলতে চান?')) {
            StorageManager.deleteStudent(id);
            RenderManager.renderStudentList();
            showToast('শিক্ষার্থী মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    editStudent(id) {
        const student = StorageManager.getStudentById(id);
        if (!student) return;
        
        document.getElementById('edit-student-id').value = student.id;
        document.getElementById('edit-student-first-name').value = student.firstName;
        document.getElementById('edit-student-last-name').value = student.lastName;
        document.getElementById('edit-student-gender').value = student.gender;
        document.getElementById('edit-student-dob').value = student.dateOfBirth;
        document.getElementById('edit-student-religion').value = student.religion;
        document.getElementById('edit-student-blood-group').value = student.bloodGroup;
        document.getElementById('edit-student-phone').value = student.phone;
        document.getElementById('edit-student-email').value = student.email;
        document.getElementById('edit-student-class').value = student.classId;
        document.getElementById('edit-student-section').value = student.section;
        document.getElementById('edit-student-roll').value = student.rollNumber;
        document.getElementById('edit-student-father-name').value = student.fatherName;
        document.getElementById('edit-student-father-phone').value = student.fatherPhone;
        document.getElementById('edit-student-mother-name').value = student.motherName;
        document.getElementById('edit-student-address').value = student.address;
        document.getElementById('edit-student-status').value = student.status;
        
        this.openModal('student-edit-modal');
    },
    
    resetStudentForm() {
        document.getElementById('add-student-form').reset();
        document.getElementById('student-image-preview').innerHTML = '<i class="fas fa-user"></i>';
        RenderManager.renderStudentList();
    },
    
    searchStudents(query) {
        if (query.length < 2) {
            RenderManager.renderStudentList();
            return;
        }
        const results = StorageManager.searchStudents(query);
        RenderManager.renderStudentList(null, results);
    },
    
    // ==================== Teacher Module ====================
    
    initTeacherFormListeners() {
        const addTeacherForm = document.getElementById('add-teacher-form');
        if (addTeacherForm) {
            addTeacherForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTeacher();
            });
        }
        
        const teacherSearch = document.getElementById('teacher-search');
        if (teacherSearch) {
            teacherSearch.addEventListener('input', (e) => {
                this.searchTeachers(e.target.value);
            });
        }
    },
    
    addTeacher() {
        const teacherData = {
            firstName: document.getElementById('teacher-first-name').value,
            lastName: document.getElementById('teacher-last-name').value,
            gender: document.getElementById('teacher-gender').value,
            dateOfBirth: document.getElementById('teacher-dob').value,
            qualification: document.getElementById('teacher-qualification').value,
            designation: document.getElementById('teacher-designation').value,
            subject: document.getElementById('teacher-subject').value,
            phone: document.getElementById('teacher-phone').value,
            email: document.getElementById('teacher-email').value,
            joinDate: document.getElementById('teacher-join-date').value,
            address: document.getElementById('teacher-address').value
        };
        
        if (!teacherData.firstName || !teacherData.subject) {
            showToast('অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
            return;
        }
        
        const newTeacher = StorageManager.addTeacher(teacherData);
        
        // Handle image
        const imageInput = document.getElementById('teacher-image');
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                StorageManager.updateTeacher(newTeacher.id, { image: e.target.result });
                this.resetTeacherForm();
                showToast('শিক্ষক যোগ করা হয়েছে', 'success');
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            this.resetTeacherForm();
            showToast('শিক্ষক যোগ করা হয়েছে', 'success');
        }
    },
    
    updateTeacher() {
        const teacherId = document.getElementById('edit-teacher-id').value;
        if (!teacherId) return;
        
        const teacherData = {
            firstName: document.getElementById('edit-teacher-first-name').value,
            lastName: document.getElementById('edit-teacher-last-name').value,
            gender: document.getElementById('edit-teacher-gender').value,
            dateOfBirth: document.getElementById('edit-teacher-dob').value,
            qualification: document.getElementById('edit-teacher-qualification').value,
            designation: document.getElementById('edit-teacher-designation').value,
            subject: document.getElementById('edit-teacher-subject').value,
            phone: document.getElementById('edit-teacher-phone').value,
            email: document.getElementById('edit-teacher-email').value,
            joinDate: document.getElementById('edit-teacher-join-date').value,
            address: document.getElementById('edit-teacher-address').value,
            status: document.getElementById('edit-teacher-status').value
        };
        
        StorageManager.updateTeacher(parseInt(teacherId), teacherData);
        this.closeModal('teacher-edit-modal');
        RenderManager.renderTeacherList();
        showToast('শিক্ষকের তথ্য আপডেট হয়েছে', 'success');
    },
    
    deleteTeacher(id) {
        if (confirm('এই শিক্ষক মুছে ফেলতে চান?')) {
            StorageManager.deleteTeacher(id);
            RenderManager.renderTeacherList();
            showToast('শিক্ষক মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    editTeacher(id) {
        const teacher = StorageManager.getTeacherById(id);
        if (!teacher) return;
        
        document.getElementById('edit-teacher-id').value = teacher.id;
        document.getElementById('edit-teacher-first-name').value = teacher.firstName;
        document.getElementById('edit-teacher-last-name').value = teacher.lastName;
        document.getElementById('edit-teacher-gender').value = teacher.gender;
        document.getElementById('edit-teacher-dob').value = teacher.dateOfBirth;
        document.getElementById('edit-teacher-qualification').value = teacher.qualification;
        document.getElementById('edit-teacher-designation').value = teacher.designation;
        document.getElementById('edit-teacher-subject').value = teacher.subject;
        document.getElementById('edit-teacher-phone').value = teacher.phone;
        document.getElementById('edit-teacher-email').value = teacher.email;
        document.getElementById('edit-teacher-join-date').value = teacher.joinDate;
        document.getElementById('edit-teacher-address').value = teacher.address;
        document.getElementById('edit-teacher-status').value = teacher.status;
        
        this.openModal('teacher-edit-modal');
    },
    
    resetTeacherForm() {
        document.getElementById('add-teacher-form').reset();
        document.getElementById('teacher-image-preview').innerHTML = '<i class="fas fa-user"></i>';
        RenderManager.renderTeacherList();
    },
    
    searchTeachers(query) {
        if (query.length < 2) {
            RenderManager.renderTeacherList();
            return;
        }
        const results = StorageManager.searchTeachers(query);
        RenderManager.renderTeacherList(results);
    },
    
    // ==================== Attendance Module ====================
    
    initAttendanceFormListeners() {
        const takeAttendanceBtn = document.getElementById('take-attendance-btn');
        if (takeAttendanceBtn) {
            takeAttendanceBtn.addEventListener('click', () => {
                this.loadAttendanceForm();
            });
        }
        
        const saveAttendanceBtn = document.getElementById('save-attendance-btn');
        if (saveAttendanceBtn) {
            saveAttendanceBtn.addEventListener('click', () => {
                this.saveDailyAttendance();
            });
        }
        
        const attendanceDate = document.getElementById('attendance-date');
        if (attendanceDate) {
            attendanceDate.valueAsDate = new Date();
            attendanceDate.addEventListener('change', () => {
                this.loadAttendanceForm();
            });
        }
        
        const attendanceClass = document.getElementById('attendance-class');
        if (attendanceClass) {
            attendanceClass.addEventListener('change', () => {
                this.loadAttendanceForm();
            });
        }
        
        // Mark all buttons
        const markAllPresent = document.getElementById('mark-all-present');
        if (markAllPresent) {
            markAllPresent.addEventListener('click', () => {
                this.markAllAttendance('present');
            });
        }
        
        const markAllAbsent = document.getElementById('mark-all-absent');
        if (markAllAbsent) {
            markAllAbsent.addEventListener('click', () => {
                this.markAllAttendance('absent');
            });
        }
    },
    
    loadAttendanceForm() {
        const classId = parseInt(document.getElementById('attendance-class').value);
        const date = document.getElementById('attendance-date').value;
        
        if (!classId) {
            showToast('শ্রেণি নির্বাচন করুন', 'error');
            return;
        }
        
        const students = StorageManager.getStudentsByClass(classId);
        const existingAttendance = StorageManager.getAttendanceByDate(date, classId);
        
        RenderManager.renderAttendanceForm(students, existingAttendance?.records || {});
    },
    
    markAllAttendance(status) {
        const buttons = document.querySelectorAll('.attendance-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.status === status) {
                btn.classList.add('active');
            }
        });
    },
    
    saveDailyAttendance() {
        const classId = parseInt(document.getElementById('attendance-class').value);
        const date = document.getElementById('attendance-date').value;
        
        if (!classId) {
            showToast('শ্রেণি নির্বাচন করুন', 'error');
            return;
        }
        
        const records = {};
        const studentInputs = document.querySelectorAll('[name="attendance-status"]');
        studentInputs.forEach(input => {
            records[input.dataset.studentId] = input.value;
        });
        
        StorageManager.saveDailyAttendance(date, classId, records);
        showToast('উপস্থিতি সেভ করা হয়েছে', 'success');
    },
    
    // ==================== Fee Module ====================
    
    initFeeFormListeners() {
        const createInvoiceBtn = document.getElementById('create-invoice-btn');
        if (createInvoiceBtn) {
            createInvoiceBtn.addEventListener('click', () => {
                this.createInvoice();
            });
        }
        
        const feeClassFilter = document.getElementById('fee-class-filter');
        if (feeClassFilter) {
            feeClassFilter.addEventListener('change', (e) => {
                RenderManager.renderFeeList(parseInt(e.target.value));
            });
        }
        
        const feeStatusFilter = document.getElementById('fee-status-filter');
        if (feeStatusFilter) {
            feeStatusFilter.addEventListener('change', (e) => {
                RenderManager.renderFeeList(null, e.target.value);
            });
        }
    },
    
    createInvoice() {
        const studentId = document.getElementById('invoice-student').value;
        const feeTypeId = document.getElementById('invoice-fee-type').value;
        const dueDate = document.getElementById('invoice-due-date').value;
        const notes = document.getElementById('invoice-notes').value;
        
        if (!studentId || !feeTypeId) {
            showToast('শিক্ষার্থী এবং ফি প্রকার নির্বাচন করুন', 'error');
            return;
        }
        
        const feeTypes = StorageManager.getFeeTypes();
        const feeType = feeTypes.find(f => f.id === parseInt(feeTypeId));
        
        if (!feeType) return;
        
        const student = StorageManager.getStudentById(parseInt(studentId));
        
        StorageManager.addFee({
            studentId: parseInt(studentId),
            feeTypeId: parseInt(feeTypeId),
            feeTypeName: feeType.name,
            amount: feeType.amount,
            waiver: 0,
            finalAmount: feeType.amount,
            dueDate: dueDate,
            status: 'unpaid',
            notes: notes
        });
        
        showToast('ইনভয়েস তৈরি হয়েছে', 'success');
        RenderManager.renderFeeList();
    },
    
    generateBulkInvoice() {
        const classId = parseInt(document.getElementById('bulk-fee-class').value);
        const feeTypeId = document.getElementById('bulk-fee-type').value;
        const dueDate = document.getElementById('bulk-fee-due-date').value;
        
        if (!classId || !feeTypeId) {
            showToast('শ্রেণি এবং ফি প্রকার নির্বাচন করুন', 'error');
            return;
        }
        
        const students = StorageManager.getStudentsByClass(classId);
        const feeTypes = StorageManager.getFeeTypes();
        const feeType = feeTypes.find(f => f.id === parseInt(feeTypeId));
        
        if (!feeType) return;
        
        let count = 0;
        students.forEach(student => {
            StorageManager.addFee({
                studentId: student.id,
                feeTypeId: feeType.id,
                feeTypeName: feeType.name,
                amount: feeType.amount,
                waiver: 0,
                finalAmount: feeType.amount,
                dueDate: dueDate,
                status: 'unpaid'
            });
            count++;
        });
        
        showToast(`${count}টি ইনভয়েস তৈরি হয়েছে`, 'success');
        RenderManager.renderFeeList();
    },
    
    deleteFee(id) {
        if (confirm('এই ইনভয়েস মুছে ফেলতে চান?')) {
            let fees = StorageManager.getFees();
            fees = fees.filter(f => f.id !== id);
            StorageManager.saveFees(fees);
            RenderManager.renderFeeList();
            showToast('ইনভয়েস মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    // ==================== Exam Module ====================
    
    initExamFormListeners() {
        const addExamForm = document.getElementById('add-exam-form');
        if (addExamForm) {
            addExamForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExam();
            });
        }
        
        const examClassFilter = document.getElementById('exam-class-filter');
        if (examClassFilter) {
            examClassFilter.addEventListener('change', (e) => {
                RenderManager.renderExamList(parseInt(e.target.value));
            });
        }
    },
    
    addExam() {
        const examData = {
            name: document.getElementById('exam-name').value,
            type: document.getElementById('exam-type').value,
            classId: parseInt(document.getElementById('exam-class').value),
            startDate: document.getElementById('exam-start-date').value,
            endDate: document.getElementById('exam-end-date').value
        };
        
        if (!examData.name || !examData.startDate) {
            showToast('পরীক্ষার নাম এবং তারিখ প্রয়োজন', 'error');
            return;
        }
        
        examData.startDate = this.formatDate(examData.startDate);
        examData.endDate = this.formatDate(examData.endDate);
        
        StorageManager.addExam(examData);
        document.getElementById('add-exam-form').reset();
        RenderManager.renderExamList();
        showToast('পরীক্ষা যোগ করা হয়েছে', 'success');
    },
    
    updateExam() {
        const examId = document.getElementById('edit-exam-id').value;
        if (!examId) return;
        
        const examData = {
            name: document.getElementById('edit-exam-name').value,
            type: document.getElementById('edit-exam-type').value,
            classId: parseInt(document.getElementById('edit-exam-class').value),
            status: document.getElementById('edit-exam-status').value
        };
        
        StorageManager.updateExam(parseInt(examId), examData);
        this.closeModal('exam-edit-modal');
        RenderManager.renderExamList();
        showToast('পরীক্ষার তথ্য আপডেট হয়েছে', 'success');
    },
    
    deleteExam(id) {
        if (confirm('এই পরীক্ষা মুছে ফেলতে চান?')) {
            StorageManager.deleteExam(id);
            RenderManager.renderExamList();
            showToast('পরীক্ষা মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    editExam(id) {
        const exam = StorageManager.getExamById(id);
        if (!exam) return;
        
        document.getElementById('edit-exam-id').value = exam.id;
        document.getElementById('edit-exam-name').value = exam.name;
        document.getElementById('edit-exam-type').value = exam.type;
        document.getElementById('edit-exam-class').value = exam.classId;
        document.getElementById('edit-exam-status').value = exam.status;
        
        this.openModal('exam-edit-modal');
    },
    
    // ==================== Result Module ====================
    
    addResult(examId, studentId, marks) {
        const subjects = StorageManager.getSubjects();
        const student = StorageManager.getStudentById(studentId);
        
        if (!student) return;
        
        // Calculate grade based on first subject for simplicity
        const gradeResult = StorageManager.calculateGrade(marks, 100);
        
        StorageManager.addResult({
            examId: examId,
            studentId: studentId,
            marks: marks,
            grade: gradeResult.grade,
            gpa: gradeResult.gpa
        });
    },
    
    // ==================== Payment Module ====================
    
    initPaymentFormListeners() {
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processPayment();
            });
        }
        
        const paymentMethodBtns = document.querySelectorAll('.payment-method');
        paymentMethodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.payment-method').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('selected-payment-method').value = btn.dataset.method;
            });
        });
    },
    
    processPayment() {
        const studentId = parseInt(document.getElementById('payment-student').value);
        const feeId = parseInt(document.getElementById('payment-fee').value);
        const method = document.getElementById('selected-payment-method').value;
        
        if (!studentId || !feeId || !method) {
            showToast('সমস্ত তথ্য পূরণ করুন', 'error');
            return;
        }
        
        const fees = StorageManager.getFees();
        const fee = fees.find(f => f.id === feeId);
        
        if (!fee) return;
        
        // Process payment
        const transactionId = 'TXN-' + Date.now();
        
        StorageManager.addPayment({
            studentId: studentId,
            feeId: feeId,
            amount: fee.finalAmount,
            method: method,
            transactionId: transactionId
        });
        
        // Update fee status
        StorageManager.updateFee(feeId, {
            status: 'paid',
            paidDate: new Date().toLocaleDateString('bn-BD'),
            paymentMethod: method,
            transactionId: transactionId
        });
        
        showToast('পেমেন্ট সফল! লেনদেন আইডি: ' + transactionId, 'success');
        this.closeModal('payment-modal');
        RenderManager.renderFeeList();
    },
    
    openPaymentModal(feeId) {
        const fees = StorageManager.getFees();
        const fee = fees.find(f => f.id === feeId);
        
        if (!fee) return;
        
        const student = StorageManager.getStudentById(fee.studentId);
        if (!student) return;
        
        document.getElementById('payment-student').value = student.id;
        document.getElementById('payment-student-name').textContent = student.banglaName;
        document.getElementById('payment-fee').value = fee.id;
        document.getElementById('payment-amount').textContent = fee.finalAmount + ' টাকা';
        document.getElementById('payment-description').textContent = fee.feeTypeName;
        
        this.openModal('payment-modal');
    },
    
    // ==================== Notification Module ====================
    
    initNotificationFormListeners() {
        const sendNotificationForm = document.getElementById('send-notification-form');
        if (sendNotificationForm) {
            sendNotificationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendNotification();
            });
        }
        
        const notificationTypeBtns = document.querySelectorAll('.notification-type-btn');
        notificationTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.notification-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },
    
    sendNotification() {
        const type = document.querySelector('.notification-type-btn.active')?.dataset.type || 'system';
        const title = document.getElementById('notification-title').value;
        const message = document.getElementById('notification-message').value;
        const recipients = document.getElementById('notification-recipients').value;
        
        if (!title || !message) {
            showToast('শিরোনাম এবং বার্তা প্রয়োজন', 'error');
            return;
        }
        
        let recipientList = [];
        if (recipients === 'all') {
            const students = StorageManager.getStudents();
            recipientList = students.map(s => s.id);
        } else if (recipients) {
            recipientList = recipients.split(',').map(id => parseInt(id.trim()));
        }
        
        // Simulate sending
        StorageManager.addNotification({
            type: type,
            title: title,
            message: message,
            recipients: recipientList,
            status: 'sent'
        });
        
        showToast('নোটিফিকেশন পাঠানো হয়েছে', 'success');
        document.getElementById('send-notification-form').reset();
        RenderManager.renderNotificationList();
    },
    
    deleteNotification(id) {
        if (confirm('এই নোটিফিকেশন মুছে ফেলতে চান?')) {
            StorageManager.deleteNotification(id);
            RenderManager.renderNotificationList();
            showToast('নোটিফিকেশন মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    // ==================== Modal Helpers ====================
    
    openModal(modalId) {
        document.getElementById(modalId)?.classList.add('open');
    },
    
    closeModal(modalId) {
        document.getElementById(modalId)?.classList.remove('open');
    },
    
    // ==================== Utility Functions ====================
    
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                       'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
        return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
    },
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('bn-BD').format(amount) + ' টাকা';
    },
    
    getBanglaNumber(number) {
        const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return String(number).split('').map(d => banglaDigits[parseInt(d)] || d).join('');
    }
};

// Make it globally accessible
window.AdminManager = AdminManager;

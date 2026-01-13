/**
 * পাঠশালা ই-ম্যানেজার - রেন্ডার ম্যানেজার
 * School Management System - Render Manager
 * Handles all UI rendering for both public and admin views
 */

const RenderManager = {
    // ==================== Public Landing Page Rendering ====================
    
    // Render complete landing page
    renderLandingPage() {
        const config = StorageManager.getConfig();
        const menu = StorageManager.getMenu();
        const sections = StorageManager.getSections().filter(s => s.visible);
        
        // Update header
        this.renderHeader(config, menu);
        
        // Update footer
        this.renderFooter(config);
        
        // Render content sections
        const contentContainer = document.getElementById('landing-content');
        if (contentContainer) {
            contentContainer.innerHTML = '';
            
            // Sort sections by order
            sections.sort((a, b) => a.order - b.order);
            
            // Render each section
            sections.forEach(section => {
                const sectionElement = this.renderSection(section);
                if (sectionElement) {
                    contentContainer.appendChild(sectionElement);
                }
            });
        }
    },
    
    // Render header
    renderHeader(config, menu) {
        // Update school name
        const headerName = document.getElementById('header-school-name');
        if (headerName) headerName.textContent = config.name;
        
        const headerTagline = document.getElementById('header-school-tagline');
        if (headerTagline) headerTagline.textContent = config.tagline;
        
        // Update logo
        const logoImg = document.getElementById('school-logo');
        if (logoImg && config.logo) {
            logoImg.src = config.logo;
        }
        
        // Render navigation menu
        const navMenu = document.getElementById('nav-menu');
        const mobileNav = document.getElementById('mobile-nav-menu');
        
        if (navMenu) {
            navMenu.innerHTML = '';
            menu.forEach(item => {
                if (!item.parent) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${item.link}">${item.name}</a>`;
                    navMenu.appendChild(li);
                }
            });
        }
        
        if (mobileNav) {
            mobileNav.innerHTML = '';
            menu.forEach(item => {
                if (!item.parent) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${item.link}">${item.name}</a>`;
                    mobileNav.appendChild(li);
                }
            });
        }
    },
    
    // Render footer
    renderFooter(config) {
        const footerAddress = document.getElementById('footer-address');
        const footerPhone = document.getElementById('footer-phone');
        const footerEmail = document.getElementById('footer-email');
        
        if (footerAddress) footerAddress.textContent = config.address;
        if (footerPhone) footerPhone.textContent = config.phone;
        if (footerEmail) footerEmail.textContent = config.email;
    },
    
    // Render a section
    renderSection(section) {
        switch (section.type) {
            case 'hero':
                return this.renderHeroSection();
            case 'features':
                return this.renderFeaturesSection();
            case 'about':
                return this.renderAboutSection();
            case 'gallery':
                return this.renderGallerySection();
            case 'notices':
                return this.renderNoticesSection();
            case 'cta':
                return this.renderCTASection();
            default:
                return this.renderCustomSection(section);
        }
    },
    
    // Render hero section
    renderHeroSection() {
        const hero = StorageManager.getHero();
        const section = document.createElement('section');
        section.className = 'hero-section';
        section.id = 'hero';
        
        const bgStyle = hero.backgroundImage 
            ? `background-image: linear-gradient(135deg, rgba(0, 105, 92, 0.9), rgba(0, 77, 64, 0.8)), url('${hero.backgroundImage}');`
            : '';
        
        section.innerHTML = `
            <div class="hero-content">
                <h1>${hero.title}</h1>
                <p>${hero.subtitle}</p>
                <a href="${hero.buttonLink}" class="btn-cta">${hero.buttonText}</a>
            </div>
        `;
        
        if (bgStyle) {
            section.style = bgStyle;
        }
        
        return section;
    },
    
    // Render features section
    renderFeaturesSection() {
        const features = StorageManager.getFeatures();
        const section = document.createElement('section');
        section.className = 'features-section';
        section.id = 'features';
        
        let featuresHTML = '<div class="features-grid">';
        features.forEach(feature => {
            featuresHTML += `
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="${feature.icon}"></i>
                    </div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `;
        });
        featuresHTML += '</div>';
        
        section.innerHTML = `
            <div class="section-header">
                <h2>আমাদের বৈশিষ্ট্য</h2>
                <p>শিক্ষার্থীদের সর্বোত্তম শিক্ষা প্রদানের জন্য আমরা যা করি</p>
            </div>
            ${featuresHTML}
        `;
        
        return section;
    },
    
    // Render about section
    renderAboutSection() {
        const about = StorageManager.getAbout();
        const section = document.createElement('section');
        section.className = 'about-section';
        section.id = 'about';
        
        section.innerHTML = `
            <div class="about-container">
                <div class="about-image">
                    ${about.image 
                        ? `<img src="${about.image}" alt="আমাদের সম্পর্কে">`
                        : '<div style="background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); width: 100%; height: 400px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">ছবি যোগ করুন</div>'
                    }
                </div>
                <div class="about-content">
                    <h2>${about.title}</h2>
                    ${about.description.split('\n').map(p => `<p>${p}</p>`).join('')}
                    <div class="about-features">
                        <div class="about-feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>অভিজ্ঞ শিক্ষকমণ্ডলী</span>
                        </div>
                        <div class="about-feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>আধুনিক সুবিধাদি</span>
                        </div>
                        <div class="about-feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>সুরক্ষিত পরিবেশ</span>
                        </div>
                        <div class="about-feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>সর্বোত্তম শিক্ষা</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return section;
    },
    
    // Render gallery section
    renderGallerySection() {
        const gallery = StorageManager.getGallery();
        const section = document.createElement('section');
        section.className = 'gallery-section';
        section.id = 'gallery';
        
        let galleryHTML = '<div class="gallery-grid">';
        if (gallery.length === 0) {
            galleryHTML += `
                <div class="gallery-item" style="background: var(--bg-light); display: flex; align-items: center; justify-content: center; min-height: 250px;">
                    <p style="color: var(--text-medium);">এখনো কোনো ছবি যোগ করা হয়নি</p>
                </div>
            `;
        } else {
            gallery.forEach(img => {
                galleryHTML += `
                    <div class="gallery-item">
                        <img src="${img.src}" alt="${img.caption}">
                        <div class="gallery-overlay">
                            <span>${img.caption}</span>
                        </div>
                    </div>
                `;
            });
        }
        galleryHTML += '</div>';
        
        section.innerHTML = `
            <div class="section-header">
                <h2>ফটো গ্যালারি</h2>
                <p>আমাদের স্কুলের মুহূর্তগুলো</p>
            </div>
            ${galleryHTML}
        `;
        
        return section;
    },
    
    // Render notices section
    renderNoticesSection() {
        const notices = StorageManager.getNotices();
        const section = document.createElement('section');
        section.className = 'notice-section';
        section.id = 'notices';
        
        let noticesHTML = '';
        notices.forEach(notice => {
            noticesHTML += `
                <div class="notice-item">
                    <span class="notice-date">${notice.date}</span>
                    <h4>${notice.title}</h4>
                    <p>${notice.description}</p>
                </div>
            `;
        });
        
        section.innerHTML = `
            <div class="notice-container">
                <div class="section-header">
                    <h2>নোটিশ বোর্ড</h2>
                    <p>সাম্প্রতিক নোটিশ এবং ঘোষণা</p>
                </div>
                <div class="notice-board">
                    <div class="notice-header">
                        <h3><i class="fas fa-bullhorn"></i> সাম্প্রতিক নোটিশ</h3>
                    </div>
                    <div class="notice-list">
                        ${noticesHTML}
                    </div>
                </div>
            </div>
        `;
        
        return section;
    },
    
    // Render CTA section
    renderCTASection() {
        const cta = StorageManager.getCTA();
        const section = document.createElement('section');
        section.className = 'cta-section';
        section.id = 'cta';
        
        section.innerHTML = `
            <div class="cta-content">
                <h2>${cta.title}</h2>
                <p>${cta.description}</p>
                <a href="${cta.buttonLink}" class="btn-cta">${cta.buttonText}</a>
            </div>
        `;
        
        return section;
    },
    
    // Render custom section
    renderCustomSection(section) {
        const el = document.createElement('section');
        el.id = section.id;
        el.className = 'custom-section';
        el.innerHTML = `
            <div class="section-header">
                <h2>${section.name}</h2>
            </div>
            <p style="text-align: center; color: var(--text-medium);">এই সেকশনের জন্য কন্টেন্ট যোগ করুন</p>
        `;
        return el;
    },
    
    // ==================== Admin Panel Rendering ====================
    
    // Render admin menu
    renderAdminMenu() {
        const menu = StorageManager.getMenu();
        const menuList = document.getElementById('admin-menu-list');
        const parentSelect = document.getElementById('menu-item-parent');
        
        if (menuList) {
            menuList.innerHTML = '';
            menu.forEach(item => {
                const li = document.createElement('li');
                li.dataset.id = item.id;
                li.innerHTML = `
                    <div class="menu-item-info">
                        <span class="drag-handle"><i class="fas fa-grip-vertical"></i></span>
                        <span>${item.name}</span>
                    </div>
                    <div class="menu-actions">
                        <button class="edit-menu" title="সম্পাদনা"><i class="fas fa-edit"></i></button>
                        <button class="delete" title="মুছুন"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                menuList.appendChild(li);
            });
        }
        
        if (parentSelect) {
            parentSelect.innerHTML = '<option value="">কোনো প্যারেন্ট নেই (মূল মেনু)</option>';
            menu.forEach(item => {
                if (!item.parent) {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.name;
                    parentSelect.appendChild(option);
                }
            });
        }
    },
    
    // Render page sections
    renderPageSections() {
        const sections = StorageManager.getSections();
        const sectionList = document.getElementById('section-list');
        
        if (sectionList) {
            sectionList.innerHTML = '';
            sections.sort((a, b) => a.order - b.order).forEach(section => {
                const li = document.createElement('li');
                li.dataset.id = section.id;
                li.innerHTML = `
                    <div class="section-info">
                        <span class="drag-handle"><i class="fas fa-grip-vertical"></i></span>
                        <span>${section.name}</span>
                    </div>
                    <label class="visibility-toggle">
                        <input type="checkbox" ${section.visible ? 'checked' : ''} onchange="toggleSectionVisibility('${section.id}')">
                        <span class="toggle-label">${section.visible ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                    </label>
                `;
                sectionList.appendChild(li);
            });
        }
    },
    
    // Render content editor
    renderContentEditor() {
        this.renderHeroEditor();
        this.renderFeaturesEditor();
        this.renderAboutEditor();
        this.renderGalleryEditor();
        this.renderNoticesEditor();
        this.renderCTAEditor();
    },
    
    // Render hero editor
    renderHeroEditor() {
        const hero = StorageManager.getHero();
        
        const titleInput = document.getElementById('hero-title');
        const subtitleInput = document.getElementById('hero-subtitle');
        const btnTextInput = document.getElementById('hero-btn-text');
        const btnLinkInput = document.getElementById('hero-btn-link');
        
        if (titleInput) titleInput.value = hero.title;
        if (subtitleInput) subtitleInput.value = hero.subtitle;
        if (btnTextInput) btnTextInput.value = hero.buttonText;
        if (btnLinkInput) btnLinkInput.value = hero.buttonLink;
        
        // Render preview
        const preview = document.getElementById('hero-bg-preview');
        if (preview && hero.backgroundImage) {
            preview.innerHTML = `<img src="${hero.backgroundImage}" alt="Preview">`;
        }
    },
    
    // Render features editor
    renderFeaturesEditor() {
        const features = StorageManager.getFeatures();
        const featuresList = document.getElementById('features-list');
        
        if (featuresList) {
            featuresList.innerHTML = '';
            features.forEach(feature => {
                const div = document.createElement('div');
                div.className = 'feature-edit-item';
                div.innerHTML = `
                    <button class="remove-feature" onclick="deleteFeature(${feature.id})">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="form-group">
                        <label>ফিচার শিরোনাম</label>
                        <input type="text" value="${feature.title}" onchange="updateFeature(${feature.id}, 'title', this.value)">
                    </div>
                    <div class="form-group">
                        <label>ফিচার বিবরণ</label>
                        <textarea rows="2" onchange="updateFeature(${feature.id}, 'description', this.value)">${feature.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>আইকন</label>
                        <input type="text" value="${feature.icon}" placeholder="fas fa-star" onchange="updateFeature(${feature.id}, 'icon', this.value)">
                    </div>
                `;
                featuresList.appendChild(div);
            });
        }
    },
    
    // Render about editor
    renderAboutEditor() {
        const about = StorageManager.getAbout();
        
        const titleInput = document.getElementById('about-title');
        const descInput = document.getElementById('about-description');
        
        if (titleInput) titleInput.value = about.title;
        if (descInput) descInput.value = about.description;
        
        // Render preview
        const preview = document.getElementById('about-image-preview');
        if (preview && about.image) {
            preview.innerHTML = `<img src="${about.image}" alt="Preview">`;
        }
    },
    
    // Render gallery editor
    renderGalleryEditor() {
        const gallery = StorageManager.getGallery();
        const galleryList = document.getElementById('gallery-images-list');
        
        if (galleryList) {
            galleryList.innerHTML = '';
            gallery.forEach(img => {
                const div = document.createElement('div');
                div.className = 'gallery-edit-item';
                div.innerHTML = `
                    <img src="${img.src}" alt="${img.caption}">
                    <button class="remove-image" onclick="deleteGalleryImage(${img.id})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                galleryList.appendChild(div);
            });
        }
    },
    
    // Render notices editor
    renderNoticesEditor() {
        const notices = StorageManager.getNotices();
        const noticesList = document.getElementById('notices-list');
        
        if (noticesList) {
            noticesList.innerHTML = '';
            notices.forEach(notice => {
                const div = document.createElement('div');
                div.className = 'notice-edit-item';
                div.innerHTML = `
                    <div class="notice-info">
                        <h4>${notice.title}</h4>
                        <span>${notice.date}</span>
                    </div>
                    <button class="delete" onclick="deleteNotice(${notice.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                noticesList.appendChild(div);
            });
        }
    },
    
    // Render CTA editor
    renderCTAEditor() {
        const cta = StorageManager.getCTA();
        
        const titleInput = document.getElementById('cta-title');
        const descInput = document.getElementById('cta-description');
        const btnTextInput = document.getElementById('cta-btn-text');
        const btnLinkInput = document.getElementById('cta-btn-link');
        
        if (titleInput) titleInput.value = cta.title;
        if (descInput) descInput.value = cta.description;
        if (btnTextInput) btnTextInput.value = cta.buttonText;
        if (btnLinkInput) btnLinkInput.value = cta.buttonLink;
    },
    
    // Render landing settings
    renderLandingSettings() {
        const config = StorageManager.getConfig();
        
        document.getElementById('school-name').value = config.name;
        document.getElementById('school-tagline').value = config.tagline;
        document.getElementById('school-established').value = config.established || '';
        document.getElementById('school-address').value = config.address;
        document.getElementById('school-phone').value = config.phone;
        document.getElementById('school-email').value = config.email;
        document.getElementById('school-facebook').value = config.facebook || '';
        document.getElementById('school-youtube').value = config.youtube || '';
    },
    
    // Render preview
    renderPreview() {
        const previewContent = document.getElementById('preview-content');
        if (previewContent) {
            const content = document.getElementById('landing-content');
            if (content) {
                previewContent.innerHTML = content.innerHTML;
            }
        }
    },
    
    // ==================== Utility Functions ====================
    
    // Switch admin section
    switchAdminSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from nav items
        document.querySelectorAll('.sidebar-nav li').forEach(li => {
            li.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update nav active state
        const navItem = document.querySelector(`.sidebar-nav li[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
        
        // Update breadcrumb
        const breadcrumbTitle = document.getElementById('current-section-title');
        if (breadcrumbTitle) {
            const titles = {
                'dashboard': 'ড্যাশবোর্ড',
                'menu-manager': 'মেনু ম্যানেজার',
                'page-builder': 'পেজ বিল্ডার',
                'content-editor': 'কন্টেন্ট এডিটর',
                'landing-settings': 'ল্যান্ডিং সেটিংস',
                'full-menu': 'সম্পূর্ণ মেনু',
                'preview': 'সাইট প্রিভিউ'
            };
            breadcrumbTitle.textContent = titles[sectionName] || sectionName;
        }
        
        // Refresh content if needed
        if (sectionName === 'menu-manager') {
            this.renderAdminMenu();
        } else if (sectionName === 'page-builder') {
            this.renderPageSections();
        } else if (sectionName === 'content-editor') {
            this.renderContentEditor();
        } else if (sectionName === 'landing-settings') {
            this.renderLandingSettings();
        } else if (sectionName === 'preview') {
            this.renderPreview();
        }
    }
};

// Make it globally accessible
window.RenderManager = RenderManager;

// Main JavaScript file for Pune Cantonment Board Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeSearch();
    initializeContactForm();
    initializeNoticeSearch();
    initializeAnimations();
    initializeTooltips();
});

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // Show loading spinner
    showLoading();
    
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.success) {
                displaySearchResults(data.data, query);
            } else {
                showAlert('Search failed. Please try again.', 'danger');
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Search error:', error);
            showAlert('Search failed. Please try again.', 'danger');
        });
}

function displaySearchResults(results, query) {
    // Create search results modal or redirect to results page
    const resultsHtml = results.map(notice => `
        <div class="search-result-item mb-3 p-3 border rounded">
            <h5><a href="/api/notices/${notice._id}" target="_blank">${notice.title}</a></h5>
            <p class="text-muted">${notice.content.substring(0, 150)}...</p>
            <small class="text-secondary">
                <span class="badge bg-primary">${notice.category}</span>
                <span class="ms-2">${new Date(notice.publishDate).toLocaleDateString()}</span>
            </small>
        </div>
    `).join('');

    // Show results in modal
    showSearchModal(resultsHtml, query, results.length);
}

function showSearchModal(resultsHtml, query, count) {
    const modalHtml = `
        <div class="modal fade" id="searchModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Search Results for "${query}"</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted">${count} results found</p>
                        ${resultsHtml || '<p>No results found.</p>'}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal
    const existingModal = document.getElementById('searchModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('searchModal'));
    modal.show();
}

// Contact form validation and submission
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (!validateContactForm()) {
                e.preventDefault();
                return false;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Reset after form submission (handled by server)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }
}

function validateContactForm() {
    const form = document.querySelector('.contact-form');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();
    
    if (!name || !email || !subject || !message) {
        showAlert('Please fill in all required fields.', 'danger');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address.', 'danger');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notice search functionality
function initializeNoticeSearch() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = document.getElementById('searchQuery').value.trim();
            const category = document.getElementById('categoryFilter').value;
            
            if (query) {
                searchNotices(query, category);
            }
        });
    }
}

function searchNotices(query, category = '') {
    showLoading();
    
    let url = `/api/search?q=${encodeURIComponent(query)}`;
    if (category) {
        url += `&category=${category}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.success) {
                updateNoticesDisplay(data.data);
            } else {
                showAlert('Search failed. Please try again.', 'danger');
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Notice search error:', error);
            showAlert('Search failed. Please try again.', 'danger');
        });
}

function updateNoticesDisplay(notices) {
    const noticesContainer = document.querySelector('.notices-container');
    if (!noticesContainer) return;
    
    if (notices.length === 0) {
        noticesContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-5x text-muted mb-3"></i>
                <h4>No Results Found</h4>
                <p class="text-muted">Try adjusting your search terms or filters.</p>
            </div>
        `;
        return;
    }
    
    const noticesHtml = notices.map(notice => `
        <div class="notice-card card mb-4 fade-in">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="notice-meta">
                        <span class="badge bg-${notice.category === 'tender' ? 'success' : 'primary'}">
                            ${notice.category.toUpperCase()}
                        </span>
                        <span class="badge bg-${notice.priority === 'urgent' ? 'danger' : notice.priority === 'high' ? 'warning' : 'secondary'} ms-2">
                            ${notice.priority.toUpperCase()}
                        </span>
                    </div>
                    <small class="text-muted">
                        <i class="fas fa-calendar"></i> ${new Date(notice.publishDate).toLocaleDateString()}
                    </small>
                </div>
                
                <h4 class="card-title">
                    <a href="/api/notices/${notice._id}" class="text-decoration-none" target="_blank">
                        ${notice.title}
                    </a>
                </h4>
                
                <p class="card-text">${notice.content.substring(0, 300)}...</p>
                
                <div class="notice-footer d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                        <i class="fas fa-eye"></i> ${notice.views || 0} views
                    </small>
                </div>
            </div>
        </div>
    `).join('');
    
    noticesContainer.innerHTML = noticesHtml;
}

// Animation initialization
function initializeAnimations() {
    // Add fade-in animation to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .notice-card, .card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Utility functions
function showLoading() {
    const loadingHtml = '<div class="spinner"></div>';
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loadingSpinner';
    loadingContainer.className = 'text-center py-4';
    loadingContainer.innerHTML = loadingHtml;
    
    // Add to main content area
    const mainContent = document.querySelector('main') || document.body;
    mainContent.appendChild(loadingContainer);
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.remove();
    }
}

function showAlert(message, type = 'info') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Add alert to top of main content
    const mainContent = document.querySelector('main') || document.body;
    const alertContainer = document.createElement('div');
    alertContainer.innerHTML = alertHtml;
    mainContent.insertBefore(alertContainer.firstElementChild, mainContent.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Back to top button
function addBackToTopButton() {
    const backToTopHtml = `
        <button id="backToTop" class="btn btn-primary position-fixed" style="bottom: 20px; right: 20px; z-index: 1000; display: none;">
            <i class="fas fa-arrow-up"></i>
        </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', backToTopHtml);
    
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
addBackToTopButton();
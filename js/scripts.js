// Custom JavaScript for The Ark Veterinary Clinic

// Global Variables
let appointmentData = {};

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initializeCookieConsent();
    updateClinicStatus();
    initializeAppointmentForm();
    initializeGallery();
    initializeSmoothScroll();
    setMinDate();
    
    // Update status every minute
    setInterval(updateClinicStatus, 60000);
});

// Cookie Consent
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const consentAccepted = localStorage.getItem('cookieConsent');
    
    if (!consentAccepted) {
        cookieConsent.classList.remove('hidden');
    } else {
        cookieConsent.style.display = 'none';
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    document.getElementById('cookieConsent').style.display = 'none';
}

// Update Clinic Open/Closed Status
function updateClinicStatus() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    const morningOpen = 9 * 60; // 9:00 AM
    const morningClose = 13 * 60; // 1:00 PM
    const eveningOpen = 17 * 60; // 5:00 PM
    const eveningClose = 21 * 60; // 9:00 PM
    
    const statusElement = document.getElementById('currentStatus');
    const topBadge = document.querySelector('.status-badge');
    
    let isOpen = false;
    let statusText = '';
    
    if (currentTime >= morningOpen && currentTime < morningClose) {
        isOpen = true;
        const minutesUntilClose = morningClose - currentTime;
        statusText = `Open Now - Closes at 1:00 PM (in ${Math.floor(minutesUntilClose / 60)}h ${minutesUntilClose % 60}m)`;
    } else if (currentTime >= eveningOpen && currentTime < eveningClose) {
        isOpen = true;
        const minutesUntilClose = eveningClose - currentTime;
        statusText = `Open Now - Closes at 9:00 PM (in ${Math.floor(minutesUntilClose / 60)}h ${minutesUntilClose % 60}m)`;
    } else if (currentTime < morningOpen) {
        const minutesUntilOpen = morningOpen - currentTime;
        statusText = `Closed - Opens at 9:00 AM (in ${Math.floor(minutesUntilOpen / 60)}h ${minutesUntilOpen % 60}m)`;
    } else if (currentTime >= morningClose && currentTime < eveningOpen) {
        const minutesUntilOpen = eveningOpen - currentTime;
        statusText = `Closed - Opens at 5:00 PM (in ${Math.floor(minutesUntilOpen / 60)}h ${minutesUntilOpen % 60}m)`;
    } else {
        const minutesUntilOpen = (24 * 60) - currentTime + morningOpen;
        statusText = `Closed - Opens at 9:00 AM tomorrow`;
    }
    
    if (statusElement) {
        statusElement.innerHTML = `<strong class="${isOpen ? 'text-success' : 'text-danger'}">${statusText}</strong>`;
        statusElement.className = `status-display ${isOpen ? 'open' : 'closed'}`;
    }
    
    if (topBadge) {
        topBadge.innerHTML = `<i class="fas fa-clock"></i> ${isOpen ? 'Open Now' : 'Closed'}`;
        topBadge.className = `status-badge ${isOpen ? 'bg-success' : 'bg-danger'}`;
    }
}

// Appointment Form Handling
function initializeAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        appointmentData = {
            patientName: formData.get('patientName'),
            ownerName: formData.get('ownerName'),
            contactPhone: formData.get('contactPhone'),
            email: formData.get('email'),
            petType: formData.get('petType'),
            petAge: formData.get('petAge'),
            symptoms: formData.get('symptoms'),
            preferredDate: formData.get('preferredDate'),
            preferredTime: formData.get('preferredTime'),
            clinicBranch: formData.get('clinicBranch'),
            source: 'web',
            submittedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        saveAppointmentLocally(appointmentData);
        
        // Try to submit to Formspree (optional - replace with your Formspree endpoint)
        submitToFormspree(appointmentData);
        
        // Show confirmation
        showConfirmation(appointmentData);
        
        // Reset form
        form.reset();
        form.classList.remove('was-validated');
        
        // Close appointment modal
        const appointmentModal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
        if (appointmentModal) {
            appointmentModal.hide();
        }
    });
}

function saveAppointmentLocally(data) {
    try {
        let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(data);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        console.log('Appointment saved locally');
    } catch (error) {
        console.error('Error saving appointment locally:', error);
    }
}

function submitToFormspree(data) {
    // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
    // Example: https://formspree.io/f/xvoeqgpr
    const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
    
    fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log('Form submitted to Formspree successfully');
        } else {
            console.warn('Formspree submission failed, but data is saved locally');
        }
    })
    .catch(error => {
        console.warn('Formspree not configured or network error:', error);
        console.log('Appointment saved locally as backup');
    });
}

function showConfirmation(data) {
    // Format date
    const date = new Date(data.preferredDate);
    const formattedDate = date.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Format branch name
    const branchName = data.clinicBranch === 'ambattur' ? 'Ambattur Industrial Estate' : 'Thiruvanmiyur';
    const branchPhone = data.clinicBranch === 'ambattur' ? '098418 77423' : '7942699091';
    
    // Create confirmation details
    const confirmationHTML = `
        <div class="confirmation-details">
            <p><strong>Pet Name:</strong> ${data.patientName}</p>
            <p><strong>Owner:</strong> ${data.ownerName}</p>
            <p><strong>Contact:</strong> ${data.contactPhone}</p>
            <p><strong>Pet Type:</strong> ${data.petType}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formatTime(data.preferredTime)}</p>
            <p><strong>Branch:</strong> ${branchName}</p>
            <p><strong>Reason:</strong> ${data.symptoms}</p>
        </div>
    `;
    
    document.getElementById('confirmationDetails').innerHTML = confirmationHTML;
    
    // Create WhatsApp message
    const whatsappMessage = `Hello, I would like to confirm my appointment:%0A%0A` +
        `Pet Name: ${data.patientName}%0A` +
        `Owner: ${data.ownerName}%0A` +
        `Contact: ${data.contactPhone}%0A` +
        `Pet Type: ${data.petType}%0A` +
        `Date: ${formattedDate}%0A` +
        `Time: ${formatTime(data.preferredTime)}%0A` +
        `Branch: ${branchName}%0A` +
        `Reason: ${data.symptoms}`;
    
    const whatsappPhone = data.clinicBranch === 'ambattur' ? '919841877423' : '917942699091';
    const whatsappLink = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;
    
    document.getElementById('whatsappNotify').href = whatsappLink;
    
    // Show confirmation modal
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

function downloadICS() {
    if (!appointmentData.preferredDate || !appointmentData.preferredTime) {
        alert('No appointment data available');
        return;
    }
    
    const date = new Date(appointmentData.preferredDate);
    const [hours, minutes] = appointmentData.preferredTime.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const endDate = new Date(date.getTime() + 60 * 60 * 1000); // 1 hour appointment
    
    const formatICSDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const branchName = appointmentData.clinicBranch === 'ambattur' ? 'Ambattur Industrial Estate' : 'Thiruvanmiyur';
    const branchAddress = appointmentData.clinicBranch === 'ambattur' 
        ? 'L20, 7th St, Ambattur Industrial Estate, Chennai, Tamil Nadu 600058'
        : 'No 43A/26, Near LB Road Indian Bank, Radha Krishnan Nagar Main Road, Thiruvanmiyur, Chennai-600041';
    
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Ark Veterinary Clinic//EN',
        'BEGIN:VEVENT',
        `DTSTART:${formatICSDate(date)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `SUMMARY:Vet Appointment - ${appointmentData.patientName}`,
        `DESCRIPTION:Veterinary appointment for ${appointmentData.patientName}\nOwner: ${appointmentData.ownerName}\nReason: ${appointmentData.symptoms}`,
        `LOCATION:The Ark Veterinary Clinic - ${branchName}, ${branchAddress}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ark-vet-appointment-${appointmentData.patientName}.ics`;
    link.click();
}

// Gallery Modal
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalImage = document.getElementById('galleryModalImage');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.getAttribute('data-img');
            galleryModalImage.src = imgSrc;
        });
    });
}

// Service Modal
function openServiceModal(button) {
    const serviceName = button.getAttribute('data-service');
    document.getElementById('serviceNameDisplay').textContent = serviceName;
    
    // Update WhatsApp link with service name
    const whatsappLink = document.querySelector('#serviceModal .btn-success');
    const message = encodeURIComponent(`I would like to know the cost for ${serviceName}`);
    whatsappLink.href = `https://wa.me/919841877423?text=${message}`;
    
    const serviceModal = new bootstrap.Modal(document.getElementById('serviceModal'));
    serviceModal.show();
}

// Smooth Scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#privacy' && href !== '#terms') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(navbarCollapse).hide();
                    }
                }
            }
        });
    });
}

// Set minimum date for appointment (today)
function setMinDate() {
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// Privacy Policy and Terms (Modal or Alert)
document.getElementById('privacyLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Privacy Policy\n\nThe Ark Veterinary Clinic respects your privacy. We collect personal information only for appointment booking and communication purposes. Your data is stored securely and never shared with third parties without your consent. By submitting the appointment form, you consent to our use of your information for clinic-related communications.');
});

document.getElementById('termsLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Terms of Service\n\nBy using The Ark Veterinary Clinic website and services, you agree to:\n\n1. Provide accurate information for appointments\n2. Arrive on time for scheduled appointments\n3. Notify us of cancellations at least 24 hours in advance\n4. Follow veterinary advice and treatment plans\n5. Make payments for services rendered\n\nWe reserve the right to refuse service or cancel appointments if necessary.');
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});
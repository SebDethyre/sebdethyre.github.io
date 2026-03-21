// NAVIGATION
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.querySelector('.nav-links');
let lastScroll = 0;
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

// Scroll: hide/show navbar + update active link
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    navbar.classList.toggle('scrolled', currentScroll > 50);
    navbar.classList.toggle('hidden', currentScroll > lastScroll && currentScroll > 100);
    lastScroll = currentScroll;

    // Update active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Show navbar when mouse near top
document.addEventListener('mousemove', (e) => {
    if (e.clientY < 45) navbar.classList.remove('hidden');
});

// Mobile menu toggle
navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Close mobile menu
        navToggle?.classList.remove('active');
        navLinksContainer?.classList.remove('active');
        
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
    if (navLinksContainer?.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.nav-toggle')) {
        navToggle?.classList.remove('active');
        navLinksContainer?.classList.remove('active');
    }
});

// CONTACT FORM
function handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    window.location.href = `mailto:dethyres@hotmail.fr?subject=${encodeURIComponent('Contact Portfolio - ' + name)}&body=${encodeURIComponent('De: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
}

// VIDEO SYSTEM
const source_folder = "assets/video/"
const source_suffix = ".mp4"
const source_type = "video/mp4"
const videoSources = Object.fromEntries(
  ['orbital', 'clip', 'commands', 'rf_controls', 'rf_doc', 'git']
    .map(k => [k, { src: `assets/video/${k}.mp4`, type: "video/mp4" }])
);

// Video button handlers
document.querySelectorAll('.project-card.has-video').forEach(card => {
    const video = card.querySelector('.project-video-preview');
    const videoId = card.dataset.videoId;
    const demoBtn = card.querySelector('.video-label');
    const hintBtn = card.querySelector('.video-hint');
    const stopBtn = card.querySelector('.video-stop');
    const indicator = card.querySelector('.video-indicator');
    const hintMsg = card.querySelector('.video-hint-msg');

    // Click on "▶ Démo" button = play video
    demoBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        // Pause other videos
        document.querySelectorAll('.project-card.has-video.playing').forEach(other => {
            if (other !== card) {
                other.classList.remove('playing', 'paused');
                other.querySelector('.project-video-preview')?.pause();
                other.querySelector('.video-indicator')?.classList.remove('show-play');
                other.querySelector('.video-hint-msg')?.classList.remove('show');
            }
        });
        video.currentTime = 0;
        video.play();
        card.classList.add('playing');
        card.classList.remove('paused');
        // Show hint message
        hintMsg?.classList.remove('show');
        void hintMsg?.offsetWidth; // Force reflow
        hintMsg?.classList.add('show');
    });

    // Click on hint (when video is playing) = fullscreen
    hintBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openVideoModal(videoId);
    });

    // Click on stop button = pause and return to card
    stopBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        video.pause();
        card.classList.remove('playing', 'paused');
        indicator?.classList.remove('show-play');
        hintMsg?.classList.remove('show');
    });

    // Double-click on video = fullscreen
    video?.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (card.classList.contains('playing')) {
            openVideoModal(videoId);
        }
    });

    // Click anywhere else on the card when playing = toggle pause/play
    card.addEventListener('click', (e) => {
        // Ignore clicks on links, demo button, fullscreen hint, and stop button
        if (e.target.closest('.project-link') ||
            e.target.closest('.video-label') || 
            e.target.closest('.video-hint') ||
            e.target.closest('.video-stop')) {
            return;
        }
        
        if (card.classList.contains('playing')) {
            if (video.paused) {
                video.play();
                card.classList.remove('paused');
                // Show play indicator briefly
                indicator?.classList.remove('show-play');
                void indicator?.offsetWidth; // Force reflow
                indicator?.classList.add('show-play');
            } else {
                video.pause();
                card.classList.add('paused');
                indicator?.classList.remove('show-play');
            }
        }
    });
});

// VIDEO MODAL
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalVideoSource = document.getElementById('modalVideoSource');

function openVideoModal(videoId) {
    // Pause any playing preview
    document.querySelectorAll('.project-card.has-video.playing').forEach(card => {
        card.classList.remove('playing');
        card.querySelector('.project-video-preview')?.pause();
    });
    
    const source = videoSources[videoId];
    if (source) {
        modalVideoSource.src = source.src;
        modalVideoSource.type = source.type;
        modalVideo.load();
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalVideo.oncanplay = () => {
            modalVideo.play();
        };
    }
}

function closeVideoModal() {
    videoModal.classList.remove('active');
    modalVideo.pause();
    modalVideo.oncanplay = null;
    document.body.style.overflow = '';
}

// Close modal on click outside or Escape
videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
});
// NAVIGATION
const navbar = document.getElementById('navbar');
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
    if (e.clientY < 80) navbar.classList.remove('hidden');
});

// Smooth scroll on nav click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
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
const videoSources = {
    'orbital': { src: `${source_folder}orbital_click_demo.mp4`, type: 'video/mp4' },
    'clip': { src: `${source_folder}clip_notes_demo.mp4`, type: 'video/mp4' },
    'commands': { src: `${source_folder}commands_builder_demo.mp4`, type: 'video/mp4' },
    'git': { src: `${source_folder}easy_git_demo.mp4`, type: 'video/mp4' }
};

// Video button handlers - only the "Démo" button triggers video
document.querySelectorAll('.project-card.has-video').forEach(card => {
    const video = card.querySelector('.project-video-preview');
    const videoId = card.dataset.videoId;
    const demoBtn = card.querySelector('.video-label');
    const hintBtn = card.querySelector('.video-hint');

    // Click on "▶ Démo" button = play video
    demoBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        // Pause other videos
        document.querySelectorAll('.project-card.has-video.playing').forEach(other => {
            if (other !== card) {
                other.classList.remove('playing');
                other.querySelector('.project-video-preview')?.pause();
            }
        });
        video.currentTime = 0;
        video.play();
        card.classList.add('playing');
    });

    // Click on hint (when video is playing) = fullscreen
    hintBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openVideoModal(videoId);
    });

    // Click anywhere else on the card when playing = pause
    card.addEventListener('click', (e) => {
        // Ignore clicks on links, demo button, and fullscreen hint
        if (e.target.closest('.project-link') ||
            e.target.closest('.video-label') || 
            e.target.closest('.video-hint')) {
            return;
        }
        
        if (card.classList.contains('playing')) {
            video.pause();
            card.classList.remove('playing');
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

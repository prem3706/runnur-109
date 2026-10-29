// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// LOADER & NAME REVEAL SYSTEM SEQUENCE (ACCELERATED)
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('scroll-locked');
  
  let count = 0;
  const counterEl = document.getElementById('loaderCounter');
  const progressFillEl = document.getElementById('loaderProgressFill');
  const statusEl = document.getElementById('loaderStatus');
  
  const statuses = [
    'SYS.INIT...',
    'LOADING KERNEL...',
    'CONNECTING NODES...',
    'SYNC CLOUD...',
    'PREPARING UI...',
    'READY'
  ];

  // Immediately slide up the text headers upon overlay launch
  const revealTimeline = gsap.timeline({
    onComplete: () => {
      startCountingSequence();
    }
  });

  revealTimeline
    .to('.intro-word', {
      y: '0%',
      duration: 0.6,
      ease: 'power4.out'
    })
    .to('.intro-word-iam', {
      y: '0%',
      duration: 0.5,
      ease: 'power4.out'
    }, '-=0.4')
    .to('.intro-word-name', {
      y: '0%',
      duration: 0.5,
      ease: 'power4.out'
    }, '-=0.4')
    .to('.intro-sub-meta span', {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.2');

  function startCountingSequence() {
    // 1-to-100 Loader (accelerated count loop: 12ms per value)
    const loaderInterval = setInterval(() => {
      count++;
      
      // Update loader status text
      if (count < 20) statusEl.textContent = statuses[0];
      else if (count < 45) statusEl.textContent = statuses[1];
      else if (count < 70) statusEl.textContent = statuses[2];
      else if (count < 85) statusEl.textContent = statuses[3];
      else if (count < 98) statusEl.textContent = statuses[4];
      else statusEl.textContent = statuses[5];

      if (counterEl) {
        counterEl.textContent = count.toString().padStart(2, '0') + '%';
      }
      if (progressFillEl) {
        progressFillEl.style.width = count + '%';
      }

      if (count >= 100) {
        clearInterval(loaderInterval);
        
        // Final transition out of the loading screen after a short hold
        setTimeout(() => {
          gsap.to('#intro-overlay', {
            y: '-100%',
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => {
              document.getElementById('intro-overlay').style.display = 'none';
              document.body.classList.remove('scroll-locked');
              
              // Fade in homepage layout
              const appContent = document.getElementById('app-content');
              appContent.style.pointerEvents = 'auto';
              gsap.to(appContent, {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => {
                  startMultilingualHello();
                  initScrollAnimations();
                  init3DGeodesicOrb();
                  initTimelineAccordions();
                  init3DBoxCarousel();
                  init3DJellyMembrane();
                  ScrollTrigger.refresh();
                }
              });
            }
          });
        }, 300);
      }
    }, 12);
  }
});


// ============================================================
// 5-LANGUAGE HELLO LOOP (ZERO-CLIPPING SLIDE-UP ANIMATION)
// ============================================================
function startMultilingualHello() {
  const languages = ['HELLO', 'नमस्ते', 'مرحبًا', 'नमस्कार', 'Olá'];
  const helloEl = document.getElementById('multilingual-hello');
  let currentIndex = 0;

  if (!helloEl) return;

  setInterval(() => {
    // Smooth upward slide & fade-out
    gsap.to(helloEl, {
      y: '-60px',
      opacity: 0,
      duration: 0.45,
      ease: 'power3.in',
      onComplete: () => {
        currentIndex = (currentIndex + 1) % languages.length;
        helloEl.textContent = languages[currentIndex];
        
        // Reset underneath and slide into view smoothly
        gsap.fromTo(helloEl, 
          { y: '60px', opacity: 0 },
          { y: '0px', opacity: 1, duration: 0.55, ease: 'power3.out' }
        );
      }
    });
  }, 2400);
}


// ============================================================
// HTML5 CANVAS INTERACTIVE NETWORK BACKGROUND
// ============================================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let particles = [];
let packets = [];
let mouse = { x: null, y: null, radius: 160 };

// Particle class representing nodes
class Particle {
  constructor(x, y) {
    this.x = x || Math.random() * width;
    this.y = y || Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.baseRadius = Math.random() * 3 + 2;
    this.radius = this.baseRadius;
    
    const types = ['node', 'square', 'ring'];
    this.type = types[Math.floor(Math.random() * types.length)];
    this.color = Math.random() > 0.4 ? 'lime' : (Math.random() > 0.5 ? 'blue' : 'violet');
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    if (mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        this.radius = this.baseRadius * 1.8;
      } else {
        this.radius = this.baseRadius;
      }
    }
  }

  draw() {
    const isDark = document.body.classList.contains('dark-mode');
    let colorHex = '#111111';
    
    if (this.color === 'lime') colorHex = '#C7FF00';
    else if (this.color === 'blue') colorHex = '#00d2ff';
    else if (this.color === 'violet') colorHex = '#d500f9';
    
    ctx.beginPath();
    ctx.fillStyle = colorHex;
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 1;

    if (this.type === 'square') {
      ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    } else if (this.type === 'ring') {
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Data Packet traveling between nodes
class Packet {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.progress = 0;
    this.speed = Math.random() * 0.01 + 0.005;
    this.color = Math.random() > 0.5 ? '#00d2ff' : '#C7FF00';
  }

  update() {
    this.progress += this.speed;
    return this.progress >= 1;
  }

  draw() {
    const x = this.start.x + (this.end.x - this.start.x) * this.progress;
    const y = this.start.y + (this.end.y - this.start.y) * this.progress;
    
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function initNetwork() {
  particles = [];
  packets = [];
  const nodeCount = Math.floor((width * height) / 16000) + 15;
  for (let i = 0; i < nodeCount; i++) {
    particles.push(new Particle());
  }
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);
  const isDark = document.body.classList.contains('dark-mode');
  const lineAlpha = isDark ? 0.08 : 0.12;
  const activeLineAlpha = isDark ? 0.35 : 0.5;
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 160) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = isDark ? `rgba(244,241,232, ${lineAlpha})` : `rgba(17,17,17, ${lineAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (Math.random() < 0.0003 && packets.length < 20) {
          packets.push(new Packet(p1, p2));
        }
      }
    }
  }

  if (mouse.x && mouse.y) {
    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = isDark ? `rgba(199,255,0, ${activeLineAlpha})` : `rgba(0, 210, 255, ${activeLineAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    });
  }

  packets = packets.filter(packet => {
    const finished = packet.update();
    packet.draw();
    return !finished;
  });

  requestAnimationFrame(drawNetwork);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initNetwork();
});

initNetwork();
drawNetwork();


// ============================================================
// PROFESSIONAL 3D GEODESIC CLOUD NODE ORB & ORBITAL RINGS ENGINE
// ============================================================
function init3DGeodesicOrb() {
  const pCanvas = document.getElementById('profile-canvas');
  if (!pCanvas) return;

  const pCtx = pCanvas.getContext('2d');
  
  let pWidth = pCanvas.width = 680;
  let pHeight = pCanvas.height = 680;

  const phi = (1 + Math.sqrt(5)) / 2;
  const radius = 115;
  
  const baseVertices = [
    [-1,  phi,  0], [ 1,  phi,  0], [-1, -phi,  0], [ 1, -phi,  0],
    [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
    [ phi,  0, -1], [ phi,  0,  1], [-phi,  0, -1], [-phi,  0,  1]
  ];

  const icoVertices = baseVertices.map(v => {
    const len = Math.hypot(v[0], v[1], v[2]);
    return {
      x: (v[0] / len) * radius,
      y: (v[1] / len) * radius,
      z: (v[2] / len) * radius
    };
  });

  const edges = [];
  const edgeDistThreshold = (2 / len(baseVertices[0])) * radius * 1.15;
  
  function len(v) { return Math.hypot(v[0], v[1], v[2]); }

  for (let i = 0; i < icoVertices.length; i++) {
    for (let j = i + 1; j < icoVertices.length; j++) {
      const dx = icoVertices[i].x - icoVertices[j].x;
      const dy = icoVertices[i].y - icoVertices[j].y;
      const dz = icoVertices[i].z - icoVertices[j].z;
      const dist = Math.hypot(dx, dy, dz);
      if (dist < edgeDistThreshold) {
        edges.push([i, j]);
      }
    }
  }

  const innerRadius = 48;
  const innerVertices = [
    { x:  innerRadius, y: 0, z: 0 }, { x: -innerRadius, y: 0, z: 0 },
    { x: 0, y:  innerRadius, z: 0 }, { x: 0, y: -innerRadius, z: 0 },
    { x: 0, y: 0, z:  innerRadius }, { x: 0, y: 0, z: -innerRadius }
  ];
  const innerEdges = [
    [0,2],[0,3],[0,4],[0,5],
    [1,2],[1,3],[1,4],[1,5],
    [2,4],[2,5],[3,4],[3,5]
  ];

  const ring1Points = [];
  const ring2Points = [];
  const ringSegments = 36;
  const ring1Radius = 160;
  const ring2Radius = 190;

  for (let i = 0; i < ringSegments; i++) {
    const angle = (i / ringSegments) * Math.PI * 2;
    const x1 = ring1Radius * Math.cos(angle);
    const y1 = ring1Radius * Math.sin(angle) * Math.cos(0.6);
    const z1 = ring1Radius * Math.sin(angle) * Math.sin(0.6);
    ring1Points.push({ x: x1, y: y1, z: z1 });

    const x2 = ring2Radius * Math.cos(angle);
    const y2 = ring2Radius * Math.sin(angle) * Math.cos(-0.8);
    const z2 = ring2Radius * Math.sin(angle) * Math.sin(-0.8);
    ring2Points.push({ x: x2, y: y2, z: z2 });
  }

  let rotY = 0;
  let rotX = 0.2;
  let targetRotY = 0;
  let targetRotX = 0.2;
  let hoverActive = false;

  window.addEventListener('mousemove', (e) => {
    const rect = pCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    if (mx > -150 && mx < pWidth + 150 && my > -150 && my < pHeight + 150) {
      targetRotY = ((mx - pWidth / 2) / pWidth) * Math.PI * 0.7;
      targetRotX = (((my - pHeight / 2) / pHeight) * Math.PI * 0.5) + 0.2;
      hoverActive = true;
    } else {
      hoverActive = false;
    }
  });

  function projectPoint(p, cY, sY, cX, sX, centerProjX, centerProjY, viewDist) {
    const x1 = p.x * cY - p.z * sY;
    const z1 = p.x * sY + p.z * cY;
    const y2 = p.y * cX - z1 * sX;
    const z2 = p.y * sX + z1 * cX;

    const scale = viewDist / (z2 + 340);
    return {
      x: x1 * scale + centerProjX,
      y: y2 * scale + centerProjY,
      depth: z2,
      scale: scale
    };
  }

  function renderGeodesicOrb() {
    pCtx.clearRect(0, 0, pWidth, pHeight);
    
    const isDark = document.body.classList.contains('dark-mode');
    
    if (!hoverActive) {
      rotY += 0.007;
      targetRotY = rotY;
    }
    
    rotY += (targetRotY - rotY) * 0.08;
    rotX += (targetRotX - rotX) * 0.08;

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    const cosYInv = Math.cos(-rotY * 1.5);
    const sinYInv = Math.sin(-rotY * 1.5);

    const centerProjX = pWidth / 2;
    const centerProjY = pHeight / 2;
    const viewDist = 360;

    const time = Date.now() * 0.003;
    const pulseR = 35 + Math.sin(time) * 5;
    const coreGrad = pCtx.createRadialGradient(
      centerProjX, centerProjY, 4,
      centerProjX, centerProjY, pulseR
    );

    if (isDark) {
      coreGrad.addColorStop(0, 'rgba(199, 255, 0, 0.7)');
      coreGrad.addColorStop(0.5, 'rgba(0, 210, 255, 0.35)');
      coreGrad.addColorStop(1, 'rgba(199, 255, 0, 0)');
    } else {
      coreGrad.addColorStop(0, 'rgba(0, 210, 255, 0.85)');
      coreGrad.addColorStop(0.5, 'rgba(17, 17, 17, 0.3)');
      coreGrad.addColorStop(1, 'rgba(0, 210, 255, 0)');
    }

    pCtx.beginPath();
    pCtx.arc(centerProjX, centerProjY, pulseR, 0, Math.PI * 2);
    pCtx.fillStyle = coreGrad;
    pCtx.fill();

    const projIco = icoVertices.map(v => 
      projectPoint(v, cosY, sinY, cosX, sinX, centerProjX, centerProjY, viewDist)
    );

    const projInner = innerVertices.map(v => 
      projectPoint(v, cosYInv, sinYInv, cosX, sinX, centerProjX, centerProjY, viewDist)
    );

    const projRing1 = ring1Points.map(v => 
      projectPoint(v, cosY, sinY, cosX, sinX, centerProjX, centerProjY, viewDist)
    );
    const projRing2 = ring2Points.map(v => 
      projectPoint(v, cosYInv, sinYInv, cosX, sinX, centerProjX, centerProjY, viewDist)
    );

    const strokeMain = isDark ? '#C7FF00' : '#111111';

    edges.forEach(pair => {
      const p1 = projIco[pair[0]];
      const p2 = projIco[pair[1]];

      const avgDepth = (p1.depth + p2.depth) / 2;
      const alpha = Math.max(0.25, Math.min(0.95, 1 - (avgDepth + 150) / 300));

      pCtx.beginPath();
      pCtx.moveTo(p1.x, p1.y);
      pCtx.lineTo(p2.x, p2.y);
      pCtx.strokeStyle = isDark ? `rgba(199, 255, 0, ${alpha})` : `rgba(17, 17, 17, ${alpha * 0.9})`;
      pCtx.lineWidth = 1.4;
      pCtx.stroke();
    });

    projIco.forEach(p => {
      const alpha = Math.max(0.3, Math.min(1.0, 1 - (p.depth + 150) / 300));
      const size = 6 * p.scale;

      pCtx.fillStyle = isDark ? '#C7FF00' : '#00d2ff';
      pCtx.fillRect(p.x - size / 2, p.y - size / 2, size, size);

      pCtx.strokeStyle = strokeMain;
      pCtx.lineWidth = 1;
      pCtx.strokeRect(p.x - size / 2, p.y - size / 2, size, size);
    });

    innerEdges.forEach(pair => {
      const p1 = projInner[pair[0]];
      const p2 = projInner[pair[1]];

      pCtx.beginPath();
      pCtx.moveTo(p1.x, p1.y);
      pCtx.lineTo(p2.x, p2.y);
      pCtx.strokeStyle = isDark ? 'rgba(0, 210, 255, 0.75)' : 'rgba(0, 150, 220, 0.85)';
      pCtx.lineWidth = 1.2;
      pCtx.stroke();
    });

    pCtx.beginPath();
    projRing1.forEach((p, idx) => {
      if (idx === 0) pCtx.moveTo(p.x, p.y);
      else pCtx.lineTo(p.x, p.y);
    });
    pCtx.closePath();
    pCtx.strokeStyle = isDark ? 'rgba(0, 210, 255, 0.45)' : 'rgba(0, 180, 230, 0.55)';
    pCtx.lineWidth = 1.2;
    pCtx.setLineDash([6, 4]);
    pCtx.stroke();
    pCtx.setLineDash([]);

    pCtx.beginPath();
    projRing2.forEach((p, idx) => {
      if (idx === 0) pCtx.moveTo(p.x, p.y);
      else pCtx.lineTo(p.x, p.y);
    });
    pCtx.closePath();
    pCtx.strokeStyle = isDark ? 'rgba(199, 255, 0, 0.45)' : 'rgba(17, 17, 17, 0.35)';
    pCtx.lineWidth = 1.0;
    pCtx.setLineDash([4, 6]);
    pCtx.stroke();
    pCtx.setLineDash([]);

    requestAnimationFrame(renderGeodesicOrb);
  }

  renderGeodesicOrb();
}


// ============================================================
// BUTTER-SMOOTH TIMELINE ACCORDION INTERACTION
// ============================================================
function initTimelineAccordions() {
  const timelineItems = document.querySelectorAll('.timeline-node-item');
  let refreshTimeout = null;

  function debouncedRefresh() {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);
  }
  
  timelineItems.forEach((item, index) => {
    const header = item.querySelector('.node-header');
    
    if (index === 0) {
      item.classList.add('open');
    }
    
    item.addEventListener('mouseenter', () => {
      timelineItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
        }
      });
      item.classList.add('open');
      debouncedRefresh();
    });
    
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        timelineItems.forEach(otherItem => {
          otherItem.classList.remove('open');
        });
        
        if (!isOpen) {
          item.classList.add('open');
        }
        debouncedRefresh();
      });
    }
  });
}


// ============================================================
// 3D BOX CAROUSEL & AUTO-SCROLL ENGINE (3-BOX START)
// ============================================================
const SHOWCASE_DATA = {
  importo: {
    badge: 'FEATURED FULL-STACK BUILD',
    title: 'IMPORTO — Transport Management System',
    subtitle: 'Full-stack enterprise application designed for import-export transport logistics.',
    desc: 'IMPORTO streamlines logistics billing and multi-branch communication across active transport hubs. It integrates an authenticated dashboard, custom Lorry Receipt (LR) dispatch generators, client billing ledger records, and automated PDF export handling.',
    features: [
      'Multi-branch real-time synchronization across distribution points',
      'Automated Lorry Receipt (LR) dispatch generation with dynamic numbering',
      'Role-based JWT authentication and access control',
      'High-resolution PDF document generation for physical paperwork handling',
      'Normalized relational database structure for zero-loss billing ledgers'
    ],
    logFile: 'importo_service_node.log',
    logs: [
      '[SYS] Initializing IMPORTO multi-branch kernel...',
      '[AUTH] JWT core validated: active tokens loaded',
      '[DB] MySQL Connection established on tcp://3306 (pool: 20)',
      '[LR] Lorry Receipt generator compiled with custom A4 templates',
      '[SUCCESS] System live: listening on port 8000 (React v18)'
    ],
    tags: ['React.js', 'PHP 8', 'MySQL', 'Tailwind CSS', 'JWT Auth', 'REST APIs', 'PDF Engine']
  },
  aws: {
    badge: 'CLOUD PLATFORM & INFRASTRUCTURE',
    title: 'AWS Cloud Architecture & Compute Services',
    subtitle: 'Scalable cloud infrastructure utilizing core AWS virtualization and storage engines.',
    desc: 'Hands-on architectural setup of AWS Cloud environments. Configured elastic compute capacity via EC2 instances, structured durable data lakes in S3 buckets with lifecycle management, orchestrated secure Virtual Private Clouds (VPCs), and configured least-privilege IAM policies.',
    features: [
      'EC2 virtual server provisioning with automated security group rules',
      'Amazon S3 bucket access control, CORS configuration, and public/private segregation',
      'Virtual Private Cloud (VPC) subnet topology, route tables, and Internet Gateways',
      'Identity and Access Management (IAM) role-based permissions and MFA policies',
      'Amazon CloudWatch metrics, alarms, and compute performance monitoring'
    ],
    logFile: 'aws_cloudwatch_metrics.log',
    logs: [
      '[AWS::EC2] Instance i-09a27f8841 running (us-east-1a)',
      '[AWS::S3] Bucket prem-data-lake-prod verified with AES256 encryption',
      '[AWS::VPC] Routing 10.0.0.0/16 via igw-082ef1a',
      '[AWS::IAM] Role policy attached: EC2ReadOnlyAccess',
      '[METRICS] CPU Utilization: 14.2% | Network In: 420 KB/s'
    ],
    tags: ['AWS EC2', 'AWS S3', 'AWS VPC', 'IAM Roles', 'CloudWatch', 'CloudFront', 'Security Groups']
  },
  linux: {
    badge: 'OPERATING SYSTEMS & SERVER OPS',
    title: 'Linux Systems & Shell Administration',
    subtitle: 'Server management, automated Bash shell scripting, and network daemon maintenance.',
    desc: 'Extensive command-line experience across Debian, Ubuntu, and CentOS servers. Configured automated backup scripts, process isolation using systemd units, secure SSH key authentication, file permissions, and firewall routing rules (UFW/IPTables).',
    features: [
      'Automated Bash maintenance and database backup shell scripts',
      'Systemd unit service creation, daemon restarts, and system logging with journalctl',
      'SSH hardening, key-based authentication, and custom port configuration',
      'User group management, cron scheduler automation, and package repository maintenance',
      'Network diagnostics with netstat, curl, iptables, and dig'
    ],
    logFile: 'systemd_journalctl.log',
    logs: [
      '[systemd] Started System Logging Service (rsyslog)',
      '[sshd] Accepted publickey for admin from 192.168.1.42 port 22',
      '[cron] Hourly backup script executed: /opt/scripts/backup.sh (0 errors)',
      '[ufw] Firewall active: ALLOW 22/tcp, ALLOW 80/tcp, ALLOW 443/tcp',
      '[kernel] Linux version 6.5.0-generic (SMP PREEMPT_DYNAMIC)'
    ],
    tags: ['Ubuntu', 'Debian', 'Bash Scripting', 'Systemd', 'SSH', 'Cron', 'UFW / IPTables', 'Linux CLI']
  },
  laravel: {
    badge: 'BACKEND FRAMEWORK & APIS',
    title: 'Laravel & PHP Enterprise Architecture',
    subtitle: 'High-throughput MVC web applications, RESTful microservices, and database ORM.',
    desc: 'Engineered scalable backend systems with Laravel 10/11 and modern PHP 8. Utilized Eloquent ORM for relational modeling, structured clean RESTful API controllers with middleware authentication, and developed modular Blade templates.',
    features: [
      'Eloquent ORM query optimization, database migrations, and model relationships',
      'RESTful API resource controllers with standardized JSON response formatting',
      'Middleware pipelines for request validation, rate limiting, and sanitization',
      'Blade templating engine integration with server-side rendering',
      'PHP Composer dependency management and environment security'
    ],
    logFile: 'laravel_artisan.log',
    logs: [
      '[artisan] Migrating: 2026_01_create_logistics_tables',
      '[artisan] Migrated: 2026_01_create_logistics_tables (14.2ms)',
      '[router] Registered 42 API routes with Sanctum middleware',
      '[http] GET /api/v1/shipments/status 200 OK (8ms)',
      '[cache] Driver: Redis pool connected (127.0.0.1:6379)'
    ],
    tags: ['Laravel', 'PHP 8', 'Eloquent ORM', 'Blade', 'MySQL', 'Composer', 'REST APIs', 'Sanctum']
  },
  azure: {
    badge: 'CLOUD PLATFORM & SERVICES',
    title: 'Microsoft Azure Cloud Architecture',
    subtitle: 'Virtual machines, blob storage repositories, and cloud network security configurations.',
    desc: 'Architected cloud environments using Microsoft Azure resources. Configured Azure Virtual Machines, Virtual Machine Scale Sets (VMSS) for high-availability workloads, Azure Blob Storage containers, and isolated Virtual Networks (VNets) with Network Security Groups (NSGs).',
    features: [
      'Azure Virtual Machines deployment and disk storage attachments',
      'Azure Blob Storage container configuration with SAS token authentication',
      'Virtual Machine Scale Sets (VMSS) with load balancing rules',
      'Azure Virtual Networks (VNets) and Network Security Group (NSG) firewalls',
      'Azure Portal resource groups and resource management tags'
    ],
    logFile: 'azure_activity_log.log',
    logs: [
      '[Azure::VM] Virtual Machine vm-prod-app01 state: Running',
      '[Azure::Storage] Blob container data-pool mounted (Hot Tier)',
      '[Azure::Network] NSG default-allow-https rule verified',
      '[Azure::ScaleSet] VMSS instances synchronized (2 active instances)',
      '[HEALTH] Azure Resource Health: 100% Available'
    ],
    tags: ['Azure VMs', 'Azure Blob', 'VMSS', 'Azure VNets', 'NSG Rules', 'Cloud Infrastructure']
  },
  docker: {
    badge: 'CONTAINERIZATION & CI/CD',
    title: 'Docker & Microservice Containerization',
    subtitle: 'Multi-stage Dockerfile builds, Docker Compose orchestration, and reproducible deployments.',
    desc: 'Containerized full-stack applications to ensure environment parity between local development and production. Authored lightweight multi-stage Dockerfiles, configured multi-container Docker Compose stacks (Frontend, Backend, Database), and optimized image cache layers.',
    features: [
      'Multi-stage Dockerfile creation with Alpine and Slim Linux base images',
      'Docker Compose orchestration for multi-tier microservice stacks',
      'Container network bridging, volume persistence, and secret handling',
      'Container performance profiling and resource limit constraints',
      'Seamless CI/CD container build and push integration'
    ],
    logFile: 'docker_daemon.log',
    logs: [
      '[docker] Building stage 1: node:20-alpine AS frontend-builder',
      '[docker] Step 5/12 : RUN npm run build (Success: 4.2s)',
      '[docker-compose] Creating network "app_internal_net"',
      '[docker-compose] Starting app_db_1 ... done (healthy)',
      '[docker-compose] Starting app_backend_1 ... done (listening :8080)'
    ],
    tags: ['Docker', 'Docker Compose', 'Dockerfiles', 'Containerization', 'Microservices', 'CI/CD']
  },
  django: {
    badge: 'PYTHON BACKEND ENGINE',
    title: 'Django & Python Web Services',
    subtitle: 'Clean Python backends with Django REST Framework, ORM queries, and relational schemas.',
    desc: 'Developed robust backend web services utilizing Python 3 and Django 5. Implemented Django REST Framework (DRF) serializers, relational models with automated migrations, Django admin dashboards, and custom management commands.',
    features: [
      'Django REST Framework API serializers, viewsets, and pagination',
      'Django ORM queries with PostgreSQL and MySQL integration',
      'Built-in user authentication, password hashing, and token auth',
      'Custom Python CLI management scripts for scheduled data syncing',
      'Static asset compression and WSGI/ASGI server deployment'
    ],
    logFile: 'django_gunicorn.log',
    logs: [
      '[django] System check identified no issues (0 silenced)',
      '[django] Apply all migrations: auth, contenttypes, sessions, core',
      '[gunicorn] Starting gunicorn 21.2.0 on 0.0.0.0:8000',
      '[drf] Endpoint registered: /api/v2/analytics/ (Auth: Token)',
      '[workers] Booting worker with pid: 28414 (Worker: Sync)'
    ],
    tags: ['Django', 'Python 3', 'DRF', 'PostgreSQL', 'Gunicorn', 'ORM', 'REST APIs']
  },
  react: {
    badge: 'MODERN FRONTEND ARCHITECTURE',
    title: 'React.js & Modern User Interfaces',
    subtitle: 'Responsive Single Page Applications (SPAs) with Tailwind CSS and modular UI components.',
    desc: 'Engineered high-performance user interfaces with React.js, Vite, and Tailwind CSS. Built reusable design systems, asynchronous state management hooks, responsive layouts, and interactive canvas graphics for engaging web applications.',
    features: [
      'Modular React component hierarchy with hooks (useState, useEffect, useMemo)',
      'Tailwind CSS utility styling with fluid clamp typography and dark theme support',
      'Client-side routing and asynchronous data fetching with fetch/Axios',
      'Interactive canvas rendering and GSAP scroll-triggered animation timelines',
      'Vite build optimizations with code-splitting and asset minification'
    ],
    logFile: 'react_vite_build.log',
    logs: [
      '[vite] vite v5.2.0 building for production...',
      '[vite] transforming (48 modules)...',
      '[vite] ✓ 48 modules transformed.',
      '[vite] dist/assets/index.js   142.4 kB │ gzip: 44.1 kB',
      '[vite] ✓ built in 380ms'
    ],
    tags: ['React.js', 'Tailwind CSS', 'Vite', 'JavaScript (ES6+)', 'HTML5 Canvas', 'UI/UX Design']
  }
};

function init3DBoxCarousel() {
  const container = document.getElementById('cardsScrollContainer');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const cards = document.querySelectorAll('.project-3d-item');

  // Modal elements
  const modalOverlay = document.getElementById('detailModalOverlay');
  const modalBackdrop = document.getElementById('detailModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalTermFile = document.getElementById('modalTermFile');
  const modalTermContent = document.getElementById('modalTermContent');
  const modalTags = document.getElementById('modalTags');

  // Cover Flow 3D Perspective Calculation
  let ticking = false;

  function updateCoverFlowTilt() {
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    cards.forEach(card => {
      const frame = card.querySelector('.box-3d-frame');
      if (!frame) return;

      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      
      const distance = (cardCenter - containerCenter) / (containerRect.width * 0.45);
      const clampedDist = Math.max(-1.5, Math.min(1.5, distance));

      const rotY = -clampedDist * 25;
      const translateZ = -Math.abs(clampedDist) * 70;
      const scale = Math.max(0.85, 1 - Math.abs(clampedDist) * 0.08);
      const opacity = Math.max(0.5, 1 - Math.abs(clampedDist) * 0.25);

      frame.style.transform = `perspective(1400px) rotateY(${rotY}deg) translateZ(${translateZ}px) scale(${scale})`;
      card.style.opacity = opacity;
    });

    ticking = false;
  }

  function requestTiltUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateCoverFlowTilt);
      ticking = true;
    }
  }

  // Smooth Automatic Horizontal Scrolling
  let isAutoScrolling = true;
  let autoScrollSpeed = 0.8;

  function autoScrollStep() {
    if (isAutoScrolling && container) {
      container.scrollLeft += autoScrollSpeed;
      
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
        container.scrollLeft = 0;
      }
      requestTiltUpdate();
    }
    requestAnimationFrame(autoScrollStep);
  }
  requestAnimationFrame(autoScrollStep);

  // Pause on hover/touch
  if (container) {
    container.addEventListener('mouseenter', () => { isAutoScrolling = false; });
    container.addEventListener('mouseleave', () => { isAutoScrolling = true; });
    container.addEventListener('touchstart', () => { isAutoScrolling = false; }, { passive: true });
    container.addEventListener('touchend', () => { isAutoScrolling = true; });

    container.addEventListener('scroll', requestTiltUpdate, { passive: true });
    window.addEventListener('resize', requestTiltUpdate);
    setTimeout(updateCoverFlowTilt, 100);
  }

  // Arrow navigation
  if (prevBtn && container) {
    prevBtn.addEventListener('click', () => {
      isAutoScrolling = false;
      container.scrollBy({ left: -400, behavior: 'smooth' });
      setTimeout(() => { isAutoScrolling = true; }, 3000);
    });
  }
  if (nextBtn && container) {
    nextBtn.addEventListener('click', () => {
      isAutoScrolling = false;
      container.scrollBy({ left: 400, behavior: 'smooth' });
      setTimeout(() => { isAutoScrolling = true; }, 3000);
    });
  }

  // Drag to scroll
  let isDown = false;
  let startX;
  let scrollLeft;

  if (container) {
    container.addEventListener('mousedown', (e) => {
      isDown = true;
      isAutoScrolling = false;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        setTimeout(() => { isAutoScrolling = true; }, 2000);
      }
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
      requestTiltUpdate();
    });
  }

  // Card click triggers detail modal
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-key');
      const data = SHOWCASE_DATA[key];
      if (!data) return;

      openDetailModal(data);
    });
  });

  // Modal Open Handler
  function openDetailModal(data) {
    if (!modalOverlay) return;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalDesc.textContent = data.desc;
    modalTermFile.textContent = data.logFile;

    modalFeatures.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      modalFeatures.appendChild(li);
    });

    modalTermContent.innerHTML = '';
    data.logs.forEach(log => {
      const div = document.createElement('div');
      div.className = 'log-line';
      div.textContent = log;
      modalTermContent.appendChild(div);
    });

    modalTags.innerHTML = '';
    data.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'btag';
      span.textContent = t;
      modalTags.appendChild(span);
    });

    modalOverlay.classList.add('active');
    document.body.classList.add('scroll-locked');
  }

  // Modal Close Handlers
  function closeDetailModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.classList.remove('scroll-locked');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDetailModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeDetailModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeDetailModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeDetailModal();
    }
  });
}


// ============================================================
// ORGANIC 3D JELLY / BLOB MEMBRANE CANVAS ENGINE
// ============================================================
function init3DJellyMembrane() {
  const jCanvas = document.getElementById('contact-jelly-canvas');
  if (!jCanvas) return;

  const jCtx = jCanvas.getContext('2d');
  let jWidth = jCanvas.width = 600;
  let jHeight = jCanvas.height = 600;

  let time = 0;
  let mouseOffset = { x: 0, y: 0, targetX: 0, targetY: 0 };

  window.addEventListener('mousemove', (e) => {
    const rect = jCanvas.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    if (Math.abs(mx) < 500 && Math.abs(my) < 500) {
      mouseOffset.targetX = (mx / (rect.width / 2)) * 35;
      mouseOffset.targetY = (my / (rect.height / 2)) * 35;
    }
  });

  function drawJellyBlob(centerX, centerY, baseRadius, noiseScale, speed, alpha, isInner) {
    const points = 72;
    jCtx.beginPath();

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      
      const wave1 = Math.sin(angle * 3 + time * speed) * (18 * noiseScale);
      const wave2 = Math.cos(angle * 5 - time * speed * 1.3) * (12 * noiseScale);
      const wave3 = Math.sin(angle * 2 + time * speed * 0.8) * (10 * noiseScale);

      const r = baseRadius + wave1 + wave2 + wave3;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) {
        jCtx.moveTo(x, y);
      } else {
        jCtx.lineTo(x, y);
      }
    }

    jCtx.closePath();

    const isDark = document.body.classList.contains('dark-mode');
    
    if (isInner) {
      jCtx.fillStyle = isDark ? `rgba(255, 255, 255, ${alpha * 0.12})` : `rgba(17, 17, 17, ${alpha * 0.16})`;
      jCtx.fill();
      jCtx.strokeStyle = isDark ? `rgba(255, 255, 255, ${alpha * 0.45})` : `rgba(17, 17, 17, ${alpha * 0.5})`;
      jCtx.lineWidth = 1.5;
      jCtx.stroke();
    } else {
      jCtx.fillStyle = isDark ? `rgba(255, 255, 255, ${alpha * 0.05})` : `rgba(17, 17, 17, ${alpha * 0.07})`;
      jCtx.fill();
      jCtx.strokeStyle = isDark ? `rgba(255, 255, 255, ${alpha * 0.25})` : `rgba(17, 17, 17, ${alpha * 0.35})`;
      jCtx.lineWidth = 1.2;
      jCtx.stroke();
    }
  }

  function renderJelly() {
    jCtx.clearRect(0, 0, jWidth, jHeight);
    time += 0.02;

    mouseOffset.x += (mouseOffset.targetX - mouseOffset.x) * 0.05;
    mouseOffset.y += (mouseOffset.targetY - mouseOffset.y) * 0.05;

    const centerX = jWidth / 2 + mouseOffset.x;
    const centerY = jHeight / 2 + mouseOffset.y;

    // Outer Layer 1
    drawJellyBlob(centerX, centerY, 210, 1.0, 1.0, 0.7, false);

    // Mid Layer 2
    drawJellyBlob(centerX, centerY, 150, 1.2, 1.4, 0.85, false);

    // Inner Core Layer 3
    drawJellyBlob(centerX, centerY, 90, 1.5, 1.8, 1.0, true);

    // Center Pulse Ring
    const pulseRadius = 14 + Math.sin(time * 2) * 3;
    jCtx.beginPath();
    jCtx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    jCtx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(199, 255, 0, 0.85)' : 'rgba(0, 210, 255, 0.85)';
    jCtx.lineWidth = 1.5;
    jCtx.stroke();

    requestAnimationFrame(renderJelly);
  }

  renderJelly();
}


// ============================================================
// SCROLL-DRIVEN REVEAL ANIMATIONS
// ============================================================
function initScrollAnimations() {
  gsap.utils.toArray('.reveal-slide-up').forEach((el) => {
    gsap.fromTo(el, 
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 92%', 
          toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out'
      }
    );
  });

  gsap.to('#timelineProgress', {
    scrollTrigger: {
      trigger: '.edu-timeline-block',
      start: 'top 85%',
      end: 'bottom 60%',
      scrub: true
    },
    height: '100%',
    ease: 'none'
  });

  document.querySelectorAll('.timeline-node-item').forEach(item => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        onEnter: () => item.classList.add('active'),
        onLeaveBack: () => item.classList.remove('active')
      }
    });
  });

  // Profile Sticky 3D Orb entrance / exit animation
  gsap.fromTo('.profile-visual', 
    { opacity: 0, scale: 0.8 },
    {
      scrollTrigger: {
        trigger: '#profile',
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse'
      },
      opacity: 0.95,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out'
    }
  );
}


// ============================================================
// DETAILED SCROLL PROGRESS (RIGHT BORDER PROGRESS INDICATOR)
// ============================================================
const traceFill = document.querySelector('.trace-fill');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (traceFill) {
    traceFill.style.height = pct + '%';
  }
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });


// ============================================================
// LIVE CLOCK TIMEZONE TICKING (GUJARAT INDIA)
// ============================================================
function updateClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  const timeString = new Date().toLocaleTimeString('en-US', options);
  clockEl.textContent = `GUJARAT, IN — ${timeString}`;
}
setInterval(updateClock, 1000);
updateClock();


// ============================================================
// MOBILE NAVIGATION HAMBURGER TRIGGERS
// ============================================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileMenuBtn && mobileMenuOverlay) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.classList.toggle('scroll-locked');
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.classList.remove('scroll-locked');
    });
  });
}


// ============================================================
// DARK/LIGHT THEME SWITCH STATE PERSISTENCE
// ============================================================
const themeToggleBtn = document.getElementById('themeToggleBtn');
if (themeToggleBtn) {
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  });
}

// Copyright year setting
const copyrightYearEl = document.getElementById('copyrightYear');
if (copyrightYearEl) {
  copyrightYearEl.textContent = new Date().getFullYear();
}

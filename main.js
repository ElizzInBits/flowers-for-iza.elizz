onload = () => {
  document.body.classList.remove("container");
  
  const canvas = document.getElementById('lycoris-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Função para desenhar pétala curva realista
  function drawPetal(x, y, length, width, angle, opacity = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = opacity;

    const gradient = ctx.createLinearGradient(0, 0, 0, -length);
    gradient.addColorStop(0, "#8B0000");
    gradient.addColorStop(0.3, "#DC143C");
    gradient.addColorStop(0.7, "#FF1744");
    gradient.addColorStop(1, "#DC143C");

    ctx.fillStyle = gradient;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(width/2, -length/4, width, -length/2, width/3, -length);
    ctx.bezierCurveTo(0, -length * 0.95, 0, -length * 0.95, -width/3, -length);
    ctx.bezierCurveTo(-width, -length/2, -width/2, -length/4, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Linha central brilhante
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(0, -length/2, 0, -length);
    ctx.stroke();

    ctx.restore();
  }

  // Função para desenhar estame arqueado
  function drawStamen(x, y, length, angle, curve = 0.3) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const gradient = ctx.createLinearGradient(0, 0, 0, -length);
    gradient.addColorStop(0, "rgba(139, 69, 19, 0.3)");
    gradient.addColorStop(0.2, "#8B4513");
    gradient.addColorStop(0.8, "#DAA520");
    gradient.addColorStop(1, "#FFD700");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(length * curve, -length/2, length * curve * 0.5, -length);
    ctx.stroke();

    // Antera brilhante
    const antherX = length * curve * 0.5;
    const antherY = -length;
    
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(antherX, antherY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(antherX - 1, antherY - 1, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Função para desenhar flor completa de Lycoris radiata
  function drawLycorisFlower(x, y, scale = 1) {
    const petalLength = 120 * scale;
    const petalWidth = 25 * scale;
    const stamenLength = 140 * scale;

    // Camada externa de pétalas (6 pétalas)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      drawPetal(x, y, petalLength, petalWidth, angle, 0.9);
    }

    // Camada interna de pétalas (6 pétalas rotacionadas)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6 + Math.PI / 6;
      drawPetal(x, y, petalLength * 0.8, petalWidth * 0.8, angle, 0.7);
    }

    // Estames (15 estames)
    for (let i = 0; i < 15; i++) {
      const angle = (i * Math.PI * 2) / 15;
      const curve = 0.2 + Math.random() * 0.4;
      drawStamen(x, y, stamenLength, angle, curve);
    }
  }

  // Função para desenhar caule
  function drawStem(x, yTop, yBottom) {
    const gradient = ctx.createLinearGradient(x - 4, yTop, x + 4, yTop);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
    gradient.addColorStop(0.3, "#006400");
    gradient.addColorStop(0.7, "#228B22");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.shadowColor = "rgba(34, 139, 34, 0.4)";
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(x, yBottom);
    ctx.lineTo(x, yTop);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Função para desenhar cena completa
  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = [
      { x: canvas.width * 0.25, scale: 0.7 },
      { x: canvas.width * 0.45, scale: 1.0 },
      { x: canvas.width * 0.65, scale: 0.8 },
      { x: canvas.width * 0.8, scale: 0.6 }
    ];

    const groundY = canvas.height * 0.9;
    const stemHeight = 300;

    positions.forEach(pos => {
      const flowerY = groundY - stemHeight * pos.scale;
      
      // Desenha caule
      drawStem(pos.x, flowerY, groundY);
      
      // Desenha flor
      drawLycorisFlower(pos.x, flowerY, pos.scale);
    });

    // Efeito de brilho atmosférico
    const time = Date.now() * 0.001;
    positions.forEach((pos, i) => {
      const flowerY = groundY - stemHeight * pos.scale;
      const radius = 80 + Math.sin(time + i) * 15;
      const opacity = 0.1 + Math.sin(time * 0.5 + i) * 0.05;
      
      const gradient = ctx.createRadialGradient(pos.x, flowerY, 0, pos.x, flowerY, radius);
      gradient.addColorStop(0, `rgba(220, 20, 60, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(139, 0, 0, ${opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, flowerY, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Animação contínua
  function animate() {
    drawScene();
    requestAnimationFrame(animate);
  }

  // Partículas flutuantes
  const particles = [];
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.4
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.fillStyle = `rgba(220, 20, 60, ${p.opacity})`;
      ctx.shadowColor = "rgba(220, 20, 60, 0.8)";
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
  }

  function animateWithParticles() {
    drawScene();
    drawParticles();
    requestAnimationFrame(animateWithParticles);
  }

  // Redimensionar canvas
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Iniciar animação
  setTimeout(() => {
    animateWithParticles();
  }, 1000);
};
let confeteAnimacaoId = null;

function salvarLogo() {
  const input = document.getElementById("logo-upload");
  const preview = document.getElementById("logo-preview");
  const container = document.getElementById("logo-container");

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Logo">`;
      input.style.display = "none";
      container.querySelector("button").style.display = "none";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function iniciarSorteio() {
  const quantidade = parseInt(document.getElementById("quantidade").value);
  if (isNaN(quantidade) || quantidade < 1) {
    alert("Digite uma quantidade válida.");
    return;
  }

  // Limpa resultado anterior
  document.getElementById("resultado").textContent = "";
  document.getElementById("resultado").style.display = "none";
  document.getElementById("parabens").textContent = "";
  document.getElementById("parabens").style.display = "none";

  // Limpa confetes e cancela animação anterior
  const canvas = document.getElementById("confetes");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (confeteAnimacaoId) {
    cancelAnimationFrame(confeteAnimacaoId);
    confeteAnimacaoId = null;
  }

  // Mostra o círculo da contagem
  const contadorContainer = document.getElementById("contador-container");
  const contadorDiv = document.getElementById("contador");
  contadorContainer.style.display = "flex";

  let contador = 5;
  contadorDiv.textContent = contador;

  const intervalo = setInterval(() => {
    contador--;
    if (contador > 0) {
      contadorDiv.textContent = contador;
    } else {
      clearInterval(intervalo);
      contadorContainer.style.display = "none";
      sortearNumero(quantidade);
    }
  }, 1000);
}
function sortearNumero(max) {
  const numero = Math.floor(Math.random() * max) + 1;
  document.getElementById("contador").textContent = "";
  document.getElementById("resultado").textContent = `🎉 ${numero} 🎉`;
  document.getElementById("resultado").style.display = "block";

  const parabensDiv = document.getElementById("parabens");
  parabensDiv.textContent = "Parabéns!";
  parabensDiv.style.display = "block";

  soltarConfetes();
}

function soltarConfetes() {
  const canvas = document.getElementById("confetes");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetes = [];
  for (let i = 0; i < 100; i++) {
    confetes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      d: Math.random() * 10,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      angle: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < confetes.length; i++) {
      const c = confetes[i];
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.angle * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();

      c.y += Math.cos(c.d) + 1;
      c.x += Math.sin(c.d) * 0.5;
      c.angle += c.rotationSpeed;

      if (c.y > canvas.height) c.y = 0;
    }
    confeteAnimacaoId = requestAnimationFrame(draw);
  }

  draw();
}
(function() {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let canvasAspectRatio;

    function resizeCanvas() {
        try {
            // Get the device pixel ratio
            const devicePixelRatio = window.devicePixelRatio || 1;

            // Calculate the aspect ratio of the canvas
            canvasAspectRatio = canvas.width / canvas.height;

            // Get the current window aspect ratio
            const windowAspectRatio = window.innerWidth / window.innerHeight;

            // Adjust canvas size while maintaining aspect ratio
            if (windowAspectRatio >= canvasAspectRatio) {
                canvas.width = window.innerHeight * canvasAspectRatio * devicePixelRatio;
                canvas.height = window.innerHeight * devicePixelRatio;
            } else {
                canvas.width = window.innerWidth * devicePixelRatio;
                canvas.height = window.innerWidth / canvasAspectRatio * devicePixelRatio;
            }

            // Set higher resolution for the canvas
            canvas.style.width = `${canvas.width / devicePixelRatio}px`;
            canvas.style.height = `${canvas.height / devicePixelRatio}px`;

            // Center canvas horizontally and vertically
            canvas.style.position = 'absolute';
            canvas.style.left = '50%';
            canvas.style.top = '50%';
            canvas.style.transform = 'translate(-50%, -50%)';

            // Reinitialize particles to fit new canvas size
            initParticles();
        } catch (error) {
            console.error("Error in resizeCanvas function:", error);
        }
    }

    // Event listeners for resize and orientation change
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
    window.addEventListener('load', resizeCanvas); // Ensure resizeCanvas runs on load

    class Particle {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.dx = Math.random() * 2 - 1;
            this.dy = Math.random() * 2 - 1;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            // Commented out gradient colors
            // const colors = ['rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.7)'];
            // return colors[Math.floor(Math.random() * colors.length)];
            
            // Set particle color to white
            return 'rgba(255, 255, 255, 0.7)';
        }

        draw() {
            try {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            } catch (error) {
                console.error("Error in draw method of Particle class:", error);
            }
        }

        update() {
            try {
                this.x += this.dx;
                this.y += this.dy;

                if (this.x < 0 || this.x > canvas.width) this.dx = -this.dx;
                if (this.y < 0 || this.y > canvas.height) this.dy = -this.dy;

                if (Math.random() < 0.01) {
                    this.color = this.getRandomColor();
                }

                this.draw();
            } catch (error) {
                console.error("Error in update method of Particle class:", error);
            }
        }
    }

    function initParticles() {
        try {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000);
            for (let i = 0; i < numberOfParticles; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = Math.random() * 2 + 1;
                particles.push(new Particle(x, y, radius));
            }
        } catch (error) {
            console.error("Error in initParticles function:", error);
        }
    }

    function connectParticles() {
        try {
            ctx.imageSmoothingEnabled = false; // Turn off image smoothing
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.lineWidth = 2; // Set line width to 2 for better visibility
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        } catch (error) {
            console.error("Error in connectParticles function:", error);
        }
    }

    function animateParticles() {
        try {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Set background color to black
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => particle.update());
            connectParticles();
        } catch (error) {
            console.error("Error in animateParticles function:", error);
        }
    }

    initParticles();
    animateParticles();
})();

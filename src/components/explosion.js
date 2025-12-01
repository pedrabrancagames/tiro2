AFRAME.registerComponent('explosion', {
    init: function () {
        const el = this.el;
        const position = el.getAttribute('position');
        const scene = el.sceneEl;

        // 1. Criar efeito visual de explosão (partículas)
        this.createExplosionParticles(scene, position);

        // 2. Esconder o objeto imediatamente (para dar feedback instantâneo)
        el.object3D.visible = false;

        // 3. Remover o objeto do DOM
        // Usamos setTimeout 0 para garantir que saia do fluxo atual, mas seja rápido
        setTimeout(() => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }, 0);
    },

    createExplosionParticles: function (scene, position) {
        const particleCount = 10;
        const colors = ['#FF0000', '#FFA500', '#FFFF00'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('a-entity');

            // Geometria simples para performance
            particle.setAttribute('geometry', { primitive: 'box', width: 0.1, height: 0.1, depth: 0.1 });
            particle.setAttribute('material', {
                color: colors[Math.floor(Math.random() * colors.length)],
                shader: 'flat'
            });

            particle.setAttribute('position', position);

            // Direção aleatória
            const dirX = (Math.random() - 0.5) * 5;
            const dirY = (Math.random() - 0.5) * 5;
            const dirZ = (Math.random() - 0.5) * 5;

            // Animação de expansão
            particle.setAttribute('animation', {
                property: 'position',
                to: `${position.x + dirX} ${position.y + dirY} ${position.z + dirZ}`,
                dur: 500,
                easing: 'easeOutQuad'
            });

            // Animação de sumir
            particle.setAttribute('animation__scale', {
                property: 'scale',
                to: '0 0 0',
                dur: 500,
                easing: 'easeOutQuad'
            });

            scene.appendChild(particle);

            // Limpeza automática da partícula
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 500);
        }
    }
});

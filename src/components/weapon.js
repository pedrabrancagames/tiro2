AFRAME.registerComponent('weapon', {
    init: function () {
        this.shootBtn = document.getElementById('shoot-btn');
        this.shootBtn.addEventListener('click', this.shoot.bind(this));
    },

    shoot: function () {
        const raycaster = this.el.components.raycaster;
        raycaster.refreshObjects();
        const intersections = raycaster.intersections;

        // Posição inicial (arma/câmera)
        const startPos = new THREE.Vector3();
        this.el.object3D.getWorldPosition(startPos);

        // Posição final (alvo ou ponto distante)
        let endPos = new THREE.Vector3();
        let targetEl = null;

        if (intersections.length > 0) {
            // Acertou algo
            endPos.copy(intersections[0].point);
            targetEl = intersections[0].object.el;
        } else {
            // Não acertou nada, atira para longe na direção da câmera
            const direction = new THREE.Vector3();
            this.el.object3D.getWorldDirection(direction);
            direction.multiplyScalar(-1); // A-Frame cameras look down -Z
            endPos.copy(startPos).add(direction.multiplyScalar(20));
        }

        // Criar o projétil visual
        this.fireProjectile(startPos, endPos, targetEl);
        this.createMuzzleFlash();
    },

    fireProjectile: function (start, end, targetEl) {
        const projectile = document.createElement('a-entity');
        projectile.setAttribute('geometry', { primitive: 'sphere', radius: 0.05 });
        projectile.setAttribute('material', { color: '#FFFF00', shader: 'flat' });
        projectile.setAttribute('position', start);

        this.el.sceneEl.appendChild(projectile);

        // Calcular duração baseada na distância (velocidade constante)
        const distance = start.distanceTo(end);
        const speed = 20; // metros por segundo
        // Garantir duração mínima para ser visível
        const duration = Math.max((distance / speed) * 1000, 100);

        // Animar posição
        projectile.setAttribute('animation', {
            property: 'position',
            to: `${end.x} ${end.y} ${end.z}`,
            dur: duration,
            easing: 'linear'
        });

        // Evento ao terminar animação
        setTimeout(() => {
            // Remover projétil
            if (projectile.parentNode) projectile.parentNode.removeChild(projectile);

            // Se tinha um alvo, processar impacto
            if (targetEl) {
                this.processHit(targetEl);
            }
        }, duration);
    },

    processHit: function (el) {
        if (el.classList.contains('trash')) {
            // Lixo: Explode e ganha pontos
            el.setAttribute('explosion', '');
            this.el.sceneEl.emit('score-up');
        } else if (el.classList.contains('fish')) {
            // Peixe: Não explode, perde pontos (penalidade)
            this.el.sceneEl.emit('score-down');

            // Fazer o peixe fugir rápido
            el.setAttribute('animation__flee', {
                property: 'position',
                to: `${el.object3D.position.x} ${el.object3D.position.y + 5} ${el.object3D.position.z}`,
                dur: 500,
                easing: 'easeInQuad'
            });
            // Remover depois de fugir
            setTimeout(() => {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 500);
        }
    },

    createMuzzleFlash: function () {
        // Simples flash de luz ou som
        // Implementação futura
    }
});

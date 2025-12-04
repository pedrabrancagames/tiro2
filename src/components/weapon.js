AFRAME.registerComponent('weapon', {
    init: function () {
        this.shootBtn = document.getElementById('shoot-btn');
        this.shootBtn.addEventListener('click', this.shoot.bind(this));
        this.soundSystem = this.el.sceneEl.systems['sound-manager'];
    },

    shoot: function () {
        // Tocar som de tiro
        if (this.soundSystem) this.soundSystem.playSound('shoot');

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
        projectile.setAttribute('material', {
            color: '#40E0D0',
            shader: 'flat',
            emissive: '#40E0D0',
            emissiveIntensity: 0.5
        });
        projectile.setAttribute('position', start);

        // Adicionar rastro de bolhas ao projétil
        projectile.setAttribute('bubble-trail', {
            enabled: true,
            interval: 50,
            bubbleSize: 0.04,
            bubbleLife: 800
        });

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
                this.processHit(targetEl, end);
            }
        }, duration);
    },

    processHit: function (el, hitPosition) {
        if (el.classList.contains('trash')) {
            // Lixo: Explode e ganha pontos
            el.setAttribute('explosion', '');

            // Criar brilho mágico ao coletar lixo
            const glowEntity = document.createElement('a-entity');
            glowEntity.setAttribute('position', hitPosition);
            glowEntity.setAttribute('magic-glow', {
                color: '#F4D03F',
                duration: 1200,
                size: 0.6
            });
            this.el.sceneEl.appendChild(glowEntity);

            // Emitir evento com detalhes para o game-manager criar o texto flutuante
            this.el.sceneEl.emit('score-up', { position: hitPosition });
        } else if (el.classList.contains('fish')) {
            // Peixe: Não explode, perde pontos (penalidade)

            // Criar partículas de água ao acertar peixe
            const waterEntity = document.createElement('a-entity');
            waterEntity.setAttribute('position', hitPosition);
            waterEntity.setAttribute('water-particles', {
                count: 15,
                color: '#4FB3D9',
                size: 0.08,
                spread: 0.4,
                duration: 1000
            });
            this.el.sceneEl.appendChild(waterEntity);

            this.el.sceneEl.emit('score-down', { position: hitPosition });

            // Som de splash/erro
            if (this.soundSystem) this.soundSystem.playSound('splash');

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

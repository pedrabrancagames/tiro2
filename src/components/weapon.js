AFRAME.registerComponent('weapon', {
    init: function () {
        this.shootBtn = document.getElementById('shoot-btn');
        this.shootBtn.addEventListener('click', this.shoot.bind(this));

        // Som de tiro (opcional, usando oscilador simples se não houver arquivo)
        // Para simplificar, vamos apenas logar por enquanto ou usar Web Audio API simples
    },

    shoot: function () {
        // Raycaster já está configurado na entidade
        const raycaster = this.el.components.raycaster;

        // Atualizar raycaster para garantir que pegue a posição atual
        raycaster.refreshObjects();

        const intersections = raycaster.intersections;

        if (intersections.length > 0) {
            // Pegar o primeiro objeto atingido
            const hitEl = intersections[0].object.el;

            if (hitEl.classList.contains('enemy')) {
                this.destroyTarget(hitEl);
            }
        } else {
            console.log('Errou!');
        }

        // Feedback visual do tiro (opcional)
        this.createMuzzleFlash();
    },

    destroyTarget: function (el) {
        // Adicionar componente de explosão e remover depois
        el.setAttribute('explosion', '');

        // Atualizar pontuação via evento
        this.el.sceneEl.emit('score-up');
    },

    createMuzzleFlash: function () {
        // Simples flash de luz ou som
        // Implementação futura
    }
});

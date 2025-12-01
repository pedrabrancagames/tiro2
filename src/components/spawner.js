AFRAME.registerComponent('spawner', {
    schema: {
        interval: { type: 'number', default: 2000 },
        range: { type: 'number', default: 5 }
    },

    init: function () {
        this.timer = 0;
        this.targets = [];
    },

    tick: function (time, timeDelta) {
        this.timer += timeDelta;
        if (this.timer >= this.data.interval) {
            this.spawn();
            this.timer = 0;
        }
    },

    spawn: function () {
        const el = document.createElement('a-entity');

        // Usar modelo GLB
        // O usuário deve colocar o arquivo 'enemy.glb' em public/models/
        el.setAttribute('gltf-model', 'url(/models/enemy.glb)');

        // Tocar todas as animações disponíveis no modelo (loop)
        el.setAttribute('animation-mixer', '');

        // Ajuste de escala (pode variar dependendo do modelo, deixei um padrão razoável)
        el.setAttribute('scale', '0.5 0.5 0.5');

        // Classe para detecção
        el.classList.add('enemy');

        // Posição Aleatória
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * (this.data.range - 2); // Entre 2m e range
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 1 + Math.random() * 1.5; // Altura entre 1m e 2.5m

        el.setAttribute('position', { x, y, z });

        // Animação de flutuar (mantida para dar movimento extra)
        el.setAttribute('animation', {
            property: 'position',
            to: `${x} ${y + 0.2} ${z}`,
            dir: 'alternate',
            dur: 2000,
            loop: true,
            easing: 'easeInOutSine'
        });

        // Adicionar à cena
        this.el.sceneEl.appendChild(el);
    },

    getRandomColor: function () {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});

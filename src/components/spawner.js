AFRAME.registerComponent('spawner', {
    schema: {
        interval: { type: 'number', default: 2000 },
        range: { type: 'number', default: 5 }
    },

    init: function () {
        this.timer = 0;
        this.targets = [];

        this.fishModels = [
            'peixe_betta.glb', 'carangueijo.glb', 'tubarao.glb', 'peixe_palhaco.glb',
            'peixe.glb', 'peixe_arcoires.glb', 'carpa.glb', 'tilapia.glb'
        ];

        this.trashModels = [
            'lixo_lata.glb', 'lixo_saco.glb', 'lixo_balde.glb', 'lixo_lata2.glb',
            'lixo_lata3.glb', 'lixo_lata4.glb', 'lixo_lata5.glb', 'lixo_garrafa.glb',
            'lixo_garrafa2.glb'
        ];
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
        const isFish = Math.random() > 0.5; // 50% de chance

        let modelName;

        if (isFish) {
            modelName = this.fishModels[Math.floor(Math.random() * this.fishModels.length)];
            el.classList.add('fish'); // Classe para identificar amigo
            el.setAttribute('animation-mixer', ''); // Peixes são animados
            el.setAttribute('scale', '0.5 0.5 0.5');
        } else {
            modelName = this.trashModels[Math.floor(Math.random() * this.trashModels.length)];
            el.classList.add('trash'); // Classe para identificar inimigo (lixo)
            el.setAttribute('scale', '0.5 0.5 0.5');
        }

        el.setAttribute('gltf-model', `url(/models/${modelName})`);

        // Posição Aleatória
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * (this.data.range - 2);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 1 + Math.random() * 1.5;

        el.setAttribute('position', { x, y, z });

        // Animação de flutuar
        el.setAttribute('animation', {
            property: 'position',
            to: `${x} ${y + 0.2} ${z}`,
            dir: 'alternate',
            dur: 2000 + Math.random() * 1000,
            loop: true,
            easing: 'easeInOutSine'
        });

        // Rotação aleatória inicial
        el.setAttribute('rotation', `0 ${Math.random() * 360} 0`);

        this.el.sceneEl.appendChild(el);
    },

    getRandomColor: function () {
        return '#FFFFFF';
    }
});

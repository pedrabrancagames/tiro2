AFRAME.registerComponent('spawner', {
    schema: {
        interval: { type: 'number', default: 1000 }, // Checa a cada 1 segundo
        range: { type: 'number', default: 5 },
        maxFish: { type: 'number', default: 4 },
        maxTrash: { type: 'number', default: 3 }
    },

    init: function () {
        this.timer = 0;
        // this.targets = []; // Removed as per new code

        this.fishModels = [
            'peixe_betta.glb', 'carangueijo.glb', 'tubarao.glb', 'peixe_palhaco.glb',
            'peixe.glb', 'peixe_arcoires.glb', 'carpa.glb', 'tilapia.glb'
        ];

        this.trashModels = [
            this.timer = 0;
    }
},

    trySpawn: function () {
        const fishCount = document.querySelectorAll('.fish').length;
        const trashCount = document.querySelectorAll('.trash').length;

        let spawnType = null;

        // Lógica de prioridade: tenta preencher o que falta
        if (fishCount < this.data.maxFish && trashCount < this.data.maxTrash) {
            // Ambos precisam, escolhe aleatório
            spawnType = Math.random() > 0.5 ? 'fish' : 'trash';
        } else if (fishCount < this.data.maxFish) {
            spawnType = 'fish';
        } else if (trashCount < this.data.maxTrash) {
            spawnType = 'trash';
        }

        if (spawnType) {
            this.spawn(spawnType);
        }
    },

    spawn: function (type) {
        const el = document.createElement('a-entity');
        let modelName;

        if (type === 'fish') {
            modelName = this.fishModels[Math.floor(Math.random() * this.fishModels.length)];
            el.classList.add('fish');
            el.setAttribute('animation-mixer', '');
        } else {
            modelName = this.trashModels[Math.floor(Math.random() * this.trashModels.length)];
            el.classList.add('trash');
        }

        el.setAttribute('gltf-model', `url(/models/${modelName})`);

        // Aplicar escala
        const scale = this.customScales[modelName] || '0.5 0.5 0.5';
        el.setAttribute('scale', scale);

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
    // Removed extra '}' here

    getRandomColor: function () {
        return '#FFFFFF';
    }
});

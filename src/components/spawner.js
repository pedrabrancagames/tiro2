AFRAME.registerComponent('spawner', {
    schema: {
        interval: { type: 'number', default: 1000 }, // Checa a cada 1 segundo
        range: { type: 'number', default: 5 },
        maxFish: { type: 'number', default: 4 },
        maxTrash: { type: 'number', default: 3 },
        enabled: { type: 'boolean', default: true }
    },

    init: function () {
        this.timer = 0;

        this.fishModels = [
            'carangueijo.glb', 'peixe_palhaco.glb',
            'peixe.glb', 'peixe_arcoires.glb', 'carpa.glb', 'tilapia.glb'
        ];

        this.trashModels = [
            'lixo_lata.glb', 'lixo_saco.glb',
            'lixo_lata4.glb', 'lixo_lata5.glb', 'lixo_garrafa.glb',
            'lixo_garrafa2.glb'
        ];

        // Escalas personalizadas
        this.customScales = {
            'peixe_palhaco.glb': '0.01 0.01 0.01',
            'lixo_lata5.glb': '0.006 0.006 0.006',
            'lixo_garrafa2.glb': '0.025 0.025 0.025',
            'lixo_saco.glb': '0.015 0.015 0.015',
            'lixo_lata4.glb': '0.1 0.1 0.1',
            'lixo_garrafa.glb': '0.025 0.025 0.025',
        };
    },

    tick: function (time, timeDelta) {
        if (!this.data.enabled) return;

        this.timer += timeDelta;
        if (this.timer >= this.data.interval) {
            this.trySpawn();
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

        // Escala Alvo
        const targetScaleStr = this.customScales[modelName] || '0.5 0.5 0.5';

        // Iniciar invisível ou com escala 0 para evitar glitch de posição
        el.setAttribute('scale', '0 0 0');
        el.setAttribute('visible', 'true');

        // Animação de Entrada (Pop-in)
        el.setAttribute('animation__spawn', {
            property: 'scale',
            to: targetScaleStr,
            dur: 800,
            easing: 'easeOutElastic'
        });

        // Posição Aleatória
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * (this.data.range - 3); // Raio mínimo aumentado para 3
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 1 + Math.random() * 1.5;

        el.setAttribute('position', { x, y, z });

        // Animação de flutuar (Manter existente, renomear para evitar conflito se necessário, mas A-Frame suporta multiplas se propriedade for diferente)
        // A animação de spawn é na escala, a de flutuar é na posição. Sem conflito.
        el.setAttribute('animation__float', {
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

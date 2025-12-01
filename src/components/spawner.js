AFRAME.registerComponent('spawner', {
    schema: {
        interval: { type: 'number', default: 2000 },
        range: { type: 'number', default: 5 }
    },

    init: function () {
        this.timer = 0;
        this.targets = [];

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

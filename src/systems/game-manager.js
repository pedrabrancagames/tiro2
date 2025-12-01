AFRAME.registerComponent('game-manager', {
    init: function () {
        this.score = 0;
        this.scoreEl = document.getElementById('score');
        this.soundSystem = this.el.sceneEl.systems['sound-manager'];

        this.el.sceneEl.addEventListener('score-up', (evt) => {
            this.score += 10;
            this.updateScore();
            if (this.soundSystem) this.soundSystem.playSound('score-up');

            if (evt.detail && evt.detail.position) {
                this.spawnFloatingText(evt.detail.position, '+10', '#00FF00');
            }
        });

        this.el.sceneEl.addEventListener('score-down', (evt) => {
            this.score -= 5;
            this.updateScore();
            if (this.soundSystem) this.soundSystem.playSound('score-down');

            if (evt.detail && evt.detail.position) {
                this.spawnFloatingText(evt.detail.position, '-5', '#FF0000');
            }
        });
    },

    updateScore: function () {
        this.scoreEl.innerText = this.score;
        if (this.score < 0) this.scoreEl.style.color = 'red';
        else this.scoreEl.style.color = 'white';
    },

    spawnFloatingText: function (position, text, color) {
        const entity = document.createElement('a-entity');
        entity.setAttribute('position', position);
        entity.setAttribute('floating-text', { text: text, color: color });
        this.el.sceneEl.appendChild(entity);
    }
});

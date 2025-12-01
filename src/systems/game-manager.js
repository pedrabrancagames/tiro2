AFRAME.registerComponent('game-manager', {
    init: function () {
        this.score = 0;
        this.scoreEl = document.getElementById('score');

        this.el.sceneEl.addEventListener('score-up', () => {
            this.score += 10;
            this.scoreEl.innerText = this.score;
        });
    }
});

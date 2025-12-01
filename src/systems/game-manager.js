AFRAME.registerComponent('game-manager', {
    init: function () {
        this.score = 0;
        this.scoreEl = document.getElementById('score');

        this.el.sceneEl.addEventListener('score-up', () => {
            this.score += 10;
            this.updateScore();
        });

        this.el.sceneEl.addEventListener('score-down', () => {
            this.score -= 5;
            this.updateScore();
        });
    },

    updateScore: function () {
        this.scoreEl.innerText = this.score;
        if (this.score < 0) this.scoreEl.style.color = 'red';
        else this.scoreEl.style.color = 'white';
    }
});

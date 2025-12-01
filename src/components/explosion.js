AFRAME.registerComponent('explosion', {
    init: function () {
        // Escalar e desaparecer
        this.el.setAttribute('animation__scale', {
            property: 'scale',
            to: '2 2 2',
            dur: 200,
            easing: 'easeOutQuad'
        });

        this.el.setAttribute('animation__opacity', {
            property: 'material.opacity',
            to: 0,
            dur: 200,
            easing: 'easeOutQuad'
        });

        // Remover entidade após animação
        setTimeout(() => {
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }, 200);
    }
});

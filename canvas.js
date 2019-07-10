export const canvas = document.getElementById("sphere");
export const ctx = canvas.getContext('2d');
export let width = canvas.offsetWidth;
export let height = canvas.offsetHeight;

function onResize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    
    if (window.devicePixelRatio > 1) {
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        ctx.scale(2, 2);
    } else {
        canvas.width = width;
        canvas.height = height;
    }
}

window.addEventListener('resize', onResize);
onResize();
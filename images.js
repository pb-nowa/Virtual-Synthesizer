export const play = new Image();
play.src = "./assets/images/play_icon_hero.png";

export const pause = new Image();
pause.src = "./assets/images/pause.png";

export const draw = (ctx, img, x, y, w, h) => {

    if (!img.complete) {
        setTimeout(() => {
            draw(ctx, img);
        }, 500);
        return;
    } else {
        ctx.drawImage(img, x, y, w, h);
    }
    
};
const circleCursor = document.querySelector('.circle-cursor');
const mouse = { x: 0, y: 0 };
const previousMouse = { x: 0, y: 0 };
const circle = { x: 0, y: 0 };

let currentScale = 0;
let currentAngle = 0;

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

const speed = 0.17;

const tick = () => {
    circle.x += (mouse.x - circle.x) * speed;
    circle.y += (mouse.y - circle.y) * speed;

    const translateTransform = `translate(${circle.x}px, ${circle.y}px)`;

    //function to  squeeze my cursor
    const deltaMouseX = mouse.x - previousMouse.x;
    const deltaMouseY = mouse.y - previousMouse.y;
    previousMouse.x = mouse.x;
    previousMouse.y = mouse.y;

    const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150); 
    const scaleValue = (mouseVelocity / 150) * 0.5;

    currentScale += (scaleValue - currentScale) * 0.5;

    const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;


    //Rotation
    const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
    if (mouseVelocity > 20){
        currentAngle = angle;
    }
    const rotateTransform = `rotate(${currentAngle}deg)`;

    //applying the transform here
    circleCursor.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;


    window.requestAnimationFrame(tick);
}
tick();

document.addEventListener('DOMContentLoaded', () => {
  /*const customCursor = document.getElementById('custom-cursor');*/

  const interactiveElements = 'a, button, .nav-button, input[type="submit"]';


  document.addEventListener('mouseover', (e) => {
    if (e.target.matches(interactiveElements)) {
      circleCursor.classList.add('active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.matches(interactiveElements)) {
      circleCursor.classList.remove('active');
    }
  });
});

function Boost(bPositions) {
  this.canvas = CANVAS;
  this.context = this.canvas.getContext('2d');
  this.arrColors = ['#00B2FF', 'yellow', '#0F0F0F']; //'purple', 'orange', 'green'];
  this.position = { x: bPositions.x, y: bPositions.y };
  this.radius = 10;
  this.speed = Math.random() + 1;
  this.fillColor = this.arrColors[Math.floor(Math.random() * this.arrColors.length)]; //'#00B2FF'

  this.create = function () {
    // APPLY POSITION
    this.position.x -= this.speed;
    this.position.y += this.speed;

    // RESET POSITION WHEN CANVAS END
    if (this.position.x < -10) {
      this.position.x = this.canvas.width + 10 + Math.random() * 30;
    }
    if (this.position.y > this.canvas.height + 10) {
      this.position.y = -10 + Math.random() * -30;
    }

    //SHIELD
    if (this.fillColor === '#00B2FF') {
      this.context.beginPath();
      this.context.fillStyle = this.fillColor;
      this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
      this.context.fill();
      this.context.fillStyle = "rgba(255,255,255, 1)";
      this.context.font = "15px Quicksand";
      this.context.fillText("S", this.position.x - 4, this.position.y + 5);
    }
    //RAINBOW
    else if (this.fillColor === 'yellow') {
      this.context.drawImage(STAR, this.position.x - 12, this.position.y - 12, 24, 24)
      // this.context.beginPath();
      // this.context.fillStyle = this.fillColor;
      // this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
      // this.context.fill();
    }
    //DARKNESS
    else if (this.fillColor === '#0F0F0F') {
      this.context.beginPath();
      this.context.fillStyle = this.fillColor;
      this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
      this.context.fill()
    }
    //GRAVITY
    else if (this.fillColor === 'purple') {
      this.context.beginPath();
      this.context.fillStyle = this.fillColor;
      this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
      this.context.fill()
    }
  }
}
// ESTÁ EN PLAYER
// function Shield(pShift) {
//   // APPLY POSITION
//     this.shieldPosition = { x: pShift.x, y: pShift.y };
//     //SHIELD BODY
//     this.context.beginPath();
//     this.context.fillStyle = 'blue';
//     this.context.arc(this.shieldPosition.x, this.shieldPosition.y, 15, 0, Math.PI * 2, true);
//     this.context.fill();
// }

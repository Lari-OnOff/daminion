// ---------- вектор (для позиции и скорости мыши и окружностей) ----------
function Vector(x,y)
{
  this.x = x===undefined ? 0 : x;
  this.y = y===undefined ? 0 : y;
}

// сложение векторов
Vector.prototype.add = function(v)
{
  return new Vector(this.x+v.x,this.y+v.y);
};

// расстояние между точками
Vector.prototype.distanceTo = function(v)
{
  var x = this.x - v.x, y = this.y - v.y;
  return Math.sqrt(x * x + y * y);
};

// скалярное произведение веторов
Vector.prototype.dot = function(v)
{
  return this.x * v.x + this.y * v.y;
};

// длина вектора
Vector.prototype.length = function()
{
  return Math.sqrt(this.dot(this));
};

// умноженгие вектора на число
Vector.prototype.multiply = function(s)
{
  return new Vector(this.x*s,this.y*s);
};

// приведение вектора к единичной длине
Vector.prototype.normalize = function()
{
  var length = this.length();
  return length==0 ? new Vector(this.x,this.y) : new Vector(this.x/length,this.y/length);
};

// отражение вектора относительно нормали
Vector.prototype.reflect = function(normal)
{
  return this.subtract(normal.multiply(this.dot(normal)*2));
};

// вычитание векторов
Vector.prototype.subtract = function(v)
{
  return new Vector(this.x-v.x,this.y-v.y);
};

// центр страницы и внешней окружности
var viewportCenter = new Vector();

// ---------- подвижная (внутренняя) окружность ----------
function Circle(selector)
{
  this.element = document.querySelector(selector); // HTML element
  if (this.element) this.element.style = 'height:0;left:0;top:0;width:0';
  this.position = new Vector(); // позиция центра окружности
  this.velocity = new Vector(); // скорость движения окружности
}

// двигаем HTML элемент в соответствии с position
Circle.prototype.update = function()
{
  var radius = this.radius;
  this.element.style.left = (this.position.x - radius) + 'px';
  this.element.style.top = (this.position.y - radius) + 'px';
};

// радиус окружности
Object.defineProperty(Circle.prototype,'radius',{
  get: function()
  {
    return this.element ? parseInt(this.element.style.width) * 0.5 : this.hasOwnProperty('__radius') ? this.__radius : 0;
  },
  set: function(value)
  {
    if (this.element)
    {
      this.element.style.width = (value * 2) + 'px';
      this.element.style.height = this.element.style.width;
    }
    this.__radius = value;
  }
});

// ---------- основная логика ----------
const Circles = function()
{
  // координаты мыши; окружность
  var mouse = new Vector(), circle = null;

  const canvas = document.getElementById('canvas');

  // внутренний радиус внешней окружности
  const OUTER_CIRCLE_RADIUS = 237;

  // записываем текущие координаты мыши в mouse
  function mousemove(event)
  {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  }

  // при изменении размеров окна браузера обновляем viewportCenter
  function resize()
  {
    viewportCenter.x = (window.innerWidth || document. documentElement.clientWidth) * 0.5;
    viewportCenter.y = (window.innerHeight || document. documentElement.clientHeight) * 0.5;
  }

  window.addEventListener('mousemove',mousemove);
  window.addEventListener('resize',resize);

  // рисование окружностей на canvas
  function render()
  {
    const context = canvas.getContext('2d');
    context.clearRect(0,0,480,480);
    // внешняя окружность
    context.beginPath();
    context.arc(240,240,238.5,0,Math.PI*2);
    context.strokeStyle = '#34648e';
    context.lineWidth = 3;
    context.stroke();
    // внутренняя окружность
    context.beginPath();
    var local = circle.position.subtract(viewportCenter);
    local.x += 240;
    local.y += 240;
    context.arc(local.x,local.y,circle.radius,0,Math.PI*2);
    context.fillStyle = '#0294bf';
    context.fill();
  }

  return {
    // создаём подвижную окружность указанного диаметра
    initialize: function(innerCircleDiameter)
    {
      resize();
      circle = new Circle('.circle--inner');
      circle.radius = innerCircleDiameter * 0.5;
      circle.position.x = viewportCenter.x;
      circle.position.y = viewportCenter.y;
      if (!canvas) circle.update();
    },
    // расчёт одного кадра анимации; time - время, прошедшее с предыдущего кадра
    run: function(time)
    {
      // расстояние от центра подвижной окружности до мыши
      var dist = circle.position.distanceTo(mouse);
      // если расстояние меньще 2,5 радиусов окружности, окружность начинает убегать
      if (dist<circle.radius*2.5)
      {
        // скорость окружности тем больше, чем ближе мышь
        var newVelocity = circle.position.subtract(mouse).normalize().multiply(time*0.01*(circle.radius*2.5-dist));
        // устанавливаем новую скорость только если она не меньше старой, иначе это будет тормозить окружность
        if (newVelocity.length()>circle.velocity.length()) circle.velocity = newVelocity;
      }
      // перемещаем окружность в новые координаты
      circle.position = circle.position.add(circle.velocity);
      // расстояние от центра подвижной окружности до центра неподвижной
      var dist2 = circle.position.distanceTo(viewportCenter);
      // проверяем, вышла ли внутренняя окружность за пределы внешней
      if (dist2>OUTER_CIRCLE_RADIUS-circle.radius)
      {
        // если вышла, сдвигаем её обратно в направлении центра внешней окружности
        var fromCenter = circle.position.subtract(viewportCenter).normalize();
        var fixPenetration = fromCenter.multiply(OUTER_CIRCLE_RADIUS-circle.radius);
        circle.position = viewportCenter.add(fixPenetration);
        // пусть внутренняя окружность, коснувшись внешней, отскакивает от неё как мячик
        circle.velocity = circle.velocity.reflect(fromCenter);
      }
      // рисуем окружности на canvas или обновляем HTML элемент
      if (canvas) render(); else circle.update();
      // эмулируем инерцию; 0 - окружность моментально останавливается, 1 - окружность не теряет скорость
      circle.velocity = circle.velocity.multiply(0.97);
    }
  };
}();
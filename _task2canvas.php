<canvas id="canvas" width="480" height="480"></canvas>
<script type="text/javascript" src="/js/circles.js"></script>
<script type="text/javascript">
  Circles.initialize(80); // диаметр окружности - 80px
  var start = performance.now();
  requestAnimationFrame(frame = function(time)
  {
    Circles.run(time-start); // вся «магия» в этом методе
    start = time;
    requestAnimationFrame(frame);
  });
</script>
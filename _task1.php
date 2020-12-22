<div class="preloader">Loading, please wait...</div>
<div class="container">
  <div class="license__select">
    <!-- the list of license plans retrieved by AJAX goes here -->
  </div>
  <div class="license__number">
    <label for="license_number">Number of licenses:</label>
    <select name="license_number" id="license_number">
      <?php for ($i=1; $i<=10; $i++) printf('<option value="%d">%d</option>',$i,$i); ?>
    </select>
  </div>
  <div class="license__buy">
    <div class="license__total">Total: <span>$340<sup>us</sup></span></div>
    <a href="/" class="license__purchase"><span>Buy now</span></a>
    <div class="license__selected">Selected plan: #1</div>
  </div>
</div>
<script type="text/javascript" src="/js/licenses.js"></script>
<script type="text/javascript">
  // инициализация
  AJAX.requestLicensePlans(function(plans)
  {
    plans.forEach(Widget.addPlan);
    Widget.loaded();
    compute();
  });
  // пересчёт
  function compute()
  {
    Widget.total = Widget.selectedPlan.price * Widget.numberOfPlans;
  }
  Widget.onchange = compute;
  // покупка
  Widget.onsubmit = function()
  {
    AJAX.purchaseLicenses(Widget.selectedPlan.id,Widget.numberOfPlans);
  };
</script>
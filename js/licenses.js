// РАБОТА С ВИДЖЕТОМ
const Widget = function()
{
  var firstPlan = true;
  // DOM элементы
  const
    licenseNumber = document.getElementById('license_number'),
    preloader = document.querySelector('.preloader'),
    plans = document.querySelector('.license__select'),
    selected = document.querySelector('.license__selected'),
    submitButton = document.querySelector('.license__purchase'),
    totalPrice = document.querySelector('.license__total span');
  var
    inputs = [], // радиокнопки
    _onchange = null, // вызываем это событие когда что-либо изменилось
    _onsubmit = null;
  // создание элемента и установка имени класса
  function createElement(tag,cls)
  {
    var element = document.createElement(tag);
    if (cls!==undefined) element.className = cls;
    return element;
  }
  // если пользователь что-то поменял, вызываем событие
  function inputChange()
  {
    if (_onchange) _onchange();
    selected.innerHTML = 'Selected plan: #' + Widget.selectedPlan.id;
  }
  licenseNumber.addEventListener('input',inputChange);
  submitButton.addEventListener('click',function(event)
  {
    if (_onsubmit) _onsubmit();
    event.preventDefault();
  });
  return {
    // добавляем план в список
    addPlan: function(plan)
    {
      var
        input = createElement('input'),
        label = createElement('label'),
        title = createElement('div','license__title'),
        price = createElement('div','license__price');
      input.type = 'radio';
      input.name = 'license';
      input.id = 'license' + plan.id;
      if (firstPlan) // первый элемент списка выбираем по умолчанию
      {
        input.checked = true;
        firstPlan = false;
      }
      input.addEventListener('change',inputChange);
      // информация о плане - в дата-аттрибуты
      input.dataset.id = plan.id;
      input.dataset.name = plan.name;
      input.dataset.price = plan.price;
      inputs.push(input);
      label.htmlFor = input.id;
      title.innerHTML = plan.name;
      price.innerHTML = '$' + plan.price + ' per license';
      label.appendChild(title);
      label.appendChild(price);
      plans.appendChild(input);
      plans.appendChild(label);
    },
    // скрывает прелоадер, отображает виджет
    loaded: function()
    {
      preloader.parentNode.removeChild(preloader);
    },
    // выбранное количество лицензий
    get numberOfPlans()
    {
      return licenseNumber.value * 1;
    },
    // если что-то поменялось
    set onchange(value)
    {
      _onchange = value;
    },
    // пользователь нажал "Buy now"
    set onsubmit(value)
    {
      _onsubmit = value;
    },
    // выбранный план
    get selectedPlan()
    {
      for (var i=0; i<inputs.length; i++) if (inputs[i].checked)
      {
        return {
          id: inputs[i].dataset.id * 1,
          name: inputs[i].dataset.name,
          price: inputs[i].dataset.price * 1
        };
      }
      return null;
    },
    // общая сумма
    get total()
    {
      return totalPrice.innerHTML.substr(1) * 1;
    },
    set total(value)
    {
      totalPrice.innerHTML = '$' + value;
    }
  };
}();

// ВЗАИМОДЕЙСТВИЕ С БЭКЕНДОМ
const AJAX = function()
{
  function get(url,callback)
  {
    var xhr = new XMLHttpRequest();
    xhr.open('POST',url,true);
    xhr.onreadystatechange = function()
    {
      if (xhr.readyState==4 && xhr.status==200) callback(xhr.responseText);
    };
    xhr.send(null);
  }
  return {
    // запрос списка планов
    requestLicensePlans: function(callback)
    {
      get('/api.php',function(response)
      {
        callback(JSON.parse(response));
      });
    },
    // приобретение лицензий id в количестве number штук
    purchaseLicenses: function(id,number)
    {
      // В идеале лучше отправлять POST-запросом, но я не стал углубляться в бэкенд в рамках этого тестового задания
      get('/api.php?action=buy&id='+id+'&number='+number,function(response)
      {
        alert(response);
      });
    }
  }
}();